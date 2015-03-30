'use strict';

var cocktail = require('backbone.cocktail');

var mixin = function(obj, fn) {
  var parent = this;

  if (typeof obj === 'string') {
    var one = {};
    one[obj] = fn;
    obj = one;
  }

  cocktail.mixin(parent, obj);

  return parent;
};

module.exports = {
  enable: function(Backbone) {
    Backbone.Model.mixin =
      Backbone.Collection.mixin =
      Backbone.Router.mixin =
      Backbone.View.mixin =
      Backbone.History.mixin = mixin;
  }
};
