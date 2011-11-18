(function () {
  var KernelFilter = require('KernelFilter');

  function MedianFilter(radiusX, radiusY) {
    this._constructor.apply(this, arguments);
  }

  MedianFilter.prototype = new KernelFilter();

  MedianFilter.prototype._runKernel = function (kernel, pixels, x, y, width, height) {
    var relY, relX, absY, absX, i;
    var ps = [];
    var h = this.radiusY * 2 - 1;
    var w = this.radiusX * 2 - 1;
    for (relY = 0,i = 0; relY < h; ++relY) {
      absY = y + relY;
      for (relX = 0; relX < w; ++relX,++i) {
        absX = x + relX;
        ps[i] = pixels[absY][absX];
      }
    }
    ps.sort(this._sortAsSum);
    return ps[i >> 1];
  };

  MedianFilter.prototype._sortAsSum = function (a, b) {
    var sumA, sumB;
    sumA = sumB = 0;
    for (var i = 0; i < 3; ++i) {
      sumA += a[i];
      sumB += b[i];
    }
    return sumA - sumB;
  };

  return MedianFilter;
});