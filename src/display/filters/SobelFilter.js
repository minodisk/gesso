(function () {
  var DoubleFilter = require('DoubleFilter');

  function SobelFilter() {
    this._constructor.apply(this, arguments);
  }

  SobelFilter.prototype = new DoubleFilter();

  SobelFilter.prototype._constructor = function () {
    this.radiusX = 2;
    this.radiusY = 2;
    this.kernel = [
      [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
      ],
      [
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
      ]
    ];
  };

  return SobelFilter;
});