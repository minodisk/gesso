/*!
 * ColorMatrix Class v2.1
 * released under MIT License (X11)
 * http://www.opensource.org/licenses/mit-license.php
 * Author: Mario Klingemann
 * http://www.quasimondo.com
 */
module.exports = ColorMatrix;

function ColorMatrix() {
  this._constructor.apply(this, arguments);
}

// RGB to Luminance conversion constants as found on
// Charles A. Poynton's colorspace-faq:
// http://www.faqs.org/faqs/graphics/colorspace-faq/
ColorMatrix.LUMA_R = 0.212671;
ColorMatrix.LUMA_G = 0.71516;
ColorMatrix.LUMA_B = 0.072169;

// There seem different standards for converting RGB
// values to Luminance. This is the one by Paul Haeberli:
ColorMatrix.LUMA_R2 = 0.3086;
ColorMatrix.LUMA_G2 = 0.6094;
ColorMatrix.LUMA_B2 = 0.0820;

ColorMatrix.ONETHIRD = 1 / 3;
ColorMatrix.IDENTITY = [
  1, 0, 0, 0, 0,
  0, 1, 0, 0, 0,
  0, 0, 1, 0, 0,
  0, 0, 0, 1, 0
];
ColorMatrix.RAD = Math.PI / 180;

ColorMatrix.prototype = {};

ColorMatrix.prototype._constructor = function(matrix) {
  if (matrix instanceof ColorMatrix) {
    this.matrix = matrix.matrix.concat();
  } else if (Array.isArray(matrix)) {
    this.matrix = matrix.concat();
  } else {
    this.reset();
  }
};

ColorMatrix.prototype.toString = function() {
  var i, len, t;
  var pad = function(str, len) {
    while (str.length < len) {
      str = ' ' + str;
    }
    return str;
  };
  var m = this.matrix;
  var tmp = [];
  for (i = 0, len = m.length; i < len; ++i) {
    if (i % 5 === 0) {
      t = [];
    }
    t.push(String(m[i]));
    if (i % 5 === 4 || i === len - 1) {
      tmp.push(t);
    }
  }
  var x, y, l;
  for (x = 0; x < 5; x++) {
    l = 0;
    for (y = 0, len = tmp.length; y < len; ++y) {
      l = Math.max(l, tmp[y][x].length);
    }
    for (y = 0, len = tmp.length; y < len; ++y) {
      tmp[y][x] = pad(tmp[y][x], l);
    }
  }
  for (y = 0, len = tmp.length; y < len; ++y) {
    tmp[y] = tmp[y].join(', ');
    if (y != len - 1) {
      tmp[y] += ',';
    }
  }
  return tmp.join('\n');
};

ColorMatrix.prototype.clone = function() {
  return new ColorMatrix(this.matrix);
};

ColorMatrix.prototype.reset = function() {
  this.matrix = ColorMatrix.IDENTITY.concat();
};

ColorMatrix.prototype.concat = function(src) {
  var dst = this.matrix;
  var out = [];
  var x, y, i;
  for (y = 0; y < 4; ++y) {
    i = 5 * y;
    for (x = 0; x < 5; ++x) {
      out[i + x] = src[i] * dst[x] +
                   src[i + 1] * dst[x + 5] +
                   src[i + 2] * dst[x + 10] +
                   src[i + 3] * dst[x + 15];
    }
    out[i + 4] += src[i + 4];
  }
  this.matrix = out;
};

ColorMatrix.prototype.invert = function() {
  this.concat([
    -1, 0, 0, 0, 0xff,
    0, -1, 0, 0, 0xff,
    0, 0, -1, 0, 0xff,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.adjustSaturation = function(s) {
  var irlum = -s * ColorMatrix.LUMA_R;
  var iglum = -s * ColorMatrix.LUMA_G;
  var iblum = -s * ColorMatrix.LUMA_B;
  ++s;
  this.concat([
    irlum + s, iglum, iblum, 0, 0,
    irlum, iglum + s, iblum, 0, 0,
    irlum, iglum, iblum + s, 0, 0,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.adjustContrast = function(r, g, b) {
  if (g === undefined) g = r;
  if (b === undefined) b = r;
  this.concat([
    1 + r, 0, 0, 0, -0x80 * r,
    0, 1 + g, 0, 0, -0x80 * g,
    0, 0, 1 + b, 0, -0x80 * b,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.adjustBrightness = function(r, g, b) {
  if (g === undefined) g = r;
  if (b === undefined) b = r;
  this.concat([
    1, 0, 0, 0, 0xff * r,
    0, 1, 0, 0, 0xff * g,
    0, 0, 1, 0, 0xff * b,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.adjustHue = function(degree) {
  var R = ColorMatrix.LUMA_R;
  var G = ColorMatrix.LUMA_G;
  var B = ColorMatrix.LUMA_B;
  degree *= ColorMatrix.RAD;
  var c = Math.cos(degree);
  var s = Math.sin(degree);
  var l = 1 - c;
  var m = l - s;
  var n = l + s;
  this.concat([
    R * m + c, G * m, B * m + s, 0, 0,
    R * l + s * 0.143, G * l + c + s * 0.14, B * l + s * -0.283, 0, 0,
    R * n - s, G * n, B * n + c, 0, 0,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.rotateHue = function(degree) {
  this._initHue();
  this.concat(this._preHue.matrix);
  this.rotateBlue(degree);
  this.concat(this._postHue.matrix);
};

ColorMatrix.prototype.luminance2Alpha = function() {
  this.concat([
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    ColorMatrix.LUMA_R, ColorMatrix.LUMA_G, ColorMatrix.LUMA_B, 0, 0
  ]);
};

ColorMatrix.prototype.adjustAlphaContrast = function(amount) {
  this.concat([
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, amount + 1, -0x80 * amount
  ]);
};

ColorMatrix.prototype.colorize = function(rgb, amount) {
  if (amount === undefined) amount = 1;
  var R = ColorMatrix.LUMA_R;
  var G = ColorMatrix.LUMA_G;
  var B = ColorMatrix.LUMA_B;
  var r = ((rgb >> 16) & 0xFF) / 0xFF;
  var g = ((rgb >> 8) & 0xFF) / 0xFF;
  var b = (rgb & 0xFF) / 0xFF;
  var invAmount = 1 - amount;
  this.concat([
    invAmount + amount * r * R, amount * r * G, amount * r * B, 0, 0,
    amount * g * R, invAmount + amount * g * G, amount * g * B, 0, 0,
    amount * b * R, amount * b * G, invAmount + amount * b * B, 0, 0,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.setChannels = function(r, g, b, a) {
  if (r === undefined) r = 1;
  if (g === undefined) g = 2;
  if (b === undefined) b = 4;
  if (a === undefined) a = 8;
  var rf = (((r & 1) === 1) ? 1 : 0) + (((r & 2) === 2) ? 1 : 0) + (((r & 4) === 4) ? 1 : 0) + (((r & 8) === 8) ? 1 : 0);
  if (rf > 0) {
    rf = (1 / rf);
  }
  var gf = (((g & 1) == 1) ? 1 : 0) + (((g & 2) == 2) ? 1 : 0) + (((g & 4) == 4) ? 1 : 0) + (((g & 8) == 8) ? 1 : 0);
  if (gf > 0) {
    gf = (1 / gf);
  }
  var bf = (((b & 1) == 1) ? 1 : 0) + (((b & 2) == 2) ? 1 : 0) + (((b & 4) == 4) ? 1 : 0) + (((b & 8) == 8) ? 1 : 0);
  if (bf > 0) {
    bf = (1 / bf);
  }
  var af = (((a & 1) == 1) ? 1 : 0) + (((a & 2) == 2) ? 1 : 0) + (((a & 4) == 4) ? 1 : 0) + (((a & 8) == 8) ? 1 : 0);
  if (af > 0) {
    af = (1 / af);
  }
  this.concat([
    ((r & 1) == 1) ? rf : 0, ((r & 2) == 2) ? rf : 0, ((r & 4) == 4) ? rf : 0, ((r & 8) == 8) ? rf : 0, 0,
    ((g & 1) == 1) ? gf : 0, ((g & 2) == 2) ? gf : 0, ((g & 4) == 4) ? gf : 0, ((g & 8) == 8) ? gf : 0, 0,
    ((b & 1) == 1) ? bf : 0, ((b & 2) == 2) ? bf : 0, ((b & 4) == 4) ? bf : 0, ((b & 8) == 8) ? bf : 0, 0,
    ((a & 1) == 1) ? af : 0, ((a & 2) == 2) ? af : 0, ((a & 4) == 4) ? af : 0, ((a & 8) == 8) ? af : 0, 0
  ]);
};

ColorMatrix.prototype.blend = function(matrix, amount) {
  for (var i = 0; i < 20; ++i) {
    this.matrix[i] = (1 - amount) * this.matrix[i] + amount * matrix.matrix[i];
  }
};

ColorMatrix.prototype.average = function(r, g, b) {
  if (r === undefined) r = ColorMatrix.ONETHIRD;
  if (g === undefined) g = ColorMatrix.ONETHIRD;
  if (b === undefined) b = ColorMatrix.ONETHIRD;
  this.concat([
    r, g, b, 0, 0,
    r, g, b, 0, 0,
    r, g, b, 0, 0,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.threshold = function(threshold, factor) {
  if (factor === undefined) factor = 0x100;
  var R = factor * ColorMatrix.LUMA_R;
  var G = factor * ColorMatrix.LUMA_G;
  var B = factor * ColorMatrix.LUMA_B;
  var t = -factor * threshold;
  this.concat([
    R, G, B, 0, t,
    R, G, B, 0, t,
    R, G, B, 0, t,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.desaturate = function() {
  var R = ColorMatrix.LUMA_R;
  var G = ColorMatrix.LUMA_G;
  var B = ColorMatrix.LUMA_B;
  this.concat([
    R, G, B, 0, 0,
    R, G, B, 0, 0,
    R, G, B, 0, 0,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.randomize = function(amount) {
  if (amount === undefined) amount = 1;
  var inv_amount = (1 - amount);
  var r1 = (inv_amount + (amount * (Math.random() - Math.random())));
  var g1 = (amount * (Math.random() - Math.random()));
  var b1 = (amount * (Math.random() - Math.random()));
  var o1 = ((amount * 0xFF) * (Math.random() - Math.random()));
  var r2 = (amount * (Math.random() - Math.random()));
  var g2 = (inv_amount + (amount * (Math.random() - Math.random())));
  var b2 = (amount * (Math.random() - Math.random()));
  var o2 = ((amount * 0xFF) * (Math.random() - Math.random()));
  var r3 = (amount * (Math.random() - Math.random()));
  var g3 = (amount * (Math.random() - Math.random()));
  var b3 = (inv_amount + (amount * (Math.random() - Math.random())));
  var o3 = ((amount * 0xFF) * (Math.random() - Math.random()));
  this.concat([
    r1, g1, b1, 0, o1,
    r2, g2, b2, 0, o2,
    r3, g3, b3, 0, o3,
    0, 0, 0, 1, 0
  ]);
};

ColorMatrix.prototype.setMultiplicators = function(r, g, b, a) {
  if (r === undefined) r = 1;
  if (g === undefined) g = 1;
  if (b === undefined) b = 1;
  if (a === undefined) a = 1;
  this.concat([
    r, 0, 0, 0, 0,
    0, g, 0, 0, 0,
    0, 0, b, 0, 0,
    0, 0, 0, a, 0
  ]);
};

ColorMatrix.prototype.clearChannels = function(r, g, b, a) {
  if (r === undefined) r = false;
  if (g === undefined) g = false;
  if (b === undefined) b = false;
  if (a === undefined) a = false;
  if (r) {
    this.matrix[0] = this.matrix[1] = this.matrix[2] = this.matrix[3] = this.matrix[4] = 0;
  }
  if (g) {
    this.matrix[5] = this.matrix[6] = this.matrix[7] = this.matrix[8] = this.matrix[9] = 0;
  }
  if (b) {
    this.matrix[10] = this.matrix[11] = this.matrix[12] = this.matrix[13] = this.matrix[14] = 0;
  }
  if (a) {
    this.matrix[15] = this.matrix[16] = this.matrix[17] = this.matrix[18] = this.matrix[19] = 0;
  }
};

ColorMatrix.prototype.thresholdAlpha = function(threshold, factor) {
  if (factor === undefined) factor = 0x100;
  this.concat([
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, factor, -factor * threshold
  ]);
};

ColorMatrix.prototype.averageRGB2Alpha = function() {
  this.concat([
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    ColorMatrix.ONETHIRD, ColorMatrix.ONETHIRD, ColorMatrix.ONETHIRD, 0, 0
  ]);
};

ColorMatrix.prototype.invertAlpha = function() {
  this.concat([
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, -1, 0xff
  ]);
};

ColorMatrix.prototype.rgb2Alpha = function(r, g, b) {
  this.concat([
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    0, 0, 0, 0, 0xff,
    r, g, b, 0, 0
  ]);
};

ColorMatrix.prototype.setAlpha = function(alpha) {
  this.concat([
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, alpha, 0
  ]);
};

ColorMatrix.prototype.rotateRed = function(degree) {
  this._rotateColor(degree, 2, 1);
};

ColorMatrix.prototype.rotateGreen = function(degree) {
  this._rotateColor(degree, 0, 2);
};

ColorMatrix.prototype.rotateBlue = function(degree) {
  this._rotateColor(degree, 1, 0);
};

ColorMatrix.prototype._rotateColor = function(degree, x, y) {
  degree *= ColorMatrix.RAD;
  var mat = ColorMatrix.IDENTITY.concat();
  mat[ x + x * 5 ] = mat[ y + y * 5 ] = Math.cos(degree);
  mat[ y + x * 5 ] = Math.sin(degree);
  mat[ x + y * 5 ] = -Math.sin(degree);
  this.concat(mat);
};

ColorMatrix.prototype.shearRed = function(green, blue) {
  this._shearColor(0, 1, green, 2, blue);
};

ColorMatrix.prototype.shearGreen = function(red, blue) {
  this._shearColor(1, 0, red, 2, blue);
};

ColorMatrix.prototype.shearBlue = function(red, green) {
  this._shearColor(2, 0, red, 1, green);
};

ColorMatrix.prototype._shearColor = function(x, y1, d1, y2, d2) {
  var mat = ColorMatrix.IDENTITY.concat();
  mat[y1 + x * 5] = d1;
  mat[y2 + x * 5] = d2;
  this.concat(mat);
};

ColorMatrix.prototype.applyColorDeficiency = function(type) {
  // the values of this method are copied from http://www.nofunc.com/Color_Matrix_Library/
  switch (type) {
    case 'Protanopia':
      this.concat([
        .567, .433, .0, .0, .0,
        .558, .442, .0, .0, .0,
        .0, .242, .758, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Protanomaly':
      this.concat([
        .817, .183, .0, .0, .0,
        .333, .667, .0, .0, .0,
        .0, .125, .875, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Deuteranopia':
      this.concat([
        .625, .375, .0, .0, .0,
        .7, .3, .0, .0, .0,
        .0, .3, .7, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Deuteranomaly':
      this.concat([
        .8, .2, .0, .0, .0,
        .258, .742, .0, .0, .0,
        .0, .142, .858, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Tritanopia':
      this.concat([
        .95, .05, .0, .0, .0,
        .0, .433, .567, .0, .0,
        .0, .475, .525, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Tritanomaly':
      this.concat([
        .967, .033, .0, .0, .0,
        .0, .733, .267, .0, .0,
        .0, .183, .817, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Achromatopsia':
      this.concat([
        .299, .587, .114, .0, .0,
        .299, .587, .114, .0, .0,
        .299, .587, .114, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
    case 'Achromatomaly':
      this.concat([
        .618, .320, .062, .0, .0,
        .163, .775, .062, .0, .0,
        .163, .320, .516, .0, .0,
        .0, .0, .0, 1.0, .0
      ]);
      break;
  }
};

ColorMatrix.prototype.applyMatrix = function(rgba) {
  var a = ( rgba >>> 24 ) & 0xff;
  var r = ( rgba >>> 16 ) & 0xff;
  var g = ( rgba >>> 8 ) & 0xff;
  var b = rgba & 0xff;

  var m = this.matrix;
  var r2 = 0.5 + r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
  var g2 = 0.5 + r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
  var b2 = 0.5 + r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
  var a2 = 0.5 + r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];

  if (a2 < 0) a2 = 0;
  if (a2 > 0xff) a2 = 0xff;
  if (r2 < 0) r2 = 0;
  if (r2 > 0xff) r2 = 0xff;
  if (g2 < 0) g2 = 0;
  if (g2 > 0xff) g2 = 0xff;
  if (b2 < 0) b2 = 0;
  if (b2 > 0xff) b2 = 0xff;

  return a2 << 24 | r2 << 16 | g2 << 8 | b2;
};

ColorMatrix.prototype.transformVector = function(values) {
  if (values.length != 4) return;
  var m = this.matrix;
  var sR = values[0];
  var sG = values[1];
  var sB = values[2];
  var sA = values[3];
  var oR = sR * m[0] + sG * m[1] + sB * m[2] + sA * m[3] + m[4];
  var oG = sR * m[5] + sG * m[6] + sB * m[7] + sA * m[8] + m[9];
  var oB = sR * m[10] + sG * m[11] + sB * m[12] + sA * m[13] + m[14];
  var oA = sR * m[15] + sG * m[16] + sB * m[17] + sA * m[18] + m[19];
  values[0] = oR;
  values[1] = oG;
  values[2] = oB;
  values[3] = oA;
};

ColorMatrix.prototype._initHue = function() {
  //var greenRotation = 35.0;
  var greenRotation = 39.182655;

  if (!this._hueInitialized) {
    this._hueInitialized = true;
    this._preHue = new ColorMatrix();
    this._preHue.rotateRed(45);
    this._preHue.rotateGreen(-greenRotation);

    var lum = [
      ColorMatrix.LUMA_R2,
      ColorMatrix.LUMA_G2,
      ColorMatrix.LUMA_B2,
      1.0
    ];

    this._preHue.transformVector(lum);

    var red = lum[0] / lum[2];
    var green = lum[1] / lum[2];

    this._preHue.shearBlue(red, green);

    this._postHue = new ColorMatrix();
    this._postHue.shearBlue(-red, -green);
    this._postHue.rotateGreen(greenRotation);
    this._postHue.rotateRed(-45.0);
  }
};