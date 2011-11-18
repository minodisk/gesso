(function () {
  var KernelFilter = require('KernelFilter');

  function DoubleFilter() {
  }

  DoubleFilter.prototype = new KernelFilter();

  DoubleFilter.prototype._evaluatePixel = function (pixels, x, y, width, height) {
    var i, len, p, r, g, b;
    r = g = b = 0;
    var h = this.radiusY * 2 - 1;
    var w = this.radiusX * 2 - 1;
    for (i = 0,len = this.kernel.length; i < len; ++i) {
      p = this._runKernel(this.kernel[i], pixels, x, y, width, height);
      r += p[0] * p[0];
      g += p[1] * p[1];
      b += p[2] * p[2];
    }
    r = Math.sqrt(r);
    g = Math.sqrt(g);
    b = Math.sqrt(b);
    return [r, g, b, pixels[y + this.radiusY - 1][x + this.radiusX - 1][3]];
  };

  return DoubleFilter;
});