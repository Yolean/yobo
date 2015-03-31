'use strict';

var expect = require('chai').expect;

describe("#mixin", function() {

  var yobo = require('../');

  it("Is a function on Model and Collection", function() {
    expect(yobo.Model.mixin).to.be.a('function');
    expect(yobo.Collection.mixin).to.be.a('function');
  });

  it("can be enabled on external components through yobo.enableMixins", function () {
    var subject1 = {}, subject2 = {};
    yobo.enableMixins([subject1, subject2]);
    expect(subject1.mixin).to.exist();
    expect(subject2.mixin).to.exist();

    var subject3 = {
      Collection: {},
      Model: {},
      View: {},
      Router: {},
      History: {},
    };
    yobo.enableMixins(subject3);
    expect(subject3.Collection.mixin).to.exist();
    expect(subject3.Model.mixin).to.exist();
    expect(subject3.View.mixin).to.exist();
    expect(subject3.Router.mixin).to.exist();
    expect(subject3.History.mixin).to.exist();
  });

  xit("Is a function on View, Router, History", function() {

  });

  xit("Is not allowed directly on those, so do a dummy '.extend({})' unless you already specialized", function() {
    expect(function() {
      var MyModel = yobo.Model.mixin({});
    }).to.throw('Forbidden to modify exported Model, use .extend({}) first');
  });

  describe("Given a single object", function() {

    it("Behaves like .extend if the props don't exist on super", function() {
      var MyModel = yobo.Model.extend({}).mixin({
        myProp: true
      });
      expect(MyModel.prototype.myProp).to.be.true();
    });

    it("Composes behavior on prop collision", function() {
      var happened = [];
      var MySpecial = yobo.Model.extend({
        myFn: function() {
          happened.push('A');
        }
      });
      MySpecial.mixin({
        myFn: function() {
          happened.push('B');
        }
      });
      new MySpecial().myFn();
      expect(happened).to.deep.equal(['A','B']);
    });

    xit("Preserves order of composition to order of execution", function() {

    });

    xit("Runs just as well on instances", function() {

    });

  });

  describe("Given string and function", function() {

    it("Is the same as a mixin object with only one prop", function() {
      var fn = function() {};
      var MyModel = yobo.Model.extend({}).mixin('myProp', fn);
      expect(MyModel.prototype.myProp).to.equal(fn);
    });

  });

  xit("What if we want to modify existing behavior without extending? Would AOP style wrapping be useful?");

});
