var express = require('express');
var path = require("path");

var app = express();
app.use(express.cookieParser());

// Käytetään oletus-MemoryStorea session-olioiden tallentamiseen.
// TODO: käytä esim MongoStorea
app.use(express.session({secret: 'salatekstiFGHJtj90et09ert'}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// TODO: hae tuotteet tietokannasta
var TUOTTEET = { 10: {id: 10, nimi:"Harja", hinta:400},
                 11: {id: 11, nimi:"Makkaraperunat", hinta:300},
                 12: {id: 12, nimi:"Kenkä", hinta:4900}};

function kauppaGet(req,res) {
    var korissa = req.session.korissa || {};
    var yhteislkm = 0;
    for (var id in korissa) {
        yhteislkm += korissa[id].lkm;
    }
    res.render("kauppa", {tuotteet: TUOTTEET, lkm: yhteislkm}); 
}

function koriGet(req,res) {
    var korissa = req.session.korissa || {};
    res.render("kori", {korissa: korissa}); 
}

function tuoteKoriinPost(req,res) {
    if (!req.session.korissa) {
        req.session.korissa = {};
    }
    var korissa = req.session.korissa;
    var tuoteId = req.param('tuoteId');
    if (tuoteId in korissa) {
        korissa[tuoteId].lkm += 1;
        res.redirect(302, '/');
    }
    else if (tuoteId in TUOTTEET) {
        korissa[tuoteId] = {tuote: TUOTTEET[tuoteId], lkm: 1};
        res.redirect(302, '/');
    }
    else {
        res.status(404).send('Ei tuotetta id:llä '+tuoteId);
    }
}

app.get('/', kauppaGet);
app.get('/kori', koriGet);
app.post('/tuotekoriin/:tuoteId', tuoteKoriinPost);

app.listen(process.env.PORT, process.env.IP);
