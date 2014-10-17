var express = require('express');

var cookieParser = require('cookie-parser');

var passport = require('passport');
var facebook = require('./facebook');
var google = require('./google');

var session = require('express-session');
var Store = require('connect-redis')(session);

var redis = require("redis").createClient();

var uuid = require('node-uuid');

var oauthAuthenticate = function (profile, done) {
    var oauthKey = profile.provider+':'+profile.id;
    redis.get(oauthKey, function (error, id) {
        if (id) {
            redis.hgetall('user:'+id, function (error, user) {
                if (user) done(null, user);
                else done(error);
            });
        } else {
            // First login

            redis.incr('nextUserId', function (error, newId) {
                if (!newId) {
                    // Initializing
                    newId = 1;
                    redis.set('nextUserId', 2);
                }

                var user = {
                    name : profile.displayName,
                    id : newId
                };
                redis.hmset('user:'+newId, user);
                redis.set(oauthKey, newId);
                done(null, user);
            });
        }
    });
};

// Google Oauth
passport.use(
    google(function (accessToken, refreshToken, profile, done) {
        oauthAuthenticate(profile, done);
    })
);

// Facebook Oauth
passport.use(
    facebook(function (accessToken, refreshToken, profile, done) {
        oauthAuthenticate(profile, done);
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(uid, done) {
    redis.hgetall('user:'+uid, function (error, user) {
        done(error, user);
    });
});

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

var httpApp = express();

httpApp.use(cookieParser());
httpApp.use(session(sessionConfig));
httpApp.use('/facebook/callback', callbackCsrf);
httpApp.use('/google/callback', callbackCsrf);
httpApp.use(passport.initialize());
httpApp.use(passport.session());

httpApp.set('views', './template');
httpApp.set('view engine', 'jade');

httpApp.get('/', function (request, response) {
    if (request.user && request.user.id) {
        var context = {};
        for (var k in request.user) {
            context[k] = request.user[k];
        }
        context.logout = "(function () { window.parent.location='https://setex.net/logout'; return false; })();";
        response.render('status.jade', context);
    } else {
        response.render('login.jade', {
            facebook : "(function () { window.parent.location='https://setex.net/facebook'; return false; })();",
            google :   "(function () { window.parent.location='https://setex.net/google'; return false; })();"
        });
    }
});

var getCsrf = function (request) {
    var now = new Date();
    var oauthCsrf = request.session.oauthCsrf;
    if (oauthCsrf === undefined) {
        return {
            birthDate : now,
            token : uuid.v4()
        };
    } else {
        oauthCsrf.birthDate = new Date(oauthCsrf.birthDate);
        if (now - oauthCsrf.birthDate < 30000) return oauthCsrf;
        else return {
            birthDate : now,
            token : uuid.v4()
        };
    }
};

httpApp.get('/facebook', function (request, response) {
    request.session.oauthCsrf = getCsrf(request);
    var auth = passport.authenticate('facebook', {
        scope : [],
        state : request.session.oauthCsrf.token
    });
    auth(request, response);
});

httpApp.get('/google', function (request, response) {
    request.session.oauthCsrf = getCsrf(request);
    var auth = passport.authenticate('google', {
        scope : ['https://www.googleapis.com/auth/userinfo.profile'],
        state : request.session.oauthCsrf.token
    });
    auth(request, response);
});

httpApp.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect : 'https://popham.github.io/rtc-github/example/messages/'
    }),
    function(request, response) {
        response.redirect('https://popham.github.io/rtc-github/example/messages/');
    }
);

httpApp.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect : 'https://popham.github.io/rtc-github/example/messages/'
    }),
    function(request, response) {
        response.redirect('https://popham.github.io/rtc-github/example/messages/');
    }
);

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
