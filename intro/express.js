var express = require('express');
var http = require('http');

var app = express();

app.get('/', function(req,res){
    res.send("Hello world!"); 
});


http.createServer(app).listen(process.env.PORT, function(){
    console.log('Express Server running at ' + process.env.IP + ':' + process.env.PORT + '/');
})