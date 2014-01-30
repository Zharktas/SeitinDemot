var express = require('express');
var http = require('http');

var app = express();

app.get('/', function(req,res, next){
    var id = req.param('id')
    res.send("Id was: " + id); 
});


http.createServer(app).listen(process.env.PORT, function(){
    console.log('Express Server running at ' + process.env.IP + ':' + process.env.PORT + '/');
})