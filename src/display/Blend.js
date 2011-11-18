var Blend = {};
module.exports = Blend;

function _mix(a, b, f) {
  return a + (((b - a) * f) >> 8);
}

function _peg(n) {
  return (n < 0x00) ? 0x00 : ((n > 0xff) ? 0xff : n);
}

Blend.scan = function(src, dst, method) {
  method = this[method];
  if (typeof method === 'undefined') {
    throw new TypeError();
  }

  for (var i = 0, len = src.data.length, o; i < len; i += 4) {
    o = method(
      [src.data[i], src.data[i + 1], src.data[i + 2], src.data[i + 3]],
      [dst.data[i], dst.data[i + 1], dst.data[i + 2], dst.data[i + 3]]
    );
    src.data[i] = o[0];
    src.data[i + 1] = o[1];
    src.data[i + 2] = o[2];
    src.data[i + 3] = o[3];
  }
  return src;
};

Blend.blend = function(s, d) {
  return [
    _mix(s[0], d[0], d[3]),
    _mix(s[1], d[1], d[3]),
    _mix(s[2], d[2], d[3]),
    s[3] + d[3]
  ];
};

Blend.add = function(s, d) {
  return [
    s[0] + (d[0] * d[3] >> 8),
    s[1] + (d[1] * d[3] >> 8),
    s[2] + (d[2] * d[3] >> 8),
    s[3] + d[3]
  ];
};

Blend.subtract = function(s, d) {
  return [
    s[0] - (d[0] * d[3] >> 8),
    s[1] - (d[1] * d[3] >> 8),
    s[2] - (d[2] * d[3] >> 8),
    s[3] + d[3]
  ];
};

Blend.darkest = function(s, d) {
  return [
    _mix(s[0], Math.min(s[0], d[0] * d[3] >> 8), d[3]),
    _mix(s[1], Math.min(s[1], d[1] * d[3] >> 8), d[3]),
    _mix(s[2], Math.min(s[2], d[2] * d[3] >> 8), d[3]),
    s[3] + d[3]
  ];
};

Blend.lightest = function(s, d) {
  return [
    Math.max(s[0], d[0] * d[3] >> 8),
    Math.max(s[1], d[1] * d[3] >> 8),
    Math.max(s[2], d[2] * d[3] >> 8),
    s[3] + d[3]
  ];
};

Blend.difference = function(s, d) {
  return [
    _mix(s[0], (s[0] > d[0]) ? (s[0] - d[0]) : (d[0] - s[0]), d[3]),
    _mix(s[1], (s[1] > d[1]) ? (s[1] - d[1]) : (d[1] - s[1]), d[3]),
    _mix(s[2], (s[2] > d[2]) ? (s[2] - d[2]) : (d[2] - s[2]), d[3]),
    s[3] + d[3]
  ];
};

Blend.exclusion = function(s, d) {
  return [
    _mix(s[0], s[0] + d[0] - (s[0] * d[0] >> 7), d[3]),
    _mix(s[1], s[1] + d[1] - (s[1] * d[1] >> 7), d[3]),
    _mix(s[2], s[2] + d[2] - (s[2] * d[2] >> 7), d[3]),
    s[3] + d[3]
  ];
};

Blend.multiply = function(s, d) {
  return [
    _mix(s[0], s[0] * d[0] >> 8, d[3]),
    _mix(s[1], s[1] * d[1] >> 8, d[3]),
    _mix(s[2], s[2] * d[2] >> 8, d[3]),
    s[3] + d[3]
  ];
};

Blend.screen = function(s, d) {
  return [
    _mix(s[0], 0xff - ((0xff - s[0]) * (0xff - d[0]) >> 8), d[3]),
    _mix(s[1], 0xff - ((0xff - s[1]) * (0xff - d[1]) >> 8), d[3]),
    _mix(s[2], 0xff - ((0xff - s[2]) * (0xff - d[2]) >> 8), d[3]),
    s[3] + d[3]
  ];
};

Blend.hardLight = function(s, d) {
  return [
    _mix(s[0], (d[0] < 0x80) ? (s[0] * d[0] >> 7) : (0xff - (((0xff - s[0]) * (0xff - d[0])) >> 7)), d[3]),
    _mix(s[1], (d[1] < 0x80) ? (s[1] * d[1] >> 7) : (0xff - (((0xff - s[1]) * (0xff - d[1])) >> 7)), d[3]),
    _mix(s[2], (d[2] < 0x80) ? (s[2] * d[2] >> 7) : (0xff - (((0xff - s[2]) * (0xff - d[2])) >> 7)), d[3]),
    s[3] + d[3]
  ];
};

Blend.softLight = function(s, d) {
  return [
    _mix(s[0], (s[0] * d[0] >> 7) + (s[0] * s[0] >> 8) - (s[0] * s[0] * d[0] >> 15), d[3]),
    _mix(s[1], (s[1] * d[1] >> 7) + (s[1] * s[1] >> 8) - (s[1] * s[1] * d[1] >> 15), d[3]),
    _mix(s[2], (s[2] * d[2] >> 7) + (s[2] * s[2] >> 8) - (s[2] * s[2] * d[2] >> 15), d[3]),
    s[3] + d[3]
  ];
};

Blend.overlay = function(s, d) {
  return [
    _mix(s[0], (s[0] < 0x80) ? (s[0] * d[0] >> 7) : (0xff - ((0xff - s[0]) * (0xff - d[0]) >> 7)), d[3]),
    _mix(s[1], (s[1] < 0x80) ? (s[1] * d[1] >> 7) : (0xff - ((0xff - s[1]) * (0xff - d[1]) >> 7)), d[3]),
    _mix(s[2], (s[2] < 0x80) ? (s[2] * d[2] >> 7) : (0xff - ((0xff - s[2]) * (0xff - d[2]) >> 7)), d[3]),
    s[3] + d[3]
  ];
};

Blend.dodge = function(s, d) {
  return [
    _mix(s[0], (d[0] === 0xff) ? 0xff : _peg((s[0] << 8) / (0xff - d[0])), d[3]),
    _mix(s[1], (d[1] === 0xff) ? 0xff : _peg((s[1] << 8) / (0xff - d[1])), d[3]),
    _mix(s[2], (d[2] === 0xff) ? 0xff : _peg((s[2] << 8) / (0xff - d[2])), d[3]),
    s[3] + d[3]
  ];
};

Blend.burn = function(s, d) {
  return [
    _mix(s[0], (d[0] === 0) ? 0 : 0xff - _peg(((0xff - s[0]) << 8) / d[0]), d[3]),
    _mix(s[1], (d[1] === 0) ? 0 : 0xff - _peg(((0xff - s[1]) << 8) / d[1]), d[3]),
    _mix(s[2], (d[2] === 0) ? 0 : 0xff - _peg(((0xff - s[2]) << 8) / d[2]), d[3]),
    s[3] + d[3]
  ];
};