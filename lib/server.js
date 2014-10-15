var express = require('express');

var cookieParser = require('cookie-parser');

var passport = require('passport');
var facebook = require('./facebook');
var google = require('./google');

var session = require('express-session');
var Store = require('connect-redis')(session);

var redis = require("redis").createClient();

var uuid = require('node-uuid');

/*
 * Quick and dirty user identifiers (no persistence beyond the server's
 * existence).
 */
var userIdCounter=1;

var user = function (profile) {
    return {
        provider : profile.provider,
        providerId : profile.id,
        name : profile.displayName,
        id : userIdCounter++
    };
};

// Google Oauth
passport.use(google(
    function (accessToken, refreshToken, profile, done) {
        var u = user(profile);
        var key = 'user:' + u.id;
        redis.hmset(key, u, function (error, reply) {
            if (reply !== null) done(null, u);
            else done(error, null);
        });
    }
));

// Facebook Oauth
passport.use(facebook(
    function (accessToken, refreshToken, profile, done) {
        var u = user(profile);
        var key = 'user:' + u.id;
        redis.hmset(key, u, function (error, reply) {
            if (reply !== null) done(null, u);
            else done(error, null);
        });
    }
));

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
    if (request.session.oauthToken !== request.query.state) {
        response.status(403).send('CSRF check failed');
    } else {
        next();
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
    if (request.user && request.user.providerId) {
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

httpApp.get('/facebook', function (request, response) {
    // Redirect implies an extra round trip :(
    var oauthToken = uuid.v4();
    request.session.oauthToken = oauthToken;
    var auth = passport.authenticate('facebook', {
        scope : [],
        state : oauthToken
    });
    auth(request, response);
});

httpApp.get('/google', function (request, response) {
    // Redirect implies an extra round trip :(
    var oauthToken = uuid.v4();
    request.session.oauthToken = oauthToken;
    var auth = passport.authenticate('google', {
        scope : ['https://www.googleapis.com/auth/userinfo.profile'],
        state : oauthToken
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
    var provider = request.user.provider;

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
    var userId = request.user.id;
    var name = request.user.name;

    if (userId === undefined) {
        // See https://tools.ietf.org/html/rfc6455#section-7.4.1
        wss.close(1011, 'Unauthorized');
    }
    if (sockets[userId]) {
        // See https://tools.ietf.org/html/rfc6455#section-7.4.1
        wss.close(1011, 'Second connection requested');
    }

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
            console.log('Client(uid='+userId+') is hosting');

            if (message.getService().getIsOffering()) {
                hosts[userId] = name;
            } else {
                delete hosts[userId];
            }

            var update = packet.fromStruct(buildHostsUpdate());
            for (var k in sockets) {
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
