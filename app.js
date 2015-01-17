var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy; 

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);

passport.use(
    new FacebookStrategy({
        clientID: 1545248059049486,
        clientSecret: 'f36058491af6aa50543fce7f30be3e2d',
        callbackURL: 'http://localhost:50000/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      routes.fbUserCreation(profile, done, accessToken);
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
app.get('/home', routes.loggedIn, function(req,res, next){
  res.render('mapPartial.ejs');
});
app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']} ));
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/login' }));
app.post('/makePin/:pinLat/:pinLong', routes.storePin);

app.get('/getPins', routes.sendPins);

app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});

