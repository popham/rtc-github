var express = require('express');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var Store = require('connect-redis')(session);

var querystring = require('querystring');
var redis = require("redis").createClient();
var uuid = require('node-uuid');
var unirest = require('unirest');

var facebookClient = require('./facebook');
var googleClient = require('./google');

var server = {
    domain : 'https://setex.net',
    successUrl : 'https://popham.github.io/rtc-github/example/messages/',
    failureUrl : 'https://popham.github.io/rtc-github/example/messages/'
};

var google = {
    name : 'google',
    endpoint : 'https://accounts.google.com/o/oauth2/auth',
    scopes : 'profile'
};

var facebook = {
    name : 'facebook',
    endpoint : 'https://www.facebook.com/dialog/oauth',
    scopes : ''
};

redis.setnx('nextUserId', 1);

var oauthUser = function (profile, done) {
    var oauthKey = profile.provider+':'+profile.id;
    redis.get(oauthKey, function (error, id) {
        if (error) done(error);

        if (id) {
            redis.hgetall('user:'+id, function (error, user) {
                if (error) done(error);
                else done(null, user);
            });
        } else {
            // User hasn't logged in with these oauth credentials before.
            redis.incr('nextUserId', function (error, newId) {
                if (error) done(error);

                // New user record.
                var user = {
                    id : newId,
                    name : profile.displayName
                };
                redis.hmset('user:'+newId, user);

                // Point the oauth credentials at the new user record.
                redis.set(oauthKey, newId);

                done(null, user);
            });
        }
    });
};

// Get request to this url will begin the oauth flow.
var initiatorUrl = function (authenticator, client, csrf, email) {
    var query = {
        response_type : 'code',
        client_id : client.id,
        redirect_uri : [domain, authenticator.name, '/callback'].join('/'),
        scope : authenticator.scopes,
        state : csrf
    };

    if (email) query.login_hint = email;

    return authenticator.endpoint + '/' + querystring.stringify(query);
};

var sessionConfig = {
    store : new Store({
        host : 'localhost',
        prefix : 'session'
    }),
    resave : true,
    saveUninitialized : true,
    unset : 'destroy',
    secret : 'peep'
};


////////////////////////////
//                        //
//  BROWSER INTERACTIONS  //
//                        //
////////////////////////////

var callbackCsrf = function (request, response, next) {
    var oauthCsrf = request.session.oauthCsrf;
    if (oauthCsrf && oauthCsrf.token === request.query.state) {
        next();
    } else {
        response.status(403).send('CSRF check failed');
    }
};

var attachUser = function (request, response, next) {
    if (request.session.userId) {
        redis.hgetall("user:"+request.session.userId, function (error, user) {
            if (error) next();
            else if (user) request.user = user;
            else next();
        });
    } else {
        next();
    }
};

var httpApp = express();

httpApp.use(cookieParser());
httpApp.use(session(sessionConfig));
httpApp.use(attachUser);
httpApp.use('/facebook/callback', callbackCsrf);
httpApp.use('/google/callback', callbackCsrf);

httpApp.set('views', './template');
httpApp.set('view engine', 'jade');
httpApp.set('query parser', 'simple');

var login = function (initiator) {
    return "(function () { window.parent.location='"+initiator+"'; return false; })();",
};

httpApp.get('/', function (request, response) {
    if (request.user && request.user.id) {
        var context = {};
        for (var k in request.user) {
            context[k] = request.user[k];
        }
        context.logout = "(function () { window.parent.location='"+server.domain+"/logout'; return false; })();";
        response.render('status.jade', context);
    } else {
        var csrf = request.session.oauthCsrf = uuid.v4();
        response.render('login.jade', {
            facebook : login(initiatorUrl(facebookOauth, facebookClient, csrf)),
            google : login(initiatorUrl(googleOauth, googleClient, csrf))
        });
    }
});

/*
httpApp.get('/facebook/callback', function (request, response) {

});
*/

httpApp.get('/google/callback', function (request, response) {
    if (request.user) response.redirect(server.successUrl);
    if (!request.query.code) response.status(404).end();

    var post = { form : {
        code : request.query.code,
        client_id : googleClient.id,
        client_secret : googleClient.secret,
        redirect_uri : [server.domain, google.name, 'callback'].join('/'),
        grant_type : 'authorization_code'
    }};

    unirest.post(google.endpoint)
        .headers({ 'Accept': 'application/json' })
        .send(post)
        .end(function (response1) {
            if (response1.statusCode >= 400)
                response.redirect(server.failureUrl);

            unirest.get('https://www.googleapis.com/plus/v1/people/me')
                .header('Authorization', 'Bearer '+response1.body.access_code)
                .end(function (response2) {
                    if (response.statusCode >= 400)
                        response.redirect(server.failureUrl);

                    var profile = {
                        provider : google.name,
                        id : response2.body.id,
                        displayName : response2.body.displayName
                    };

                    var oauthUser = function (profile, function (error, user) {
                        if (error) {
                            response.redirect(server.failureUrl);
                        } else {
                            request.session.userId = user.id;
                            response.redirect(server.successUrl);
                        }
                    });
                });
        });
});

httpApp.get('/logout', function (request, response) {
    request.session.destroy();
    response.redirect('https://popham.github.io/rtc-github/example/messages/');
});

httpApp.listen(16034, function () {});


////////////////////////
//                    //
//  WEBSOCKET ROUTES  //
//                    //
////////////////////////

var wssApp = express();
require('express-ws')(wssApp);

wssApp.use(cookieParser());
wssApp.use(session(sessionConfig));
wssApp.use(passport.initialize());
wssApp.use(passport.session());

var Allocator = require('capnp-js/builder/Allocator');
var allocator = new Allocator();
var packet = require('capnp-js/packet');
var server = require('rtc-github-protocol/server.capnp.d/builders');
var client = require('rtc-github-protocol/client.capnp.d/readers');
var sockets = {};
var hosts = {}; // Subset of sockets where each is hosting.

var buildHostsUpdate = function () {
    var update = allocator.initRoot(server.Server);
    var hostsUpdate = update.initHostsUpdate(Object.keys(hosts).length);
    var i = 0;
    for (var k in hosts) {
        var host = hostsUpdate.get(i++);
        host.setId(k);
        host.setName(hosts[k]);
    }

    return update;
};

wssApp.ws('/', function(wss, request) {
    if (!request.user) {
        // See https://tools.ietf.org/html/rfc6455#section-7.4.1
        wss.close(1011, 'Unauthorized');
        return;
    }

    var userId = request.user.id;
    var name = request.user.name;

    if (userId === undefined) {
        // See https://tools.ietf.org/html/rfc6455#section-7.4.1
        wss.close(1011, 'Unauthorized');
        return;
    }

    if (sockets[userId]) {
        // See https://tools.ietf.org/html/rfc6455#section-7.4.1
        wss.close(1011, 'Second connection requested');
        return;
    }

    sockets[userId] = wss;

    // On initialization, provide session to connection holder.
    var root = allocator.initRoot(server.Server);
    var user = root.getSession().initUser();
    user.setId(userId);
    user.setName(name);
    wss.send(packet.fromStruct(root));

    // Provide the initial host list to the new connection holder.
    wss.send(packet.fromStruct(buildHostsUpdate()));

    wss.on('message', function (bytes) {
        var message = packet.toArena(bytes).getRoot(client.Client);

        switch (message.which()) {
        case message.SERVICE:
            if (message.getService().getIsOffering()) {
                console.log('Client(uid='+userId+') is hosting');
                hosts[userId] = name;
            } else {
                console.log('Client(uid='+userId+') is not hosting');
                delete hosts[userId];
            }

            var update = packet.fromStruct(buildHostsUpdate());
            for (var k in sockets) {
                console.log('Notifying Client(uid='+k+') of available hosts');
                sockets[k].send(update);
            }
            break;

        case message.PEER:
            var peer = message.getPeer();
            var target = peer.getTarget();
            var targetSocket = sockets[target.getUserId()];
            console.log('Client(uid='+userId+') is signalling Client(uid='+target.getUserId()+')');

            var response = allocator.initRoot(server.Server);
            if (target.isUserId() && targetSocket) {
                response.setPeer(peer);
                peer = response.getPeer(); // Use the builder.
                var user = peer.getSource().initUser();
                user.setId(userId);
                user.setName(name);
                targetSocket.send(packet.fromStruct(response));
            } // Else do nothing.
            break;

        default:
            console.log('Client(uid='+userId+') provided an unhandled message with discriminant='+message.which());
        }
    });

    wss.on('close', function () {
        delete sockets[userId];
        delete hosts[userId];
    });
});

wssApp.listen(26938, function () {});
