'use strict';

var FilteredCollection = require('backbone-filtered-collection');

// the major disadvantage with this lib is that the subset is of a different type than the superset
var cocktail = require('backbone.cocktail');

var _ = require('../node_modules/backbone/node_modules/underscore');
console.assert(!!_);

var subsetConnectMixin = {

  add: function(models, addopt) {
    var singular = !_.isArray(models);
    models = singular ? (models ? [models] : []) : models.slice();

    var immerse = this._subset_immerse;
    var superset = this._subset_superset;
    _.each(models, immerse);

    return superset.add.apply(superset, arguments);
  },

  remove: function() {
    throw 'Not implemented';
  }

};

cocktail.mixin(FilteredCollection, subsetConnectMixin);

// understands both subsetWhere obj and subset filter function
var backboneFilteredCollectionSubset = function(filterBy, immerse) {
  var superset = this;
  var subset = new FilteredCollection(superset);
  subset.filterBy(filterBy);
  console.log('filter', superset.pluck('id'), 'by', filterBy, 'to', subset.size());
  // do we need private state?
  subset._subset_superset = superset;
  subset._subset_immerse = immerse || function immerseNoop() {};
  return subset;
};

module.exports = {

  subset: backboneFilteredCollectionSubset,

  subsetWhere: backboneFilteredCollectionSubset,

};
