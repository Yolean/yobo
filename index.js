
var backbone = require('backbone');
var backboneUnderscore = require('./node_modules/backbone/node_modules/underscore');

var mixins = require('./mixins/BackboneCocktail');
mixins.enable(backbone);

module.exports = {

  _: backboneUnderscore,

  Backbone: backbone,

  Collection: backbone.Collection,
  Model: backbone.Model,

  // looks like "named mixins" in backbone.cocktail, but are not supported as such in .mixin, yet
  mixins: {
    subset: require('./subset/CollectionSubsetMixin')
  }
};
