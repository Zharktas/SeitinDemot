var mongoose = require("mongoose");
mongoose.connect('mongodb://' + process.env.IP + '/test')


var Schema = mongoose.Schema;

var characterSchema = new Schema({
    name: String,
    age: Number
});

var Character = mongoose.model('Character', characterSchema);

Character.remove({name: 'Hulk'}, function(err, hero){
    if (err) throw err;
    console.log("deleted");
})

