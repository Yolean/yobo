'use strict';

var expect = require('chai').expect;

describe('yobo module', function() {

  var yobo = require('../');

  it('Exports .Backbone, the current backbone version', function() {
    expect(yobo.Backbone).to.exist();
  });

  it('Exports .Collection, a shorthand for the (future) browser lib independent data structure', function() {
    expect(yobo.Collection).to.exist();
  });

  it('Exports .Model, the "class" that Collection does instanceof on', function() {
    expect(yobo.Model).to.exist();
  });

  it('Does not export shorthand for browser dependent parts of Backbone', function() {
    expect(yobo.View).to.be.undefined();
    expect(yobo.Router).to.be.undefined();
  });

  it('Exports _ from backbone, to avoid duplicate libs in webpack bundles', function() {
    expect(yobo._).to.exist();
  });

});
