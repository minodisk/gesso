(function () {
  var Filter = require('Filter');

  function KernelFilter(radiusX, radiusY, kernel) {
    this._constructor.apply(this, arguments);
  }

  KernelFilter.prototype = new Filter();

  KernelFilter.prototype._constructor = function (radiusX, radiusY, kernel) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.kernel = kernel;
  };


  KernelFilter.prototype.scan = function (graphics) {
    var src = graphics.getImageData();
    var pixels = this._getPixels(src);

    var y, x;
    for (y = 0; y < this.radiusY - 1; ++y) {
      pixels.unshift(pixels[0].concat());
      pixels.push(pixels[pixels.length - 1].concat());
    }
    for (y = 0; y < pixels.length; ++y) {
      for (x = 0; x < this.radiusX - 1; ++x) {
        pixels[y].unshift(pixels[y][0].concat());
        pixels[y].push(pixels[y][pixels[y].length - 1].concat());
      }
    }

    var out = graphics.createImageData();
    this._setPixels(out, pixels);

    return out;
  };

  KernelFilter.prototype._evaluatePixel = function (pixels, x, y, width, height) {
    var p = this._runKernel(this.kernel, pixels, x, y, width, height);
    p[3] = pixels[y + this.radiusY - 1][x + this.radiusX - 1][3];
    return p;
  };

  KernelFilter.prototype._runKernel = function (kernel, pixels, x, y, width, height) {
    var relY, relX, absY, absX, i, p, f, r, g, b;
    r = g = b = 0;
    var h = this.radiusY * 2 - 1;
    var w = this.radiusX * 2 - 1;
    for (relY = 0,i = 0; relY < h; ++relY) {
      absY = y + relY;
      for (relX = 0; relX < w; ++relX,++i) {
        absX = x + relX;
        p = pixels[absY][absX];
        f = kernel[i];
        r += p[0] * f;
        g += p[1] * f;
        b += p[2] * f;
      }
    }
    return [r, g, b];
  };

  return KernelFilter;
});