module.exports = BilateralFilter;

var KernelFilter = require('display/filters/KernelFilter');

function BilateralFilter(radiusX, radiusY, sigma) {
  this._constructor.apply(this, arguments);
}

BilateralFilter.prototype = new KernelFilter();

BilateralFilter.prototype._constructor = function(radiusX, radiusY, sigmaDistance, sigmaColor) {
  this.radiusX = radiusX;
  this.radiusY = radiusY;
  if (sigmaDistance === undefined) sigmaDistance = 1;
  if (sigmaColor === undefined) sigmaColor = 1;

  var kernel = [];
  var i, len, dy, dx, s;
  s = 2 * sigmaDistance * sigmaDistance;
  for (dy = 1 - this.radiusY, i = 0; dy < this.radiusY; ++dy) {
    for (dx = 1 - this.radiusX; dx < this.radiusX; ++dx, ++i) {
      kernel[i] = Math.exp(-(dx * dx + dy * dy) / s);
    }
  }
  this.kernel = kernel;

  this.colorWeightMap = [];
  s = 2 * sigmaColor * sigmaColor;
  for (i = 0, len = 0xff * 3; i < len; ++i) {
    this.colorWeightMap[i] = Math.exp(-i * i * s);
  }
};

BilateralFilter.prototype._runKernel = function(kernel, pixels, x, y, width, height) {
  var i, relY, relX, absY, absX, p, r, g, b, weight;
  p = pixels[y + this.radiusY - 1][x + this.radiusX - 1];
  var cR = p[0];
  var cG = p[1];
  var cB = p[2];
  r = g = b = 0;
  var totalWeight = 0;
  var h = this.radiusY * 2 - 1;
  var w = this.radiusX * 2 - 1;
  for (relY = 0, i = 0; relY < h; ++relY) {
    absY = y + relY;
    for (relX = 0; relX < w; ++relX, ++i) {
      absX = x + relX;
      p = pixels[absY][absX];
      weight = kernel[i] * this.colorWeightMap[Math.abs(p[0] - cR) + Math.abs(p[1] - cG) + Math.abs(p[2] - cB)];
      totalWeight += weight;
      r += p[0] * weight;
      g += p[1] * weight;
      b += p[2] * weight;
    }
  }
  return [r / totalWeight, g / totalWeight, b / totalWeight];
};