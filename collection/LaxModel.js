
module.exports = function(Collection) {

  Collection.prototype._isModel = function(model) {
    return typeof model.attributes === 'object';
  };

};
