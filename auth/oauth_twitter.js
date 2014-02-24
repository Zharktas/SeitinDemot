
var Twitter = require('twitter');

var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var app = express();

var path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'salateksti1234'}));
app.use(passport.initialize());
app.use(passport.session());

var TWITTER_KEY = 'DlBi4CbzD9N2kFDE2IcUwQ';
var TWITTER_SECRET = 'H2mAscOWB4QJTziHDNg9cw96m6lWXy614pH0r9pssyA';

passport.use(new TwitterStrategy({
  consumerKey: TWITTER_KEY,
  consumerSecret: TWITTER_SECRET,
  callbackURL: "https://luentodemot-c9-zharktas.c9.io/twittercallback"
},
function(token, tokenSecret, profile, done) {
  var user = {
    name: profile.username,
    token: token,
    tokenSecret: tokenSecret};
  done(null, user);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function etusivu(req, res) {
  res.render("twittersivu", {kayttaja: req.user, twiitti:null});
}

function twiittaa(req, res) {
  var user = req.user;

  var twiitti = req.body.twiitti;

  var twit = new Twitter({
      consumer_key: TWITTER_KEY,
      consumer_secret: TWITTER_SECRET,
      access_token_key: user.token,
      access_token_secret: user.tokenSecret
  });

  twit.post('/statuses/update.json', {status: twiitti}, function(data) {
    var linkki = 'https://twitter.com/'+data.user.screen_name+'/status/'+data.id_str;
    res.render("twittersivu", {kayttaja: user, twiitti:twiitti, linkki:linkki});
  });
}

var twitterAuth = passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/' });
app.get('/twitterlogin', twitterAuth);
app.get('/twittercallback', twitterAuth);

app.get('/', etusivu);

app.post('/twiittaa', twiittaa);

app.listen(process.env.PORT, process.env.IP);

