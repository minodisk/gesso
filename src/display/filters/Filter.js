(function () {
  function Filter() {
    this._constructor.apply(this, arguments);
  }

  Filter.prototype = {};

  Filter.prototype._constructor = function () {
  };

  Filter.prototype.scan = function (graphics) {
    var src = graphics.getImageData();
    var pixels = this._getPixels(src);

    var out = graphics.createImageData();
    this._setPixels(out, pixels);

    return out;
  };

  Filter.prototype._getPixels = function (imageData) {
    var data = imageData.data;
    var width = imageData.width;
    var height = imageData.height;
    var pixels = [];
    var y, x, i;
    for (y = 0,i = 0; y < height; ++y) {
      pixels[y] = [];
      for (x = 0; x < width; ++x,i += 4) {
        pixels[y][x] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      }
    }
    return pixels;
  };

  Filter.prototype._setPixels = function (imageData, pixels) {
    var data = imageData.data;
    var width = imageData.width;
    var height = imageData.height;
    var y, x, i, p;
    for (y = 0,i = 0; y < height; ++y) {
      for (x = 0; x < width; ++x,i += 4) {
        p = this._evaluatePixel(pixels, x, y, width, height);
        data[i] = p[0];
        data[i + 1] = p[1];
        data[i + 2] = p[2];
        data[i + 3] = p[3];
      }
    }
  };

  Filter.prototype._evaluatePixel = function (pixels, x, y, width, height) {
    return pixels[y][x];
  };

  return Filter;
});