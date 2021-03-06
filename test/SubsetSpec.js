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

    it("is possible to create several layers of subsets", function () {
      var superset = new Collection([{ id: 1}, { id: 2}, { id: 3 } ]);
      var subset1 = superset.subset(function (m) { return m.attributes.id > 1; });
      var subset2 = subset1.subset(function (m) { return m.attributes.id > 2; });

      expect(superset.length).to.equal(3);
      expect(subset1.length).to.equal(2);
      expect(subset2.length).to.equal(1);
    });

    it("Aggregates immerse for each layer of subset", function() {
      var superset = new Collection();
      var subset1 = superset.subset(function (m) { return true; }, function(m) { m.set('1', true); });
      var subset2 = subset1.subset(function (m) { return true; }, function(m) { m.set('2', true); });
      var add1 = subset1.add(new Model({}));
      var add2 = subset2.add(new Model({}));
      expect(add1.has('1')).to.be.true;
      expect(add1.has('2')).to.be.false;
      expect(add2.has('1')).to.be.true;
      expect(add2.has('2')).to.be.true;
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
      expect(function() {
        new Collection().subset({type:'X'});
      }).to.throw();
    });

  });

  describe("Subset modification", function() {

    it("#add is reflected to superset", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = c.subsetWhere({type:'C'}, function(model) {
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
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = c.subsetWhere({type:'B'});
      expect(s.size()).to.equal(1);
      var m = s.at(0);
      s.remove(m);
      expect(s.size()).to.equal(0);
      expect(c.size()).to.equal(0);
    });

    it("Change events are triggered in both sets", function() {
      var c = new Collection([new Model({id: 1}), new Model({id: 2})]);
      var s = c.subset(function(model) { return model.id > 1; });
      var cc = mocks.spy();
      var sc = mocks.spy();
      c.on('change:type', cc);
      s.on('change:type', sc);
      s.at(0).set('type','X');
      expect(sc.called).to.be.true();
      expect(cc.called).to.be.true();
    });

  });

  describe("Superset modification", function() {

    var immerse = mocks.spy();

    it("#add is reflected in subset if it matches filter", function() {
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = c.subsetWhere({type:'C'}, immerse);

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
      var c = new Collection(new Model({id: '001', type: 'B'}));
      var s = c.subsetWhere({type:'B'}, function(model) { model.set('immersed', true); });
      c.add([new Model({id: 'a2'}), new Model({id: 'a3', type:'B'})]);
      expect(c.size()).to.equal(3);
      expect(s.pluck('id')).to.deep.equal(['001','a3']);
    });

    it("Remove is reflected in subset if the model matches filter", function() {
      var c = new Collection([new Model({id: 1}), new Model({id: 2})]);
      var s = c.subset(function(model) { return model.id > 1; });
      var sr = mocks.spy();
      s.on('remove', sr);
      expect(s.size()).to.equal(1);
      c.remove(c.at(0));
      expect(s.size()).to.equal(1);
      c.remove(c.at(0));
      expect(s.size()).to.equal(0);
      expect(sr.calls).to.have.length(1);
    });

    it("Change events are reflected in subset for matching models", function() {
      var c = new Collection([new Model({id: 1}), new Model({id: 2})]);
      var s = c.subset(function(model) { return model.id > 1; });
      var sc = mocks.spy();
      s.on('change', sc);
      c.get(1).set('type','T');
      expect(sc.called).to.be.false();
      c.get(2).set('type','T');
      expect(sc.called).to.be.true();
    });

  });

  describe("Superset model change from non-matching to matching", function() {

    var sc = mocks.spy();
    var sa = mocks.spy();
    var immerse = mocks.spy();

    it("Becomes a subset add if model matches subset after change", function() {
      var c = new Collection(new Model({id: 1, v: 1}));
      var s = c.subset(function(m) { return m.get('v') > 2; }, immerse);
      s.on('add', sa);
      s.on('change', sc);
      c.get(1).set('v', 2);
      expect(s.size()).to.equal(0);
      c.get(1).set('v', 4);
      expect(s.size()).to.equal(1);
    });

    it("Does not do immerse on this pseudo-add", function() {
      expect(immerse.called).to.be.false();
    });

    it("Triggers an add event in subset", function() {
      expect(sa.called).to.be.true();
    });

    it("Triggers no change event in subset", function() {
      expect(sc.called).to.be.false();
    });

  });

  describe("Subset model change from matching to non-matching", function() {

    var cc = mocks.spy();
    var sc = mocks.spy();
    var cr = mocks.spy();
    var sr = mocks.spy();

    it("Counts as remove so no change event", function() {
      var c = new Collection(new Model({id: '1', type: 'B'}));
      c.on('change', cc);
      c.on('remove', cr);
      var s = c.subsetWhere({type:'B'});
      s.on('change', sc);
      s.on('remove', sr);
      expect(s.size()).to.equal(1);
      s.get('1').set('type', 'C');
      expect(s.size()).to.equal(0);
      expect(sc.called).to.be.false();
    });

    it("But a regular change event on superset", function() {
      expect(cc.called).to.be.true();
    });

    it("Triggers a remove event on subset", function() {
      expect(sr.called).to.be.true();
      expect(cr.called).to.be.false();
    });

  });

});
