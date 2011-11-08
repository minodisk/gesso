module.exports = Quadtree;

__padLeft = require('utils/StringUtil').padLeft;

function _separate(n) {
  n = (n | (n << 8)) & 0x00ff00ff;
  n = (n | (n << 4)) & 0x0f0f0f0f;
  n = (n | (n << 2)) & 0x33333333;
  return (n | (n << 1)) & 0x55555555;
}

function Quadtree(level) {
  this.level = level;
  this.lowestLengthPerSide = Math.pow(2, this.level);
  this.lowestSpaceLength =
    this.lowestLengthPerSide * this.lowestLengthPerSide;
  this.bitLength = (this.lowestSpaceLength - 1).toString(2).length;
}

Quadtree.coordToZOrder = function(x, y) {
  return _separate(x) | (_separate(y) << 1);
};

Quadtree.prototype = {};

Quadtree.prototype.coordsToIndex = function(x0, y0, x1, y1) {
  var m0 = Quadtree.coordToZOrder(x0, y0);
  var m1 = Quadtree.coordToZOrder(x1, y1);

  var level = m0 ^ m1;
  for (var i = 0, m = this.bitLength / 2, shift; i < m; ++i) {
    if ((level & (3 << 2 * (m - i - 1))) !== 0) {
      shift = 2 * (m - i);
      break;
    }
  }
  m1 >>= shift;

  return (Math.pow(4, i) - 1) / 3 + m1;
};

Quadtree.prototype.toBitString = function(n) {
  return __padLeft(n.toString(2), this.bitLength, '0');
};
