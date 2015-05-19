
var expect = require('chai').expect;

var yobo = require('../');

describe("Collection", function() {

  // Or would there be a point with keeping the unmodified Collection class?
  it("yobo.Collection is same as yobo.Backbone.Collection", function() {
    expect(yobo.Collection).to.equal(yobo.Backbone.Collection);
  });

  describe("add", function() {

    it("Accepts anything that looks like a Backbone model", function() {
      var c = new yobo.Collection();
      var m1real = new yobo.Model({prop: 'val'});
      var m1 = yobo._.clone(m1real);
      expect(m1 instanceof yobo.Model).to.be.false;
      expect(m1.attributes.prop).to.equal('val');

      var added = c.add(m1);
      expect(added.attributes.prop).to.equal('val');
      expect(added).to.equal(m1);
      expect(c.at(0)).to.equal(m1);
    });

    it("Wraps any object that does not have .attributes", function() {
      var c = new yobo.Collection();
      var added = c.add({prop: 'val'});
      expect(added.get('prop')).to.equal('val');
      expect(added.prop).to.not.exist;
    });

    it("Thus requires a real model instance if there is an attribute called 'attributes'", function() {
      var c = new yobo.Collection();
      // Should work but will probably warn a lot
      //var added = c.add({attributes: 'val'});
      var m1 = new yobo.Model({attributes: 'val'});
      var added = c.add(m1);
      expect(added).to.equal(m1);
      expect(added.attributes.attributes).to.exist;
    });

    it("Consistently denies automatic wrapping if the model type has been unset", function() {
      var MyCollection = yobo.Collection.extend({model: undefined});
      expect(function() {
        new MyCollection().add({prop: 'val'});
      }).to.throw();
    });

  });


});
