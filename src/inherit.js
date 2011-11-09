module.exports = (function () {
  var Uber = function () {
  };

  function inherit(Child, Parent) {
    if (typeof Child === 'undefined' || typeof Parent === 'undefined') {
      throw new TypeError();
    }
    Uber.prototype = Parent.prototype;
    Child.prototype = new Uber();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;
  }

  window.inherit = inherit;
})();