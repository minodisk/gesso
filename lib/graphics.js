(function() {
  var AnimationFrameTicker, Bitmap, CapsStyle, Class, DisplayObject, Event, EventDispatcher, EventPhase, GradientType, Graphics, InteractiveObject, JointStyle, KeyboardEvent, Loader, Matrix, MouseEvent, Rectangle, Shape, Sprite, Stage, Stopwatch, TextField, TextFormat, TextFormatAlign, TextFormatBaseline, TextFormatFont, Timer, Vector, exports, _ELLIPSE_CUBIC_BEZIER_HANDLE, _PI, _PI_1_2, _PI_2, _RADIAN_PER_DEGREE, _SQRT2, _VERSION, _atan2, _cos, _instance, _internal, _max, _min, _requestAnimationFrame, _sin, _sqrt, _storage, _tan, __slice = Array.prototype.slice, __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _VERSION = "0.2.0";
  _PI = Math.PI;
  _SQRT2 = Math.SQRT2;
  _PI_1_2 = _PI / 2;
  _PI_2 = _PI * 2;
  _ELLIPSE_CUBIC_BEZIER_HANDLE = (_SQRT2 - 1) * 4 / 3;
  _RADIAN_PER_DEGREE = _PI / 180;
  _sin = Math.sin;
  _cos = Math.cos;
  _tan = Math.tan;
  _min = Math.min;
  _max = Math.max;
  _sqrt = Math.sqrt;
  _atan2 = Math.atan2;
  if (window.mn == null) window.mn = {};
  if (window.mn.dsk == null) window.mn.dsk = {};
  exports = window.mn.dsk;
  if (exports.core == null) exports.core = {};
  if (exports.display == null) exports.display = {};
  if (exports.events == null) exports.events = {};
  if (exports.geom == null) exports.geom = {};
  if (exports.text == null) exports.text = {};
  if (exports.timers == null) exports.timers = {};
  exports.core.Class = Class = function() {
    function Class() {}
    Class.prototype.defineProperty = function() {
      if (Object.defineProperty != null) {
        return function(prop, getter, setter) {
          var descriptor;
          descriptor = {};
          descriptor.get = getter != null ? getter : this._error("get", prop);
          descriptor.set = setter != null ? setter : this._error("set", prop);
          descriptor.enumerable = true;
          descriptor.configuable = false;
          return Object.defineProperty(this, prop, descriptor);
        };
      } else if (Object.prototype.__defineGetter__ != null && Object.prototype.__defineSetter__ != null) {
        return function(prop, getter, setter) {
          this.prototype.__defineGetter__(prop, getter != null ? getter : this._error("get", prop));
          return this.prototype.__defineSetter__(prop, setter != null ? setter : this._error("set", prop));
        };
      } else {
        throw new Error("Doesn't support 'getter/setter' properties.");
      }
    }();
    Class.prototype._error = function(method, prop) {
      return function(value) {
        throw new Error("Cannot " + method + " property '" + prop + "'.");
      };
    };
    return Class;
  }();
  exports.display.CapsStyle = CapsStyle = {
    NONE: "butt",
    BUTT: "butt",
    ROUND: "round",
    SQUARE: "square"
  };
  exports.display.GradientType = GradientType = {
    LINEAR: "linear",
    RADIAL: "radial"
  };
  exports.display.Graphics = Graphics = function() {
    Graphics.toColorString = function(color, alpha) {
      if (color == null) color = 0;
      if (alpha == null) alpha = 1;
      return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + (alpha < 0 ? 0 : alpha > 1 ? 1 : alpha) + ")";
    };
    function Graphics(_displayObject) {
      this._displayObject = _displayObject;
      this._context = this._displayObject._context;
      this._stacks = this._displayObject._stacks;
    }
    Graphics.prototype._requestRender = function() {
      this._displayObject._requestRender.apply(this._displayObject, arguments);
      return this;
    };
    Graphics.prototype._execStacks = function() {
      var drawingCounter, i, isDrawing, method, stack, _len, _ref;
      this._context.fillStyle = this._context.strokeStyle = "rgba(0,0,0,0)";
      this._context.translate(-this._displayObject._bounds.x, -this._displayObject._bounds.y);
      drawingCounter = 0;
      _ref = this._stacks;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        stack = _ref[i];
        method = stack.method;
        isDrawing = method.indexOf("draw") === 0;
        if (method === "moveTo" || method === "lineTo" || method === "quadraticCurveTo" || method === "cubicCurveTo" || isDrawing) {
          drawingCounter++;
        } else if (drawingCounter !== 0) {
          drawingCounter = 0;
          if (isDrawing) this._context.closePath();
          this._context.fill();
          this._context.stroke();
        }
        if (drawingCounter === 1) this._context.beginPath();
        this["_" + stack.method].apply(this, stack.arguments);
      }
      if (drawingCounter !== 0) {
        drawingCounter = 0;
        if (isDrawing) this._context.closePath();
        this._context.fill();
        this._context.stroke();
      }
      return this._context.setTransform(1, 0, 0, 1, 0, 0);
    };
    Graphics.prototype.clear = function() {
      while (this._stacks.length) {
        this._stacks.pop();
      }
      this._context.canvas.width = this._context.canvas.height = 0;
      return this._requestRender(true);
    };
    Graphics.prototype.lineStyle = function(thickness, color, alpha, capsStyle, jointStyle, miterLimit) {
      if (thickness == null) thickness = 1;
      if (color == null) color = 0;
      if (alpha == null) alpha = 1;
      if (capsStyle == null) capsStyle = CapsStyle.NONE;
      if (jointStyle == null) jointStyle = JointStyle.BEVEL;
      if (miterLimit == null) miterLimit = 10;
      this._stacks.push({
        method: "lineStyle",
        arguments: [ thickness, color, alpha, capsStyle, jointStyle, miterLimit ],
        delta: thickness
      });
      return this._requestRender(true);
    };
    Graphics.prototype._lineStyle = function(thickness, color, alpha, capsStyle, jointStyle, miterLimit) {
      this._context.lineWidth = thickness;
      this._context.strokeStyle = Graphics.toColorString(color, alpha);
      this._context.lineCaps = capsStyle;
      this._context.lineJoin = jointStyle;
      this._context.miterLimit = miterLimit;
    };
    Graphics.prototype.beginFill = function(color, alpha) {
      if (color == null) color = 0;
      if (alpha == null) alpha = 1;
      this._stacks.push({
        method: "beginFill",
        arguments: [ color, alpha ]
      });
      return this._requestRender(true);
    };
    Graphics.prototype._beginFill = function(color, alpha) {
      this._context.fillStyle = Graphics.toColorString(color, alpha);
    };
    Graphics.prototype.beginGradientFill = function(type, colors, alphas, ratios, matrix, focalPointRatio) {
      if (matrix == null) matrix = null;
      if (focalPointRatio == null) focalPointRatio = 0;
      this._stacks.push({
        method: "beginGradientFill",
        arguments: [ type, colors, alphas, ratios, matrix, focalPointRatio ]
      });
      return this._requestRender(true);
    };
    Graphics.prototype._beginGradientFill = function(type, colors, alphas, ratios, matrix, focalPointRatio) {
      var a, b, cB, cBL, cBR, cCenter, cDst, cL, cR, cSrc, cTL, dNormal, focalRadius, gradient, i, len, long, ratio, v0, v1, vCB, vCL, vNormal, vR, x1p, x2p, y1p, y2p, _len;
      len = ratios.length;
      if (colors.length !== len || alphas.length !== len) {
        throw new TypeError("Invalid length of colors, alphas or ratios.");
      }
      cTL = matrix.transformPoint(new Vector(-1638.4 / 2, -1638.4 / 2));
      cBR = matrix.transformPoint(new Vector(1638.4 / 2, 1638.4 / 2));
      cBL = matrix.transformPoint(new Vector(-1638.4 / 2, 1638.4 / 2));
      v1 = cBR.subtract(cTL).divide(2);
      cCenter = cTL.add(v1);
      switch (type) {
       case "linear":
        v0 = cBL.subtract(cTL);
        dNormal = v1.magnitude * Math.abs(Math.sin(v1.direction - v0.direction));
        v0.direction += Math.PI / 2;
        vNormal = v0.normalize(dNormal);
        cSrc = cCenter.add(vNormal);
        cDst = cCenter.subtract(vNormal);
        gradient = this._context.createLinearGradient(cSrc.x, cSrc.y, cDst.x, cDst.y);
        break;
       case "radial":
        cR = matrix.transformPoint(new Vector(1638.4 / 2, 0));
        vR = cR.subtract(cCenter);
        cL = cTL.add(cBL).divide(2);
        cB = cBR.add(cBL).divide(2);
        vCL = cL.subtract(cCenter);
        vCB = cB.subtract(cCenter);
        x1p = vCL.x * vCL.x;
        y1p = vCL.y * vCL.y;
        x2p = vCB.x * vCB.x;
        y2p = vCB.y * vCB.y;
        a = Math.sqrt((y1p * x2p - x1p * y2p) / (y1p - y2p));
        b = Math.sqrt((x1p * y2p - y1p * x2p) / (x1p - x2p));
        long = Math.max(a, b);
        focalRadius = long * focalPointRatio;
        gradient = this._context.createRadialGradient(cCenter.x, cCenter.y, long, cCenter.x + focalRadius * Math.cos(vR.direction), cCenter.y + focalRadius * Math.sin(vR.direction), 0);
        ratios = ratios.slice();
        ratios.reverse();
      }
      for (i = 0, _len = ratios.length; i < _len; i++) {
        ratio = ratios[i];
        gradient.addColorStop(ratio / 255, Graphics.toColorString(colors[i], alphas[i]));
      }
      return this._context.fillStyle = gradient;
    };
    Graphics.prototype.endFill = function(color, alpha) {
      if (color == null) color = 0;
      if (alpha == null) alpha = 1;
      this._stacks.push({
        method: "endFill",
        arguments: [ color, alpha ]
      });
      return this._requestRender(true);
    };
    Graphics.prototype._endFill = function(color, alpha) {};
    Graphics.prototype.moveTo = function(x, y) {
      this._stacks.push({
        method: "moveTo",
        arguments: [ x, y ],
        rect: new Rectangle(x, y, 0, 0)
      });
      return this._requestRender(true);
    };
    Graphics.prototype._moveTo = function(x, y) {
      this._context.moveTo(x, y);
    };
    Graphics.prototype.lineTo = function(x, y, thickness) {
      this._stacks.push({
        method: "lineTo",
        arguments: [ x, y ],
        rect: new Rectangle(x, y, 0, 0)
      });
      return this._requestRender(true);
    };
    Graphics.prototype._lineTo = function(x, y) {
      this._context.lineTo(x, y);
    };
    Graphics.prototype.drawPath = function(commands, data, clockwise) {
      var i, j, rect, _ref;
      if (clockwise == null) clockwise = 0;
      rect = new Rectangle(data[0], data[1], 0, 0);
      for (i = 1, _ref = data.length / 2; i < _ref; i += 1) {
        j = i * 2;
        rect.contain(data[j], data[j + 1]);
      }
      this._stacks.push({
        method: "drawPath",
        arguments: [ commands, data, clockwise ],
        rect: rect
      });
      return this._requestRender(true);
    };
    Graphics.prototype._drawPath = function(commands, data, clockwise) {
      var c, command, d, i, _i, _j, _len, _len2;
      if (clockwise < 0) {
        d = [];
        i = 0;
        for (_i = 0, _len = commands.length; _i < _len; _i++) {
          command = commands[_i];
          switch (command) {
           case 0:
           case 1:
            d.unshift(data[i++], data[i++]);
            break;
           case 2:
            i += 4;
            d.unshift(data[i - 2], data[i - 1], data[i - 4], data[i - 3]);
            break;
           case 3:
            i += 6;
            d.unshift(data[i - 2], data[i - 1], data[i - 4], data[i - 3], data[i - 6], data[i - 5]);
          }
        }
        data = d;
        commands = commands.slice();
        c = commands.shift();
        commands.reverse();
        commands.unshift(c);
      }
      i = 0;
      for (_j = 0, _len2 = commands.length; _j < _len2; _j++) {
        command = commands[_j];
        switch (command) {
         case 0:
          this._context.moveTo(data[i++], data[i++]);
          break;
         case 1:
          this._context.lineTo(data[i++], data[i++]);
          break;
         case 2:
          this._context.quadraticCurveTo(data[i++], data[i++], data[i++], data[i++]);
          break;
         case 3:
          this._context.bezierCurveTo(data[i++], data[i++], data[i++], data[i++], data[i++], data[i++]);
        }
      }
      if (data[0] === data[data.length - 2] && data[1] === data[data.length - 1]) {
        return this._context.closePath();
      }
    };
    Graphics.prototype.quadraticCurveTo = function(x1, y1, x2, y2) {
      this._stacks.push({
        method: "quadraticCurveTo",
        arguments: [ x1, y1, x2, y2 ],
        rect: (new Rectangle(x1, y1)).contain(x2, y2)
      });
      return this._requestRender(true);
    };
    Graphics.prototype.curveTo = Graphics.prototype.quadraticCurveTo;
    Graphics.prototype._quadraticCurveTo = function(x1, y1, x2, y2) {
      return this._context.quadraticCurveTo(x1, y1, x2, y2);
    };
    Graphics.prototype.cubicCurveTo = function(x1, y1, x2, y2, x3, y3) {
      this._stacks.push({
        method: "cubicCurveTo",
        arguments: [ x1, y1, x2, y2, x3, y3 ],
        rect: (new Rectangle(x1, y1)).contain(x2, y2).contain(x3, y3)
      });
      return this._requestRender(true);
    };
    Graphics.prototype.bezierCurveTo = Graphics.prototype.cubicCurveTo;
    Graphics.prototype._cubicCurveTo = function(x1, y1, x2, y2, x3, y3) {
      return this._context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    };
    Graphics.prototype.drawRectangle = function(rect, clockwise) {
      if (clockwise == null) clockwise = 0;
      return this.drawRect(rect.x, rect.y, rect.width, rect.height, clockwise);
    };
    Graphics.prototype.drawRect = function(x, y, width, height, clockwise) {
      var b, r;
      if (height == null) height = width;
      if (clockwise == null) clockwise = 0;
      r = x + width;
      b = y + height;
      return this.drawPath([ 0, 1, 1, 1, 1 ], [ x, y, r, y, r, b, x, b, x, y ], clockwise);
    };
    Graphics.prototype.drawRectangleWithoutPath = function(rect) {
      return this.drawRectWithoutPath(rect.x, rect.y, rect.width, rect.height);
    };
    Graphics.prototype.drawRectWithoutPath = function(x, y, width, height) {
      if (height == null) height = width;
      this._stacks.push({
        method: "drawRectWithoutPath",
        arguments: [ x, y, width, height ],
        rect: new Rectangle(x, y, width, height)
      });
      return this._requestRender(true);
    };
    Graphics.prototype._drawRectWithoutPath = function(x, y, width, height) {
      this._context.fillRect(x, y, width, height);
      return this._context.strokeRect(x, y, width, height);
    };
    Graphics.prototype.drawRoundRectangle = function(rect, ellipseW, ellipseH, clockwise) {
      if (ellipseH == null) ellipseH = ellipseW;
      if (clockwise == null) clockwise = 0;
      return this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH, clockwise);
    };
    Graphics.prototype.drawRoundRect = function(x, y, width, height, ellipseW, ellipseH, clockwise) {
      if (ellipseH == null) ellipseH = ellipseW;
      if (clockwise == null) clockwise = 0;
      return this.drawPath([ 0, 1, 2, 1, 2, 1, 2, 1, 2 ], [ x + ellipseW, y, x + width - ellipseW, y, x + width, y, x + width, y + ellipseH, x + width, y + height - ellipseH, x + width, y + height, x + width - ellipseW, y + height, x + ellipseW, y + height, x, y + height, x, y + height - ellipseH, x, y + ellipseH, x, y, x + ellipseW, y ], clockwise);
    };
    Graphics.prototype.drawCircle = function(x, y, radius, clockwise) {
      if (clockwise == null) clockwise = 0;
      this._stacks.push({
        method: "drawCircle",
        arguments: [ x, y, radius, clockwise ],
        rect: new Rectangle(x - radius, y - radius, radius * 2, radius * 2)
      });
      return this._requestRender(true);
    };
    Graphics.prototype._drawCircle = function(x, y, radius, clockwise) {
      this._context.moveTo(x + radius, y);
      this._context.arc(x, y, radius, 0, _PI_2, clockwise < 0);
    };
    Graphics.prototype.drawEllipse = function(x, y, width, height, clockwise) {
      var handleHeight, handleWidth;
      if (clockwise == null) clockwise = 0;
      width /= 2;
      height /= 2;
      x += width;
      y += height;
      handleWidth = width * _ELLIPSE_CUBIC_BEZIER_HANDLE;
      handleHeight = height * _ELLIPSE_CUBIC_BEZIER_HANDLE;
      return this.drawPath([ 0, 3, 3, 3, 3 ], [ x + width, y, x + width, y + handleHeight, x + handleWidth, y + height, x, y + height, x - handleWidth, y + height, x - width, y + handleHeight, x - width, y, x - width, y - handleHeight, x - handleWidth, y - height, x, y - height, x + handleWidth, y - height, x + width, y - handleHeight, x + width, y ], clockwise);
    };
    Graphics.prototype.drawRegularPolygon = function(x, y, radius, length, clockwise) {
      var commands, data, i, rotation, unitRotation;
      if (length == null) length = 3;
      if (clockwise == null) clockwise = 0;
      commands = [];
      data = [];
      unitRotation = _PI_2 / length;
      for (i = 0; 0 <= length ? i <= length : i >= length; 0 <= length ? i++ : i--) {
        commands.push(i === 0 ? 0 : 1);
        rotation = -_PI_1_2 + unitRotation * i;
        data.push(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
      }
      return this.drawPath(commands, data, clockwise);
    };
    Graphics.prototype.drawRegularStar = function(x, y, outer, length, clockwise) {
      var cos;
      if (length == null) length = 5;
      if (clockwise == null) clockwise = 0;
      cos = Math.cos(_PI / length);
      return this.drawStar(x, y, outer, outer * (2 * cos - 1 / cos), length, clockwise);
    };
    Graphics.prototype.drawStar = function(x, y, outer, inner, length, clockwise) {
      var commands, data, i, radius, rotation, unitRotation, _ref;
      if (length == null) length = 5;
      if (clockwise == null) clockwise = 0;
      commands = [];
      data = [];
      unitRotation = _PI / length;
      for (i = 0, _ref = length * 2; i <= _ref; i += 1) {
        commands.push(i === 0 ? 0 : 1);
        radius = (i & 1) === 0 ? outer : inner;
        rotation = -_PI_1_2 + unitRotation * i;
        data.push(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
      }
      return this.drawPath(commands, data, clockwise);
    };
    return Graphics;
  }();
  exports.display.JointStyle = JointStyle = {
    BEVEL: "bevel",
    MITER: "miter",
    ROUND: "round"
  };
  exports.events.Event = Event = function() {
    Event.ENTER_FRAME = "enterFrame";
    Event.COMPLETE = "complete";
    function Event(type, bubbles, cancelable) {
      var event;
      if (bubbles == null) bubbles = false;
      if (cancelable == null) cancelable = false;
      if (!(this instanceof Event)) return new Event(type, bubbles, cancelable);
      if (type instanceof Event) {
        event = type;
        type = event.type;
        bubbles = event.bubbles;
        cancelable = event.cancelable;
        this.currentTarget = event.currentTarget;
        this.target = event.target;
      }
      this.type = type;
      this.bubbles = bubbles;
      this.cancelable = cancelable;
      this._isPropagationStopped = false;
      this._isPropagationStoppedImmediately = false;
      this._isDefaultPrevented = false;
    }
    Event.prototype.formatToString = function() {
      var args, className;
      className = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return "";
    };
    Event.prototype.stopPropagation = function() {
      this._isPropagationStopped = true;
    };
    Event.prototype.stopImmediatePropagation = function() {
      this._isPropagationStopped = true;
      this._isPropagationStoppedImmediately = true;
    };
    Event.prototype.isDefaultPrevented = function() {
      return this._isDefaultPrevented;
    };
    Event.prototype.preventDefault = function() {
      this._isDefaultPrevented = true;
    };
    return Event;
  }();
  exports.events.EventPhase = EventPhase = {
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
  };
  exports.geom.Matrix = Matrix = function() {
    function Matrix(xx, xy, yx, yy, ox, oy) {
      this.xx = xx != null ? xx : 1;
      this.xy = xy != null ? xy : 0;
      this.yx = yx != null ? yx : 0;
      this.yy = yy != null ? yy : 1;
      this.ox = ox != null ? ox : 0;
      this.oy = oy != null ? oy : 0;
    }
    Matrix.prototype.identity = function() {
      this.xx = 1;
      this.xy = 0;
      this.yx = 0;
      this.yy = 1;
      this.ox = 0;
      return this.oy = 0;
    };
    Matrix.prototype.clone = function() {
      return new Matrix(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
    };
    Matrix.prototype.toString = function() {
      return "" + this.xx + " " + this.yx + " " + this.ox + "\n" + this.xy + " " + this.yy + " " + this.oy + "\n0 0 1";
    };
    Matrix.prototype.apply = function(matrix) {
      return this._apply(matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy);
    };
    Matrix.prototype._apply = function(xx, xy, yx, yy, ox, oy) {
      this.xx = xx;
      this.xy = xy;
      this.yx = yx;
      this.yy = yy;
      this.ox = ox;
      this.oy = oy;
      return this;
    };
    Matrix.prototype.setTo = function(context) {
      return context.setTransform(this.xx, this.xy, this.yx, this.yy, this.ox, this.oy);
    };
    Matrix.prototype.concat = function(matrix) {
      return this._concat(matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy);
    };
    Matrix.prototype._concat = function(xx, xy, yx, yy, ox, oy) {
      var _ox, _oy, _xx, _xy, _yx, _yy;
      _xx = this.xx;
      _xy = this.xy;
      _yx = this.yx;
      _yy = this.yy;
      _ox = this.ox;
      _oy = this.oy;
      this.xx = xx * _xx + yx * _xy;
      this.xy = xy * _xx + yy * _xy;
      this.yx = xx * _yx + yx * _yy;
      this.yy = xy * _yx + yy * _yy;
      this.ox = xx * _ox + yx * _oy + ox;
      this.oy = xy * _ox + yy * _oy + oy;
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
      return this._concat(c, s, -s, c, 0, 0);
    };
    Matrix.prototype.skew = function(skewX, skewY) {
      return this._concat(0, _tan(skewY), _tan(skewX), 0, 0, 0);
    };
    Matrix.prototype.invert = function() {
      var d, ox, oy, xx, xy, yx, yy;
      xx = this.xx;
      xy = this.xy;
      yx = this.yx;
      yy = this.yy;
      ox = this.ox;
      oy = this.oy;
      d = xx * yy - xy * yx;
      this.xx = yy / d;
      this.xy = -xy / d;
      this.yx = -yx / d;
      this.yy = xx / d;
      this.ox = (yx * oy - yy * ox) / d;
      this.oy = (xy * ox - xx * oy) / d;
      return this;
    };
    Matrix.prototype.transformPoint = function(pt) {
      return new Vector(this.xx * pt.x + this.yx * pt.y + this.ox, this.xy * pt.x + this.yy * pt.y + this.oy);
    };
    Matrix.prototype.deltaTransformPoint = function(pt) {
      return new Vector(this.xx * pt.x + this.yx * pt.y, this.xy * pt.x + this.yy * pt.y);
    };
    Matrix.prototype.createBox = function(scaleX, scaleY, rotation, tx, ty) {
      var c, s;
      if (rotation == null) rotation = 0;
      if (tx == null) tx = 0;
      if (ty == null) ty = 0;
      c = _cos(rotation);
      s = _sin(rotation);
      return this._concat(scaleX * c, scaleY * s, -scaleX * s, scaleY * c, tx, ty);
    };
    Matrix.prototype.createGradientBox = function(width, height, rotation, x, y) {
      if (rotation == null) rotation = 0;
      if (x == null) x = 0;
      if (y == null) y = 0;
      return this.createBox(width / 1638.4, height / 1638.4, rotation, x + width / 2, y + height / 2);
    };
    return Matrix;
  }();
  exports.geom.Rectangle = Rectangle = function() {
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
    Rectangle.prototype.apply = function(rect) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      return this;
    };
    Rectangle.prototype.contains = function(x, y) {
      return this.x < x && x < this.x + this.width && this.y < y && y < this.y + this.height;
    };
    Rectangle.prototype.containsPoint = function(point) {
      var _ref, _ref2;
      return this.x < (_ref = point.x) && _ref < this.x + this.width && this.y < (_ref2 = point.y) && _ref2 < this.y + this.height;
    };
    Rectangle.prototype.contain = function(x, y) {
      if (x < this.x) {
        this.width += this.x - x;
        this.x = x;
      } else if (x > this.x + this.width) {
        this.width = x - this.x;
      }
      if (y < this.y) {
        this.height += this.y - y;
        this.y = y;
      } else if (y > this.y + this.height) {
        this.height = y - this.y;
      }
      return this;
    };
    Rectangle.prototype.offset = function(dx, dy) {
      this.x += dx;
      this.y += dy;
      return this;
    };
    Rectangle.prototype.offsetPoint = function(pt) {
      this.x += pt.x;
      this.y += pt.y;
      return this;
    };
    Rectangle.prototype.inflate = function(dw, dh) {
      this.width += dw;
      this.height += dh;
      return this;
    };
    Rectangle.prototype.inflatePoint = function(pt) {
      this.width += pt.x;
      this.height += pt.y;
      return this;
    };
    Rectangle.prototype.deflate = function(dw, dh) {
      this.width -= dw;
      this.height -= dh;
      return this;
    };
    Rectangle.prototype.deflatePoint = function(pt) {
      this.width -= pt.x;
      this.height -= pt.y;
      return this;
    };
    Rectangle.prototype.union = function(rect) {
      var b, b1, b2, h, l, r, r1, r2, t, w;
      l = this.x < rect.x ? this.x : rect.x;
      r1 = this.x + this.width;
      r2 = rect.x + rect.width;
      r = r1 > r2 ? r1 : r2;
      w = r - l;
      t = this.y < rect.y ? this.y : rect.y;
      b1 = this.y + this.height;
      b2 = rect.y + rect.height;
      b = b1 > b2 ? b1 : b2;
      h = b - t;
      this.x = l;
      this.y = t;
      this.width = w < 0 ? 0 : w;
      this.height = h < 0 ? 0 : h;
      return this;
    };
    Rectangle.prototype.isEmpty = function() {
      return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
    };
    Rectangle.prototype.intersects = function(rect) {
      var b, h, l, r, t, w;
      l = _max(this.x, rect.x);
      r = _min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) return false;
      t = _max(this.y, rect.y);
      b = _min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) return false;
      return true;
    };
    Rectangle.prototype.intersection = function(rect) {
      var b, h, l, r, t, w;
      l = _max(this.x, rect.x);
      r = _min(this.x + this.width, rect.x + rect.width);
      w = r - l;
      if (w <= 0) return new Rectangle;
      t = _max(this.y, rect.y);
      b = _min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) return new Rectangle;
      return new Rectangle(l, t, w, h);
    };
    Rectangle.prototype.measureFarDistance = function(x, y) {
      var b, db, dl, dr, dt, l, min, r, t;
      l = this.x;
      r = this.x + this.width;
      t = this.y;
      b = this.y + this.height;
      dl = x - l;
      dr = x - r;
      dt = y - t;
      db = y - b;
      dl = dl * dl;
      dr = dr * dr;
      dt = dt * dt;
      db = db * db;
      min = _max(dl + dt, dr + dt, dr + db, dl + db);
      return _sqrt(min);
    };
    Rectangle.prototype.adjustOuter = function() {
      var x, y;
      x = Math.floor(this.x);
      y = Math.floor(this.y);
      if (x !== this.x) this.width++;
      if (y !== this.y) this.height++;
      this.x = x;
      this.y = y;
      this.width = Math.ceil(this.width);
      return this.height = Math.ceil(this.height);
    };
    Rectangle.prototype.transform = function(matrix) {
      var b, l, lb, lt, r, rb, rt, t;
      lt = new Matrix(1, 0, 0, 1, this.x, this.y);
      rt = new Matrix(1, 0, 0, 1, this.x + this.width, this.y);
      rb = new Matrix(1, 0, 0, 1, this.x + this.width, this.y + this.height);
      lb = new Matrix(1, 0, 0, 1, this.x, this.y + this.height);
      lt.concat(matrix);
      rt.concat(matrix);
      rb.concat(matrix);
      lb.concat(matrix);
      l = _min(lt.ox, rt.ox, rb.ox, lb.ox);
      r = _max(lt.ox, rt.ox, rb.ox, lb.ox);
      t = _min(lt.oy, rt.oy, rb.oy, lb.oy);
      b = _max(lt.oy, rt.oy, rb.oy, lb.oy);
      this.x = l;
      this.y = t;
      this.width = r - l;
      return this.height = b - t;
    };
    return Rectangle;
  }();
  exports.text.TextFormat = TextFormat = function() {
    function TextFormat(font, size, color, alpha, bold, italic, smallCaps, align, baseline, leading) {
      var textFormat;
      this.font = font != null ? font : TextFormatFont.SANS_SERIF;
      this.size = size != null ? size : 16;
      this.color = color != null ? color : 0;
      this.alpha = alpha != null ? alpha : 1;
      this.bold = bold != null ? bold : false;
      this.italic = italic != null ? italic : false;
      this.smallCaps = smallCaps != null ? smallCaps : false;
      this.align = align != null ? align : TextFormatAlign.START;
      this.baseline = baseline != null ? baseline : TextFormatBaseline.TOP;
      this.leading = leading != null ? leading : 0;
      if (this.font instanceof TextFormat) {
        textFormat = this.font;
        this.font = textFormat.font;
        this.size = textFormat.size;
        this.color = textFormat.color;
        this.alpha = textFormat.alpha;
        this.bold = textFormat.bold;
        this.italic = textFormat.italic;
        this.smallCaps = textFormat.smallCaps;
        this.align = textFormat.align;
        this.baseline = textFormat.baseline;
        this.leading = textFormat.leading;
      }
    }
    TextFormat.prototype.toStyleSheet = function() {
      var font, key, premitive, value;
      premitive = false;
      for (key in TextFormatFont) {
        value = TextFormatFont[key];
        if (!(value === this.font)) continue;
        premitive = true;
        break;
      }
      font = premitive ? this.font : "'" + this.font + "'";
      return "" + (this.italic ? "italic" : "normal") + " " + (this.smallCaps ? "small-caps" : "normal") + " " + (this.bold ? "bold" : "normal") + " " + this.size + "px " + font;
    };
    return TextFormat;
  }();
  exports.text.TextFormatAlign = TextFormatAlign = {
    START: "start",
    END: "end",
    LEFT: "left",
    RIGHT: "right",
    CENTER: "center"
  };
  exports.text.TextFormatBaseline = TextFormatBaseline = {
    TOP: "top",
    HANGING: "hanging",
    MIDDLE: "middle",
    ALPHABETIC: "alphabetic",
    IDEOGRAPHIC: "ideographic",
    BOTTOM: "bottom"
  };
  exports.timers.TextFormatFont = TextFormatFont = {
    SERIF: "serif",
    SANS_SERIF: "sans-serif",
    CURSIVE: "cursive",
    MONOSPACE: "monospace",
    FANTASY: "fantasy"
  };
  _requestAnimationFrame = function() {
    return this.requestAnimationFrame || this.webkitRequestAnimationFrame || this.mozRequestAnimationFrame || this.oRequestAnimationFrame || this.msRequestAnimationFrame || function(callback) {
      return setTimeout(function() {
        return callback((new Date).getTime());
      }, 1e3 / 60);
    };
  }();
  _instance = null;
  _internal = false;
  exports.text.AnimationFrameTicker = AnimationFrameTicker = function() {
    AnimationFrameTicker.getInstance = function() {
      if (_instance == null) {
        _internal = true;
        _instance = new AnimationFrameTicker;
      }
      return _instance;
    };
    function AnimationFrameTicker() {
      this._onAnimationFrame = __bind(this._onAnimationFrame, this);
      if (_internal === false) {
        throw new Error("Ticker is singleton model, call Ticker.getInstance().");
      }
      _internal = false;
      this._handlers = [];
      this._continuous = false;
      this._counter = 0;
    }
    AnimationFrameTicker.prototype.addHandler = function(handler) {
      this._handlers.push(handler);
      if (this._continuous === false) {
        this._continuous = true;
        _requestAnimationFrame(this._onAnimationFrame);
      }
    };
    AnimationFrameTicker.prototype.removeHandler = function(handler) {
      this._handlers.splice(this._handlers.indexOf(handler), 1);
      if (this._handlers.length === 0) this._continuous = false;
    };
    AnimationFrameTicker.prototype._onAnimationFrame = function(time) {
      var handler, _fn, _i, _len, _ref;
      this._counter++;
      _ref = this._handlers;
      _fn = function(handler) {
        return setTimeout(function() {
          return handler(time);
        }, 0);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _fn(handler);
      }
      if (this._continuous === true) {
        _requestAnimationFrame(this._onAnimationFrame);
      }
    };
    return AnimationFrameTicker;
  }();
  _storage = {};
  exports.timers.Stopwatch = Stopwatch = {
    start: function(name) {
      var date;
      if (name in _storage != null) {
        date = _storage[name];
      } else {
        date = _storage[name] = {};
        date.counter = 0;
        date.total = 0;
      }
      date._startAt = (new Date).getTime();
    },
    stop: function(name) {
      var date;
      date = _storage[name];
      if ((date != null ? date._startAt : void 0) != null) {
        date.counter++;
        date.total += (new Date).getTime() - date._startAt;
        date.average = date.total / date.counter;
        delete date._startAt;
      }
    },
    toObject: function(name) {
      return _clone(_storage[name]);
    },
    toString: function(name) {
      var max, rows;
      if (name == null) name = null;
      if (name != null) {
        return this._toString(name, 0);
      } else {
        max = "name".length;
        for (name in _storage) {
          max = Math.max(max, name.length);
        }
        rows = [];
        for (name in _storage) {
          rows.push(this._toString(name, max));
        }
        return rows.join("\n");
      }
    },
    _toString: function(name, max) {
      var date;
      date = _storage[name];
      return "" + _padRight(name, max, " ") + " : " + date.total + "(ms) / " + date.counter + " = " + date.average + "(ms)";
    }
  };
  exports.events.EventDispatcher = EventDispatcher = function(_super) {
    __extends(EventDispatcher, _super);
    function EventDispatcher() {
      this._events = {};
    }
    EventDispatcher.prototype.addEventListener = function(type, listener, useCapture, priority) {
      if (useCapture == null) useCapture = false;
      if (priority == null) priority = 0;
      if (typeof listener !== "function") {
        throw new TypeError("listener isn't function");
      }
      if (this._events[type] == null) this._events[type] = [];
      this._events[type].push({
        listener: listener,
        useCapture: useCapture,
        priority: priority
      });
      this._events[type].sort(this._sortOnPriorityInDescendingOrder);
      return this;
    };
    EventDispatcher.prototype._sortOnPriorityInDescendingOrder = function(a, b) {
      return b.priority - a.priority;
    };
    EventDispatcher.prototype.addListener = EventDispatcher.addEventListener;
    EventDispatcher.prototype.on = EventDispatcher.addEventListener;
    EventDispatcher.prototype.removeEventListener = function(type, listener) {
      var i, storage;
      if (storage = this._events[type]) {
        i = storage.length;
        while (i--) {
          if (storage[i].listener === listener) storage.splice(i, 1);
        }
        if (storage.length === 0) delete this._events[type];
      }
      return this;
    };
    EventDispatcher.prototype.dispatchEvent = function(event) {
      var i, obj, objs, _len;
      event.currentTarget = this;
      objs = this._events[event.type];
      if (objs != null) {
        for (i = 0, _len = objs.length; i < _len; i++) {
          obj = objs[i];
          if (obj.useCapture && event.eventPhase === EventPhase.CAPTURING_PHASE || obj.useCapture === false && event.eventPhase !== EventPhase.CAPTURING_PHASE) {
            (function(obj, event) {
              return setTimeout(function() {
                return obj.listener(event);
              }, 0);
            })(obj, event);
            if (event._isPropagationStoppedImmediately) break;
          }
        }
      }
      return !event._isDefaultPrevented;
    };
    EventDispatcher.prototype.emit = EventDispatcher.dispatchEvent;
    return EventDispatcher;
  }(Class);
  exports.events.KeyboardEvent = KeyboardEvent = function(_super) {
    __extends(KeyboardEvent, _super);
    function KeyboardEvent(type, bubbles, cancelable, charCodeValue, keyCodeValue, keyLocationValue, ctrlKeyValue, altKeyValue, shiftKeyValue, controlKeyValue, commandKeyValue) {
      this.type = type;
      this.bubbles = bubbles != null ? bubbles : false;
      this.cancelable = cancelable != null ? cancelable : false;
      if (charCodeValue == null) charCodeValue = 0;
      if (keyCodeValue == null) keyCodeValue = 0;
      if (keyLocationValue == null) keyLocationValue = 0;
      if (ctrlKeyValue == null) ctrlKeyValue = false;
      if (altKeyValue == null) altKeyValue = false;
      if (shiftKeyValue == null) shiftKeyValue = false;
      if (controlKeyValue == null) controlKeyValue = false;
      if (commandKeyValue == null) commandKeyValue = false;
      KeyboardEvent.__super__.constructor.call(this, "Event");
    }
    return KeyboardEvent;
  }(Event);
  exports.events.MouseEvent = MouseEvent = function(_super) {
    __extends(MouseEvent, _super);
    MouseEvent.CLICK = "click";
    MouseEvent.CONTEXT_MENU = "contextMenu";
    MouseEvent.DOUBLE_CLICK = "doubleClick";
    MouseEvent.MIDDLE_CLICK = "middleClick";
    MouseEvent.MIDDLE_MOUSE_DOWN = "middleMouseDown";
    MouseEvent.MIDDLE_MOUSE_UP = "middleMouseUp";
    MouseEvent.MOUSE_DOWN = "mouseDown";
    MouseEvent.MOUSE_MOVE = "mouseMove";
    MouseEvent.MOUSE_OUT = "mouseOut";
    MouseEvent.MOUSE_OVER = "mouseOver";
    MouseEvent.MOUSE_UP = "mouseUp";
    MouseEvent.MOUSE_WHEEL = "mouseWheel";
    MouseEvent.RIGHT_CLICK = "rightClick";
    MouseEvent.RIGHT_MOUSE_DOWN = "rightMouseDown";
    MouseEvent.RIGHT_MOUSE_UP = "rightMouseUp";
    MouseEvent.ROLL_OUT = "rollOut";
    MouseEvent.ROLL_OVER = "rollOver";
    function MouseEvent(type, bubbles, cancelable, localX, localY, relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta, commandKey, controlKey, clickCount) {
      var currentTarget, event, stageX, stageY, target;
      if (bubbles == null) bubbles = false;
      if (cancelable == null) cancelable = false;
      if (localX == null) localX = NaN;
      if (localY == null) localY = NaN;
      if (relatedObject == null) relatedObject = null;
      if (ctrlKey == null) ctrlKey = false;
      if (altKey == null) altKey = false;
      if (shiftKey == null) shiftKey = false;
      if (buttonDown == null) buttonDown = false;
      if (delta == null) delta = 0;
      if (commandKey == null) commandKey = false;
      if (controlKey == null) controlKey = false;
      if (clickCount == null) clickCount = 0;
      if (!(this instanceof MouseEvent)) {
        return new MouseEvent(type, bubbles, cancelable, localX, localY, relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta, commandKey, controlKey, clickCount);
      }
      if (type instanceof MouseEvent) {
        event = type;
        type = event.type;
        bubbles = event.bubbles;
        cancelable = event.cancelable;
        localX = event.localX;
        localY = event.localY;
        relatedObject = event.relatedObject;
        ctrlKey = event.ctrlKey;
        altKey = event.altKey;
        shiftKey = event.shiftKey;
        buttonDown = event.buttonDown;
        delta = event.delta;
        commandKey = event.commandKey;
        controlKey = event.controlKey;
        clickCount = event.clickCount;
        currentTarget = event.currentTarget;
        target = event.target;
        stageX = event.stageX;
        stageY = event.stageY;
      }
      MouseEvent.__super__.constructor.call(this, type, bubbles, cancelable);
      this.localX = localX;
      this.localY = localY;
      this.relatedObject = relatedObject;
      this.ctrlKey = ctrlKey;
      this.altKey = altKey;
      this.shiftKey = shiftKey;
      this.buttonDown = buttonDown;
      this.delta = delta;
      this.commandKey = commandKey;
      this.controlKey = controlKey;
      this.clickCount = clickCount;
      this.currentTarget = currentTarget;
      this.target = target;
      this.stageX = stageX;
      this.stageY = stageY;
    }
    return MouseEvent;
  }(Event);
  exports.geom.Vector = Vector = function(_super) {
    __extends(Vector, _super);
    Vector.crossProduct = function(a, b) {
      return a.distance * b.distance * _sin(b.angle - a.angle);
    };
    Vector.dotProduct = function(a, b) {};
    Vector.distance = function(a, b) {
      var x, y;
      x = a.x - b.x;
      y = a.y - b.y;
      return _sqrt(x * x + y * y);
    };
    Vector.between = function(src, dst, ratio) {
      if (ratio == null) ratio = .5;
      return new Vector(src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio);
    };
    function Vector(x, y) {
      var src;
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      if (this.x instanceof Vector) {
        src = this.x;
        this.x = src.x;
        this.y = src.y;
      }
      this.defineProperty("direction", function() {
        return _atan2(this.y, this.x);
      }, function(direction) {
        var magnitude;
        magnitude = _sqrt(this.x * this.x + this.y * this.y);
        this.x = magnitude * _cos(direction);
        this.y = magnitude * _sin(direction);
      });
      this.defineProperty("magnitude", function() {
        return _sqrt(this.x * this.x + this.y * this.y);
      }, function(magnitude) {
        var ratio;
        ratio = magnitude / _sqrt(this.x * this.x + this.y * this.y);
        this.x *= ratio;
        this.y *= ratio;
      });
    }
    Vector.prototype.add = function(b) {
      return new Vector(this.x + b.x, this.y + b.y);
    };
    Vector.prototype.subtract = function(b) {
      return new Vector(this.x - b.x, this.y - b.y);
    };
    Vector.prototype.divide = function(b) {
      return new Vector(this.x / b, this.y / b);
    };
    Vector.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };
    Vector.prototype.equals = function(pt) {
      return this.x === pt.x && this.y === pt.y;
    };
    Vector.prototype.normalize = function(thickness) {
      var ratio;
      if (thickness == null) thickness = 1;
      ratio = thickness / _sqrt(this.x * this.x + this.y * this.y);
      this.x *= ratio;
      this.y *= ratio;
      return this;
    };
    return Vector;
  }(Class);
  exports.display.DisplayObject = DisplayObject = function(_super) {
    __extends(DisplayObject, _super);
    DisplayObject.prototype._getWidth = function() {
      this._measureSize();
      return this._width;
    };
    DisplayObject.prototype._setWidth = function(value) {
      this._width = value;
      if (this._context.canvas.width !== 0) {
        this._scaleX = value / this._context.canvas.width;
      }
      this._requestRender(false);
    };
    DisplayObject.prototype._getHeight = function() {
      this._measureSize();
      return this._height;
    };
    DisplayObject.prototype._setHeight = function(value) {
      this._height = value;
      if (this._context.canvas.height !== 0) {
        this._scaleY = value / this._context.canvas.height;
      }
      this._requestRender(false);
    };
    function DisplayObject() {
      DisplayObject.__super__.constructor.call(this);
      this.defineProperty("VERSION", function() {
        return _VERSION;
      });
      this.defineProperty("stage", function() {
        return this.__stage;
      }, null);
      this.defineProperty("_stage", null, function(value) {
        var child, _i, _len, _ref;
        if (this._children != null) {
          _ref = this._children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            child._stage = value;
          }
        }
        this.__stage = value;
      });
      this.defineProperty("parent", function() {
        return this._parent;
      });
      this.defineProperty("x", function() {
        return this._x;
      }, function(value) {
        this._x = value;
        this._requestRender(false);
      });
      this.defineProperty("y", function() {
        return this._y;
      }, function(value) {
        this._y = value;
        this._requestRender(false);
      });
      this.defineProperty("alpha", function() {
        return this._alpha;
      }, function(value) {
        this._alpha = value;
        this._requestRender(false);
      });
      this.defineProperty("rotation", function() {
        return this._rotation;
      }, function(value) {
        this._rotation = value;
        this._requestRender(false);
      });
      this.defineProperty("width", this._getWidth, this._setWidth);
      this.defineProperty("height", this._getHeight, this._setHeight);
      this.defineProperty("scaleX", function() {
        return this._scaleX;
      }, function(value) {
        this._scaleX = value;
        this._width = this._context.canvas.width * value;
        this._requestRender(false);
      });
      this.defineProperty("scaleY", function() {
        return this._scaleY;
      }, function(value) {
        this._scaleY = value;
        this._height = this._context.canvas.height * value;
        this._requestRender(false);
      });
      this.defineProperty("matrix", function() {
        return this._matrix;
      }, function(matrix) {
        this._matrix = matrix;
        this._requestRender(false);
      });
      this.__stage = null;
      this._parent = null;
      this._x = 0;
      this._y = 0;
      this._width = 0;
      this._height = 0;
      this._scaleX = 1;
      this._scaleY = 1;
      this._rotation = 0;
      this._alpha = 1;
      this._matrix = new Matrix;
      this.filters = [];
      this._context = document.createElement("canvas").getContext("2d");
      this._context.canvas.width = this._context.canvas.height = 0;
      this._stacks = [];
      this._drawn = false;
      this._measured = false;
    }
    DisplayObject.prototype._getTransform = function() {
      return this._matrix.clone().createBox(this._scaleX, this._scaleY, this._rotation * _RADIAN_PER_DEGREE, this._x, this._y);
    };
    DisplayObject.prototype.set = function(propertyName, value) {
      this[propertyName] = value;
      return this;
    };
    DisplayObject.prototype.addTo = function(parent) {
      if (!(parent instanceof Sprite)) {
        throw new TypeError("parent " + parent + " isn't display object container");
      }
      parent.addChild(this);
      return this;
    };
    DisplayObject.prototype._requestRender = function(drawn) {
      if (drawn == null) drawn = false;
      this._drawn |= drawn;
      this._measured = false;
      if (this._parent != null) this._parent._requestRender(true);
      return this;
    };
    DisplayObject.prototype._render = function() {
      var _ref;
      if (this._drawn) {
        this._drawn = false;
        this._measureSize();
        this._applySize();
        this._execStacks();
        this._applyFilters();
        if ((_ref = this.__stage) != null ? _ref.debug : void 0) {
          return this._drawBounds();
        }
      }
    };
    DisplayObject.prototype._measureSize = function() {
      var b, bounds, delta, rect, stack, _i, _len, _ref;
      if (!this._measured) {
        delta = 0;
        _ref = this._stacks;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stack = _ref[_i];
          if (stack.delta != null) delta = stack.delta;
          if (stack.rect != null) {
            if (typeof rect === "undefined" || rect === null) {
              rect = stack.rect.clone();
            } else {
              rect.union(stack.rect);
            }
            b = stack.rect.clone();
            b.offset(-delta / 2, -delta / 2);
            b.inflate(delta, delta);
            if (typeof bounds === "undefined" || bounds === null) {
              bounds = b;
            } else {
              bounds.union(b);
            }
          }
        }
        if (rect == null) rect = new Rectangle;
        if (bounds == null) {
          bounds = new Rectangle;
        } else {
          bounds.adjustOuter();
        }
        this._width = rect.width;
        this._height = rect.height;
        this._rect = rect;
        this._bounds = bounds;
        this._measured = true;
      }
    };
    DisplayObject.prototype._applySize = function() {
      this._context.canvas.width = this._bounds.width;
      return this._context.canvas.height = this._bounds.height;
    };
    DisplayObject.prototype._execStacks = function() {
      var stack, _i, _len, _ref;
      this._context.translate(-this._bounds.x, -this._bounds.y);
      _ref = this._stacks;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stack = _ref[_i];
        this["_" + stack.method].apply(this, stack.arguments);
      }
      this._context.setTransform(1, 0, 0, 1, 0, 0);
    };
    DisplayObject.prototype._applyFilters = function() {
      var filter, imageData, newImageData, _i, _len, _ref;
      if (this.filters.length > 0) {
        imageData = this._context.getImageData(0, 0, this._bounds.width, this._bounds.height);
        newImageData = this._context.createImageData(this._bounds.width, this._bounds.height);
        _ref = this.filters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          filter = _ref[_i];
          filter.scan(imageData, newImageData);
        }
        this._context.putImageData(newImageData, 0, 0);
      }
    };
    DisplayObject.prototype._drawBounds = function() {
      this._context.strokeStyle = "rgb(255, 0, 0)";
      this._context.lineWidth = 2;
      this._context.strokeRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    };
    DisplayObject.prototype.hitTest = function(x, y) {
      var local, pt;
      if (x instanceof Vector) {
        pt = x;
        x = pt.x;
        y = pt.y;
      }
      local = this.globalToLocal(x, y);
      return this._hitTest(local.x, local.y);
    };
    DisplayObject.prototype._hitTest = function(localX, localY) {
      if (this._bounds != null) {
        return this._context.isPointInPath(localX - this._bounds.x, localY - this._bounds.y);
      }
    };
    DisplayObject.prototype.getPixel32 = function(x, y) {
      var data, iData;
      iData = this._context.getImageData(x, y, 1, 1);
      data = iData.data;
      return data[3] << 24 | data[2] << 16 | data[1] << 8 | data[0];
    };
    DisplayObject.prototype.globalToLocalPoint = function(point) {
      return this.globalToLocal(point.x, point.y);
    };
    DisplayObject.prototype.globalToLocal = function(x, y) {
      var displayObject;
      displayObject = this;
      while (displayObject) {
        x -= displayObject.x;
        y -= displayObject.y;
        displayObject = displayObject._parent;
      }
      return new Vector(x, y);
    };
    return DisplayObject;
  }(EventDispatcher);
  exports.timers.Timer = Timer = function(_super) {
    __extends(Timer, _super);
    Timer.prototype.__defineGetter__("delay", function() {
      return this._delay;
    });
    Timer.prototype.__defineSetter__("delay", function(delay) {
      var running;
      running = this._running;
      this.stop();
      this._delay = delay;
      if (running) return this.start();
    });
    Timer.prototype.__defineGetter__("repeatCount", function() {
      return this._repeatCount;
    });
    Timer.prototype.__defineSetter__("repeatCount", function(repeatCount) {
      this._repeatCount = repeatCount;
      if (this._repeatCount !== 0 && this._currentCount >= this._repeatCount) {
        return this.stop();
      }
    });
    Timer.prototype.__defineGetter__("currentCount", function() {
      return this._currentCount;
    });
    Timer.prototype.__defineGetter__("running", function() {
      return this._running;
    });
    function Timer(delay, repeatCount) {
      if (repeatCount == null) repeatCount = 0;
      this._onInterval = __bind(this._onInterval, this);
      this.delay = Number(delay);
      this.reset();
    }
    Timer.prototype.reset = function() {
      this.stop();
      this._currentCount = 0;
    };
    Timer.prototype.start = function() {
      if (this._running !== true && (this._repeatCount === 0 || this._currentCount < this._repeatCount)) {
        if (this._intervalId != null) _clearInterval(this._intervalId);
        this._running = true;
        this._intervalId = setInterval(this._onInterval, this._delay);
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
      this.dispatchEvent("timer");
      if (this._repeatCount !== 0 && ++this._currentCount >= this._repeatCount) {
        this.stop();
        this.dispatchEvent("timerComplete");
      }
    };
    return Timer;
  }(EventDispatcher);
  exports.display.Bitmap = Bitmap = function(_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
      Bitmap.__super__.constructor.call(this, "Bitmap");
    }
    Bitmap.prototype.draw = function(data, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      if (data instanceof DisplayObject) data = data._context.canvas;
      if (data instanceof Image || data instanceof HTMLImageElement || data instanceof HTMLCanvasElement || data instanceof HTMLVideoElement) {
        this.drawImage(data, x, y);
        return;
      }
      if (data instanceof ImageData) {
        this.drawImageData(data, x, y);
        return;
      }
      throw new TypeError("data isn't drawable object");
    };
    Bitmap.prototype.drawImage = function(image, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
      this._stacks.push({
        method: "drawImage",
        arguments: [ image, x, y ],
        rect: new Rectangle(x, y, image.width, image.height)
      });
      return this._requestRender(true);
    };
    Bitmap.prototype._drawImage = function(image, x, y) {
      this._context.drawImage(image, x, y, image.width, image.height);
    };
    Bitmap.prototype.drawImageData = function(imageData, x, y) {
      if (x == null) x = 0;
      if (y == null) y = 0;
    };
    Bitmap.prototype.applyFilter = function(srcBitmap, srcRect, dstPoint, filter) {};
    return Bitmap;
  }(DisplayObject);
  exports.display.InteractiveObject = InteractiveObject = function(_super) {
    __extends(InteractiveObject, _super);
    function InteractiveObject() {
      this._drag = __bind(this._drag, this);
      InteractiveObject.__super__.constructor.call(this);
    }
    InteractiveObject.prototype._propagateMouseEvent = function(event) {
      var child, e, hit, i, pt;
      if (this._mouseEnabled && event._isPropagationStopped === false) {
        event = new MouseEvent(event);
        pt = this._getTransform().invert().transformPoint(new Vector(event.localX, event.localY));
        event.localX = pt.x;
        event.localY = pt.y;
        hit = this._hitTest(event.localX, event.localY);
        if (hit === true && this._mouseIn === false) {
          e = new MouseEvent(event);
          e.type = MouseEvent.MOUSE_OVER;
          this._targetMouseEvent(e);
          e = new MouseEvent(event);
          e.type = MouseEvent.ROLL_OVER;
          e.bubbles = false;
          this._targetMouseEvent(e);
          this._mouseIn = true;
          if (this._buttonMode) this.__stage._canvas.style.cursor = "pointer";
        } else if (hit === false && this._mouseIn === true) {
          e = new MouseEvent(event);
          e.type = MouseEvent.MOUSE_OUT;
          this._targetMouseEvent(e);
          e = new MouseEvent(event);
          e.type = MouseEvent.ROLL_OUT;
          e.bubbles = false;
          this._targetMouseEvent(e);
          this._mouseIn = false;
          if (this !== this.__stage) this.__stage._canvas.style.cursor = "default";
        }
        if (this._mouseChildren) {
          i = this._children.length;
          while (i--) {
            child = this._children[i];
            if (child._propagateMouseEvent != null) {
              e = child._propagateMouseEvent(event);
              if (e != null) {
                this._captureMouseEvent(e);
                return;
              }
            }
            if (typeof child._hitTest === "function" ? child._hitTest(event.localX - child.x, event.localY - child.y) : void 0) {
              hit = true;
            }
          }
        }
        if (hit) return this._targetMouseEvent(event);
      }
    };
    InteractiveObject.prototype._captureMouseEvent = function(event) {
      event = new MouseEvent(event);
      event.eventPhase = EventPhase.CAPTURING_PHASE;
      event.currentTarget = this;
      this.dispatchEvent(event);
      return event;
    };
    InteractiveObject.prototype._targetMouseEvent = function(event) {
      var _ref;
      event = new MouseEvent(event);
      event.eventPhase = EventPhase.AT_TARGET;
      event.target = event.currentTarget = this;
      this.dispatchEvent(event);
      if (event.bubbles) {
        if ((_ref = this._parent) != null) _ref._bubbleMouseEvent(event);
      }
      return event;
    };
    InteractiveObject.prototype._bubbleMouseEvent = function(event) {
      var _ref;
      event = new MouseEvent(event);
      event.eventPhase = EventPhase.BUBBLING_PHASE;
      event.currentTarget = this;
      this.dispatchEvent(event);
      if ((_ref = this._parent) != null) _ref._bubbleMouseEvent(event);
      return event;
    };
    InteractiveObject.prototype.startDrag = function(lockCenter) {
      if (lockCenter == null) lockCenter = false;
      return this.__stage.addEventListener(MouseEvent.MOUSE_MOVE, this._drag);
    };
    InteractiveObject.prototype._drag = function(e) {
      this.x = e.stageX;
      return this.y = e.stageY;
    };
    InteractiveObject.prototype.stopDrag = function() {
      return this.__stage.removeEventListener(MouseEvent.MOUSE_MOVE, this._drag);
    };
    return InteractiveObject;
  }(DisplayObject);
  exports.display.Shape = Shape = function(_super) {
    __extends(Shape, _super);
    function Shape() {
      Shape.__super__.constructor.call(this);
      this.graphics = new Graphics(this);
    }
    Shape.prototype._execStacks = function() {
      this.graphics._execStacks();
    };
    Shape.prototype.clip = function() {
      this._stacks.push({
        method: "clip",
        arguments: ArrayUtil.toArray(arguments)
      });
      return this._requestRender(true);
    };
    Shape.prototype._clip = function() {
      this._context.clip();
    };
    return Shape;
  }(DisplayObject);
  exports.display.Sprite = Sprite = function(_super) {
    __extends(Sprite, _super);
    function Sprite() {
      Sprite.__super__.constructor.call(this);
      this.defineProperty("mouseEnabled", function() {
        return this._mouseEnabled;
      }, function(value) {
        return this._mouseEnabled = value;
      });
      this.defineProperty("mouseChildren", function() {
        return this._mouseChildren;
      }, function(value) {
        return this._mouseChildren = value;
      });
      this.defineProperty("buttonMode", function() {
        return this._buttonMode;
      }, function(value) {
        return this._buttonMode = value;
      });
      this.graphics = new Graphics(this);
      this._children = [];
      this._mouseEnabled = true;
      this._mouseChildren = true;
      this._buttonMode = false;
      this._mouseIn = false;
    }
    Sprite.prototype.addChild = function(child) {
      if (!(child instanceof DisplayObject)) {
        throw new TypeError("Child must be specified in DisplayObject.");
      }
      child._stage = this.__stage;
      child._parent = this;
      this._children.push(child);
      return this._requestRender(true);
    };
    Sprite.prototype.addChildAt = function(child, index) {
      if (!(child instanceof DisplayObject)) {
        throw new TypeError("Child must be specified in DisplayObject.");
      }
      if (index < 0 || index > this._children.length) {
        throw new TypeError("Index is out of range.");
      }
      this._children.splice(index, 0, child);
      return this._requestRender(true);
    };
    Sprite.prototype.removeChild = function() {
      var child, children, index, _i, _len;
      children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        index = this._children.indexOf(child);
        if (index !== -1) this._children.splice(index, 1);
      }
      return this._requestRender(true);
    };
    Sprite.prototype._render = function() {
      var _ref;
      if (this._drawn) {
        this._drawn = false;
        this._measureSize();
        this._applySize();
        this._execStacks();
        this._drawChildren();
        this._applyFilters();
        if ((_ref = this.__stage) != null ? _ref.debug : void 0) {
          return this._drawBounds();
        }
      }
    };
    Sprite.prototype._measureSize = function() {
      var b, bounds, child, rect, x, y, _i, _len, _ref;
      Sprite.__super__._measureSize.call(this);
      rect = this._rect;
      bounds = this._bounds;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child._render();
        rect.union(child._rect);
        b = child._bounds.clone();
        b.transform(child._getTransform());
        bounds.union(b);
      }
      x = Math.floor(bounds.x);
      if (x !== bounds.x) bounds.width++;
      y = Math.floor(bounds.y);
      if (y !== bounds.y) bounds.height++;
      bounds.x = x;
      bounds.y = y;
      bounds.width = Math.ceil(bounds.width);
      bounds.height = Math.ceil(bounds.height);
      this._width = rect.width;
      this._height = rect.height;
    };
    Sprite.prototype._execStacks = function() {
      this.graphics._execStacks();
    };
    Sprite.prototype._drawChildren = function() {
      var child, matrix, _i, _len, _ref;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child._bounds != null && child._bounds.width > 0 && child._bounds.height > 0) {
          if (isNaN(child.x || isNaN(child._bounds.x || isNaN(child.y || isNaN(child._bounds.y))))) {
            throw new Error("invalid position");
          }
          matrix = new Matrix(1, 0, 0, 1, this._bounds.x, this._bounds.y);
          matrix.concat(child._getTransform());
          matrix.translate(-this._bounds.x, -this._bounds.y);
          matrix.setTo(this._context);
          this._context.globalAlpha = child._alpha < 0 ? 0 : child._alpha > 1 ? 1 : child._alpha;
          this._context.drawImage(child._context.canvas, child._bounds.x - this._bounds.x, child._bounds.y - this._bounds.y);
          this._context.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    };
    return Sprite;
  }(InteractiveObject);
  exports.text.TextField = TextField = function(_super) {
    __extends(TextField, _super);
    function TextField(text, textFormat) {
      if (text == null) text = "";
      if (textFormat == null) textFormat = new TextFormat;
      TextField.__super__.constructor.call(this);
      this.defineProperty("text", function() {
        return this._texts.join("\n");
      }, function(text) {
        this._texts = this._stacks[0].arguments[0] = text.split(/\r?\n/);
        return this._requestRender(true);
      });
      this.defineProperty("textFormat", function() {
        return this._textFormat;
      }, function(textFormat) {
        this._textFormat = this._stacks[0].arguments[1] = textFormat;
        return this._requestRender(true);
      });
      this.defineProperty("maxWidth", function() {
        return this._maxWidth;
      }, function(maxWidth) {
        this._maxWidth = this._stacks[0].arguments[2] = value;
        return this._requestRender(true);
      });
      this._stacks.push({
        method: "drawText",
        arguments: []
      });
      this.text = text;
      this.textFormat = textFormat;
    }
    TextField.prototype._measureSize = function() {
      var bounds, rect, text, _i, _len, _ref;
      if (this._texts != null && this._textFormat != null) {
        rect = new Rectangle;
        this._context.font = this._textFormat.toStyleSheet();
        _ref = this._texts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          text = _ref[_i];
          rect.width = Math.max(rect.width, this._context.measureText(text).width);
          rect.height += this._textFormat.size * 1.2 + this._textFormat.leading;
        }
        this._width = rect.width;
        this._height = rect.height;
        this._rect = rect;
        bounds = rect.clone();
        bounds.x = -bounds.width;
        bounds.width *= 2;
        bounds.y = -bounds.height;
        bounds.height *= 2;
        this._bounds = bounds;
      }
    };
    TextField.prototype._drawText = function(texts, textFormat) {
      var i, lineHeight, text, _len, _ref;
      this._context.font = textFormat.toStyleSheet();
      this._context.textAlign = textFormat.align;
      this._context.textBaseline = textFormat.baseline;
      this._context.fillStyle = Graphics.toColorString(textFormat.color, textFormat.alpha);
      lineHeight = textFormat.size + textFormat.leading;
      _ref = this._texts;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        text = _ref[i];
        this._context.fillText(text, 0, lineHeight * i);
      }
    };
    return TextField;
  }(InteractiveObject);
  exports.display.Loader = Loader = function(_super) {
    __extends(Loader, _super);
    function Loader() {
      Loader.__super__.constructor.call(this);
    }
    Loader.prototype.load = function(url) {
      var img, _this = this;
      img = new Image;
      img.src = url;
      return img.addEventListener("load", function(e) {
        var bitmap;
        bitmap = new Bitmap;
        bitmap.draw(img);
        _this.content = bitmap;
        _this.addChild(_this.content);
        return _this.dispatchEvent(new Event(Event.COMPLETE));
      });
    };
    return Loader;
  }(Sprite);
  exports.display.Stage = Stage = function(_super) {
    __extends(Stage, _super);
    Stage.prototype._getWidth = function() {
      return this._width;
    };
    Stage.prototype._getHeight = function() {
      return this._height;
    };
    function Stage(canvasOrWidth, height) {
      var canvas;
      if (height == null) height = null;
      this._onMouseWheel = __bind(this._onMouseWheel, this);
      this._onMouseMove = __bind(this._onMouseMove, this);
      this._onMouseUp = __bind(this._onMouseUp, this);
      this._onMouseDown = __bind(this._onMouseDown, this);
      this._onClick = __bind(this._onClick, this);
      this._enterFrame = __bind(this._enterFrame, this);
      Stage.__super__.constructor.call(this);
      this.defineProperty("frameRate", function() {
        return this._frameRate;
      });
      if (canvasOrWidth instanceof HTMLCanvasElement) {
        canvas = canvasOrWidth;
        this._width = canvas.width;
        this._height = canvas.height;
      } else if (notisNaN(Number(canvasOrWidth)) && notisNaN(Number(height))) {
        canvas = document.createElement("canvas");
        this._width = canvas.width = canvasOrWidth;
        this._height = canvas.height = height;
      } else {
        throw new TypeError("");
      }
      this._canvas = canvas;
      this.__stage = this;
      this._context = canvas.getContext("2d");
      this._bounds = new Rectangle(0, 0, canvas.width, canvas.height);
      this.overrideMouseWheel = false;
      this._startTime = this._time = (new Date).getTime();
      this.currentFrame = 0;
      this._frameRate = 60;
      AnimationFrameTicker.getInstance().addHandler(this._enterFrame);
      canvas.addEventListener("click", this._onClick, false);
      canvas.addEventListener("mousedown", this._onMouseDown, false);
      canvas.addEventListener("mouseup", this._onMouseUp, false);
      canvas.addEventListener("mousemove", this._onMouseMove, false);
      canvas.addEventListener("mousewheel", this._onMouseWheel, false);
    }
    Stage.prototype.getTimer = function() {
      return (new Date).getTime() - this._startTime;
    };
    Stage.prototype._enterFrame = function(time) {
      this.currentFrame++;
      if (this.currentFrame % 30 === 0) {
        this._frameRate = (3e5 / (time - this._time) >> 0) / 10;
        this._time = time;
      }
      this.dispatchEvent(new Event(Event.ENTER_FRAME));
      if (this._drawn) {
        this._drawn = false;
        this._render();
      }
    };
    Stage.prototype._render = function() {
      var child, _i, _len, _ref;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child._render();
      }
      this._context.canvas.width = this._width;
      this._drawChildren();
    };
    Stage.prototype._hitTest = function(localX, localY) {
      return true;
    };
    Stage.prototype._requestRender = function() {
      this._drawn = true;
    };
    Stage.prototype._onClick = function(e) {
      var event;
      e.preventDefault();
      event = new MouseEvent(MouseEvent.CLICK, true);
      this._setMousePosition(event, e);
      return this._propagateMouseEvent(event);
    };
    Stage.prototype._onMouseDown = function(e) {
      var event;
      e.preventDefault();
      event = new MouseEvent(MouseEvent.MOUSE_DOWN, true);
      this._setMousePosition(event, e);
      return this._propagateMouseEvent(event);
    };
    Stage.prototype._onMouseUp = function(e) {
      var event;
      e.preventDefault();
      event = new MouseEvent(MouseEvent.MOUSE_UP, true);
      this._setMousePosition(event, e);
      return this._propagateMouseEvent(event);
    };
    Stage.prototype._onMouseMove = function(e) {
      var event;
      e.preventDefault();
      event = new MouseEvent(MouseEvent.MOUSE_MOVE, true);
      this._setMousePosition(event, e);
      return this._propagateMouseEvent(event);
    };
    Stage.prototype._onMouseWheel = function(e) {
      var event;
      if (this.overrideMouseWheel) e.preventDefault();
      event = new MouseEvent(MouseEvent.MOUSE_WHEEL, true);
      this._setMousePosition(event, e);
      return this._propagateMouseEvent(event);
    };
    Stage.prototype._setMousePosition = function(event, nativeEvent) {
      event.stageX = event.localX = nativeEvent.offsetX != null ? nativeEvent.offsetX : nativeEvent.pageX - this._canvas.offsetLeft;
      event.stageY = event.localY = nativeEvent.offsetY != null ? nativeEvent.offsetY : nativeEvent.pageY - this._canvas.offsetTop;
      return event.delta = nativeEvent.wheelDelta != null ? nativeEvent.wheelDelta : nativeEvent.detail != null ? nativeEvent.detail : 0;
    };
    return Stage;
  }(Sprite);
}).call(this);