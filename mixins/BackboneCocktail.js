'use strict';

var cocktail = require('backbone.cocktail');
var underscore = require('underscore');

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
  enable: function(target) {
    if (underscore.isArray(target)) {
      target.forEach(function (component) {
        component.mixin = mixin;
      });
    } else {
      target.Model.mixin =
        target.Collection.mixin =
        target.Router.mixin =
        target.View.mixin =
        target.History.mixin = mixin;
    }
  }
};
