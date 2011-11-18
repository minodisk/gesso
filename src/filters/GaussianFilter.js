(function () {
  var KernelFilter = require('KernelFilter');

  function GaussianFilter(radiusX, radiusY, sigma) {
    this._constructor.apply(this, arguments);
  }

  GaussianFilter.prototype = new KernelFilter();

  GaussianFilter.prototype._constructor = function (radiusX, radiusY, sigma) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    if (sigma === undefined) sigma = 1;

    var kernel = [];
    var weight = 0;
    var i, len, dy, dx, s, w;
    for (dy = 1 - this.radiusY,i = 0; dy < this.radiusY; ++dy) {
      for (dx = 1 - this.radiusX; dx < this.radiusX; ++dx,++i) {
        s = 2 * sigma * sigma;
        w = 1 / (s * Math.PI) * Math.exp(-(dx * dx + dy * dy) / s);
        weight += w;
        kernel[i] = w;
      }
    }
    // normalize kernel
    for (i = 0,len = kernel.length; i < len; ++i) {
      kernel[i] /= weight;
    }
    this.kernel = kernel;
  };

  return GaussianFilter;
});