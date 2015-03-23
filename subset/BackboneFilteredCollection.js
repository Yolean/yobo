
var FilteredCollection = require('backbone-filtered-collection');

// the major disadvantage with this lib is that the subset is of a different type than the superset
var cocktail = require('backbone.cocktail');

var _ = require('../')._;

var subsetConnectMixin = {

  add: function(models, addopt) {
    var singular = !_.isArray(models);
    models = singular ? (models ? [models] : []) : models.slice();

    var immerse = this._subset_immerse;
    var superset = this._subset_superset;
    _.each(models, immerse);
    superset.add(models, addopt);
  },

  remove: function() {

  }

};

cocktail.mixin(FilteredCollection, subsetConnectMixin);

var supersetMixin = {

  subset: function(matcher, immerse) {

  },

  subsetWhere: function(obj, immerse) {
    var superset = this;
    var subset = new FilteredCollection(superset);
    subset.filterBy(obj);
    console.log('filter', superset.pluck('id'), 'by', obj, 'to', subset.size());    
    // do we need private state?
    subset._subset_superset = superset;
    subset._subset_immerse = immerse || function immerseNoop() {};
    return subset;
  }

};

module.exports = supersetMixin;
