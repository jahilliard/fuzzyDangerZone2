var express = require('express'),
  http = require('http'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy;
var httpServer = http.Server(app);
var sio =require('socket.io');
var io = sio(httpServer);

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);


passport.use(
    new FacebookStrategy({
        clientID: 713738708715202,
        clientSecret: '3e38182ac70a4e700f54374b5d9d5d0d',
        callbackURL: 'http://socialmap-jhilliard.rhcloud.com/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      routes.findOrCreate(profile, done, accessToken);
    }
));


  app.use(morgan('dev'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', function(req, res){
  res.render('login.ejs');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']} ));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/login' }));

//var currUser = routes.initialFB(passport);

app.get('/home', routes.loggedIn, function(req, res, next){
  res.render('home.ejs');
});

app.post("/makePin/:currLat/:currLong/:vote", routes.makeEventorPin);

app.get("/event", routes.GotoEventPage);

app.get("/makePin/:currLat/:currLong", routes.IfUInEvent);

routes.ioInit(io);



httpServer.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});

