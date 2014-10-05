var cookieParser = require('cookie-parser');

var passport = require('passport');
var facebook = require('./facebook');
var google = require('./google');

var session = require('express-session');
var Store = require('connect-redis')(session);

var app = require('express')();
app = require('express-ws')(app);

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
    console.log('login');

    console.log(request);

//    if (isLoggedIn) {
        response.render('login.jade', {
            facebook : "(function () { window.parent.location='http://localhost:3000/facebook'; return false; })();",
            google : "(function () { window.parent.location='http://localhost:3000/google'; return false; })();"
        });
//    } else {
//        response.render('status.jade', {});
//    }
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
    console.log('logout');
});


////////////////////////
//                    //
//  WEBSOCKET ROUTES  //
//                    //
////////////////////////

app.ws('/signal', function(ws, request) {
    console.log('open');

    ws.on('open', function() {
        console.log('open');
    });

    ws.on('message', function (msg) {
        console.log(msg);
    });

    ws.on('close', function () {
        console.log('close');
    });
});


/////////////
//         //
//  START  //
//         //
/////////////

app.listen(3000, function () {
    console.log('Listening on localhost: 3000');
});
