var express = require('express');
var http = require('http');
var path = require("path");


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/hello/:name/:count', function(req,res, next){
    var name = req.param('name');
    var count = req.param('count');
    res.render("hello", {count: count, name: name}); 
});


http.createServer(app).listen(process.env.PORT, function(){
    console.log('Express Server running at ' + process.env.IP + ':' + process.env.PORT + '/');
});