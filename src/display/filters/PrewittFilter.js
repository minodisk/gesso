(function () {
  var DoubleFilter = require('DoubleFilter');

  function PrewittFilter() {
    this._constructor.apply(this, arguments);
  }

  PrewittFilter.prototype = new DoubleFilter();

  PrewittFilter.prototype._constructor = function () {
    this.radiusX = 2;
    this.radiusY = 2;
    this.kernel = [
      [
        -1, 0, 1,
        -1, 0, 1,
        -1, 0, 1
      ],
      [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
      ]
    ];
  };

  return DoubleFilter;
});