var fs = require('fs');
var tls = require('./tls');
var https = require('https');

var cookieParser = require('cookie-parser');

var passport = require('passport');
var facebook = require('./facebook');
var google = require('./google');

var session = require('express-session');
var Store = require('connect-redis')(session);

var app = require('express')();
var server = https.createServer({
    key : fs.readFileSync(tls.key),
    cert : fs.readFileSync(tls.cert)
}, app);
app = require('express-ws')(app, server);

var redis = require("redis").createClient();

var user = function (profile) {
    return {
        provider : profile.provider,
        id : profile.id,
        name : profile.displayName
    };
};

// Google Oauth
passport.use(google(
    function (accessToken, refreshToken, profile, done) {
        var key = 'user:' + profile.provider + ':' + profile.id;
        var u = user(profile);
        redis.hmset(key, u, function (error, reply) {
            if (reply !== null) done(null, u);
            else done(error, null);
        });
    }
));

// Facebook Oauth
passport.use(facebook(
    function (accessToken, refreshToken, profile, done) {
        var key = 'user:' + profile.provider + ':' + profile.id;
        var u = user(profile);
        redis.hmset(key, u, function (error, reply) {
            if (reply !== null) done(null, u);
            else done(error, null);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.provider+':'+user.id);
});

passport.deserializeUser(function(i, done) {
    redis.get('user:'+i, function (error, user) {
        done(error, user)
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
            google :   "(function () { window.parent.location='https://setex.net/google';   return false; })();"
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

app.ws('/signal', function(ws, request) {
    ws.on('open', function() {});

    ws.on('message', function (msg) {});

    ws.on('close', function () {});
});


/////////////
//         //
//  START  //
//         //
/////////////

app.listen(16034, function () {});
