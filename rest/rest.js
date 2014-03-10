
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var app = express();

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
  // TODO: jotain
  return username==='antti' && password==='1234';
}

function logout(req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

var basicAuth = passport.authenticate('basic', {session: false});

// Tarkistetaan autentikointi.
// 1. Ensin katsotaan onko käyttäjä kirjautunut istuntoon (passport.session)
// 2. Ellei, tarkistetaan oliko pyynnössä kelvolliset Basic Auth -tunnukset
//
// 1. vaihtoehto on tarkoitettu selaimelta tehtäville Ajax-pyynnöille, jotka
// hyväksytään vain jos käyttäjä on kirjautunut sisään, eli req.user on jotain.
// Tällöin pyyntöön ei tarvitse liittää Basic Auth -headereita mukaan.
// Tämä tapa ei ole 100% restful, mutta jos istuntokirjautumista joka tapauksessa
// käytetään, niin eiköhän tämä ole ok...
//
// Basic Auth sitten muita käyttötapauksia varten.
//
function checkApiAuthentication(req, res, next) {
  if (req.user) { // 1.
    next();
  }
  else { // 2.
    basicAuth(req, res, next);
  }
}

// Kaikki /api/ -alkuiset polut ohjataan rest_api.js:lle.
var restApi = require('./rest_api.js');
app.use('/api/', restApi(checkApiAuthentication));


// Lomakekirjautumiseen:
app.post('/logout', logout);
app.post('/login', passport.authenticate('local',
         {successRedirect: '/', failureRedirect: '/login'}));
app.get('/login', function(req,res) {res.render('kirjaudu');} );

app.use('/static/', express.static(__dirname + '/static'));

app.get('/', function(req,res) { res.redirect('/static/jsclient.html'); })

app.listen(3000);

