(function () {
  var KernelFilter = require('KernelFilter');

  function BlurFilter(radiusX, radiusY) {
    this._constructor.apply(this, arguments);
  }

  BlurFilter.prototype = new KernelFilter();

  BlurFilter.prototype._constructor = function (radiusX, radiusY) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;

    var kernel = [];
    var length = (radiusX * 2 - 1) * (radiusY * 2 - 1);
    var value = 1 / length;
    for (var i = 0; i < length; ++i) {
      kernel[i] = value;
    }
    this.kernel = kernel;
  };

  return BlurFilter;
});