
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var app = express();

var path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'salateksti1234'}));
app.use(passport.initialize());
app.use(passport.session());

// Lomakekirjautuminen
passport.use(new LocalStrategy(
  {
    // Kenttien nimet HTML-lomakkeessa
    usernameField: 'kayttaja',
    passwordField: 'salasana'
  },
  function(username, password, done) {
    if (salasanaOikein(username, password)) {
      return done(null, username);
    }
    return done(null, false);
  }
));

// HTTP Basic Auth
passport.use(new BasicStrategy(
  function(username, password, done) {
    if (salasanaOikein(username, password)) {
      return done(null, username);
    }
    return done(null, false);
  }
));

// Serialisointi session-muuttujaksi
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialisointi session-muuttujasta
passport.deserializeUser(function(user, done) {
  done(null, user);
});

function salasanaOikein(username, password) {
  return username==='antti' && password==='1234';
}

function selainkello(req, res) {
  var kello = new Date().toLocaleTimeString();
  res.render("kello", {kayttaja: req.user, kello:kello});
}

function apikello(req, res) {
  var kello = new Date().toLocaleTimeString();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify( {kello:kello} ));
}

function logout(req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

app.get('/', function(req,res) { res.render('etusivu'); } );

app.get('/kello', ensureLoggedIn('/login'), selainkello);

app.get('/api/kello',
        passport.authenticate('basic', {session: false}),
        apikello);

// Lomakekirjautumiseen:
app.post('/logout', logout);
app.post('/login', passport.authenticate('local',
         {successRedirect: '/kello', failureRedirect: '/login'}));
app.get('/login', function(req,res) {res.render('kirjaudu');} );

app.listen(process.env.PORT, process.env.IP);

