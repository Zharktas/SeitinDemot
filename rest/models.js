
var mongoose = require('mongoose');

var baseUrl = '/api/heroes';

var trans = function(doc, ret, options) {
  // Ei palauteta mongoosen sisäisiä juttuja JSON-esityksessä.
  delete ret.id
  delete ret._id;
  delete ret.__v;
}

var options = {toJSON:{transform: trans, virtuals: true}};

var HeroSchema = new mongoose.Schema({
  heroid: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  city: String
}, options);

HeroSchema.virtual('links').get(function() {
  return [
    { rel: 'self', href: baseUrl+'/'+this.heroid }
    // linkkejä voisi olla lisääkin...
  ];
});

module.exports.Hero = mongoose.model('Hero', HeroSchema);

