// Setup Environment 
var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy, 
  Oauth = require('oauth'),
  superagent = require('superagent');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);
require('superagent-oauth')(superagent);

var FACEBOOK_APP_ID = "1545248059049486";
var FACEBOOK_APP_SECRET = "f36058491af6aa50543fce7f30be3e2d";
var CALLBACK_URL = "http://localhost:50000/auth/facebook/callback";
var PROFILE_FIELDS = ['id', 'name', 'gender', 'displayName','photos','profileUrl'];
var LOGIN_PATH = '/';
var profileToPassToClient;
var accessTokenPassToClient;



passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: CALLBACK_URL,
  profileFields: PROFILE_FIELDS
},
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      profileToPassToClient = profile;
      accessTokenPassToClient = accessToken;
    return done(null, profile);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj,done){
  done(null, obj); 
});


  
  app.use(morgan('dev'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
    app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.static(__dirname + '/public'));
  


app.get('/', function(req, res){
  res.render('login.ejs');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']} ));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: LOGIN_PATH}),
  function(req, res){
  res.redirect('/home');
  console.log("I'm tryign to redir to /home")
});

app.get('/home', ensureAuthenticated, function(req,res, next){
  var currUser = routes.findOrCreate(profileToPassToClient, accessTokenPassToClient);
  res.render('mapPartial.ejs', {profile: profileToPassToClient,
                                accessToken : accessTokenPassToClient});
});

app.post('/makePin/:pinLat/:pinLong', routes.storePin);

app.get('/getPins/', routes.sendPins);

app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});


function ensureAuthenticated(req, res, next) {
  if (1) {return next();}
  res.redirect('/');
}


