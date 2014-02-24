var express = require('express');
var app = express();

var tarkistus = express.basicAuth(function(user, pass) {
    return user==="antti" && pass==="12345";
});

function suojattu(req,res) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end("Moi " + req.user + "!");
}

app.use('/', tarkistus);

app.get('/', suojattu);

app.listen(process.env.PORT, process.env.IP);

