(function () {
  var KernelFilter = require('KernelFilter');

  function LaplacianFilter(is4Direction) {
    this._constructor.apply(this, arguments);
  }

  LaplacianFilter.prototype = new KernelFilter();

  LaplacianFilter.prototype._constructor = function (is4Direction) {
    this.radiusX = 2;
    this.radiusY = 2;
    if (is4Direction) {
      this.kernel = [
        0, 1, 0,
        1, -4, 1,
        0, 1, 0
      ];
    } else {
      this.kernel = [
        1, 1, 1,
        1, -8, 1,
        1, 1, 1
      ];
    }
  };

  return LaplacianFilter;
});