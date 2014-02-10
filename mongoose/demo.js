var mongoose = require("mongoose");
mongoose.connect('mongodb://' + process.env.IP + '/test')


var Schema = mongoose.Schema;

var characterSchema = new Schema({
    name: String,
    age: Number
});

var Character = mongoose.model('Character', characterSchema);

var hero = new Character({
    name: "Hulk",
    age: 34
});

hero.save(function(err){
    if( err ) throw err;
    console.log("saved");
})

Character.find({}, function(err, heroes){
    console.log(heroes);
})

