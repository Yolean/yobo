
module.exports = function(Collection) {

  Collection.prototype._isModel = function(model) {
    if (typeof model.attributes === 'object' && typeof model.cid === 'string') {
      if (typeof model.on !== 'function' || typeof model.trigger !== 'function') {
        throw new Error('Backbone requires Model to have .on and .trigger functions. Use Model, Backbone.Events or https://www.npmjs.com/package/bev.');
      }
      return true;
    }
    if (typeof model.attributes === 'object' && typeof model.cid === 'undefined') {
      throw new Error('Invalid Model instance, has .attributes but not .cid');
    }
    if (typeof model.attributes === 'undefined' && typeof model.cid !== 'undefined') {
      throw new Error('Invalid Model instance, has .cid but not .attributes');
    }
    return false;
  };

};
