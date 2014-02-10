var mongoose = require("mongoose");
mongoose.connect('mongodb://' + process.env.IP + '/test')

var Schema = mongoose.Schema;
var characterSchema = new Schema({
    name: String,
    age: Number
});

var CharacterModel = mongoose.model('Character', characterSchema);
function Character(obj){
    this.name = obj.name;
    this.age = obj.age;
}

module.exports = Character;
Character.prototype.save = function(fn){
    if (this.id){
        this.update(fn);
    }
    else{
        var that = this;
        var character = new CharacterModel({
            name: that.name,
            age: that.age
        })
        
        character.save(function(err, character){
            if (err) fn(err);
            fn(null, character);
        })
    }
}

Character.prototype.update = function(fn){
    var that = this;
    CharacterModel.update({name: that.name, age: that.age }, function(err, character){
        if (err) fn(err);
        return(null, character);
    })
    
}

Character.getByName = function(name, fn){
    CharacterModel.find({name: name}, function(err, characters){
        if (err) fn(err);
        if ( characters.length == 0){
            fn()
        }
        else{
            fn(null, new Character(characters[0]))
        }
    })
}

