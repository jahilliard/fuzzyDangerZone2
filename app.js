// Setup Environment 
var express = require('express'),
  morgan = require('morgan'),
  app = express(),
  routes = require('./routes/routes.js'),
  passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy, 
  // Oauth = require('oauth'),  NOT SURE WHY THIS IS
  superagent = require('superagent'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session');
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 50000;
console.log("IP address: " + ipaddress);
console.log("Port: " + port);
require('superagent-oauth')(superagent);

var FACEBOOK_APP_ID = "1545248059049486";
var FACEBOOK_APP_SECRET = "f36058491af6aa50543fce7f30be3e2d";
var CALLBACK_URL = "http://localhost:50000/auth/facebook/callback";
var PROFILE_FIELDS = ['id', 'name', 'gender', 'displayName','photos','profileUrl'];
var SUCCESS_LOGIN_PATH = '/home';
var FAIL_LOGIN_PATH = '/';


// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({ secret: 'socialmap',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: (3600000 * 2),
    // secure: (config.env === 'production')
  }
}));
app.use(passport.initialize());
app.use(passport.session());




passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: CALLBACK_URL,
  profileFields: PROFILE_FIELDS
},
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      profile['accessToken'] = accessToken;
      routes.findOrCreate(profile, accessToken, 
        function(currUser, accessToken){
          console.log("THIS WAS STORED " + JSON.stringify(currUser));
      });
      return done(null, profile);
    });
}));

// app.get('*',function(req,res){  
//   if (!req.user) {res.redirect('https://localhost:50000/login')}
//   else {res.redirect('https://localhost:50000/home')};
// })


passport.serializeUser(routes.serializeUser);

passport.deserializeUser(routes.deserializeUser);
  
  app.use(morgan('dev'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));

app.get(FAIL_LOGIN_PATH, function(req, res){
  res.render('login.ejs');
});

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email', 'user_friends']} ));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: SUCCESS_LOGIN_PATH,
                                      failureRedirect: FAIL_LOGIN_PATH}));

app.get(SUCCESS_LOGIN_PATH, ensureAuthenticated, function(req,res,next){
  res.render('mapPartial.ejs', {profile: req.user,
                                    accessToken : req.user.accessToken});
});

app.post('/makePin/:pinLat/:pinLong/:user_id', routes.storePin);

app.put('/addFriendsList/:profileId/:toAddId', routes.addToFriendList);

app.delete('/deleteFriendsList/:profileId/:toAddId', routes.deleteFriendsList);

app.get('/getShowPins/:user_id', routes.sendPins);

app.post('/sendBetaFeed/:profileId', routes.sendBetaFeed);

routes.clearPinsInDb();

app.listen(port, ipaddress, function() {
        console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});


function ensureAuthenticated(req, res, next) {
  if (req.user) {return next();}
  res.redirect(FAIL_LOGIN_PATH);
}


