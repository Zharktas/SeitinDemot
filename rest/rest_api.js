
var express = require('express');

var Hero = require('./models.js').Hero;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.once('open', function() {
  console.log("Connected to mongodb");
});


 // curl localhost:3000/api/heroes
function heroesGet(req, res) {
  Hero.find({}, function(err, heroes) {
    res.send(JSON.stringify(heroes));
  });
};

// curl -H 'Content-Type: application/json' -X POST -d '{"heroid": "spiderman", "name": "Spider Man", "city": "New York"}' localhost:3000/api/heroes
function heroesPost(req, res) {
  var hero = new Hero(req.body);
  hero.save(function(err, savedHero) {
    if (!err) {
      res.setHeader('Location', '/api/heroes/'+savedHero.heroid);
      res.status(201).send(JSON.stringify(savedHero));
    }
    else {
      res.status(403).send(JSON.stringify({err:err}));
    }
  });
}

 // curl localhost:3000/api/heroes/spiderman
function heroGet(req, res) {
  var heroid = req.param('heroid');
  Hero.findOne({heroid:heroid}, function(err, hero) {
    if (hero) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(404).send(JSON.stringify({err:"Not found"}));
    }
  });
}

// curl -u 'antti:1234' -X DELETE localhost:3000/api/heroes/spiderman
function heroDelete(req, res) {
  // Nykyisessä toteutuksessa kuka vain voi tehdä mitä vain, kunhan on autentikoitunut.
  // Monasti olisi kiva vielä rajoittaa tätä niin, että vain itsensä saa poistaa/muokata.
  // esim. if(heroid!==req.user) { res.status(403).send(...
  // Samoin PUT:ssa...

  var heroid = req.param('heroid');
  Hero.findOneAndRemove({heroid:heroid}, function(err, hero) {
    if (hero) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(404).send();
    }
  });
}

// curl -u 'antti:1234' -H 'Content-Type: application/json' -X PUT -d '{"heroid": "hulk", "name": "Hulk", "city": "Ohio"}' localhost:3000/api/heroes/hulk
function heroPut(req, res) {
  var heroid = req.param('heroid');
  if (heroid!==req.body.heroid) {
      res.status(409).send(JSON.stringify({err:heroid+" != "+req.body.heroid}));
  }
  Hero.findOneAndUpdate({heroid:heroid}, req.body, {upsert:true}, function(err, hero) {
    if (!err) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(500).send(JSON.stringify({err:err}));
    }
  });
}


// Vaaditaan autorisointi PUT:lle ja DELETE:lle.
// Autorisointi tarkistetaan authMiddleware:lla.
module.exports = function(authMiddleware) {

  var app = express();

  // Kaikki API:n vastaukset ovat json-tyyppiä
  app.use(function(req, res, next) {
    res.type('application/json; charset=utf-8');
    next();
  });

  app.get('/heroes', heroesGet);
  app.post('/heroes', heroesPost);
  app.get('/heroes/:heroid', heroGet);
  app.put('/heroes/:heroid', authMiddleware, heroPut);
  app.delete('/heroes/:heroid', authMiddleware, heroDelete);

  return app;
};

