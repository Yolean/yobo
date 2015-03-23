'use strict';

var expect = require('chai').expect;
var mocks = require('simple-mock');

describe('Subset', function() {

  var yobo = require('../');
  var Collection = yobo.Collection.extend({}).mixin(yobo.mixins.subset);
  var Model = yobo.Model.extend({});

  describe("#subset", function() {

    it("Takes as first arg a matcher that returns true or false for model instances", function() {
      var c = new Collection([new Model({id: 1}), new Model({id: 2})]);
      var s = c.subset(function(model) {
        return model.attributes.id > 1;
      });
      expect(s.size()).to.equal(1);
      expect(s.pluck('id')).to.deep.equal([2]);
    });

    it("Takes as second arg (optional) and immerse function", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = c.subset(
        function(model) {
          return !!model.attributes.visible;
        },
        function(model) {
          model.set('visible', true);
        });
      expect(s.size()).to.equal(0);
      var add = new Model({id: '002'});
      s.add(add);
      expect(add.attributes.visible).to.be.true();
    });

    xit("May some day take non-function first arg, for cacheable filters like those in PourOver", function() {
    });

  });

  describe("#subsetWhere", function() {

    it("Is a shorthand for _.isMatch matcher", function() {
      var c = new Collection([new Model({id: '001', type: 'B'}), new Model({id: '002', type: 'A'}), new Model({id: '003', type: 'B'})]);
      var sA = c.subsetWhere({type:'A'});
      expect(sA.pluck('id')).to.deep.equal(['002']);
      var sB = c.subsetWehre({type:'B'});
      expect(aB.pluck('id')).to.deep.equal(['001','003']);
    });

    it("Too supports immerse, .i.e. lets any consumer of the subset do .add without knowlege of the filter", function() {
      var s = new Collection().subsetWhere({type:'C'}, function(model) {
        model.set('type','C');
      });
      s.add(new Model({id: 1}));
      expect(s.pluck('type')).to.deep.equal(['C']);
    });

  });

  describe("subset add", function() {

    it("Is always added to superset", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = new Collection().subsetWhere({type:'C'}, function(model) {
        model.set('type','C');
      });

      var cadd = mocks.spy();
      c.on('add', cadd);
      var sadd = mocks.spy();
      s.on('add', sadd);

      s.add(new Model({id: '002'}));
      expect(c.pluck('id')).to.deep.equal(['001', '002']);
      expect(c.at(1).get('type')).to.equal('C');

      expect(cadd.called).to.be.true();
      expect(sadd.called).to.be.true();
    });

  });

  describe("superset add", function() {

    var immerse = mocks.spy();

    it("Is added to subset if it matches filter", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = new Collection().subsetWhere({type:'C'}, immerse);

      sadd = mocks.spy();
      s.on('add', sadd);
      c.add(new Model({type: 'B'}));
      expect(sadd.called).to.be.false();
      c.add(new Model({type: 'C'}));
      expect(sadd.called).to.be.true();
      expect(s.size()).to.equal(1);
      expect(c.size()).to.equal(3);
    });

    it("Does not invoke the immerse function", function() {
      expect(immerse.called).to.be.false();
    });

  });

  describe("Change to model outside subset", function() {

    it("Produces no change event in the subset", function() {

    });

    it("Becomes a subset add if model matchs subset after change", function() {

    });

  });

  describe("subset model change to exit filter", function() {

  });

  describe("change events in both superset and subset", function() {

  });

  describe("change events on the way in", function() {

    xit("Counts as add so no change event?", function() {
    });

  });

  describe("change events on the way out", function() {

    xit("Counts as remove so no change event?", function() {
    });

  });

});
