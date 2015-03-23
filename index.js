
var backbone = require('backbone');

var mixins = require('./mixins/BackboneCocktail');
mixins.enable(backbone);

module.exports = {

  Backbone: backbone,

  Collection: backbone.Collection,
  Model: backbone.Model,

  // looks like "named mixins" in backbone.cocktail, but are not supported as such in .mixin, yet
  mixins: {
    subset: require('./subset/CollectionSubsetMixin')
  }
};
