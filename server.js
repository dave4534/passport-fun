var express = require('express');
var app = express();
var passport = require('passport');
var bodyParser = require('body-parser');

var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use(express.static('/'));
app.use(express.static('node_modules'));

passport.use('login', new LocalStrategy(function (username, password, done) {
  var authenticated = username === "John" && password === "Smith";
  
  if (authenticated) {
    return done(null, { myUser:'user', myID: 1234 });
  } else {
    return done(null, false);       
  }
}));

// Let’s add a '/login' POST route with passport.authenticate as 
// the route-level middleware. And inside of the route-level 
// middleware, we'll pass the name of the strategy ('login') and 
// callback functions to change routes based on the success or 
// failure of the authentication:
app.post('/login', passport.authenticate('login', {
  successRedirect: '/success',
  failureRedirect: '/login',
  session: false
}));

app.get('/success', function (req, res){
  res.send("Hey, hello from the server!");
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});


app.listen(8000);