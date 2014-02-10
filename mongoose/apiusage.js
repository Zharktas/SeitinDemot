var Character = require("./api");

var hero = new Character({
    name: 'Wolverine',
    age: 28
});

hero.save(function(err, character){
    if(err) throw err;
});

Character.getByName('Wolverine', function(err, character){
    if (err) throw err;
    if (character != null){
        character.name = 'Spiderman';
        console.log()
        character.save(function(err, newhero){
            console.log("Saved hero", newhero)
        });
    }
})


Character.getByName('Spiderman', function(err, character){
    if (err) throw err;
    console.log(character)
})

