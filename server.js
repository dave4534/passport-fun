var express = require('express');
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');

var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user);    // Could store just the id using done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use('login', new LocalStrategy(function (username, password, done) {
  var authenticated = username === "John" && password === "Smith";
  
  if (authenticated) {
    return done(null, { myUser:'user', myID: 1234 });
  } else {
    return done(null, false);       
  }
}));

app.post('/login', passport.authenticate('login', {
  successRedirect: '/success',
  failureRedirect: '/login'
}));

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.get('/success', function (req, res){
  if (!req.isAuthenticated()) {// Denied. Redirect to login
    console.log('DEEEnied');
    res.redirect('/login');
  } else {
    res.send('Hey, hello from the server!');
  }
});

app.get('/logout', function (req, res) {
  req.logout();
  res.send('Logged out!');
});

app.listen(8000);