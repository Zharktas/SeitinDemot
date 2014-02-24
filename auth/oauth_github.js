
var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var https = require('https');

var app = express();

var path = require("path");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: 'salateksti1234'}));
app.use(passport.initialize());
app.use(passport.session());

var GITHUB_CLIENT_ID = 'x';
var GITHUB_CLIENT_SECRET = 'y';

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/githubcallback",
    scope: 'repo'
  },
  function(accessToken, refreshToken, profile, done) {
    var user = {
      name: profile.displayName,
      accessToken: accessToken,
      refreshToken: refreshToken
    }
    done(null, user);
  }
));


function uusiissue(req, res) {
  var repo = req.body.repo;
  var options = {
    method: 'POST',
    host: 'api.github.com',
    path: '/repos/'+repo+'/issues',
  };

  callback = function(githubres) {
    res.redirect('/');
  }

  var post = https.request(options, callback);
  post.setHeader('User-Agent', 'testiappis');
  post.setHeader('Authorization', 'token '+req.user.accessToken);
  post.write(JSON.stringify({title:req.body.title}));
  post.end();
}


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function etusivu(req, res) {
  res.render("githubsivu", {kayttaja: req.user});
}

var githubAuth = passport.authenticate('github', { successRedirect: '/', failureRedirect: '/' });
app.get('/githublogin', githubAuth);
app.get('/githubcallback', githubAuth);

app.get('/', etusivu);

app.post('/uusiissue', uusiissue);


app.listen(3000);

