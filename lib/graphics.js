
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"display/Bitmap": function(exports, require, module) {(function() {
  var Bitmap, DisplayObject, Rectangle;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  DisplayObject = require('display/DisplayObject');
  Rectangle = require('geom/Rectangle');
  module.exports = Bitmap = (function() {
    __extends(Bitmap, DisplayObject);
    function Bitmap() {
      Bitmap.__super__.constructor.call(this, 'Bitmap');
    }
    Bitmap.prototype.draw = function(data, x, y) {
      var img;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (typeof data === 'string') {
        img = new Image();
        img.src = data;
      } else if (data instanceof Image || data instanceof HTMLImageElement) {
        img = data;
      }
      if (img != null) {
        if (img.complete) {
          this.drawImage(img, x, y);
        } else {
          img.addEventListener('load', (__bind(function(e) {
            return this.drawImage(img, x, y);
          }, this)), false);
        }
        return img;
      }
      if (data instanceof DisplayObject) {
        data = data._canvas;
      }
      if (data instanceof HTMLCanvasElement || data instanceof HTMLVideoElement) {
        this.drawImage(data, x, y);
        return;
      } else if (data instanceof ImageData) {
        this.drawImageData(data, x, y);
        return;
      }
      throw new TypeError("data isn't drawable object");
    };
    Bitmap.prototype.drawImage = function(image, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this._stacks.push({
        method: 'drawImage',
        arguments: [image, x, y],
        bounds: new Rectangle(x, y, image.width, image.height)
      });
      this._requestRender(true);
    };
    Bitmap.prototype._drawImage = function(image, x, y) {
      this._context.drawImage(image, x, y, image.width, image.height);
    };
    Bitmap.prototype.drawImageData = function(imageData, x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
    };
    return Bitmap;
  })();
}).call(this);
}, "display/DisplayObject": function(exports, require, module) {(function() {
  var BlendMode, DisplayObject, EventEmitter, Rectangle;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  EventEmitter = require('events/EventDispatcher');
  BlendMode = require('display/blends/BlendMode');
  Rectangle = require('geom/Rectangle');
  module.exports = DisplayObject = (function() {
    __extends(DisplayObject, EventEmitter);
    DisplayObject.toColorString = function(color, alpha) {
      if (color == null) {
        color = 0;
      }
      if (alpha == null) {
        alpha = 1;
      }
      return "rgba(" + (color >> 16 & 0xff) + "," + (color >> 8 & 0xff) + "," + (color & 0xff) + "," + (alpha < 0 ? 0 : alpha > 1 ? 1 : alpha) + ")";
    };
    function DisplayObject() {
      DisplayObject.__super__.constructor.call(this, 'DisplayObject');
      this.__stage = null;
      this._parent = null;
      this._x = 0;
      this._y = 0;
      this._width = 0;
      this._height = 0;
      this._scaleX = 0;
      this._scaleY = 0;
      this.alpha = 1;
      this.blendMode = BlendMode.NORMAL;
      this.rect = new Rectangle();
      this.filters = [];
      this._canvas = document.createElement('canvas');
      this._canvas.width = this._canvas.height = 0;
      this._context = this._canvas.getContext('2d');
      this._stacks = [];
      this._rerender = false;
    }
    DisplayObject.prototype.__defineGetter__('stage', function() {
      return this.__stage;
    });
    DisplayObject.prototype.__defineSetter__('_stage', function(value) {
      this.__stage = value;
    });
    DisplayObject.prototype.__defineGetter__('parent', function() {
      return this._parent;
    });
    DisplayObject.prototype.__defineGetter__('x', function() {
      return this._x;
    });
    DisplayObject.prototype.__defineSetter__('x', function(value) {
      this._x = value;
      this._requestRender(false);
    });
    DisplayObject.prototype.__defineGetter__('y', function() {
      return this._y;
    });
    DisplayObject.prototype.__defineSetter__('y', function(value) {
      this._y = value;
      this._requestRender(false);
    });
    DisplayObject.prototype.__defineGetter__('width', function() {
      return this._width;
    });
    DisplayObject.prototype.__defineSetter__('width', function(value) {
      this._width = value;
      if (this._canvas.width !== 0) {
        this._scaleX = value / this._canvas.width;
      }
      this._requestRender(false);
    });
    DisplayObject.prototype.__defineGetter__('height', function() {
      return this._height;
    });
    DisplayObject.prototype.__defineSetter__('height', function(value) {
      this._height = value;
      if (this._canvas.height !== 0) {
        this._scaleY = value / this._canvas.height;
      }
      this._requestRender(false);
    });
    DisplayObject.prototype.__defineGetter__('scaleX', function() {
      return this._scaleX;
    });
    DisplayObject.prototype.__defineSetter__('scaleX', function(value) {
      this._scaleX = value;
      this._width = this._canvas.width * value;
      this._requestRender(false);
    });
    DisplayObject.prototype.__defineGetter__('scaleY', function() {
      return this._scaleY;
    });
    DisplayObject.prototype.__defineSetter__('scaleY', function(value) {
      this._scaleY = value;
      this._height = this._canvas.height * value;
      this._requestRender(false);
    });
    DisplayObject.prototype.set = function(propertyName, value) {
      this[propertyName] = value;
      return this;
    };
    DisplayObject.prototype.render = function() {
      var delta, filter, imageData, newImageData, offset, stack, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
      if (this._rerender) {
        this._rerender = false;
        this.rect = new Rectangle();
        delta = 0;
        _ref = this._stacks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stack = _ref[_i];
          if (stack.rect != null) {
            this.rect.union(stack.rect);
          }
          if (stack.delta != null) {
            delta = Math.max(delta, stack.delta);
          }
        }
        this.bounds = this.rect.clone();
        offset = Math.ceil(delta / 2);
        delta = offset * 2;
        offset *= -1;
        this.bounds.offset(offset, offset);
        this.bounds.inflate(delta, delta);
        this._canvas.width = this.bounds.width;
        this._canvas.height = this.bounds.height;
        _ref2 = this._stacks;
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          stack = _ref2[_j];
          this["_" + stack.method].apply(this, stack.arguments);
        }
        if (this.filters.length > 0) {
          imageData = this._context.getImageData(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
          newImageData = this._context.createImageData(this.bounds.width, this.bounds.height);
          _ref3 = this.filters;
          for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
            filter = _ref3[_k];
            filter.scan(imageData, newImageData);
          }
          this._context.putImageData(newImageData, this.bounds.x, this.bounds.y);
        }
      }
    };
    DisplayObject.prototype.clear = function() {
      this._canvas.width = this.rect.width;
      return this._requestRender(true);
    };
    DisplayObject.prototype.addTo = function(parent) {
      if (!(parent instanceof Sprite)) {
        throw new TypeError("parent " + parent + " isn't display object container");
      }
      return parent.addChild(this);
    };
    DisplayObject.prototype._requestRender = function(rerender) {
      if (rerender) {
        this._rerender = true;
      }
      if (this._parent != null) {
        this._parent._requestRender();
      }
      return this;
    };
    return DisplayObject;
  })();
}).call(this);
}, "display/Shape": function(exports, require, module) {(function() {
  var CapsStyle, DisplayObject, GradientType, JointStyle, Rectangle, Shape, _PI, _PI_1_2, _PI_2;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  DisplayObject = require('display/DisplayObject');
  GradientType = require('display/styles/GradientType');
  CapsStyle = require('display/styles/CapsStyle');
  JointStyle = require('display/styles/JointStyle');
  Rectangle = require('geom/Rectangle');
  _PI = Math.PI;
  _PI_1_2 = _PI / 2;
  _PI_2 = _PI * 2;
  module.exports = Shape = (function() {
    __extends(Shape, DisplayObject);
    Shape.ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3;
    Shape.createGradationBox = function(x, y, width, height, rotation) {
      var centerX, centerY, dx, dxt, dy, dyt, height1_2, tan, threshold, width1_2;
      threshold = height / width;
      tan = Math.tan(rotation);
      width1_2 = width / 2;
      height1_2 = height / 2;
      centerX = x + width1_2;
      centerY = y + height1_2;
      if (tan > -threshold && tan < threshold) {
        dx = width1_2 * (Math.cos(rotation) < 0 ? -1 : 1);
        dxt = dx * tan;
        return {
          x0: centerX - dx,
          y0: centerY - dxt,
          x1: centerX + dx,
          y1: centerY + dxt
        };
      } else {
        dy = height1_2 * (Math.sin(rotation) < 0 ? -1 : 1);
        dyt = dy / tan;
        return {
          x0: centerX - dyt,
          y0: centerY - dy,
          x1: centerX + dyt,
          y1: centerY + dy
        };
      }
    };
    function Shape() {
      Shape.__super__.constructor.call(this, 'Shape');
    }
    Shape.prototype.drawLine = function() {
      var coords, i, j, max, maxX, maxY, minX, minY, x, y;
      coords = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      minX = minY = Number.MAX_VALUE;
      maxX = maxY = -Number.MAX_VALUE;
      max = Math.ceil(coords.length / 2);
      for (i = 0; i < max; i += 1) {
        j = i * 2;
        x = coords[j];
        y = coords[j + 1];
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
      this._stacks.push({
        method: 'drawLine',
        arguments: coords,
        rect: new Rectangle(minX, minY, maxX - minX, maxY - minY)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawLine = function() {
      var coords, i, j, max;
      coords = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this._context.beginPath();
      this._context.moveTo(coords[0] - this.bounds.x, coords[1] - this.bounds.y);
      max = Math.ceil(coords.length / 2);
      for (i = 1; i < max; i += 1) {
        j = i * 2;
        this._context.lineTo(coords[j] - this.bounds.x, coords[j + 1] - this.bounds.y);
      }
    };
    Shape.prototype.drawRectangle = function(rect) {
      return this.drawRect(rect.x, rect.y, rect.width, rect.height);
    };
    Shape.prototype.drawRect = function(x, y, width, height) {
      if (height == null) {
        height = width;
      }
      this._stacks.push({
        method: 'drawRect',
        arguments: [x, y, width, height],
        rect: new Rectangle(x, y, width, height)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawRect = function(x, y, width, height) {
      this._context.beginPath();
      this._context.rect(x, y, width, height);
      this._context.closePath();
    };
    Shape.prototype.drawRoundRectangle = function(rect, ellipseW, ellipseH) {
      if (ellipseH == null) {
        ellipseH = ellipseW;
      }
      return this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH);
    };
    Shape.prototype.drawRoundRect = function(x, y, width, height, ellipseW, ellipseH) {
      if (ellipseH == null) {
        ellipseH = ellipseW;
      }
      this._stacks.push({
        method: 'drawRoundRect',
        arguments: [x, y, width, height, ellipseW, ellipseH],
        rect: new Rectangle(x, y, width, height)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawRoundRect = function(x, y, width, height, ellipseW, ellipseH) {
      if (ellipseH == null) {
        ellipseH = ellipseW;
      }
      this._context.beginPath();
      this._context.moveTo(x + ellipseW, y);
      this._context.lineTo(x + width - ellipseW, y);
      this._context.quadraticCurveTo(x + width, y, x + width, y + ellipseH);
      this._context.lineTo(x + width, y + height - ellipseH);
      this._context.quadraticCurveTo(x + width, y + height, x + width - ellipseW, y + height);
      this._context.lineTo(x + ellipseW, y + height);
      this._context.quadraticCurveTo(x, y + height, x, y + height - ellipseH);
      this._context.lineTo(x, y + ellipseH);
      this._context.quadraticCurveTo(x, y, x + ellipseW, y);
      this._context.closePath();
    };
    Shape.prototype.drawCircle = function(x, y, radius, startAngle, endAngle, anticlockwise) {
      this._stacks.push({
        method: 'drawCircle',
        arguments: [x, y, radius, startAngle, endAngle, anticlockwise],
        rect: new Rectangle(x - radius, y - radius, radius * 2, radius * 2)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawCircle = function(x, y, radius, startAngle, endAngle, anticlockwise) {
      if (startAngle == null) {
        startAngle = 0;
      }
      if (endAngle == null) {
        endAngle = _PI_2;
      }
      if (anticlockwise == null) {
        anticlockwise = false;
      }
      this._context.beginPath();
      this._context.arc(x - this.bounds.x, y - this.bounds.y, radius, startAngle, endAngle, anticlockwise);
      this._context.closePath();
    };
    Shape.prototype.drawEllipse = function(x, y, width, height) {
      this._stacks.push({
        method: 'drawEllipse',
        arguments: [x, y, width, height],
        rect: new Rectangle(x, y, width, height)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawEllipse = function(x, y, width, height) {
      var handleHeight, handleWidth;
      width /= 2;
      height /= 2;
      x += width;
      y += height;
      handleWidth = width * Shape.ELLIPSE_CUBIC_BEZIER_HANDLE;
      handleHeight = height * Shape.ELLIPSE_CUBIC_BEZIER_HANDLE;
      this._context.beginPath();
      this._context.moveTo(x + width, y);
      this._context.bezierCurveTo(x + width, y + handleHeight, x + handleWidth, y + height, x, y + height);
      this._context.bezierCurveTo(x - handleWidth, y + height, x - width, y + handleHeight, x - width, y);
      this._context.bezierCurveTo(x - width, y - handleHeight, x - handleWidth, y - height, x, y - height);
      this._context.bezierCurveTo(x + handleWidth, y - height, x + width, y - handleHeight, x + width, y);
      this._context.closePath();
    };
    Shape.prototype.drawRegularPolygon = function(x, y, radius, length) {
      if (length == null) {
        length = 3;
      }
      this._stacks.push({
        method: 'drawRegularPolygon',
        arguments: [x, y, radius, length],
        rect: new Rectangle(x - radius, y - radius, radius * 2, radius * 2)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawRegularPolygon = function(x, y, radius, length) {
      var i, r, u;
      u = _PI_2 / length;
      this._context.beginPath();
      this._context.moveTo(x, y - radius);
      for (i = 1; 1 <= length ? i <= length : i >= length; 1 <= length ? i++ : i--) {
        r = -_PI_1_2 + u * i;
        this._context.lineTo(x + radius * Math.cos(r), y + radius * Math.sin(r));
      }
      this._context.closePath();
    };
    Shape.prototype.drawRegularStar = function(x, y, outer, length) {
      var c;
      if (length == null) {
        length = 5;
      }
      c = Math.cos(_PI / length);
      return this.drawStar(x, y, outer, outer * (2 * c - 1 / c), length);
    };
    Shape.prototype.drawStar = function(x, y, outer, inner, length) {
      if (length == null) {
        length = 5;
      }
      this._stacks.push({
        method: 'drawStar',
        arguments: [x, y, outer, inner, length],
        rect: new Rectangle(x - outer, y - outer, outer * 2, outer * 2)
      });
      return this._requestRender(true);
    };
    Shape.prototype._drawStar = function(x, y, outer, inner, length) {
      var i, r, radius, u, _ref;
      this._context.beginPath();
      this._context.moveTo(x - this.bounds.x, y - this.bounds.y - outer);
      u = _PI / length;
      for (i = 1, _ref = length * 2; i <= _ref; i += 1) {
        radius = (i & 1) === 0 ? outer : inner;
        r = -_PI_1_2 + u * i;
        this._context.lineTo(x - this.bounds.x + radius * Math.cos(r), y - this.bounds.y + radius * Math.sin(r));
      }
      this._context.closePath();
    };
    Shape.prototype.clip = function() {
      this._stacks.push({
        method: 'clip',
        arguments: ArrayUtil.toArray(arguments)
      });
      return this._requestRender(true);
    };
    Shape.prototype._clip = function() {
      this._context.clip();
    };
    Shape.prototype.fillGradient = function(type, colors, alphas, ratios, gradientBox) {
      switch (type) {
        case GradientType.LINEAR:
          return this.fill(this._createLinearGradient);
      }
    };
    Shape.prototype.fill = function(color, alpha) {
      if (color == null) {
        color = 0x000000;
      }
      if (alpha == null) {
        alpha = 1;
      }
      this._stacks.push({
        method: 'fill',
        arguments: [color, alpha]
      });
      return this._requestRender(true);
    };
    Shape.prototype._fill = function(color, alpha) {
      this._context.fillStyle = Shape.toColorString(color, alpha);
      this._context.fill();
    };
    Shape.prototype.strokeGradient = function(type, colors, alphas, ratios, gradientBox) {
      switch (type) {
        case GradientType.LINEAR:
          return this.stroke(this._createLinearGradient(colors, alphas, ratios, gradientBox));
      }
    };
    Shape.prototype.stroke = function(thickness, color, alpha, capsStyle, jointStyle, miterLimit) {
      if (thickness == null) {
        thickness = 1;
      }
      if (color == null) {
        color = 0x000000;
      }
      if (alpha == null) {
        alpha = 1;
      }
      if (capsStyle == null) {
        capsStyle = CapsStyle.NONE;
      }
      if (jointStyle == null) {
        jointStyle = JointStyle.BEVEL;
      }
      if (miterLimit == null) {
        miterLimit = 10;
      }
      this._stacks.push({
        method: 'stroke',
        arguments: [thickness, color, alpha, capsStyle, jointStyle, miterLimit],
        delta: thickness
      });
      return this._requestRender(true);
    };
    Shape.prototype._stroke = function(thickness, color, alpha, capsStyle, jointStyle, miterLimit) {
      this._context.lineWidth = thickness;
      this._context.strokeStyle = Shape.toColorString(color, alpha);
      this._context.lineCaps = capsStyle;
      this._context.lineJoin = jointStyle;
      this._context.miterLimit = miterLimit;
      this._context.stroke();
    };
    Shape.prototype._createLinearGradient = function(colors, alphas, ratios, gradientBox) {
      var color, gradient, i, len, _len;
      len = colors.length;
      if (alphas.length !== len || ratios.length !== len) {
        throw new TypeError('Invalid length of colors, alphas or ratios.');
      }
      gradient = this._context.createLinearGradient(gradientBox.x0, gradientBox.y0, gradientBox.x1, gradientBox.y1);
      for (i = 0, _len = colors.length; i < _len; i++) {
        color = colors[i];
        gradient.addColorStop(ratios[i], Shape.toColorString(colors[i], alphas[i]));
      }
      return gradient;
    };
    return Shape;
  })();
}).call(this);
}, "display/Sprite": function(exports, require, module) {(function() {
  var Blend, BlendMode, DisplayObject, Sprite;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  DisplayObject = require('display/DisplayObject');
  Blend = require('display/blends/Blend');
  BlendMode = require('display/blends/BlendMode');
  module.exports = Sprite = (function() {
    __extends(Sprite, DisplayObject);
    function Sprite() {
      Sprite.__super__.constructor.call(this, 'Sprite');
      this._children = [];
    }
    Sprite.prototype.__defineSetter__('_stage', function(value) {
      var child, _i, _len, _ref;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child._stage = value;
      }
      this.__stage = value;
    });
    Sprite.prototype.addChild = function(child) {
      child._stage = this._stage;
      child._parent = this;
      this._children.push(child);
      this._requestRender(true);
    };
    Sprite.prototype.removeChild = function(displayObject) {
      var index;
      index = this._children.indexOf(displayObject);
      if (index !== -1) {
        this._children.splice(index, 1);
      }
      this._requestRender(true);
    };
    Sprite.prototype.render = function() {
      var child, imageData, _i, _len, _ref;
      this._canvas.width = this._width;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child._stacks.length > 0) {
          child.render();
          if (child.blendMode === BlendMode.NORMAL) {
            this._context.drawImage(child._canvas, child.x + child.bounds.x, child.y + child.bounds.y);
          } else {
            imageData = this.getImageData();
            Blend.scan(imageData, child.getImageData(), child.blendMode);
            this._context.putImageData(imageData, 0, 0);
          }
        }
      }
    };
    return Sprite;
  })();
}).call(this);
}, "display/Stage": function(exports, require, module) {(function() {
  var Capabilities, Sprite, Stage, _tick;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Sprite = require('display/Sprite');
  Capabilities = require('system/Capabilities');
  _tick = (function() {
    return this.requestAnimationFrame || this.webkitRequestAnimationFrame || this.mozRequestAnimationFrame || this.oRequestAnimationFrame || this.msRequestAnimationFrame || function(callback) {
      return setTimeout((function() {
        return callback((new Date()).getTime());
      }), 1000 / 60);
    };
  })();
  module.exports = Stage = (function() {
    __extends(Stage, Sprite);
    function Stage(canvasOrWidth, height) {
      if (height == null) {
        height = null;
      }
      this._onAnimationFrame = __bind(this._onAnimationFrame, this);
      Stage.__super__.constructor.call(this, 'Stage');
      if (!Capabilities.supports.canvas) {
        throw new Error("Canvas isn't supported");
      }
      if (canvasOrWidth instanceof HTMLCanvasElement) {
        this._canvas = canvasOrWidth;
        this.width = this._canvas.width;
        this.height = this._canvas.height;
      } else if (!isNaN(Number(canvasOrWidth)) && !isNaN(Number(height))) {
        this._canvas = document.createElement('canvas');
        this.width = this._canvas.width = canvasOrWidth;
        this.height = this._canvas.height = height;
      } else {
        throw new TypeError();
      }
      this._context = this._canvas.getContext('2d');
      this._startTime = this._time = (new Date()).getTime();
      this.currentFrame = 0;
      _tick(this._onAnimationFrame);
    }
    Stage.prototype.getTime = function() {
      return (new Date()).getTime() - this._startTime;
    };
    Stage.prototype.getAverageFrameRate = function() {
      return this.getTime() / this.currentFrame;
    };
    Stage.prototype._onAnimationFrame = function(time) {
      this.currentFrame++;
      if ((this.currentFrame % 30) === 0) {
        this.frameRate = (300000 / (time - this._time) >> 0) / 10;
        this._time = time;
      }
      this.dispatchEvent('enterFrame');
      if (this._isRender) {
        this.render();
        this._isRender = false;
      }
      return _tick(this._onAnimationFrame);
    };
    Stage.prototype._requestRender = function() {
      this._isRender = true;
    };
    return Stage;
  })();
}).call(this);
}, "display/TextField": function(exports, require, module) {(function() {
  var DisplayObject, Rectangle, TextField, TextFormat;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  DisplayObject = require('display/DisplayObject');
  TextFormat = require('display/styles/TextFormat');
  Rectangle = require('geom/Rectangle');
  module.exports = TextField = (function() {
    __extends(TextField, DisplayObject);
    function TextField(text, format) {
      var metrix;
      if (text == null) {
        text = '';
      }
      if (format == null) {
        format = new TextFormat();
      }
      TextField.__super__.constructor.call(this, 'TextField');
      this.rect = new Rectangle();
      this._stack = {
        method: 'drawText',
        arguments: [text, format, null],
        rect: this.rect
      };
      this._stacks.push(this._stack);
      metrix = this._measureText();
      this.rect.y = -metrix.height * 2;
      this.rect.width = metrix.width;
      this.rect.height = metrix.height * 4;
      this._requestRender(true);
    }
    TextField.prototype.__defineGetter__('text', function() {
      return this._stack.arguments[0];
    });
    TextField.prototype.__defineSetter__('text', function(value) {
      var metrix;
      this._stack.arguments[0] = value;
      metrix = this._measureText();
      this.rect.y = -metrix.height * 2;
      this.rect.width = this._stack.arguments[2] != null ? this._stack.arguments[2] : metrix.width;
      this.rect.height = metrix.height * 4;
      return this._requestRender(true);
    });
    TextField.prototype.__defineGetter__('format', function() {
      return this._stack.arguments[1];
    });
    TextField.prototype.__defineSetter__('format', function(value) {
      var metrix;
      this._stack.arguments[1] = value;
      metrix = this._measureText();
      this.rect.y = -metrix.height * 2;
      this.rect.width = this._stack.arguments[2] != null ? this._stack.arguments[2] : metrix.width;
      this.rect.height = metrix.height * 4;
      return this._requestRender(true);
    });
    TextField.prototype.__defineGetter__('maxLength', function() {
      return this._stack.arguments[2];
    });
    TextField.prototype.__defineSetter__('maxLength', function(value) {
      this.rect.width = this._stack.arguments[2] = value;
      return this._requestRender(true);
    });
    TextField.prototype._measureText = function() {
      var metrix;
      this._context.font = this._stack.arguments[1].toStyleSheet();
      metrix = this._context.measureText(this._stack.arguments[0]);
      metrix.height = this._stack.arguments[1].fontSize;
      return metrix;
    };
    TextField.prototype._drawText = function(text, format, maxLength) {
      if (maxLength == null) {
        maxLength = null;
      }
      this._context.font = format.toStyleSheet();
      this._context.textAlign = format.textAlign;
      this._context.textBaseline = format.textBaseline;
      this._context.fillStyle = TextField.toColorString(format.color);
      return this._context.fillText(text, 0, -this.rect.y, maxLength);
    };
    return TextField;
  })();
}).call(this);
}, "display/blends/Blend": function(exports, require, module) {var Blend = {};
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
};}, "display/blends/BlendMode": function(exports, require, module) {var BlendMode = {};
module.exports = BlendMode;

BlendMode.NORMAL = 'normal';
BlendMode.BLEND = 'blend';
BlendMode.ADD = 'add';
BlendMode.SUBTRACT = 'subtract';
BlendMode.DARKEST = 'darkest';
BlendMode.LIGHTEST = 'lightest';
BlendMode.DIFFERENCE = 'difference';
BlendMode.EXCLUSION = 'exclusion';
BlendMode.MULTIPLY = 'multiply';
BlendMode.SCREEN = 'screen';
BlendMode.OVERLAY = 'overlay';
BlendMode.HARD_LIGHT = 'hardLight';
BlendMode.SOFT_LIGHT = 'softLight';
BlendMode.DODGE = 'dodge';
BlendMode.BURN = 'burn';}, "display/filters/BilateralFilter": function(exports, require, module) {module.exports = BilateralFilter;

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
};}, "display/filters/BlurFilter": function(exports, require, module) {(function () {
  var KernelFilter = require('KernelFilter');

  function BlurFilter(radiusX, radiusY) {
    this._constructor.apply(this, arguments);
  }

  BlurFilter.prototype = new KernelFilter();

  BlurFilter.prototype._constructor = function (radiusX, radiusY) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;

    var kernel = [];
    var length = (radiusX * 2 - 1) * (radiusY * 2 - 1);
    var value = 1 / length;
    for (var i = 0; i < length; ++i) {
      kernel[i] = value;
    }
    this.kernel = kernel;
  };

  return BlurFilter;
});}, "display/filters/ColorMatrix": function(exports, require, module) {/*!
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
};}, "display/filters/ColorMatrixFilter": function(exports, require, module) {(function() {
  var ColorMatrixFilter;
  module.exports = ColorMatrixFilter = (function() {
    function ColorMatrixFilter(matrix) {
      this.matrix = matrix;
    }
    ColorMatrixFilter.prototype.scan = function(src, dst) {
      var a, b, d, g, h, i, m, r, s, w, x, y;
      m = this.matrix;
      w = src.width;
      h = src.height;
      s = src.data;
      d = dst.data;
      for (y = 0; y < h; y += 1) {
        for (x = 0; x < w; x += 1) {
          i = 4 * (w * y + x);
          r = s[i];
          g = s[i + 1];
          b = s[i + 2];
          a = s[i + 3];
          d[i] = r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
          d[i + 1] = r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
          d[i + 2] = r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
          d[i + 3] = r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
        }
      }
      return dst;
    };
    return ColorMatrixFilter;
  })();
}).call(this);
}, "display/filters/DeficiencyType": function(exports, require, module) {(function () {
  var DeficiencyType = {};

  DeficiencyType.PROTANOPIA = 'protanopia';
  DeficiencyType.PROTANOMALY = 'protanomaly';
  DeficiencyType.DEUTERANOPIA = 'deuteranopia';
  DeficiencyType.DEUTERNOMALY = 'deuteranomaly';
  DeficiencyType.TRITANOPIA = 'tritanopia';
  DeficiencyType.TRITANOMALY = 'tritanomaly';
  DeficiencyType.ACHROMATOSIA = 'achromatopsia';
  DeficiencyType.ACHROMATOMALY = 'achromatomaly';

  return DeficiencyType;
});}, "display/filters/DoubleFilter": function(exports, require, module) {(function () {
  var KernelFilter = require('KernelFilter');

  function DoubleFilter() {
  }

  DoubleFilter.prototype = new KernelFilter();

  DoubleFilter.prototype._evaluatePixel = function (pixels, x, y, width, height) {
    var i, len, p, r, g, b;
    r = g = b = 0;
    var h = this.radiusY * 2 - 1;
    var w = this.radiusX * 2 - 1;
    for (i = 0,len = this.kernel.length; i < len; ++i) {
      p = this._runKernel(this.kernel[i], pixels, x, y, width, height);
      r += p[0] * p[0];
      g += p[1] * p[1];
      b += p[2] * p[2];
    }
    r = Math.sqrt(r);
    g = Math.sqrt(g);
    b = Math.sqrt(b);
    return [r, g, b, pixels[y + this.radiusY - 1][x + this.radiusX - 1][3]];
  };

  return DoubleFilter;
});}, "display/filters/Filter": function(exports, require, module) {(function () {
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
});}, "display/filters/GaussianFilter": function(exports, require, module) {(function () {
  var KernelFilter = require('KernelFilter');

  function GaussianFilter(radiusX, radiusY, sigma) {
    this._constructor.apply(this, arguments);
  }

  GaussianFilter.prototype = new KernelFilter();

  GaussianFilter.prototype._constructor = function (radiusX, radiusY, sigma) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    if (sigma === undefined) sigma = 1;

    var kernel = [];
    var weight = 0;
    var i, len, dy, dx, s, w;
    for (dy = 1 - this.radiusY,i = 0; dy < this.radiusY; ++dy) {
      for (dx = 1 - this.radiusX; dx < this.radiusX; ++dx,++i) {
        s = 2 * sigma * sigma;
        w = 1 / (s * Math.PI) * Math.exp(-(dx * dx + dy * dy) / s);
        weight += w;
        kernel[i] = w;
      }
    }
    // normalize kernel
    for (i = 0,len = kernel.length; i < len; ++i) {
      kernel[i] /= weight;
    }
    this.kernel = kernel;
  };

  return GaussianFilter;
});}, "display/filters/KernelFilter": function(exports, require, module) {(function () {
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
});}, "display/filters/LaplacianFilter": function(exports, require, module) {(function () {
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
});}, "display/filters/MedianFilter": function(exports, require, module) {(function () {
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
});}, "display/filters/PrewittFilter": function(exports, require, module) {(function () {
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
});}, "display/filters/SobelFilter": function(exports, require, module) {(function () {
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
});}, "display/filters/UnsharpMaskFilter": function(exports, require, module) {(function () {
  var KernelFilter = require('KernelFilter');

  function UnsharpMaskFilter(radiusX, radiusY, amount) {
    this._constructor.apply(this, arguments);
  }

  UnsharpMaskFilter.prototype = new KernelFilter();

  UnsharpMaskFilter.prototype._constructor = function (radiusX, radiusY, amount) {
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.amount = (amount !== undefined) ? amount : 1;

    var kernel = [];
    var length = (radiusX * 2 - 1) * (radiusY * 2 - 1);
    var value = 1 / length;
    for (var i = 0, isCenter; i < length; ++i) {
      kernel[i] = -value;
      isCenter = (i === length >> 1);
      if (isCenter) {
        ++kernel[i];
      }
      kernel[i] *= this.amount;
      if (isCenter) {
        ++kernel[i];
      }
    }
    this.kernel = kernel;
  };

  return UnsharpMaskFilter;
});}, "display/styles/CapsStyle": function(exports, require, module) {(function() {
  var CapsStyle;
  module.exports = CapsStyle = {
    NONE: 'butt',
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  };
}).call(this);
}, "display/styles/FontFamily": function(exports, require, module) {(function() {
  var FontFamily;
  module.exports = FontFamily = {
    SERIF: 'serif',
    SANS_SERIF: 'sans-serif',
    CURSIVE: 'cursive',
    MONOSPACE: 'monospace',
    FANTASY: 'fantasy'
  };
}).call(this);
}, "display/styles/FontStyle": function(exports, require, module) {(function() {
  var FontStyle;
  module.exports = FontStyle = {
    NORMAL: 'normal',
    ITALIC: 'italic',
    OBLIQUE: 'oblique'
  };
}).call(this);
}, "display/styles/FontVariant": function(exports, require, module) {(function() {
  var FontVariant;
  module.exports = FontVariant = {
    NORMAL: 'normal',
    SMALL_CAPS: 'small-caps'
  };
}).call(this);
}, "display/styles/FontWeight": function(exports, require, module) {(function() {
  var FontWeight;
  module.exports = FontWeight = {
    NORMAL: 'normal',
    BOLD: 'bold',
    LIGHTER: 'lighter',
    BOLDER: 'bolder'
  };
}).call(this);
}, "display/styles/GradientType": function(exports, require, module) {(function() {
  var GradientType;
  module.exports = GradientType = {
    LINEAR: 'linear',
    RADIAL: 'radial'
  };
}).call(this);
}, "display/styles/JointStyle": function(exports, require, module) {(function() {
  var JointStyle;
  module.exports = JointStyle = {
    BEVEL: 'bevel',
    MITER: 'miter',
    ROUND: 'round'
  };
}).call(this);
}, "display/styles/TextAlign": function(exports, require, module) {(function() {
  var TextAlign;
  module.exports = TextAlign = {
    START: 'start',
    END: 'end',
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center'
  };
}).call(this);
}, "display/styles/TextBaseline": function(exports, require, module) {(function() {
  var TextBaseline;
  module.exports = TextBaseline = {
    TOP: 'top',
    HANGING: 'hanging',
    MIDDLE: 'middle',
    ALPHABETIC: 'alphabetic',
    IDEOGRAPHIC: 'ideographic',
    BOTTOM: 'bottom'
  };
}).call(this);
}, "display/styles/TextFormat": function(exports, require, module) {(function() {
  var FontFamily, FontStyle, FontVariant, FontWeight, TextAlign, TextBaseline, TextFormat;
  FontFamily = require('display/styles/FontFamily');
  FontWeight = require('display/styles/FontWeight');
  FontStyle = require('display/styles/FontStyle');
  FontVariant = require('display/styles/FontVariant');
  TextAlign = require('display/styles/TextAlign');
  TextBaseline = require('display/styles/TextBaseline');
  module.exports = TextFormat = (function() {
    function TextFormat(fontFamily, fontSize, color, fontWeight, fontStyle, fontVariant, textAlign, textBaseline) {
      this.fontFamily = fontFamily != null ? fontFamily : FontFamily.SANS_SERIF;
      this.fontSize = fontSize != null ? fontSize : 16;
      this.color = color != null ? color : 0;
      this.fontWeight = fontWeight != null ? fontWeight : FontWeight.NORMAL;
      this.fontStyle = fontStyle != null ? fontStyle : FontStyle.NORMAL;
      this.fontVariant = fontVariant != null ? fontVariant : FontVariant.NORMAL;
      this.textAlign = textAlign != null ? textAlign : TextAlign.START;
      this.textBaseline = textBaseline != null ? textBaseline : TextBaseline.ALPHABETIC;
    }
    TextFormat.prototype.toStyleSheet = function() {
      return "" + this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + this.fontSize + "px " + this.fontFamily;
    };
    return TextFormat;
  })();
}).call(this);
}, "events/EventDispatcher": function(exports, require, module) {(function() {
  var EventDispatcher;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  module.exports = EventDispatcher = (function() {
    function EventDispatcher() {
      this._events = {};
    }
    EventDispatcher.prototype.addEventListener = function(type, listener, args) {
      if (typeof listener !== 'function') {
        throw new Error('');
      }
      if (this._events[type] == null) {
        this._events[type] = [];
      }
      this._events[type].push(__bind(function() {
        listener.apply(this, args);
      }, this));
      return this;
    };
    EventDispatcher.prototype.dispatchEvent = function(type) {
      var handler, handlers, _i, _len;
      handlers = this._events[type];
      if (handlers != null) {
        for (_i = 0, _len = handlers.length; _i < _len; _i++) {
          handler = handlers[_i];
          handler();
        }
      }
    };
    EventDispatcher.prototype.addListener = EventDispatcher.prototype.on = EventDispatcher.addEventListener;
    EventDispatcher.prototype.emit = EventDispatcher.dispatchEvent;
    return EventDispatcher;
  })();
}).call(this);
}, "geom/Matrix": function(exports, require, module) {(function() {
  var Matrix, _cos, _sin, _tan;
  _sin = Math.sin;
  _cos = Math.cos;
  _tan = Math.tan;
  /*
           |a c x|
  Matrix = |b d y|
           |0 0 1|
  */
  module.exports = Matrix = (function() {
    function Matrix(a, b, c, d, x, y) {
      this.a = a != null ? a : 1;
      this.b = b != null ? b : 0;
      this.c = c != null ? c : 0;
      this.d = d != null ? d : 1;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }
    Matrix.prototype.clone = function() {
      return new Matrix(this.a, this.b, this.c, this.d, this.x, this.y);
    };
    Matrix.prototype.concat = function(matrix) {
      return this._concat(matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y);
    };
    Matrix.prototype._concat = function(a, b, c, d, x, y) {
      this.a = this.a * a + this.c * b + this.x * 0;
      this.b = this.b * a + this.d * b + this.y * 0;
      this.c = this.a * c + this.c * d + this.x * 0;
      this.d = this.b * c + this.d * d + this.y * 0;
      this.x = this.a * x + this.c * y + this.x * 1;
      this.y = this.b * x + this.d * y + this.y * 1;
      return this;
    };
    Matrix.prototype.translate = function(tx, ty) {
      return this._concat(1, 0, 0, 1, tx, ty);
    };
    Matrix.prototype.scale = function(sx, sy) {
      return this._concat(sx, 0, 0, sy, 0, 0);
    };
    Matrix.prototype.rotate = function(angle) {
      var c, s;
      c = _cos(angle);
      s = _sin(angle);
      return this.concat(c, -s, s, c, 0, 0);
    };
    Matrix.prototype.skew = function(skewX, skewY) {
      return this.concat(0, _tan(skewY), _tan(skewX), 0, 0, 0);
    };
    return Matrix;
  })();
}).call(this);
}, "geom/Quadtree": function(exports, require, module) {module.exports = Quadtree;

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
}, "geom/QuadtreeSpace": function(exports, require, module) {module.exports = QuadtreeSpace;

var Quadtree = require('geom/Quadtree')
  , Rectangle = require('geom/Rectangle');

function QuadtreeSpace(rectangle, level/*, debugSprite = null*/) {
  this.rectangle = rectangle;
  this.debugSprite = arguments[2];
  this.quadtree = new Quadtree(level);
  this.lowestWidth = this.rectangle.width / this.quadtree.lowestLengthPerSide;
  this.lowestHeight =
    this.rectangle.height / this.quadtree.lowestLengthPerSide;
  this._objects = [];

  if (this.debugSprite) {
    var Shape = require('display/Shape')
      , TextField = require('display/TextField')
      , TextFormat = require('display/TextFormat');

    var grid = (new Shape()).addTo(this.debugSprite);
    var textFormat = new TextFormat('12px monospace', 'center', 'middle');
    var textField;
    for (var x = 0, w = this.quadtree.lowestLengthPerSide; x < w; ++x) {
      for (var y = 0, h = this.quadtree.lowestLengthPerSide; y < h; ++y) {
        grid._context.rect(this.lowestWidth * x, this.lowestHeight * y,
          this.lowestWidth, this.lowestHeight);
        textField = new TextField(textFormat);
        textField.text = Quadtree.coordToZOrder(x, y);
        textField.x = this.lowestWidth * (x + .5);
        textField.y = this.lowestHeight * (y + .5);
        grid.addChild(textField);
      }
    }

    (new Shape()).addTo(this.debugSprite);
    (new Shape()).addTo(this.debugSprite);
  }
}

QuadtreeSpace.prototype = {};

QuadtreeSpace.prototype.add = function(/*...*/rectangle) {
  var i = arguments.length;
  while (i--) {
    rectangle = arguments[i];
    rectangle.apply(rectangle.intersection(this.rectangle));
    this._objects.push({
      rectangle: rectangle
    });

    if (this.debugSprite && rectangle.isStatic) {
      var staticLayer = this._graphics.getLayer('static');
      staticLayer.drawRect(
        rectangle.x - this.rectangle.x, rectangle.y - this.rectangle.y,
        rectangle.width, rectangle.height
      );
      staticLayer.stroke(1, 0xff0000);
    }
  }
};

QuadtreeSpace.prototype.remove = function(/*...*/rectangle) {
  var i = arguments.length;
  var j;
  while (i--) {
    rectangle = arguments[i];
    j = this._objects.length;
    while (j--) {
      if (rectangle === this._objects[j].rectangle) {
        this._objects.splice(j, 1);
        break;
      }
    }
  }
};

QuadtreeSpace.prototype.update2DPosition = function(obj) {
  var rectangle = obj.rectangle;
  obj.x0 = _validatePos((rectangle.x - this.rectangle.x) / this.lowestWidth);
  obj.y0 = _validatePos((rectangle.y - this.rectangle.y) / this.lowestHeight);
  obj.x1 = _validatePos((rectangle.x + rectangle.width - this.rectangle.x) /
    this.lowestWidth);
  obj.y1 = _validatePos((rectangle.y + rectangle.height - this.rectangle.y) /
    this.lowestHeight);
};

function _validatePos(n) {
  if (n === 8) {
    return 7;
  }
  if (n < 0 || n > 8) {
    throw new Error('Overflow quadtree space : ' + n);
  }
  return n >> 0;
}

QuadtreeSpace.prototype.detectCollision = function() {
  if (this.isDebug) {
    var dynamicLayer = this._graphics.getLayer('dynamic');
    dynamicLayer.clear();
  }

  this.linearList = [];
  var i, len, obj, linear;
  for (i = 0, len = this._objects.length; i < len; ++i) {
    obj = this._objects[i];
    this.update2DPosition(obj);
    linear = this.quadtree.coordsToIndex(obj.x0, obj.y0, obj.x1, obj.y1);
    if (!this.linearList[linear]) {
      this.linearList[linear] = [];
    }
    this.linearList[linear].push(obj);

    if (this.isDebug && !obj.rectangle.isStatic) {
      dynamicLayer.drawRect(
        obj.rectangle.x - this.rectangle.x,
        obj.rectangle.y - this.rectangle.y,
        obj.rectangle.width, obj.rectangle.height
      );
      dynamicLayer.stroke(1, 0x0000ff);
    }
  }

  if (this.isDebug) {
    this._graphics.render();
  }

  var collisionList = [];
  var j, objects, src, k, objs, l, dst;
  i = this.linearList.length;
  while (i--) {
    objects = this.linearList[i];
    if (objects) {
      j = objects.length;
      while (j--) {
        src = objects[j];
        // check collision in same space
        k = j;
        while (k--) {
          dst = objects[k];
          if (src.rectangle.intersects(dst.rectangle)) {
            collisionList.push([ src.rectangle, dst.rectangle ]);
          }
        }
        // check collision in parent space
        k = i;
        while ((k = k - 1 >> 2) >= 0) {
          objs = this.linearList[k];
          if (objs) {
            l = objs.length;
            while (l--) {
              dst = objs[l];
              if (src.rectangle.intersects(dst.rectangle)) {
                collisionList.push([ src.rectangle, dst.rectangle ]);
              }
            }
          }
        }
      }
    }
  }

  return collisionList;
};

QuadtreeSpace.prototype.getBlankSpace = function() {
  var blankList = [];
  var src, k, objs, l, dst, intersects;
  for (var x = 0, w = this.quadtree.lowestLengthPerSide; x < w; ++x) {
    for (var y = 0, h = this.quadtree.lowestLengthPerSide; y < h; ++y) {
      src = new Rectangle(this.lowestWidth * x, this.lowestHeight * y,
        this.lowestWidth, this.lowestHeight);
      k = this.quadtree.coordsToIndex(x, y, x, y);
      intersects = false;
      while ((k = k - 1 >> 2) >= 0) {
        objs = this.linearList[k];
        if (objs) {
          l = objs.length;
          while (l--) {
            dst = objs[l];
            if (src.intersects(dst.rectangle)) {
              intersects = true;
              break;
            }
          }
        }
      }
      if (!intersects) {
        blankList.push(src);
      }
    }
  }
  return blankList;
};}, "geom/Rectangle": function(exports, require, module) {(function() {
  var Rectangle;
  module.exports = Rectangle = (function() {
    function Rectangle(x, y, width, height) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.width = width != null ? width : 0;
      this.height = height != null ? height : 0;
    }
    Rectangle.prototype.toString = function() {
      return "[Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
    };
    Rectangle.prototype.clone = function() {
      return new Rectangle(this.x, this.y, this.width, this.height);
    };
    Rectangle.prototype.apply = function(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    };
    Rectangle.prototype.applyRectangle = function(rect) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
    };
    Rectangle.prototype.offset = function(dx, dy) {
      this.x += dx;
      this.y += dy;
    };
    Rectangle.prototype.offsetPoint = function(pt) {
      this.x += pt.x;
      this.y += pt.y;
    };
    Rectangle.prototype.inflate = function(dw, dh) {
      this.width += dw;
      this.height += dh;
    };
    Rectangle.prototype.inflatePoint = function(pt) {
      this.width += pt.x;
      this.height += pt.y;
    };
    Rectangle.prototype.deflate = function(dw, dh) {
      this.width -= dw;
      this.height -= dh;
    };
    Rectangle.prototype.deflatePoint = function(pt) {
      this.width -= pt.x;
      this.height -= pt.y;
    };
    Rectangle.prototype.union = function(rect) {
      var b, h, l, r, t, w;
      l = Math.min(this.x, rect.x);
      r = Math.max(this.x + this.width, rect.x + rect.width);
      w = r - l;
      t = Math.min(this.y, rect.y);
      b = Math.max(this.y + this.height, rect.y + rect.height);
      h = b - t;
      this.x = l;
      this.y = t;
      this.width = w < 0 ? 0 : w;
      this.height = h < 0 ? 0 : h;
    };
    Rectangle.prototype.isEmpty = function() {
      return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
    };
    Rectangle.prototype.intersects = function(rect) {
      var b, h, l, r, t, w;
      l = Math.max(this.x, rect.x);
      r = Math.min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) {
        return false;
      }
      t = Math.max(this.y, rect.y);
      b = Math.min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) {
        return false;
      }
      return true;
    };
    Rectangle.prototype.intersection = function(rect) {
      var b, h, l, r, t, w;
      l = Math.max(this.x, rect.x);
      r = Math.min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) {
        return new Rectangle();
      }
      t = Math.max(this.y, rect.y);
      b = Math.min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) {
        return new Rectangle();
      }
      return new Rectangle(l, t, w, h);
    };
    return Rectangle;
  })();
}).call(this);
}, "serialization/DateFormat": function(exports, require, module) {(function() {
  var DateFormat, __R_ISO_8601, __padLeft;
  __R_ISO_8601 = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d*))?Z$/;
  __padLeft = require('utils/StringUtil').padLeft;
  module.exports = DateFormat = {
    stringifyJSON: function(date) {
      return "" + (date.getUTCFullYear()) + "-" + (__padLeft(date.getUTCMonth() + 1, 2, '0')) + "-" + (__padLeft(date.getUTCDate(), 2, '0')) + "T" + (__padLeft(date.getUTCHours(), 2, '0')) + ":" + (__padLeft(date.getUTCMinutes(), 2, '0')) + ":" + (__padLeft(date.getUTCSeconds(), 2, '0')) + "." + (__padLeft(date.getUTCMilliseconds(), 3, '0')) + "Z";
    },
    parseJSON: function(dateString) {
      var r;
      if (typeof dateString === 'string') {
        r = __R_ISO_8601.exec(dateString);
        if (r != null) {
          return new Date(Date.UTC(+r[1], +r[2] - 1, +r[3], +r[4], +r[5], +r[6], +r[7]));
        }
      }
      return dateString;
    },
    reviveJSON: function(key, value) {
      return DateFormat.parseJSON(value);
    }
  };
}).call(this);
}, "serialization/JSON": function(exports, require, module) {(function() {
  var DateFormat, JSON, __META, __R_CHARS, __R_CX, __R_ESCAPABLE, __R_RACES, __R_SPACES, __R_TOKENS, __quote, __str, __walk, _base;
  var __hasProp = Object.prototype.hasOwnProperty;
  DateFormat = require('serialization/DateFormat');
  __R_ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  __META = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
  };
  __R_CX = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  __R_CHARS = /^[\],:{}\s]*$/;
  __R_SPACES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  __R_TOKENS = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  __R_RACES = /(?:^|:|,)(?:\s*\[)+/g;
  __quote = function(string) {
    __R_ESCAPABLE.lastIndex = 0;
    if (__R_ESCAPABLE.test(string)) {
      return '"' + string.replace(__R_ESCAPABLE, function(a) {
        var c;
        c = __META[a];
        if (typeof c === 'string') {
          return c;
        } else {
          return "\\u" + (("0000" + (a.charCodeAt(0).toString(16))).slice(-4));
        }
      }) + '"';
    } else {
      return "\"" + string + "\"";
    }
  };
  __str = function(key, holder, replacer, gap, indent) {
    var i, k, mind, partial, v, value, _ref, _ref2;
    mind = gap;
    value = holder[key];
    if (value instanceof Date) {
      value = DateFormat.stringifyJSON(value);
    }
    if (typeof replacer === 'function') {
      value = replacer.call(holder, key, value);
    }
    switch (typeof value) {
      case 'string':
        return __quote(value);
      case 'number':
        if (isFinite(value)) {
          return String(value);
        } else {
          return 'null';
        }
        break;
      case 'boolean':
      case 'null':
        return String(value);
      case 'object':
        if (!value) {
          return 'null';
        }
        gap += indent;
        partial = [];
        if (Object.prototype.toString.apply(value) === '[object Array]') {
          for (i = 0, _ref = value.length; i < _ref; i += 1) {
            partial[i] = __str(i, value, replacer, gap, indent) || 'null';
          }
          v = partial.length === 0 ? '[]' : gap ? "[\n" + gap + (partial.join(',\n' + gap)) + "\n" + mind + "]" : "[" + (partial.join(',')) + "]";
          gap = mind;
          return v;
        }
        if (replacer && typeof replacer === 'object') {
          for (i = 0, _ref2 = replacer.length; i < _ref2; i += 1) {
            if (typeof replacer[i] === 'string') {
              k = replacer[i];
              v = __str(k, value, replacer, gap, indent);
              if (v) {
                partial.push(__quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (!__hasProp.call(value, k)) continue;
            v = __str(k, value, replacer, gap, indent);
            if (v) {
              partial.push(__quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        }
        v = partial.length === 0 ? '{}' : gap ? "{\n" + gap + (partial.join(',\n' + gap)) + "\n" + mind + "}" : "{" + (partial.join(',')) + "}";
        gap = mind;
        return v;
    }
  };
  __walk = function(holder, key, reviver) {
    var k, v, value;
    value = holder[key];
    if (value && typeof value === 'object') {
      for (k in value) {
        v = __walk(value, k, reviver);
        if (v !== void 0) {
          value[k] = v;
        } else {
          delete value[k];
        }
      }
    }
    return reviver.call(holder, key, value);
  };
  module.exports = JSON = (typeof (_base = window.JSON).stringify === "function" ? _base.stringify([new Date()]).charAt(21) : void 0) === '.' ? window.JSON : {
    stringify: function(value, replacer, space) {
      var i, indent, treplacer, tspace;
      indent = '';
      tspace = typeof space;
      if (tspace === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }
      } else if (tspace === 'string') {
        indent = space;
      }
      if (replacer && (treplacer = typeof replacer) !== 'function' && (treplacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }
      return __str('', {
        '': value
      }, replacer, '', indent);
    },
    parse: function(text, reviver) {
      text = String(text);
      __R_CX.lastIndex = 0;
      if (__R_CX.test(text)) {
        text = text.replace(__R_CX, function(a) {
          return "\\u" + (("0000" + (a.charCodeAt(0).toString(16))).slice(-4));
        });
      }
      if (__R_CHARS.test(text.replace(__R_SPACES, '@').replace(__R_TOKENS, ']').replace(__R_RACES, ''))) {
        text = eval("(" + text + ")");
      }
      if (typeof reviver === 'function') {
        __walk({
          '': text
        }, '', reviver);
      }
      return text;
    }
  };
}).call(this);
}, "serialization/QueryString": function(exports, require, module) {(function() {
  var QueryString;
  module.exports = QueryString = {
    stringify: function(object, separate, equal) {
      var key, queries, v, value, _i, _len;
      if (separate == null) {
        separate = '&';
      }
      if (equal == null) {
        equal = '=';
      }
      queries = [];
      for (key in object) {
        value = object[key];
        key = encodeURIComponent(key);
        if (Object.prototype.toString.call(value) === '[object Array]') {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            v = value[_i];
            queries.push(v != null ? key + equal + encodeURIComponent(v) : key);
          }
        } else {
          queries.push(value != null ? key + equal + encodeURIComponent(value) : key);
        }
      }
      return queries.join(separate);
    },
    parse: function(string, separator, equal) {
      var key, keyValue, q, queries, query, value, _i, _len, _results;
      if (separator == null) {
        separator = '&';
      }
      if (equal == null) {
        equal = '=';
      }
      query = {};
      queries = string.split(separator);
      _results = [];
      for (_i = 0, _len = queries.length; _i < _len; _i++) {
        q = queries[_i];
        keyValue = q.split(equal);
        key = keyValue[0];
        value = keyValue[1];
        _results.push(key in query ? (key = decodeURIComponent(key), typeof query[key] === 'string' ? query[key] = [query[key]] : void 0, query[key].push(decodeURIComponent(value))) : query[key] = decodeURIComponent(value));
      }
      return _results;
    }
  };
}).call(this);
}, "system/Capabilities": function(exports, require, module) {(function() {
  var Capabilities, R_CHROME, R_MOZILLA, R_MSIE, R_OPERA, R_SAFARI, R_WEBKIT, browser, browserInfo, ua, v, version, versions, _base;
  R_CHROME = /(chrome)[ \/]([\w.]+)/;
  R_SAFARI = /(safari)[ \/]([\w.]+)/;
  R_WEBKIT = /(webkit)[ \/]([\w.]+)/;
  R_OPERA = /(opera)(?:.*version)?[ \/]([\w.]+)/;
  R_MSIE = /(msie) ([\w.]+)/;
  R_MOZILLA = /(mozilla)(?:.*? rv:([\w.]+))?/;
  ua = window.navigator.userAgent.toLowerCase();
  browserInfo = R_CHROME.exec(ua) || R_SAFARI.exec(ua) || R_WEBKIT.exec(ua) || R_OPERA.exec(ua) || R_MSIE.exec(ua) || (ua.indexOf('compatible') === -1 && R_MOZILLA.exec(ua)) || [];
  browser = browserInfo[1] || '';
  version = browserInfo[2] || '0';
  versions = (function() {
    var _i, _len, _ref, _results;
    _ref = version.split('.');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      _results.push(Number(v));
    }
    return _results;
  })();
  module.exports = Capabilities = {
    browser: {
      name: browser,
      version: version,
      versions: versions,
      is: {
        browser: true
      }
    },
    supports: {
      smoothing: !(browser === 'msie' && versions[9] <= 7),
      VML: browser === 'msie' && versions[0] <= 8 && ((typeof (_base = document.namespace).add === "function" ? _base.add() : void 0) != null),
      touch: (typeof document.createTouch === "function" ? document.createTouch() : void 0) != null,
      canvas: window.HTMLCanvasElement != null
    }
  };
}).call(this);
}, "timers/Stopwatch": function(exports, require, module) {(function() {
  var Stopwatch, _clone, _padRight, _storage;
  _clone = require('utils/ObjectUtil').clone;
  _padRight = require('utils/StringUtil').padRight;
  _storage = {};
  module.exports = Stopwatch = {
    start: function(name) {
      var date;
      if ((name in _storage) != null) {
        date = _storage[name];
      } else {
        date = _storage[name] = {};
        date.counter = 0;
        date.total = 0;
      }
      date._startAt = (new Date()).getTime();
    },
    stop: function(name) {
      var date;
      date = _storage[name];
      if ((date != null ? date._startAt : void 0) != null) {
        date.counter++;
        date.total += (new Date()).getTime() - date._startAt;
        date.average = date.total / date.counter;
        delete date._startAt;
      }
    },
    toObject: function(name) {
      return _clone(_storage[name]);
    },
    toString: function(name) {
      var max, rows;
      if (name == null) {
        name = null;
      }
      if (name != null) {
        return this._toString(name, 0);
      } else {
        max = 'name'.length;
        for (name in _storage) {
          max = Math.max(max, name.length);
        }
        rows = [];
        for (name in _storage) {
          rows.push(this._toString(name, max));
        }
        return rows.join('\n');
      }
    },
    _toString: function(name, max) {
      var date;
      date = _storage[name];
      return "" + (_padRight(name, max, ' ')) + " : " + date.total + "(ms) / " + date.counter + " = " + date.average + "(ms)";
    }
  };
}).call(this);
}, "timers/Timer": function(exports, require, module) {(function() {
  var EventDispatcher, Timer, _clearInterval, _setInterval;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  EventDispatcher = require('events/EventDispatcher');
  _setInterval = setInterval;
  _clearInterval = clearInterval;
  module.exports = Timer = (function() {
    __extends(Timer, EventDispatcher);
    Timer.prototype.__defineGetter__('delay', function() {
      return this._delay;
    });
    Timer.prototype.__defineSetter__('delay', function(delay) {
      var running;
      running = this._running;
      this.stop();
      this._delay = delay;
      if (running) {
        return this.start();
      }
    });
    Timer.prototype.__defineGetter__('repeatCount', function() {
      return this._repeatCount;
    });
    Timer.prototype.__defineSetter__('repeatCount', function(repeatCount) {
      this._repeatCount = repeatCount;
      if (this._repeatCount !== 0 && this._currentCount >= this._repeatCount) {
        return this.stop();
      }
    });
    Timer.prototype.__defineGetter__('currentCount', function() {
      return this._currentCount;
    });
    Timer.prototype.__defineGetter__('running', function() {
      return this._running;
    });
    function Timer(delay, repeatCount) {
      if (repeatCount == null) {
        repeatCount = 0;
      }
      this._onInterval = __bind(this._onInterval, this);
      this.delay = Number(delay);
      if (isNaN(this.delay)) {
        throw new Error('Timer constructor requires delay as Number.');
      }
      this.reset();
    }
    Timer.prototype.reset = function() {
      this.stop();
      this._currentCount = 0;
    };
    Timer.prototype.start = function() {
      if (this._running !== true && (this._repeatCount === 0 || this._currentCount < this._repeatCount)) {
        if (this._intervalId != null) {
          _clearInterval(this._intervalId);
        }
        this._running = true;
        this._intervalId = _setInterval(this._onInterval, this._delay);
      }
    };
    Timer.prototype.stop = function() {
      this._running = false;
      if (this._intervalId != null) {
        _clearInterval(this._intervalId);
        this._intervalId = null;
      }
    };
    Timer.prototype._onInterval = function() {
      this.dispatchEvent('timer');
      if (this._repeatCount !== 0 && ++this._currentCount >= this._repeatCount) {
        this.stop();
        this.dispatchEvent('timerComplete');
      }
    };
    return Timer;
  })();
}).call(this);
}, "utils/ArrayUtil": function(exports, require, module) {(function() {
  var ArrayUtil, __ceil, __floor, __shift;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  __shift = Array.prototype.shift;
  __ceil = Math.ceil;
  __floor = Math.floor;
  module.exports = ArrayUtil = {
    isArray: typeof Array.isArray === 'function' ? function(array) {
      return Array.isArray(array);
    } : function(array) {
      return Object.prototype.toString.call(array) === '[object Array]';
    },
    "in": function(array, searchElement) {
      return __indexOf.call(array, searchElement) >= 0;
    },
    indexOf: typeof Array.prototype.indexOf === 'function' ? function(array, searchElement, fromIndex) {
      return Array.prototype.indexOf.apply(__shift.call(arguments), arguments);
    } : function(array, searchElement, fromIndex) {
      var i, len;
      if (fromIndex == null) {
        fromIndex = 0;
      }
      len = array.length;
      fromIndex = fromIndex < 0 ? __ceil(fromIndex) : __floor(fromIndex);
      if (fromIndex < 0) {
        fromIndex += len;
      }
      for (i = fromIndex; i <= len; i += 1) {
        if (i in array && array[i] === searchElement) {
          return i;
        }
      }
      return -1;
    },
    lastIndexOf: typeof Array.prototype.lastIndexOf === 'function' ? function(array, searchElement, fromIndex) {
      return Array.prototype.lastIndexOf.apply(__shift.call(arguments), arguments);
    } : function(array, searchElement, fromIndex) {
      var i, len;
      if (fromIndex == null) {
        fromIndex = Number.MAX_VALUE;
      }
      len = array.length;
      fromIndex = fromIndex < 0 ? __ceil(fromIndex) : __floor(fromIndex);
      if (fromIndex < 0) {
        fromIndex += len;
      } else {
        fromIndex = len - 1;
      }
      for (i = fromIndex; i >= -1; i += -1) {
        if (i in array && array[i] === searchElement) {
          return i;
        }
      }
      return -1;
    },
    filter: typeof Array.prototype.filter === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.filter.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len, _results;
      if (thisObject == null) {
        thisObject = null;
      }
      if (typeof callback !== 'function') {
        throw new TypeError();
      }
      _results = [];
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array && callback.call(thisObject, val, i, array)) {
          _results.push(val);
        }
      }
      return _results;
    },
    forEach: typeof Array.prototype.forEach === 'function' ? function(array, callback, thisObject) {
      Array.prototype.forEach.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len;
      if (thisObject == null) {
        thisObject = null;
      }
      if (typeof callback !== 'function') {
        throw new TypeError();
      }
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array) {
          callback.call(thisObject, val, i, array);
        }
      }
    },
    every: typeof Array.prototype.every === 'function' ? function(array, callvack, thisObject) {
      return Array.prototype.every.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len;
      if (thisObject == null) {
        thisObject = null;
      }
      if (typeof callback !== 'function') {
        throw new TypeError();
      }
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array && !callback.call(thisObject, val, i, array)) {
          return false;
        }
      }
      return true;
    },
    map: typeof Array.prototype.map === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.map.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len, _results;
      if (thisObject == null) {
        thisObject = null;
      }
      if (typeof callback !== 'function') {
        throw new TypeError();
      }
      _results = [];
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array) {
          _results.push(callback.call(thisObject, val, i, array));
        }
      }
      return _results;
    },
    some: typeof Array.prototype.some === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.some.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len;
      if (thisObject == null) {
        thisObject = null;
      }
      if (typeof callback !== 'function') {
        throw new TypeError();
      }
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i(fo(array && callback.call(thisObject, val, i, array)))) {
          return true;
        }
      }
      return false;
    },
    reduce: typeof Array.prototype.reduce === 'function' ? function(array, callback, initialValue) {
      return Array.prototype.reduce.apply(__shift.call(arguments), arguments);
    } : function(array, callback, initialValue) {
      var i, len, val, _ref;
      if (initialValue == null) {
        initialValue = null;
      }
      len = array.length;
      if (typeof callback !== 'function' || (len === 0 && initialValue === null)) {
        throw new TypeError();
      }
      i = 0;
      if (initialValue === null) {
        do {
            if (i in array) {
              initialValue = array[i++];
              break;
            }
            if (++i > len) {
              throw new TypeError();
            }
          } while (true);
      }
      for (val = i, _ref = len - 1; val >= _ref; val += -1) {
        if (val in array) {
          initialValue = callback.call(null, initialValue, array[val], val, array);
        }
      }
      return initialValue;
    },
    reduceRight: typeof Array.prototype.reduceRight === 'function' ? function(array, callback, initialValue) {
      return Array.prototype.reduceRight.apply(__shift.call(arguments), arguments);
    } : function(array, callback, initialValue) {
      var i, len, val;
      if (initialValue == null) {
        initialValue = null;
      }
      len = array.length;
      if (typeof callback !== 'function' || (len === 0 && initialValue === null)) {
        throw new TypeError();
      }
      i = len - 1;
      if (initialValue === null) {
        do {
            if (i in array) {
              initialValue = array[i--];
              break;
            }
            if (--i <= len) {
              throw new TypeError();
            }
          } while (true);
      }
      for (val = i; val >= 0; val += -1) {
        if (val in array) {
          initialValue = callback.call(null, initialValue, array[val], val, array);
        }
      }
      return initialValue;
    },
    toArray: function(arrayLikeObject) {
      return Array.prototype.slice.call(arrayLikeObject);
    },
    random: function(array, length) {
      var _results;
      if (length == null) {
        length = 1;
      }
      if (length === 1) {
        return array[array.length * Math.random() >> 0];
      } else {
        array = Array.prototype.slice.call(array);
        _results = [];
        while (length--) {
          _results.push(array.splice(array.length * Math.random() >> 0, 1)[0]);
        }
        return _results;
      }
    },
    shuffle: function(array) {
      var i, j, v;
      i = array.length;
      while (i) {
        j = Math.random() * i >> 0;
        v = array[--i];
        array[i] = array[j];
        array[j] = v;
      }
      return array;
    },
    unique: function(array) {
      var storage;
      storage = {};
      for (var i = 0, elem; i < array.length; ++i) {
        elem = array[i];
        if (elem in storage) {
          array.splice(i--, 1);
        }
        storage[elem] = true;
      };
      return array;
    },
    rotate: function(array, index) {
      if (index == null) {
        index = 1;
      }
      if (index > 0) {
        while (index--) {
          array.push(array.shift());
        }
      } else if (index < 0) {
        index *= -1;
        while (index--) {
          array.unshift(array.pop());
        }
      }
      return array;
    },
    transpose: function(array) {
      var cols, columns, elem, i, j, results, row, _len, _len2;
      results = [];
      columns = -1;
      for (i = 0, _len = array.length; i < _len; i++) {
        row = array[i];
        if (!ArrayUtil.isArray(row)) {
          throw new TypeError('Element isn\'t Array.');
        }
        cols = row.length;
        if (i !== 0 && cols !== columns) {
          throw new Error("Element size differ (" + cols + " should be " + columns + ")");
        }
        columns = cols;
        if (i === 0) {
          while (cols--) {
            results[cols] = [];
          }
        }
        for (j = 0, _len2 = row.length; j < _len2; j++) {
          elem = row[j];
          results[j].push(elem);
        }
      }
      return results;
    }
  };
}).call(this);
}, "utils/MathUtil": function(exports, require, module) {(function() {
  var MathUtil;
  module.exports = MathUtil = {
    DEGREE_PER_RADIAN: 180 / Math.PI,
    RADIAN_PER_DEGREE: Math.PI / 180,
    nearestIn: function(number, numbers) {
      var compared, n, _i, _len;
      compared = [];
      for (_i = 0, _len = numbers.length; _i < _len; _i++) {
        n = numbers[_i];
        compared.push(Math.abs(n - number));
      }
      return numbers[compared.indexOf(Math.min.apply(null, compared))];
    },
    randomBetween: function(a, b) {
      return a + (b - a) * Math.random();
    },
    convergeBetween: function(number, a, b) {
      var max, min;
      min = Math.min(a, b);
      max = Math.max(a, b);
      if (number < min) {
        return min;
      } else if (number > max) {
        return max;
      } else {
        return number;
      }
    }
  };
}).call(this);
}, "utils/ObjectUtil": function(exports, require, module) {(function() {
  var DateFormat, JSON, ObjectUtil;
  var __hasProp = Object.prototype.hasOwnProperty;
  JSON = require('serialization/JSON');
  DateFormat = require('serialization/DateFormat');
  module.exports = ObjectUtil = {
    clone: function(obj) {
      return JSON.parse(JSON.stringify(obj), DateFormat.reviveJSON);
    },
    keys: Object.keys || function(obj) {
      var key, type, _results;
      if ((type = typeof obj) !== 'object' && type !== 'function') {
        throw new TypeError("" + obj + " isn't Object object");
      }
      _results = [];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        _results.push(key);
      }
      return _results;
    }
  };
}).call(this);
}, "utils/StringUtil": function(exports, require, module) {(function() {
  var StringUtil, __shift;
  __shift = Array.prototype.shift;
  module.exports = StringUtil = {
    split: 'a'.split(/(a)/).length !== 0 ? function(string, separator, limit) {
      return String.prototype.split.apply(__shift.call(arguments), arguments);
    } : function(string, separator, limit) {
      var chunks, i, index, r, _ref;
      if (separator == null) {
        separator = null;
      }
      if (limit == null) {
        limit = -1;
      }
      if (separator instanceof RegExp) {
        separator = new RegExp(separator.source, 'g');
        chunks = [];
        index = 0;
        while ((r = separator.exec(string)) != null) {
          chunks.push(string.slice(index, r.index));
          for (i = 1, _ref = r.length; i < _ref; i += 1) {
            chunks.push(r[i]);
          }
          index = separator.lastIndex;
        }
        chunks.push(index !== string.length ? string.slice(index) : '');
        if (limit < 0) {
          return chunks;
        } else {
          return chunks.slice(0, limit);
        }
      } else {
        return String.prototype.split.apply(__shift.call(arguments), arguments);
      }
    },
    trim: typeof String.prototype.trim === 'function' ? function(string) {
      return String.prototype.trim.call(string);
    } : function(string) {
      return string.replace(/^\s+|\s+$/g, '');
    },
    trimLeft: typeof String.prototype.trimLeft === 'function' ? function(string) {
      return String.prototype.trimLeft.call(string);
    } : function(string) {
      return string.replace(/^\s+/g, '');
    },
    trimRight: typeof String.prototype.trimRight === 'function' ? function(string) {
      return String.prototype.trimRight.call(string);
    } : function(string) {
      return string.replace(/\s+$/g, '');
    },
    pad: function(string, length, padding) {
      if (padding == null) {
        padding = ' ';
      }
      string = String(string);
      while (string.length < length) {
        string = (length - string.length & 1) === 0 ? padding + string : string + padding;
      }
      return string;
    },
    padLeft: function(string, length, padding) {
      if (padding == null) {
        padding = ' ';
      }
      string = String(string);
      while (string.length < length) {
        string = padding + string;
      }
      return string;
    },
    padRight: function(string, length, padding) {
      if (padding == null) {
        padding = ' ';
      }
      string = String(string);
      while (string.length < length) {
        string += padding;
      }
      return string;
    },
    repeat: function(string, times) {
      var str;
      str = '';
      while (times--) {
        str += string;
      }
      return str;
    },
    insert: function(string, index, insert) {
      return string.slice(0, index) + insert + string.slice(index);
    },
    reverse: function(string) {
      var i, str;
      i = string.length;
      str = '';
      while (i--) {
        str += string.charAt(i);
      }
      return str;
    }
  };
}).call(this);
}});
