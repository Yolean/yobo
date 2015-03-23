'use strict';

describe('Subset', function() {

  var yobo = require('../').Collection;
  var Collection = yobo.Collection.extend({}).mixin(yobo.mixins.subset);

  describe("#subset", function() {

    it("Takes as first arg a matcher that returns true or false for model instances", function() {

    });

    it("Takes as second arg (optional) and immerse function", function() {

    });

    it("Allows through the immerse function a consumer of the collection to .add without knowlege of the filter", function() {

    });

    xit("May some day take non-function first arg, for cacheable filters like those in PourOver", function() {
    });

  });

  describe("#subsetWhere", function() {

    it("Is a shorthand for _.isMatch matcher", function() {

    });

  });

  describe("subset add", function() {

  });

  describe("superset add", function() {

  });

  describe("superset change to enter filter", function() {

  });

  describe("superset change to exit filter", function() {

  });

  describe("subset change to exit filter", function() {

  });

});
