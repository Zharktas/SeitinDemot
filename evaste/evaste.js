var express = require('express');
var app = express();
var Cookies = require('cookies');

function laskuriGet(req, res) {
    var cookies = new Cookies(req, res);
    var laskuri = parseInt(cookies.get("laskuri"), 10) || 0;
    cookies.set("laskuri", laskuri+1, {maxage: 60*1000});

    var body = "Moi, evästeesi mukaan olet käynyt täällä "+laskuri+" kertaa.";
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(body);
}

app.get('/', laskuriGet);

app.listen(process.env.PORT, process.env.IP);
