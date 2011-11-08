(function () {
  var KernelFilter = require('KernelFilter');

  function UnsharpMaskFilter(radiusX, radiusY, amount) {
    this._constructor.apply(this, arguments);
  }

  UnsharpMaskFilter.prototype = new KernelFilter();

  UnsharpMaskFilter.prototype._constructor = function (radiusX, radiusY, amount) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.amount = (amount !== undefined) ? amount : 1;

    var kernel = [];
    var length = (radiusX * 2 - 1) * (radiusY * 2 - 1);
    var value = 1 / length;
    for (var i = 0, isCenter; i < length; ++i) {
      kernel[i] = -value;
      isCenter = (i === length >> 1);
      if (isCenter) {
        ++kernel[i];
      }
      kernel[i] *= this.amount;
      if (isCenter) {
        ++kernel[i];
      }
    }
    this.kernel = kernel;
  };

  return UnsharpMaskFilter;
});