
var backbone = require('backbone');

var mixins = require('./mixins/BackboneCocktail');
mixins.enable(backbone);

module.exports = {
  Backbone: backbone,
  Collection: backbone.Collection,
  Model: backbone.Model
};
