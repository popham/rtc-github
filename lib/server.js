var cookieParser = require('cookie-parser');

var passport = require('passport');
var facebook = require('./facebook');
var google = require('./google');

var session = require('express-session');
var Store = require('connect-redis')(session);

var app = require('express')();
app = require('express-ws')(app);

var redis = require("redis").createClient();

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
    redis.get('user:'+uid, function (error, user) {
        done(error, user);
    });
});

app.use(cookieParser());
app.use(session({
    store : new Store({
        host : 'localhost',
        prefix : 'session'
    }),
    resave : true,
    saveUninitialized : true,
    unset : 'destroy',
    secret : 'peep'
}));
app.use(passport.initialize());
app.use(passport.session());


////////////////////////////
//                        //
//  BROWSER INTERACTIONS  //
//                        //
////////////////////////////

app.set('views', './template');
app.set('view engine', 'jade');

app.get('/', function (request, response) {
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

// Redirect implies an extra round trip :(
app.get('/facebook', passport.authenticate('facebook'));

app.get(
    '/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect : 'https://popham.github.io/rtc-github/example/messages/'
    }),
    function(request, response) {
        response.redirect('https://popham.github.io/rtc-github/example/messages/');
    }
);

// Redirect implies an extra round trip :(
app.get('/google', passport.authenticate('google', {
    scope : ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect : 'https://popham.github.io/rtc-github/example/messages/'
    }),
    function(request, response) {
        response.redirect('https://popham.github.io/rtc-github/example/messages/');
    }
);

app.get('/logout', function (request, response) {
    request.session.destroy();
    response.redirect('https://popham.github.io/rtc-github/example/messages/');
});


////////////////////////
//                    //
//  WEBSOCKET ROUTES  //
//                    //
////////////////////////

var allocator = new require('capnp-js/builder/Allocator')();
var packet = require('capnp-js/packet');
var server = require('rtc-github-protocol/server.capnp.d/builders');
var client = require('rtc-github-protocol/client.capnp.d/readers');
var sockets = {};
var hosts = {}; // Subset of sockets where each is hosting.

app.ws('/signal', function(wss, request) {
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
    user.setUserId(userId);
    user.setName(name);
    wss.send(packet.fromStruct(root));

    wss.on('message', function (bytes) {
        var message = packet.toArena(bytes).getRoot(client.Client);
        var response = allocator.initRoot(server.Server);

        switch (message.which()) {
        case message.SERVICE:
            // The client is offering service.

            var i, k;

            if (message.getService().getIsOffering()) {
                hosts[userId] = name;
            } else {
                delete hosts[userId];
            }

            var hostsUpdate = response.initHostsUpdate(Object.keys(hosts).length);
            i = 0;
            for (k in hosts) {
                var host = hostsUpdate.init(i++);
                host.setId(k);
                host.setName(hosts[k]);
            }
            for (k in sockets) {
                sockets[i].send(packet.fromStruct(response));
            }
            break;

        case message.PEER:
            // The client is signalling a peer.

            var target = peer.getTarget();
            var targetSocket;
            if (target.isUserId() && targetSocket=sockets[target.getUserId()]) {
                response.setPeer(peer);
                peer = response.getPeer(); // Use the builder.
                var user = peer.getSource().initUser();
                user.setId(userId);
                user.setName(name);
                targetSocket.send(packet.fromStruct(response));
            } // Else do nothing.
            break;
        }
    });

    ws.on('close', function () {
        delete sockets[userId];
        delete hosts[userId];
    });
});


/////////////
//         //
//  START  //
//         //
/////////////

app.listen(16034, function () {});
