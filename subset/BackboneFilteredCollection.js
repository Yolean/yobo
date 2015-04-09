'use strict';

var FilteredCollection = require('backbone-filtered-collection');

// the major disadvantage with this lib is that the subset is of a different type than the superset
var cocktail = require('backbone.cocktail');

var _ = require('underscore');

var mixins = require('../mixins/BackboneCocktail');

var subsetConnectMixin = {

  add: function(models, options) {
    var singular = !_.isArray(models);
    models = singular ? (models ? [models] : []) : models.slice();

    var immerse = this._subset_immerse;
    var superset = this._subset_superset;
    _.each(models, immerse);

    return superset.add.apply(superset, arguments);
  },

  remove: function(models, options) {
    var superset = this._subset_superset;
    return superset.remove.apply(superset, arguments);
  }

};

cocktail.mixin(FilteredCollection, subsetConnectMixin);

// understands both subsetWhere obj and subset filter function
var backboneFilteredCollectionSubset = function(filterBy, immerse) {
  var superset = this;
  var subset = new FilteredCollection(superset);
  subset.filterBy(filterBy);

  // do we need private state?
  subset._subset_superset = superset;
  subset._subset_immerse = immerse || function immerseNoop() {};
  return subset;
};

var subsetMixin = function() {
  if (typeof arguments[0] === 'object') {
    throw new Error('Advanced filters not supported. Use a predicate function.');
  }

  var set = backboneFilteredCollectionSubset.apply(this, arguments);
  mixins.enable([set]);
  set.mixin(module.exports);

  return set;
};

module.exports = {

  subset: subsetMixin,

  subsetWhere: backboneFilteredCollectionSubset,

};
