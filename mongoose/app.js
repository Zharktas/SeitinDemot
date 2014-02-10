var mongoose = require("mongoose");
mongoose.connect('mongodb://' + process.env.IP + '/test')

var db = mongoose.connection;
db.once('open', function callback () {
  console.log("We have connection");
});