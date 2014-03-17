var mongoose = require("mongoose");
mongoose.connect('mongodb://' + process.env.IP + '/test')


var Schema = mongoose.Schema;

var characterSchema = new Schema({
    name: String,
    age: Number
});

var Character = mongoose.model('Character', characterSchema);

Character.findOne({name: 'Hulk'}, function(err, hero){
    hero.name = "Luentodemo";
    hero.save(function(err){
        if (err) throw err;
    });
})

