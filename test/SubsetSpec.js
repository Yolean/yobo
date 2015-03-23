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

  });

  describe("#subsetWhere", function() {

    it("Is a shorthand for _.isMatch matcher", function() {
      var c = new Collection([new Model({id: '001', type: 'B'}), new Model({id: '002', type: 'A'}), new Model({id: '003', type: 'B'})]);
      var sA = c.subsetWhere({type:'A'});
      expect(sA.pluck('id')).to.deep.equal(['002']);
      var sB = c.subsetWhere({type:'B'});
      expect(sB.pluck('id')).to.deep.equal(['001','003']);
    });

    it("Too supports immerse, .i.e. lets any consumer of the subset do .add without knowlege of the filter", function() {
      var s = new Collection().subsetWhere({type:'C'}, function(model) {
        model.set('type','C');
      });
      s.add(new Model({id: 1}));
      expect(s.pluck('type')).to.deep.equal(['C']);
    });

    it("Is not embedded in #subset because we want to keep a future object arg open for advanced filters", function() {
      // like those from Filters.make*Filter in PourOver
    });

  });

  describe("Subset modification", function() {

    it("#add is reflected to superset", function() {
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

    it("#remove is reflected to superset", function() {

    });

    it("Change events are triggered in both sets", function() {

    });

  });

  describe("Superset modification", function() {

    var immerse = mocks.spy();

    it("#add is reflected in subset if it matches filter", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = new Collection().subsetWhere({type:'C'}, immerse);

      var sadd = mocks.spy();
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

    it("In a multi-model add only those matching filter are added to subset", function() {

    });

    it("Remove is reflected in subset if the model matches filter", function() {

    });

    it("Change events don't affect subset for non-matching models", function() {

    });

    it("Change events affect subset for matching models", function() {

    });

  });

  describe("Superset model change from non-matching to matching", function() {

    it("Produces no change event in the subset", function() {

    });

    it("Becomes a subset add if model matchs subset after change", function() {

    });

  });

  describe("Subset model change from matching to non-matching", function() {

    it("Counts as remove so no change event", function() {
      
    });

    it("Triggers a remove event", function() {

    });

  });

});
