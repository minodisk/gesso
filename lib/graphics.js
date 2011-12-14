
(function () {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __slice = Array.prototype.slice;
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
}).call(this)({"3d/core/Camera": function(exports, require, module) {(function() {
  var Camera, Class, EulerAngles, Matrix, Vector, atan, tan;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Class = require('core/Klass');

  EulerAngles = require('3d/geom/EulerAngles');

  Matrix = require('3d/geom/Matrix');

  Vector = require('3d/geom/Vector');

  tan = Math.tan;

  atan = Math.atan;

  module.exports = Camera = (function() {

    __extends(Camera, Class);

    function Camera() {
      this.defineProperty('fov', function() {
        return this._fov;
      }, function(fov) {
        this._fov = fov;
        this._zoom = 1 / tan(fov / 2);
      });
      this.defineProperty('zoom', function() {
        return this._zoom;
      }, function(zoom) {
        this._zoom = zoom;
        this._fov = 2 * atan(1 / zoom);
      });
      this.position = new Vector(0, 0, 0);
      this.orientation = new EulerAngles(0, 0, 0);
      this.up = new Vector(0, 1, 0);
      this.target = {
        position: Vector.ZERO
      };
      this.fov = Math.PI / 3;
      this.near = 10;
      this.far = 5000;
      this._scene = null;
      this._screenList = [];
    }

    Camera.prototype.addScreen = function(screen) {
      screen._camera = this;
      return this._screenList.push(screen);
    };

    Camera.prototype.snap = function(displayList) {};

    return Camera;

  })();

}).call(this);
}, "3d/core/Renderer": function(exports, require, module) {(function() {
  var Matrix, Matrix2D, Renderer, RotationMatrix, Vector;

  Matrix = require('3d/geom/Matrix');

  RotationMatrix = require('3d/geom/RotationMatrix');

  Vector = require('3d/geom/Vector');

  Matrix2D = require('geom/Matrix');

  module.exports = Renderer = (function() {

    function Renderer(scene) {
      this.scene = scene;
    }

    Renderer.prototype.render = function() {
      var camera, display, i, projectionMatrix, screen, screenMatrix, vertex, vertices, viewMatrix, w, worldMatrix, wvMatrix, _i, _len, _ref, _results;
      viewMatrix = new Matrix;
      worldMatrix = new Matrix;
      projectionMatrix = new Matrix;
      screenMatrix = new Matrix;
      _ref = this.scene._cameraList;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        camera = _ref[_i];
        viewMatrix.setupView(camera);
        _results.push((function() {
          var _j, _len2, _ref2, _results2;
          _ref2 = camera._screenList;
          _results2 = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            screen = _ref2[_j];
            screen.graphics.clear();
            projectionMatrix.setupProjection(camera, screen);
            screenMatrix.setupScreen(screen);
            _results2.push((function() {
              var _k, _len3, _len4, _ref3, _ref4, _results3;
              _ref3 = this.scene._displayList;
              _results3 = [];
              for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
                display = _ref3[_k];
                worldMatrix.setupLocalToParent(display.position, display.orientation);
                wvMatrix = Matrix.multiply(worldMatrix, viewMatrix);
                vertices = [];
                _ref4 = display.vertices;
                for (i = 0, _len4 = _ref4.length; i < _len4; i++) {
                  vertex = _ref4[i];
                  vertex = Matrix.multiply(vertex, wvMatrix);
                  w = vertex.z;
                  vertex = Matrix.multiply(vertex, projectionMatrix);
                  vertex = Vector.divide(vertex, w);
                  vertex = Matrix.multiply(vertex, screenMatrix);
                  vertices[i] = vertex;
                }
                _results3.push(display.drawAt(screen, vertices));
              }
              return _results3;
            }).call(this));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    return Renderer;

  })();

}).call(this);
}, "3d/core/Scene": function(exports, require, module) {(function() {
  var Matrix, Scene;

  Matrix = require('3d/geom/Matrix');

  module.exports = Scene = (function() {

    function Scene() {
      this._cameraList = [];
      this._displayList = [];
    }

    Scene.prototype.addCamera = function(camera) {
      camera._scene = this;
      return this._cameraList.push(camera);
    };

    Scene.prototype.addChild = function(displayObject) {
      displayObject._scene = this;
      return this._displayList.push(displayObject);
    };

    Scene.prototype.render = function() {};

    return Scene;

  })();

}).call(this);
}, "3d/core/Screen": function(exports, require, module) {(function() {
  var Screen, Shape;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Shape = require('display/Shape');

  module.exports = Screen = (function() {

    __extends(Screen, Shape);

    function Screen() {
      Screen.__super__.constructor.call(this);
      this.screenWidth = 480;
      this.screenHeight = 360;
      this._camera = null;
    }

    return Screen;

  })();

}).call(this);
}, "3d/display/DisplayObject": function(exports, require, module) {(function() {
  var DisplayObject, EulerAngles, Klass, Vector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EulerAngles = require('3d/geom/EulerAngles');

  Vector = require('3d/geom/Vector');

  Klass = require('core/Klass');

  module.exports = DisplayObject = (function() {

    __extends(DisplayObject, Klass);

    function DisplayObject() {
      this.position = new Vector(0, 0, 0);
      this.orientation = new EulerAngles(0, 0, 0);
      this.vertices = [];
      this.color = 0;
    }

    DisplayObject.prototype.drawAt = function(screen) {};

    return DisplayObject;

  })();

}).call(this);
}, "3d/display/Dot": function(exports, require, module) {(function() {
  var DisplayObject, Dot, Vector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('3d/display/DisplayObject');

  Vector = require('3d/geom/Vector');

  module.exports = Dot = (function() {

    __extends(Dot, DisplayObject);

    function Dot() {
      Dot.__super__.constructor.call(this);
      this.vertices[0] = new Vector(0, 0, 0);
      this.color = 0;
    }

    Dot.prototype.drawAt = function(screen, vertices) {
      var graphics;
      graphics = screen.graphics;
      graphics.beginFill(this.color);
      graphics.drawCircle(vertices[0].x, vertices[0].y, 1);
      return graphics.endFill();
    };

    return Dot;

  })();

}).call(this);
}, "3d/display/Line": function(exports, require, module) {(function() {
  var DisplayObject, Line, Matrix, Vector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('3d/display/DisplayObject');

  Matrix = require('3d/geom/Matrix');

  Vector = require('3d/geom/Vector');

  module.exports = Line = (function() {

    __extends(Line, DisplayObject);

    function Line() {
      Line.__super__.constructor.call(this);
    }

    Line.prototype.setupDirection = function(v0, v1) {
      this.vertices[0] = v0;
      return this.vertices[1] = v1;
    };

    Line.prototype.drawAt = function(screen, vertices) {
      var graphics;
      graphics = screen.graphics;
      graphics.lineStyle(1, this.color);
      graphics.moveTo(vertices[0].x, vertices[0].y);
      return graphics.lineTo(vertices[1].x, vertices[1].y);
    };

    return Line;

  })();

}).call(this);
}, "3d/display/Plane": function(exports, require, module) {

}, "3d/display/Sphere": function(exports, require, module) {(function() {
  var DisplayObject, MathUtil, PI, PI2, PI_2, Sphere, Vector;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('3d/display/DisplayObject');

  Vector = require('3d/geom/Vector');

  MathUtil = require('utils/MathUtil');

  PI = MathUtil.PI;

  PI_2 = MathUtil.PI_2;

  PI2 = MathUtil.PI2;

  module.exports = Sphere = (function() {

    __extends(Sphere, DisplayObject);

    function Sphere(radius, lngSeg, latSeg) {
      if (radius == null) radius = 100;
      if (lngSeg == null) lngSeg = 8;
      if (latSeg == null) latSeg = 6;
      Sphere.__super__.constructor.call(this);
      this._radius = radius;
      this._lngSeg = lngSeg;
      this._latSeg = latSeg;
      this._updateVertices();
      this.defineProperty('radius', function() {
        return this._radius;
      }, function(radius) {
        this._radius = radius;
        this._updateVertices();
      });
    }

    Sphere.prototype._updateVertices = function() {
      var lat, latAngle, latUnitAngle, lng, lngAngle, lngUnitAngle, radius, x, y, z, _ref, _results;
      this.vertices = [];
      lngUnitAngle = PI2 / this._lngSeg;
      latUnitAngle = PI / this._latSeg;
      _results = [];
      for (lat = 0, _ref = this._latSeg; lat <= _ref; lat += 1) {
        console.log(lat);
        latAngle = latUnitAngle * lat - PI_2;
        radius = this._radius * Math.cos(latAngle);
        y = this._radius * Math.sin(latAngle);
        _results.push((function() {
          var _ref2, _results2;
          _results2 = [];
          for (lng = 0, _ref2 = this._lngSeg; lng < _ref2; lng += 1) {
            lngAngle = lngUnitAngle * lng;
            x = radius * Math.cos(lngAngle);
            z = radius * Math.sin(lngAngle);
            _results2.push(this.vertices.push(new Vector(x, y, z)));
          }
          return _results2;
        }).call(this));
      }
      return _results;
    };

    Sphere.prototype.drawAt = function(screen, vertices) {
      var graphics, i, vertex, _len, _results;
      graphics = screen.graphics;
      graphics.lineStyle(1, this.color);
      graphics.beginFill(0, 0);
      _results = [];
      for (i = 0, _len = vertices.length; i < _len; i++) {
        vertex = vertices[i];
        _results.push(graphics.drawCircle(vertex.x, vertex.y, 0.5));
      }
      return _results;
    };

    return Sphere;

  })();

}).call(this);
}, "3d/geom/AABB": function(exports, require, module) {(function() {
  var AABB, MAX_VALUE, MAX_VECTOR, MIN_VALUE, MIN_VECTOR, Vector;

  Vector = require('3d/geom/Vector');

  MAX_VALUE = Number.MAX_VALUE;

  MIN_VALUE = -MAX_VALUE;

  MIN_VECTOR = new Vector(MIN_VALUE, MIN_VALUE, MIN_VALUE);

  MAX_VECTOR = new Vector(MAX_VALUE, MAX_VALUE, MAX_VALUE);

  module.exports = AABB = (function() {

    AABB.intersectAABBs = function(box1, box2, boxIntersect) {
      if (box1.min.x > box2.max.x || box1.max.x < box2.min.x || box1.min.y > box2.max.y || box1.max.y < box2.min.y || box1.min.z > box2.max.z || box1.max.z < box2.min.z) {
        return false;
      }
      if (boxIntersect != null) {
        boxIntersect.min.x = max(box1.min.x, box2.min.x);
        boxIntersect.max.x = min(box1.max.x, box2.max.x);
        boxIntersect.min.y = max(box1.min.y, box2.min.y);
        boxIntersect.max.y = min(box1.max.y, box2.max.y);
        boxIntersect.min.z = max(box1.min.z, box2.min.z);
        boxIntersect.max.z = min(box1.max.z, box2.max.z);
      }
      return true;
    };

    AABB.intersectMovingAABB = function(stationaryBox, movingBox, d) {
      var oneOverD, tEnter, tLeave, xEnter, xLeave, yEnter, yLeave, zEnter, zLeave;
      tEnter = 0;
      tLeave = 1;
      if (d.x === 0) {
        if (stationaryBox.min.x >= movingBox.max.x || stationaryBox.max.x <= movingBox.min.x) {
          return MAX_VALUE;
        }
      } else {
        oneOverD = 1 / d.x;
        xEnter = (stationaryBox.min.x - movingBox.max.x) * oneOverD;
        xLeave = (stationaryBox.max.x - movingBox.min.x) * oneOverD;
        if (xEnter > xLeave) swap(xEnter, xLeave);
        if (xEnter > tEnter) tEnter = xEnter;
        if (xLeave < tLeave) tLeave = xLeave;
        if (tEnter > tLeave) return MAX_VALUE;
      }
      if (d.y === 0) {
        if (stationaryBox.min.y >= movingBox.max.y || stationaryBox.max.y <= movingBox.min.y) {
          return MAX_VALUE;
        }
      } else {
        oneOverD = 1 / d.y;
        yEnter = (stationaryBox.min.y - movingBox.max.y) * oneOverD;
        yLeave = (stationaryBox.max.y - movingBox.min.y) * oneOverD;
        if (yEnter > yLeave) swap(yEnter, yLeave);
        if (yEnter > tEnter) tEnter = yEnter;
        if (yLeave < tLeave) tLeave = yLeave;
        if (tEnter > tLeave) return MAX_VALUE;
      }
      if (d.z === 0) {
        if (stationaryBox.min.z >= movingBox.max.z || stationaryBox.max.z <= movingBox.min.z) {
          return MAX_VALUE;
        }
      } else {
        oneOverD = 1 / d.z;
        zEnter = (stationaryBox.min.z - movingBox.max.z) * oneOverD;
        zLeave = (stationaryBox.max.z - movingBox.min.z) * oneOverD;
        if (zEnter > zLeave) swap(zEnter, zLeave);
        if (zEnter > tEnter) tEnter = zEnter;
        if (zLeave < tLeave) tLeave = zLeave;
        if (tEnter > tLeave) return MAX_VALUE;
      }
      return tEnter;
    };

    function AABB() {
      var box;
      if (!(this instanceof AABB)) return new AABB;
      if ((box = arguments[0]) instanceof AABB) {
        this.min = new Vector(box.min);
        this.max = new Vector(box.max);
      } else {
        this.min = new Vector(MIN_VECTOR);
        this.max = new Vector(MAX_VECTOR);
      }
    }

    AABB.prototype.size = function() {
      return this.max.subtract(this.min);
    };

    AABB.prototype.xSize = function() {
      return this.max.x - this.min.x;
    };

    AABB.prototype.ySize = function() {
      return this.max.y - this.min.y;
    };

    AABB.prototype.zSize = function() {
      return this.max.z - this.min.z;
    };

    AABB.prototype.center = function() {
      return this.min.add(max).multiply(0.5);
    };

    AABB.prototype.corner = function(i) {
      if (i < 0 || 7 < i) {
        throw new TypeError("'i' must be specified between 0 and 7.");
      }
      return new Vector(i & 1 ? this.max.x : this.min.x, i & 2 ? this.max.y : this.min.y, i & 4 ? this.max.z : this.min.z);
    };

    AABB.prototype.empty = function() {
      this.min.x = this.min.y = this.min.z = MAX_VALUE;
      this.max.x = this.max.y = this.max.z = MIN_VALUE;
    };

    AABB.prototype.add = function(p) {
      var box;
      if (p instanceof AABB) {
        box = p;
        this.add(box.min);
        this.add(box.max);
        return;
      }
      if (p.x < this.min.x) this.min.x = p.x;
      if (p.x > this.max.x) this.max.x = p.x;
      if (p.y < this.min.y) this.min.y = p.y;
      if (p.y > this.max.y) this.max.y = p.y;
      if (p.z < this.min.z) this.min.z = p.z;
      if (p.z > this.max.z) this.max.z = p.z;
    };

    AABB.prototype.setTransformedBox = function(box, m) {
      if (box.isEmpty()) {
        this.empty();
        return;
      }
      this.min = this.max = getTranslation(m);
      if (m.m11 > 0) {
        this.min.x += m.m11 * box.min.x;
        this.max.x += m.m11 * box.max.x;
      } else {
        this.min.x += m.m11 * box.max.x;
        this.max.x += m.m11 * box.min.x;
      }
      if (m.m12 > 0) {
        this.min.y += m.m12 * box.min.x;
        this.max.y += m.m12 * box.max.x;
      } else {
        this.min.y += m.m12 * box.max.x;
        this.max.y += m.m12 * box.min.x;
      }
      if (m.m13 > 0) {
        this.min.z += m.m13 * box.min.x;
        this.max.z += m.m13 * box.max.x;
      } else {
        this.min.z += m.m13 * box.max.x;
        this.max.z += m.m13 * box.min.x;
      }
      if (m.m21 > 0) {
        this.min.x += m.m21 * box.min.y;
        this.max.x += m.m21 * box.max.y;
      } else {
        this.min.x += m.m21 * box.max.y;
        this.max.x += m.m21 * box.min.y;
      }
      if (m.m22 > 0) {
        this.min.y += m.m22 * box.min.y;
        this.max.y += m.m22 * box.max.y;
      } else {
        this.min.y += m.m22 * box.max.y;
        this.max.y += m.m22 * box.min.y;
      }
      if (m.m23 > 0) {
        this.min.z += m.m23 * box.min.y;
        this.max.z += m.m23 * box.max.y;
      } else {
        this.min.z += m.m23 * box.max.y;
        this.max.z += m.m23 * box.min.y;
      }
      if (m.m31 > 0) {
        this.min.x += m.m31 * box.min.z;
        this.max.x += m.m31 * box.max.z;
      } else {
        this.min.x += m.m31 * box.max.z;
        this.max.x += m.m31 * box.min.z;
      }
      if (m.m32 > 0) {
        this.min.y += m.m32 * box.min.z;
        this.max.y += m.m32 * box.max.z;
      } else {
        this.min.y += m.m32 * box.max.z;
        this.max.y += m.m32 * box.min.z;
      }
      if (m.m33 > 0) {
        this.min.z += m.m33 * box.min.z;
        this.max.z += m.m33 * box.max.z;
      } else {
        this.min.z += m.m33 * box.max.z;
        this.max.z += m.m33 * box.min.z;
      }
    };

    AABB.prototype.isEmpty = function() {
      return this.min.x > this.max.x || this.min.y > this.max.y || this.min.z > this.max.z;
    };

    AABB.prototype.contains = function(p) {
      return p.x >= this.min.x && p.x <= this.max.x && p.y >= this.min.y && p.y <= this.max.y && p.z >= this.min.z && p.z <= this.max.z;
    };

    AABB.prototype.closestPointTo = function(p) {
      return new Vector((p.x < this.min.x ? this.min.x : p.x > this.max.x ? this.max.x : p.x, p.y < this.min.y ? this.min.y : p.y > this.max.y ? this.max.y : p.y, p.z < this.min.z ? this.min.z : p.z > this.max.z ? this.max.z : p.z));
    };

    AABB.prototype.intersectsSphere = function(center, radius) {
      var closestPoint;
      closestPoint = closestPointTo(center);
      return Vector.distanceSquared(center, closestPoint) < radius * radius;
    };

    AABB.prototype.rayIntersect = function(rayOrg, rayDelta, returnNormal) {
      var inside, t, which, x, xn, xt, y, yn, yt, z, zn, zt;
      inside = true;
      if (rayOrg.x < this.min.x) {
        xt = this.min.x - rayOrg.x;
        if (xt > rayDelta.x) return MAX_VALUE;
        xt /= rayDelta.x;
        inside = false;
        xn = -1;
      } else if (rayOrg.x > this.max.x) {
        xt = this.max.x - rayOrg.x;
        if (xt < rayDelta.x) return MAX_VALUE;
        xt /= rayDelta.x;
        inside = false;
        xn = 1;
      } else {
        xt = -1;
      }
      if (rayOrg.y < this.min.y) {
        yt = this.min.y - rayOrg.y;
        if (yt > rayDelta.y) return MAX_VALUE;
        yt /= rayDelta.y;
        inside = false;
        yn = -1;
      } else if (rayOrg.y > this.max.y) {
        yt = this.max.y - rayOrg.y;
        if (yt < rayDelta.y) return MAX_VALUE;
        yt /= rayDelta.y;
        inside = false;
        yn = 1;
      } else {
        yt = -1;
      }
      if (rayOrg.z < this.min.z) {
        zt = this.min.z - rayOrg.z;
        if (zt > rayDelta.z) return MAX_VALUE;
        zt /= rayDelta.z;
        inside = false;
        zn = -1;
      } else if (rayOrg.z > this.max.z) {
        zt = this.max.z - rayOrg.z;
        if (zt < rayDelta.z) return MAX_VALUE;
        zt /= rayDelta.z;
        inside = false;
        zn = 1;
      } else {
        zt = -1;
      }
      if (inside) {
        if (returnNormal != null) {
          returnNormal = -rayDelta;
          returnNormal.normalize();
        }
        return 0;
      }
      which = 0;
      t = xt;
      if (yt > t) {
        which = 1;
        t = yt;
      }
      if (zt > t) {
        which = 2;
        t = zt;
      }
      switch (which) {
        case 0:
          float(y = rayOrg.y + rayDelta.y * t);
          if (y < this.min.y || y > this.max.y) return MAX_VALUE;
          float(z = rayOrg.z + rayDelta.z * t);
          if (z < this.min.z || z > this.max.z) return MAX_VALUE;
          if (returnNormal != null) {
            returnNormal.x = xn;
            returnNormal.y = 0;
            returnNormal.z = 0;
          }
          break;
        case 1:
          float(x = rayOrg.x + rayDelta.x * t);
          if (x < this.min.x || x > this.max.x) return MAX_VALUE;
          float(z = rayOrg.z + rayDelta.z * t);
          if (z < this.min.z || z > this.max.z) return MAX_VALUE;
          if (returnNormal != null) {
            returnNormal.x = 0;
            returnNormal.y = yn;
            returnNormal.z = 0;
          }
          break;
        case 2:
          float(x = rayOrg.x + rayDelta.x * t);
          if (x < this.min.x || x > this.max.x) return MAX_VALUE;
          float(y = rayOrg.y + rayDelta.y * t);
          if (y < this.min.y || y > this.max.y) return MAX_VALUE;
          if (returnNormal != null) {
            returnNormal.x = 0;
            returnNormal.y = 0;
            returnNormal.z = zn;
          }
      }
      return t;
    };

    AABB.prototype.classifyPlane = function(n, d) {
      var maxD, minD;
      if (n.x > 0) {
        minD = n.x * this.min.x;
        maxD = n.x * this.max.x;
      } else {
        minD = n.x * this.max.x;
        maxD = n.x * this.min.x;
      }
      if (n.y > 0) {
        minD += n.y * this.min.y;
        maxD += n.y * this.max.y;
      } else {
        minD += n.y * this.max.y;
        maxD += n.y * this.min.y;
      }
      if (n.z > 0) {
        minD += n.z * this.min.z;
        maxD += n.z * this.max.z;
      } else {
        minD += n.z * this.max.z;
        maxD += n.z * this.min.z;
      }
      if (minD >= d) return +1;
      if (maxD <= d) return -1;
      return 0;
    };

    AABB.prototype.intersectPlane = function(n, planeD, dir) {
      var dot, maxD, minD, t;
      if (!(abs(Vector.magnitudeSquared(n) - 1) < 0.01)) {
        throw new TypeError("'n' must specified Vector.");
      }
      if (!(abs(Vector.magnitudeSquared(dir) - 1) < 0.01)) {
        throw new TypeError("'dir' must specified Vector.");
      }
      dot = Vector.innerProduct(n, dir);
      if (dot >= 0) return MAX_VALUE;
      if (n.x > 0) {
        minD = n.x * this.min.x;
        maxD = n.x * this.max.x;
      } else {
        minD = n.x * this.max.x;
        maxD = n.x * this.min.x;
      }
      if (n.y > 0) {
        minD += n.y * this.min.y;
        maxD += n.y * this.max.y;
      } else {
        minD += n.y * this.max.y;
        maxD += n.y * this.min.y;
      }
      if (n.z > 0) {
        minD += n.z * this.min.z;
        maxD += n.z * this.max.z;
      } else {
        minD += n.z * this.max.z;
        maxD += n.z * this.min.z;
      }
      if (maxD <= planeD) return MAX_VALUE;
      t = planeD - minD / dot;
      if (t < 0) return 0;
      return t;
    };

    return AABB;

  })();

}).call(this);
}, "3d/geom/EulerAngles": function(exports, require, module) {(function() {
  var EulerAngles, MathUtil, PI, PI2, PI_2, abs, asin, atan2, cos, sin, wrapPi, _PI, _PI2;

  MathUtil = require('utils/MathUtil');

  PI = MathUtil.PI;

  PI2 = MathUtil.PI2;

  PI_2 = MathUtil.PI_2;

  _PI = MathUtil._PI;

  _PI2 = MathUtil._PI2;

  abs = Math.abs;

  sin = Math.sin;

  cos = Math.cos;

  asin = Math.asin;

  atan2 = Math.atan2;

  wrapPi = MathUtil.wrapPi;

  module.exports = EulerAngles = (function() {

    EulerAngles.IDENTITY = new EulerAngles(0, 0, 0);

    function EulerAngles(heading, pitch, bank) {
      var orientation;
      if (!(this instanceof EulerAngles)) {
        return new EulerAngles(heading, pitch, bank);
      }
      if ((orientation = arguments[0]) instanceof EulerAngles) {
        this.heading = orientation.heading;
        this.pitch = orientation.pitch;
        this.bank = orientation.bank;
      } else {
        this.heading = heading;
        this.pitch = pitch;
        this.bank = bank;
      }
    }

    EulerAngles.prototype.identity = function() {
      return this.heading = this.pitch = this.bank = 0;
    };

    EulerAngles.prototype.canonize = function() {
      this.pitch = wrapPi(this.pitch);
      if (this.pitch < -PI_2) {
        this.pitch = -PI - this.pitch;
        this.heading += PI;
        this.bank += PI;
      } else if (this.pitch > PI_2) {
        this.pitch = PI - this.pitch;
        this.heading += PI;
        this.bank += PI;
      }
      if (abs(this.pitch) > PI_2 - 0.0001) {
        this.heading += this.bank;
        this.bank = 0;
      } else {
        this.bank = wrapPi(this.bank);
      }
      this.heading = wrapPi(this.heading);
    };

    EulerAngles.prototype.fromObjectToInertialQuaternion = function(q) {
      var sp;
      sp = 2 * (q.y * q.z - q.w * q.x);
      if (abs(sp) > 0.9999) {
        this.pitch = PI_2 * sp;
        this.heading = atan2(-q.x * q.z + q.w * q.y, 0.5 - q.y * q.y - q.z * q.z);
        this.bank = 0;
      } else {
        this.pitch = asin(sp);
        this.heading = atan2(q.x * q.z + q.w * q.y, 0.5 - q.x * q.x - q.y * q.y);
        this.bank = atan2(q.x * q.y + q.w * q.z, 0.5 - q.x * q.x - q.z * q.z);
      }
    };

    EulerAngles.prototype.fromInertialToObjectQuaternion = function(q) {
      var sp;
      sp = -2 * (q.y * q.z + q.w * q.x);
      if (abs(sp) > 0.9999) {
        this.pitch = PI_2 * sp;
        this.heading = atan2(-q.x * q.z - q.w * q.y, 0.5 - q.y * q.y - q.z * q.z);
        this.bank = 0;
      } else {
        this.pitch = asin(sp);
        this.heading = atan2(q.x * q.z - q.w * q.y, 0.5 - q.x * q.x - q.y * q.y);
        this.bank = atan2(q.x * q.y - q.w * q.z, 0.5 - q.x * q.x - q.z * q.z);
      }
    };

    EulerAngles.prototype.fromObjectToWorldMatrix = function(m) {
      var sp;
      sp = -m.m32;
      if (abs(sp) > 9.99999) {
        this.pitch = PI_2 * sp;
        this.heading = atan2(-m.m23, m.m11);
        this.bank = 0;
      } else {
        this.heading = atan2(m.m31, m.m33);
        this.pitch = asin(sp);
        this.bank = atan2(m.m12, m.m22);
      }
    };

    EulerAngles.prototype.fromWorldToObjectMatrix = function(m) {
      var sp;
      sp = -m.m23;
      if (abs(sp) > 9.99999) {
        this.pitch = PI_2 * sp;
        this.heading = atan2(-m.m31, m.m11);
        this.bank = 0;
      } else {
        this.heading = atan2(m.m13, m.m33);
        this.pitch = asin(sp);
        this.bank = atan2(m.m21, m.m22);
      }
    };

    EulerAngles.prototype.fromRotationMatrix = function(m) {
      var sp;
      sp = -m.m23;
      if (abs(sp) > 9.99999) {
        this.pitch = PI_2 * sp;
        this.heading = atan2(-m.m31, m.m11);
        this.bank = 0;
      } else {
        this.heading = atan2(m.m13, m.m33);
        this.pitch = asin(sp);
        this.bank = atan2(m.m21, m.m22);
      }
    };

    return EulerAngles;

  })();

}).call(this);
}, "3d/geom/Matrix": function(exports, require, module) {(function() {
  var EulerAngles, Matrix, Quaternion, RotationMatrix, Vector, abs, cos, sin, tan;

  EulerAngles = require('3d/geom/EulerAngles');

  RotationMatrix = require('3d/geom/RotationMatrix');

  Quaternion = require('3d/geom/Quaternion');

  Vector = require('3d/geom/Vector');

  abs = Math.abs;

  sin = Math.sin;

  cos = Math.cos;

  tan = Math.tan;

  module.exports = Matrix = (function() {

    Matrix.IDENTITY = new Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0);

    Matrix.multiply = function(a, b) {
      if (!(b instanceof Matrix)) {
        throw new TypeError("'b' must be specified an instance of Matrix.");
      }
      if (a instanceof Vector) {
        return new Vector(a.x * b.m11 + a.y * b.m21 + a.z * b.m31 + b.tx, a.x * b.m12 + a.y * b.m22 + a.z * b.m32 + b.ty, a.x * b.m13 + a.y * b.m23 + a.z * b.m33 + b.tz);
      } else if (a instanceof Matrix) {
        return new Matrix(a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31, a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32, a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33, a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31, a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32, a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33, a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31, a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32, a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33, a.tx * b.m11 + a.ty * b.m21 + a.tz * b.m31 + b.tx, a.tx * b.m12 + a.ty * b.m22 + a.tz * b.m32 + b.ty, a.tx * b.m13 + a.ty * b.m23 + a.tz * b.m33 + b.tz);
      } else {
        throw new TypeError("'a' must be specified an instance of Vector or Matrix.");
      }
    };

    Matrix.determinant = function(m) {
      return m.m11 * (m.m22 * m.m33 - m.m23 * m.m32) + m.m12 * (m.m23 * m.m31 - m.m21 * m.m33) + m.m13 * (m.m21 * m.m32 - m.m22 * m.m31);
    };

    Matrix.invert = function(m) {
      var det, oneOverDet;
      det = this.determinant(m);
      if (!(abs(det) > 0.000001)) {
        throw new TypeError("Zero matrix doesn't have inverse matrix.");
      }
      oneOverDet = 1 / det;
      return new Matrix((m.m22 * m.m33 - m.m23 * m.m32) * oneOverDet, (m.m13 * m.m32 - m.m12 * m.m33) * oneOverDet, (m.m12 * m.m23 - m.m13 * m.m22) * oneOverDet, (m.m23 * m.m31 - m.m21 * m.m33) * oneOverDet, (m.m11 * m.m33 - m.m13 * m.m31) * oneOverDet, (m.m13 * m.m21 - m.m11 * m.m23) * oneOverDet, (m.m21 * m.m32 - m.m22 * m.m31) * oneOverDet, (m.m12 * m.m31 - m.m11 * m.m32) * oneOverDet, (m.m11 * m.m22 - m.m12 * m.m21) * oneOverDet, -(m.tx * r.m11 + m.ty * r.m21 + m.tz * r.m31), -(m.tx * r.m12 + m.ty * r.m22 + m.tz * r.m32), -(m.tx * r.m13 + m.ty * r.m23 + m.tz * r.m33));
    };

    function Matrix(m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz) {
      var m;
      if (!(this instanceof Matrix)) {
        return new Matrix(m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz);
      }
      if ((m = arguments[0]) instanceof Matrix) {
        this.m11 = m.m11;
        this.m12 = m.m12;
        this.m13 = m.m13;
        this.m21 = m.m21;
        this.m22 = m.m22;
        this.m23 = m.m23;
        this.m31 = m.m31;
        this.m32 = m.m32;
        this.m33 = m.m33;
        this.tx = m.tx;
        this.ty = m.ty;
        this.tz = m.tz;
      } else {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.tx = tx;
        this.ty = ty;
        this.tz = tz;
      }
    }

    Matrix.prototype.setupView = function(camera) {
      var x, y, z;
      z = Vector.subtract(camera.target.position, camera.position);
      z.normalize();
      x = Vector.crossProduct(camera.up, z);
      x.normalize();
      y = Vector.crossProduct(z, x);
      this.m11 = x.x;
      this.m12 = y.x;
      this.m13 = z.x;
      this.m21 = x.y;
      this.m22 = y.y;
      this.m23 = z.y;
      this.m31 = x.z;
      this.m32 = y.z;
      this.m33 = z.z;
      this.tx = -Vector.dotProduct(camera.position, x);
      this.ty = -Vector.dotProduct(camera.position, y);
      this.tz = -Vector.dotProduct(camera.position, z);
    };

    Matrix.prototype.setupProjection = function(camera, screen) {
      var sx, sy, sz;
      sy = 1 / tan(camera.fov / 2);
      sx = sy * screen.screenHeight / screen.screenWidth;
      sz = camera.far / (camera.far - camera.near);
      this.m11 = sx;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = sy;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = sz;
      this.tx = 0;
      this.ty = 0;
      this.tz = -sz * camera.near;
    };

    Matrix.prototype.setupScreen = function(screen) {
      var h, w;
      w = screen.screenWidth / 2;
      h = screen.screenHeight / 2;
      this.m11 = w;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = -h;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.tx = w;
      this.ty = h;
      return this.tz = 0;
    };

    Matrix.prototype.identity = function() {
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.tx = 0;
      this.ty = 0;
      this.tz = 0;
    };

    Matrix.prototype.zeroTranslation = function() {
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setTranslation = function(d) {
      this.tx = d.x;
      this.ty = d.y;
      this.tz = d.z;
    };

    Matrix.prototype.setupTranslation = function(d) {
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.tx = d.x;
      this.ty = d.y;
      this.tz = d.z;
    };

    Matrix.prototype.setupLocalToParent = function(pos, orient) {
      var orientMatrix;
      if (orient instanceof EulerAngles) {
        orientMatrix = new RotationMatrix;
        orientMatrix.setup(orient);
        orient = orientMatrix;
      }
      this.m11 = orient.m11;
      this.m12 = orient.m21;
      this.m13 = orient.m31;
      this.m21 = orient.m12;
      this.m22 = orient.m22;
      this.m23 = orient.m32;
      this.m31 = orient.m13;
      this.m32 = orient.m23;
      this.m33 = orient.m33;
      this.tx = pos.x;
      this.ty = pos.y;
      this.tz = pos.z;
    };

    Matrix.prototype.setupParentToLocal = function(pos, orient) {
      var matrix;
      if (orient instanceof EulerAngles) {
        matrix = new RotationMatrix;
        matrix.setup(orient);
        orient = matrix;
      }
      this.m11 = orient.m11;
      this.m12 = orient.m12;
      this.m13 = orient.m13;
      this.m21 = orient.m21;
      this.m22 = orient.m22;
      this.m23 = orient.m23;
      this.m31 = orient.m31;
      this.m32 = orient.m32;
      this.m33 = orient.m33;
      this.tx = -(pos.x * this.m11 + pos.y * this.m21 + pos.z * this.m31);
      this.ty = -(pos.x * this.m12 + pos.y * this.m22 + pos.z * this.m32);
      this.tz = -(pos.x * this.m13 + pos.y * this.m23 + pos.z * this.m33);
    };

    Matrix.prototype.setupRotate = function(axis, theta) {
      var a, ax, ay, az, c, s;
      s = sin(theta);
      c = cos(theta);
      if (!(axis instanceof Vector)) {
        switch (axis) {
          case 1:
            this.m11 = 1;
            this.m12 = 0;
            this.m13 = 0;
            this.m21 = 0;
            this.m22 = c;
            this.m23 = s;
            this.m31 = 0;
            this.m32 = -s;
            this.m33 = c;
            break;
          case 2:
            this.m11 = c;
            this.m12 = 0;
            this.m13 = -s;
            this.m21 = 0;
            this.m22 = 1;
            this.m23 = 0;
            this.m31 = s;
            this.m32 = 0;
            this.m33 = c;
            break;
          case 3:
            this.m11 = c;
            this.m12 = s;
            this.m13 = 0;
            this.m21 = -s;
            this.m22 = c;
            this.m23 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = 1;
            break;
          default:
            throw new Error("'axis' must be specified 1, 2 or 3.");
        }
      } else {
        a = 1 - c;
        ax = a * axis.x;
        ay = a * axis.y;
        az = a * axis.z;
        this.m11 = ax * axis.x + c;
        this.m12 = ax * axis.y + axis.z * s;
        this.m13 = ax * axis.z - axis.y * s;
        this.m21 = ay * axis.x - axis.z * s;
        this.m22 = ay * axis.y + c;
        this.m23 = ay * axis.z + axis.x * s;
        this.m31 = az * axis.x + axis.y * s;
        this.m32 = az * axis.y - axis.x * s;
        this.m33 = az * axis.z + c;
      }
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.fromQuaternion = function(q) {
      var ww, wwx, wwy, wwz, xx, xxx, xxy, xxz, yy, yyy, yyz, zz, zzz;
      ww = 2 * q.w;
      xx = 2 * q.x;
      yy = 2 * q.y;
      zz = 2 * q.z;
      wwx = ww * q.x;
      wwy = ww * q.y;
      wwz = ww * q.z;
      xxx = xx * q.x;
      xxy = xx * q.y;
      xxz = xx * q.z;
      yyy = yy * q.y;
      yyz = yy * q.z;
      zzz = yy * q.z;
      this.m11 = 1 - yyy - zzz;
      this.m12 = xxy + wwz;
      this.m13 = xxz - wwy;
      this.m21 = xxy - wwz;
      this.m22 = 1 - xxx - zzz;
      this.m23 = yyz + wwx;
      this.m31 = xxz + wwy;
      this.m32 = yyz - wwx;
      this.m33 = 1 - xxx - yyy;
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setupScale = function(v) {
      this.m11 = s.x;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = s.y;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = s.z;
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setupScaleAlongAxis = function(axis, x) {
      var a, ax, ay, az;
      if (!(abs(Vector.magnitudeSquared(axis) - 1) < 0.01)) {
        throw new TypeError("'axis' must be specified a unit vector.");
      }
      a = k - 1;
      ax = a * axis.x;
      ay = a * axis.y;
      az = a * axis.z;
      this.m11 = ax * axis.x + 1;
      this.m22 = ay * axis.y + 1;
      this.m33 = az * axis.z + 1;
      this.m21 = this.m21 = ax * axis.y;
      this.m13 = this.m31 = ax * axis.z;
      this.m23 = this.m32 = ay * axis.z;
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setupShear = function(axis, s, t) {
      switch (axis) {
        case 1:
          this.m11 = 1;
          this.m12 = s;
          this.m13 = t;
          this.m21 = 0;
          this.m22 = 1;
          this.m23 = 0;
          this.m31 = 0;
          this.m32 = 0;
          this.m33 = 1;
          break;
        case 2:
          this.m11 = 1;
          this.m12 = 0;
          this.m13 = 0;
          this.m21 = s;
          this.m22 = 1;
          this.m23 = t;
          this.m31 = 0;
          this.m32 = 0;
          this.m33 = 1;
          break;
        case 3:
          this.m11 = 1;
          this.m12 = 0;
          this.m13 = 0;
          this.m21 = 0;
          this.m22 = 1;
          this.m23 = 0;
          this.m31 = s;
          this.m32 = t;
          this.m33 = 1;
          break;
        default:
          throw new TypeError("axis must be specified 1, 2 or 3.");
      }
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setupProject = function(n) {
      if (!(abs(Vector.magnitudeSquared(n) - 1) < 0.1)) {
        throw new TypeError("'n' must be specified a unit vector.");
      }
      this.m11 = 1 - n.x * n.x;
      this.m22 = 1 - n.y * n.y;
      this.m33 = 1 - n.z * n.z;
      this.m12 = this.m21 = -n.x * n.y;
      this.m13 = this.m31 = -n.x * n.z;
      this.m23 = this.m32 = -n.y * n.z;
      this.tx = this.ty = this.tz = 0;
    };

    Matrix.prototype.setupReflect = function(axis, k) {
      var ax, ay, az, n;
      if (k == null) k = 0;
      if (!(axis instanceof Vector)) {
        switch (axis) {
          case 1:
            this.m11 = -1;
            this.m12 = 0;
            this.m13 = 0;
            this.m21 = 0;
            this.m22 = 1;
            this.m23 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = 1;
            this.tx = 2 * k;
            this.ty = 0;
            this.tz = 0;
            break;
          case 2:
            this.m11 = 1;
            this.m12 = 0;
            this.m13 = 0;
            this.m21 = 0;
            this.m22 = -1;
            this.m23 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = 1;
            this.tx = 0;
            this.ty = 2 * k;
            this.tz = 0;
            break;
          case 2:
            this.m11 = 1;
            this.m12 = 0;
            this.m13 = 0;
            this.m21 = 0;
            this.m22 = 1;
            this.m23 = 0;
            this.m31 = 0;
            this.m32 = 0;
            this.m33 = -1;
            this.tx = 0;
            this.ty = 0;
            this.tz = 2 * k;
            break;
          default:
            throw new TypeError("'axis' must be specified 1, 2 or 3.");
        }
      } else {
        n = axis;
        if (!(abss(Vector.magnitudeSquared(n) - 1) < 0.01)) {
          throw new TypeError("'n' must be specified a unit vector.");
        }
        ax = -2 * n.x;
        ay = -2 * n.y;
        az = -2 * n.z;
        this.m11 = 1 + ax * n.x;
        this.m22 = 1 + ay * n.y;
        this.m33 = 1 + az * n.z;
        this.m12 = this.m21 = ax * n.y;
        this.m13 = this.m31 = ax * n.z;
        this.m23 = this.m32 = ay * n.z;
        this.tx = this.ty = this.tz = 0;
      }
    };

    Matrix.prototype.getTranslation = function(m) {
      return new Vector(m.tx, m.ty, m.tz);
    };

    Matrix.prototype.getPositionFromParentToLocalMatrix = function(m) {
      return new Vector(-(m.tx * m.m11 + m.ty * m.m12 + m.tz * m.m13), -(m.tx * m.m21 + m.ty * m.m22 + m.tz * m.m23), -(m.tx * m.m31 + m.ty * m.m32 + m.tz * m.m33));
    };

    Matrix.prototype.getPositionFromLocalToParentMatrix = function(m) {
      return new Vector(m.tx, m.ty, m.tz);
    };

    return Matrix;

  })();

}).call(this);
}, "3d/geom/Quaternion": function(exports, require, module) {(function() {
  var MathUtil, Quaternion, Vector, abs, cos, safeAcos, sin, sqrt;

  Vector = require('3d/geom/Vector');

  MathUtil = require('utils/MathUtil');

  abs = Math.abs;

  sqrt = Math.sqrt;

  sin = Math.sin;

  cos = Math.cos;

  safeAcos = MathUtil.safeAcos;

  module.exports = Quaternion = (function() {

    Quaternion.IDENTITY = new Quaternion(1, 0, 0, 0);

    Quaternion.dotProduct = function(a, b) {
      return a.w * b.w + a.x * b.y + a.y * b.y + a.z * b.z;
    };

    Quaternion.slerp = function(q0, q1, t) {
      var cosOmega, k0, k1, omega, oneOverSinOmega, q1w, q1x, q1y, q1z, sinOmega;
      if (t <= 0) {
        return q0;
      } else if (t >= 1) {
        return q1;
      } else {
        cosOmega = this.dotProduct(q0, q1);
        q1w = s1.w;
        q1x = s1.x;
        q1y = s1.y;
        q1z = s1.z;
        if (cosOmega < 0) {
          q1w *= -1;
          q1x *= -1;
          q1y *= -1;
          q1z *= -1;
          cosOmega *= -1;
        }
        if (!(cosOmega < 1.1)) throw new Error("");
        if (cosOmega > 0.9999) {
          k0 = 1 - t;
          k1 = t;
        } else {
          sinOmega = sqrt(1 - cosOmega * cosOmega);
          omega = atan2(sinOmega, cosOmega);
          oneOverSinOmega = 1 / sinOmega;
          k0 = sin((1 - t) * omega) * oneOverSinOmega;
          k1 = sin(t * omega) * oneOverSinOmega;
        }
        return new Quaternion(k0 * q0.x + k1 * q1x, k0 * q0.y + k1 * q1y, k0 * q0.z + k1 * q1z, k0 * q0.w + k1 * q1w);
      }
    };

    Quaternion.conjugate = function(q) {
      return new Quaternion(q.w, -q.x, -q.y, -q.z);
    };

    Quaternion.pow = function(q, exponent) {
      var alpha, mult, newAlpha;
      if (abs(q.w) > 0.9999) {
        return q;
      } else {
        alpha = acos(q.w);
        newAlpha = alpha * exponent;
        mult = sin(newAlpha) / sin(alpha);
        return new Quaternion(cos(newAlpha), q.x * mult, q.y * mult, q.z * mult);
      }
    };

    function Quaternion(w, x, y, z) {
      var q;
      if (!(this instanceof Quaternion)) return new Quaternion(w, x, y, z);
      if ((q = arguments[0]) instanceof Quaternion) {
        this.w = q.w;
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
      } else {
        this.w = w;
        this.x = x;
        this.y = y;
        this.z = z;
      }
    }

    Quaternion.prototype.identity = function() {
      this.w = 1;
      return this.x = this.y = this.z = 0;
    };

    Quaternion.prototype.setToRotateAboutX = function(theta) {
      var theta_2;
      theta_2 = theta / 2;
      this.w = cos(theta_2);
      this.x = sin(theta_2);
      this.y = 0;
      return this.z = 0;
    };

    Quaternion.prototype.setToRotateAboutY = function(theta) {
      var theta_2;
      theta_2 = theta / 2;
      this.w = cos(theta_2);
      this.x = 0;
      this.y = sin(theta_2);
      return this.z = 0;
    };

    Quaternion.prototype.setToRotateAboutZ = function(theta) {
      var theta_2;
      theta_2 = theta / 2;
      this.w = cos(theta_2);
      this.x = 0;
      this.y = sin(theta_2);
      return this.z = 0;
    };

    Quaternion.prototype.setToRotateAboutAxis = function(axis, theta) {
      var sinThetaOver2, thetaOver2;
      if (!(abs(Vector.magnitude(axis) - 1) < 0.01)) {
        throw new Error("'axis' should be normalized.");
      }
      thetaOver2 = theta / 2;
      sinThetaOver2 = sin(thetaOver2);
      this.w = con(thetaOver2);
      this.x = axis.x * sinThetaOver2;
      this.y = axis.y * sinThetaOver2;
      return this.z = axis.z * sinThetaOver2;
    };

    Quaternion.prototype.setToRotateObjectToInertial = function(orientation) {
      var bankOver2, cb, ch, cp, headingOver2, pitchOver2, sb, sh, sp;
      headingOver2 = orientation.heading / 2;
      pitchOver2 = orientation.pitch / 2;
      bankOver2 = orientation.bank / 2;
      sh = sin(headingOver2);
      ch = cos(headingOver2);
      sp = sin(pitchOver2);
      cp = cos(pitchOver2);
      sb = sin(bankOver2);
      cb = cos(bankOver2);
      this.w = ch * cp * cb + sh * sp * sb;
      this.x = ch * sp * cb + sh * cp * sb;
      this.y = -ch * sp * sb + sh * cp * cb;
      return this.z = -sh * sp * cb + ch * cp * sb;
    };

    Quaternion.prototype.setToRotateInertialToObject = function(orientation) {
      var bankOver2, cb, ch, cp, headingOver2, pitchOver2, sb, sh, sp;
      headingOver2 = orientation.heading / 2;
      pitchOver2 = orientation.pitch / 2;
      bankOver2 = orientation.bank / 2;
      sh = sin(headingOver2);
      ch = cos(headingOver2);
      sp = sin(pitchOver2);
      cp = cos(pitchOver2);
      sb = sin(bankOver2);
      cb = cos(bankOver2);
      this.w = ch * cp * cb + sh * sp * sb;
      this.x = -ch * sp * cb - sh * cp * sb;
      this.y = ch * sp * sb - sh * cp * cb;
      return this.z = sh * sp * cb - ch * cp * sb;
    };

    Quaternion.prototype.crossProduct = function(q) {
      return new Quaternion(this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z, this.w * q.x + this.x * q.w + this.z * q.y - this.y * q.z, this.w * q.y + this.y * q.w + this.x * q.z - this.z * q.x, this.w * q.z + this.z * q.w + this.y * q.x - this.x * q.y);
    };

    Quaternion.prototype.normalize = function() {
      var mag, oneOverMag;
      mag = sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
      if (mag > 0) {
        oneOverMag = 1 / mag;
        this.w += oneOverMag;
        this.x += oneOverMag;
        this.y += oneOverMag;
        return this.z += oneOverMag;
      } else {
        throw new Error("Zero magnitude");
        return this.identity();
      }
    };

    Quaternion.prototype.getRotationAngle = function() {
      var thetaOver2;
      thetaOver2 = safeAcos(this.w);
      return thetaOver2 * 2;
    };

    Quaternion.prototype.getRotationAxis = function() {
      var oneOverSinThetaOver2, sinThetaOver2Sq;
      sinThetaOver2Sq = 1 - this.w * this.w;
      if (sinThetaOver2Sq <= 0) {
        return new Vector(1, 0, 0);
      } else {
        oneOverSinThetaOver2 = 1 / sqrt(sinThetaOver2Sq);
        return new Vector(this.x * oneOverSinThetaOver2, this.y * oneOverSinThetaOver2, this.z * oneOverSinThetaOver2);
      }
    };

    return Quaternion;

  })();

}).call(this);
}, "3d/geom/RotationMatrix": function(exports, require, module) {(function() {
  var RotationMatrix, Vector, cos, sin;

  Vector = require('3d/geom/Vector');

  sin = Math.sin;

  cos = Math.cos;

  module.exports = RotationMatrix = (function() {

    function RotationMatrix(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
      var m;
      if (!(this instanceof RotationMatrix)) {
        return new RotationMatrix(m11, m12, m13, m21, m22, m23, m31, m32, m33);
      }
      if ((m = arguments[0]) instanceof RotationMatrix) {
        this.m11 = m.m11;
        this.m12 = m.m12;
        this.m13 = m.m13;
        this.m21 = m.m21;
        this.m22 = m.m22;
        this.m23 = m.m23;
        this.m31 = m.m31;
        this.m32 = m.m32;
        this.m33 = m.m33;
      } else {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
      }
    }

    RotationMatrix.prototype.identity = function() {
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
    };

    RotationMatrix.prototype.setup = function(orientation) {
      var cb, ch, cp, sb, sh, sp;
      sh = sin(orientation.heading);
      ch = cos(orientation.heading);
      sp = sin(orientation.pitch);
      cp = cos(orientation.pitch);
      sb = sin(orientation.bank);
      cb = cos(orientation.bank);
      this.m11 = ch * cb + sh * sp * sb;
      this.m12 = -ch * sb + sh * sp * cb;
      this.m13 = sh * cp;
      this.m21 = sb * cp;
      this.m22 = cb * cp;
      this.m23 = -sp;
      this.m31 = -sh * cb + ch * sp * sb;
      this.m32 = sb * sh + ch * sp * cb;
      this.m33 = ch * cp;
    };

    RotationMatrix.prototype.fromInertialToObjectQuaternion = function(q) {
      var wx, wy, wz, xx, xy, xz, yy, yz, zz;
      wx = q.w * q.x;
      wy = q.w * q.y;
      wz = q.w * q.z;
      xx = q.x * q.x;
      xy = q.x * q.y;
      xz = q.x * q.z;
      yy = q.y * q.y;
      yz = q.y * q.z;
      zz = q.z * q.z;
      this.m11 = 1 - 2 * (yy + zz);
      this.m12 = 2 * (xy + wz);
      this.m13 = 2 * (xz - wy);
      this.m21 = 2 * (xy - wz);
      this.m22 = 1 - 2 * (xx + zz);
      this.m23 = 2 * (yz + wx);
      this.m31 = 2 * (xz + wy);
      this.m32 = 2 * (yz - wx);
      this.m33 = 1 - 2 * (xx + yy);
    };

    RotationMatrix.prototype.fromObjectToInertialQuaternion = function(q) {
      var wx, wy, wz, xx, xy, xz, yy, yz, zz;
      wx = q.w * q.x;
      wy = q.w * q.y;
      wz = q.w * q.z;
      xx = q.x * q.x;
      xy = q.x * q.y;
      xz = q.x * q.z;
      yy = q.y * q.y;
      yz = q.y * q.z;
      zz = q.z * q.z;
      this.m11 = 1 - 2 * (yy + zz);
      this.m12 = 2 * (xy - wz);
      this.m13 = 2 * (xz + wy);
      this.m21 = 2 * (xy + wz);
      this.m22 = 1 - 2 * (xx + zz);
      this.m23 = 2 * (yz - wx);
      this.m31 = 2 * (xz - wy);
      this.m32 = 2 * (yz + wx);
      this.m33 = 1 - 2 * (xx + yy);
    };

    RotationMatrix.prototype.inertialToObject = function(v) {
      return new Vector(this.m11 * v.x + this.m21 * v.y + this.m31 * v.z, this.m12 * v.x + this.m22 * v.y + this.m32 * v.z, this.m13 * v.x + this.m23 * v.y + this.m33 * v.z);
    };

    RotationMatrix.prototype.objectToInertial = function(v) {
      return new Vector(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    };

    return RotationMatrix;

  })();

}).call(this);
}, "3d/geom/Vector": function(exports, require, module) {(function() {
  var Vector, sqrt;

  sqrt = Math.sqrt;

  module.exports = Vector = (function() {

    Vector.ZERO = new Vector(0, 0, 0);

    Vector.equals = function(a, b) {
      return a.x === b.x && a.y === b.y && a.z === b.z;
    };

    Vector.notEquals = function(a, b) {
      return a.x !== b.x || a.y !== b.y || a.z !== b.z;
    };

    Vector.add = function(a, b) {
      return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
    };

    Vector.subtract = function(a, b) {
      return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
    };

    Vector.multiply = function(m, s) {
      return new Vector(m.x * s, m.y * s, m.z * s);
    };

    Vector.divide = function(m, d) {
      return new Vector(m.x / d, m.y / d, m.z / d);
    };

    Vector.dotProduct = function(a, b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
    };

    Vector.crossProduct = function(a, b) {
      return new Vector(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    };

    Vector.magnitude = function(a) {
      return sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    };

    Vector.magnitudeSquared = function(a) {
      return a.x * a.x + a.y * a.y + a.z * a.z;
    };

    Vector.distance = function(a, b) {
      var dx, dy, dz;
      dx = a.x - b.x;
      dy = a.y - b.y;
      dz = a.z - b.z;
      return sqrt(dx * dx + dy * dy + dz * dz);
    };

    Vector.distanceSquared = function(a, b) {
      var dx, dy, dz;
      dx = a.x - b.x;
      dy = a.y - b.y;
      dz = a.z - b.z;
      return dx * dx + dy * dy + dz * dz;
    };

    function Vector(x, y, z) {
      var v;
      if (!(this instanceof Vector)) return new Vector(x, y, z);
      if ((v = arguments[0]) instanceof Vector) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
      } else {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    }

    Vector.prototype.apply = function(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
    };

    Vector.prototype.zero = function() {
      this.x = this.y = this.z = 0;
    };

    Vector.prototype.invert = function() {
      this.a *= -1;
      this.b *= -1;
      this.c *= -1;
    };

    Vector.prototype.normalize = function() {
      var d, dPow;
      dPow = this.x * this.x + this.y * this.y + this.z * this.z;
      if (dPow > 0) {
        d = sqrt(dPow);
        this.x /= d;
        this.y /= d;
        this.z /= d;
      }
    };

    return Vector;

  })();

}).call(this);
}, "core/Klass": function(exports, require, module) {(function() {

  /*
  graphicsJS
  
  The MIT License (MIT)
  
  Copyright (c) 2011 Daisuke MINO
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  */

  var Klass;

  module.exports = Klass = (function() {

    function Klass() {}

    Klass.prototype.defineProperty = (function() {
      if (Object.defineProperty != null) {
        return function(prop, getter, setter) {
          var descriptor;
          descriptor = {};
          if (getter != null) descriptor.get = getter;
          if (setter != null) descriptor.set = setter;
          descriptor.enumerable = true;
          descriptor.configuable = false;
          return Object.defineProperty(this, prop, descriptor);
        };
      } else if ((Object.prototype.__defineGetter__ != null) && (Object.prototype.__defineSetter__ != null)) {
        return function(prop, getter, setter) {
          if (getter != null) this.prototype.__defineGetter__(prop, getter);
          if (setter != null) return this.prototype.__defineSetter__(prop, setter);
        };
      } else {
        throw new Error("Doesn't support 'getter/setter' properties.");
      }
    })();

    return Klass;

  })();

}).call(this);
}, "display/Bitmap": function(exports, require, module) {(function() {
  var Bitmap, DisplayObject, Rectangle;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('display/DisplayObject');

  Rectangle = require('geom/Rectangle');

  module.exports = Bitmap = (function() {

    __extends(Bitmap, DisplayObject);

    function Bitmap() {
      Bitmap.__super__.constructor.call(this, 'Bitmap');
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
        method: 'drawImage',
        arguments: [image, x, y],
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

  })();

}).call(this);
}, "display/Blend": function(exports, require, module) {(function() {
  var Blend, _max, _min, _mix, _peg;

  _mix = function(a, b, f) {
    return a + (((b - a) * f) >> 8);
  };

  _peg = function(n) {
    if (n < 0) {
      return 0;
    } else if (n > 255) {
      return 255;
    } else {
      return n;
    }
  };

  _min = Math.min;

  _max = Math.max;

  module.exports = Blend = {
    scan: function(dst, src, method) {
      var d, i, o, s, _ref, _ref2;
      method = this[method];
      if (method == null) throw new TypeError("" + method + " isn't defined.");
      d = dst.data;
      s = src.data;
      for (i = 0, _ref = d.length; i < _ref; i += 4) {
        o = method(d[i], d[i + 1], d[i + 2], d[i + 3], s[i], s[i + 1], s[i + 2], s[i + 3]);
        [].splice.apply(d, [i, (i + 3) - i + 1].concat(_ref2 = o.slice(0, 4))), _ref2;
      }
      return dst;
    },
    blend: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, sr, sa), _mix(dg, sg, sa), _mix(db, sb, sa), da + sa];
    },
    add: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [dr + (sr * sa >> 8), dg + (sg * sa >> 8), db + (sb * sa >> 8), da + sa];
    },
    subtract: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [dr - (sr * sa >> 8), dg - (sg * sa >> 8), db - (sb * sa >> 8), da + sa];
    },
    darkest: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, _min(dr, sr * sa >> 8), sa), _mix(dg, _min(dg, sg * sa >> 8), sa), _mix(db, _min(db, sb * sa >> 8), sa), da + sa];
    },
    lightest: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_max(dr, sr * sa >> 8), _max(dg, sg * sa >> 8), _max(db, sb * sa >> 8), da + sa];
    },
    difference: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (dr > sr ? dr - sr : sr - dr), sa), _mix(dg, (dg > sg ? dg - sg : sg - dg), sa), _mix(db, (db > sb ? db - sb : sb - db), sa), da + sa];
    },
    exclusion: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, dr + sr - (dr * sr >> 7), sa), _mix(dg, dg + sg - (dg * sg >> 7), sa), _mix(db, db + sb - (db * sb >> 7), sa), da + sa];
    },
    reflex: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (sr === 0xff ? sr : dr * dr / (0xff - sr)), sa), _mix(dg, (sg === 0xff ? sg : dg * dg / (0xff - sg)), sa), _mix(db, (sb === 0xff ? sb : db * db / (0xff - sb)), sa), da + sa];
    },
    multiply: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, dr * sr >> 8, sa), _mix(dg, dg * sg >> 8, sa), _mix(db, db * sb >> 8, sa), da + sa];
    },
    screen: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, 0xff - ((0xff - dr) * (0xff - sr) >> 8), sa), _mix(dg, 0xff - ((0xff - dg) * (0xff - sg) >> 8), sa), _mix(db, 0xff - ((0xff - db) * (0xff - sb) >> 8), sa), da + sa];
    },
    overlay: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (dr < 0x80 ? dr * sr >> 7 : 0xff - ((0xff - dr) * (0xff - sr) >> 7)), sa), _mix(dg, (dg < 0x80 ? dg * sg >> 7 : 0xff - ((0xff - dg) * (0xff - sg) >> 7)), sa), _mix(db, (db < 0x80 ? db * sb >> 7 : 0xff - ((0xff - db) * (0xff - sb) >> 7)), sa), da + sa];
    },
    softLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (dr * sr >> 7) + (dr * dr >> 8) - (dr * dr * sr >> 15), sa), _mix(dg, (dg * sg >> 7) + (dg * dg >> 8) - (dg * dg * sg >> 15), sa), _mix(db, (db * sb >> 7) + (db * db >> 8) - (db * db * sb >> 15), sa), da + sa];
    },
    hardLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (sr < 0x80 ? dr * sr >> 7 : 0xff - (((0xff - dr) * (0xff - sr)) >> 7)), sa), _mix(dg, (sg < 0x80 ? dg * sg >> 7 : 0xff - (((0xff - dg) * (0xff - sg)) >> 7)), sa), _mix(db, (sb < 0x80 ? db * sb >> 7 : 0xff - (((0xff - db) * (0xff - sb)) >> 7)), sa), da + sa];
    },
    vividLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [(sr === 0 ? 0 : sr === 0xff ? 0xff : sr < 0x80 ? 0xff - _peg(((0xff - dr) << 8) / (sr * 2)) : _peg((dr << 8) / ((0xff - sr) * 2))), (sg === 0 ? 0 : sg === 0xff ? 0xff : sg < 0x80 ? 0xff - _peg(((0xff - dg) << 8) / (sg * 2)) : _peg((dg << 8) / ((0xff - sg) * 2))), (sb === 0 ? 0 : sb === 0xff ? 0xff : sb < 0x80 ? 0xff - _peg(((0xff - db) << 8) / (sb * 2)) : _peg((db << 8) / ((0xff - sb) * 2))), da + sa];
    },
    linearLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [(sr < 0x80 ? _max(sr * 2 + dr - 0xff, 0) : _min(sr + dr, 0xff)), (sg < 0x80 ? _max(sg * 2 + dg - 0xff, 0) : _min(sg + dg, 0xff)), (sb < 0x80 ? _max(sb * 2 + db - 0xff, 0) : _min(sb + db, 0xff)), da + sa];
    },
    pinLight: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [(sr < 0x80 ? _min(sr * 2, dr) : _max((sr - 0x80) * 2, dr)), (sg < 0x80 ? _min(sg * 2, dg) : _max((sg - 0x80) * 2, dg)), (sb < 0x80 ? _min(sb * 2, db) : _max((sb - 0x80) * 2, db)), da + sa];
    },
    hardMix: function(dr, dg, db, da, sr, sg, sb, sa) {
      var b, g, r;
      r = (sr === 0 ? 0 : sr === 0xff ? 0xff : sr < 0x80 ? 0xff - _peg(((0xff - dr) << 8) / (sr * 2)) : _peg((dr << 8) / ((0xff - sr) * 2)));
      g = (sg === 0 ? 0 : sg === 0xff ? 0xff : sg < 0x80 ? 0xff - _peg(((0xff - dg) << 8) / (sg * 2)) : _peg((dg << 8) / ((0xff - sg) * 2)));
      b = (sb === 0 ? 0 : sb === 0xff ? 0xff : sb < 0x80 ? 0xff - _peg(((0xff - db) << 8) / (sb * 2)) : _peg((db << 8) / ((0xff - sb) * 2)));
      return [r < 0x80 ? 0 : 0xff, g < 0x80 ? 0 : 0xff, b < 0x80 ? 0 : 0xff, da + sa];
    },
    dodge: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, _peg((dr << 8) / (0xff - sr)), sa), _mix(dg, _peg((dg << 8) / (0xff - sg)), sa), _mix(db, _peg((db << 8) / (0xff - sb)), sa), da + sa];
    },
    burn: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, (sr === 0 ? 0 : 0xff - _peg(((0xff - dr) << 8) / sr)), sa), _mix(dg, (sg === 0 ? 0 : 0xff - _peg(((0xff - dg) << 8) / sg)), sa), _mix(db, (sb === 0 ? 0 : 0xff - _peg(((0xff - db) << 8) / sb)), sa), da + sa];
    },
    linearDodge: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, _min(sr + dr, 0xff), sa), _mix(dg, _min(dg + sg, 0xff), sa), _mix(db, _min(db + sb, 0xff), sa), da + sa];
    },
    linearBurn: function(dr, dg, db, da, sr, sg, sb, sa) {
      return [_mix(dr, _max(sr + dr - 0xff, 0), sa), _mix(dg, _max(dg + sg - 0xff, 0), sa), _mix(db, _max(db + sb - 0xff, 0), sa), da + sa];
    }
  };

}).call(this);
}, "display/BlendMode": function(exports, require, module) {(function() {
  var BlendMode;

  module.exports = BlendMode = {
    NORMAL: 'normal',
    BLEND: 'blend',
    ADD: 'add',
    SUBTRACT: 'subtract',
    DARKEST: 'darkest',
    LIGHTEST: 'lightest',
    DIFFERENCE: 'difference',
    EXCLUSION: 'exclusion',
    MULTIPLY: 'multiply',
    SCREEN: 'screen',
    OVERLAY: 'overlay',
    SOFT_LIGHT: 'softLight',
    HARD_LIGHT: 'hardLight',
    VIVID_LIGHT: 'vividLight',
    LINEAR_LIGHT: 'linearLight',
    PIN_LIGHT: 'pinLight',
    HARD_MIX: 'hardMix',
    DODGE: 'dodge',
    BURN: 'burn',
    LINEAR_DODGE: 'linearDodge',
    LINEAR_BURN: 'linearBurn'
  };

}).call(this);
}, "display/CapsStyle": function(exports, require, module) {(function() {
  var CapsStyle;

  module.exports = CapsStyle = {
    NONE: 'butt',
    BUTT: 'butt',
    ROUND: 'round',
    SQUARE: 'square'
  };

}).call(this);
}, "display/DisplayObject": function(exports, require, module) {(function() {
  var BlendMode, DisplayObject, EventDispatcher, Matrix, Point, Rectangle, _RADIAN_PER_DEGREE;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventDispatcher = require('events/EventDispatcher');

  BlendMode = require('display/BlendMode');

  Matrix = require('geom/Matrix');

  Point = require('geom/Point');

  Rectangle = require('geom/Rectangle');

  _RADIAN_PER_DEGREE = Math.PI / 180;

  module.exports = DisplayObject = (function() {

    __extends(DisplayObject, EventDispatcher);

    function DisplayObject() {
      DisplayObject.__super__.constructor.call(this);
      this.defineProperty('stage', function() {
        return this.__stage;
      }, function(value) {
        this.__stage = value;
      });
      this.defineProperty('parent', function() {
        return this._parent;
      });
      this.defineProperty('x', function() {
        return this._x;
      }, function(value) {
        this._x = value;
        this._requestRender(false);
      });
      this.defineProperty('y', function() {
        return this._y;
      }, function(value) {
        this._y = value;
        this._requestRender(false);
      });
      this.defineProperty('alpha', function() {
        return this._alpha;
      }, function(value) {
        this._alpha = value;
        this._requestRender(false);
      });
      this.defineProperty('rotation', function() {
        return this._rotation;
      }, function(value) {
        this._rotation = value;
        this._requestRender(false);
      });
      this.defineProperty('width', function() {
        return this._width;
      }, function(value) {
        this._width = value;
        if (this._context.canvas.width !== 0) {
          this._scaleX = value / this._context.canvas.width;
        }
        this._requestRender(false);
      });
      this.defineProperty('height', function() {
        return this._height;
      }, function(value) {
        this._height = value;
        if (this._context.canvas.height !== 0) {
          this._scaleY = value / this._context.canvas.height;
        }
        this._requestRender(false);
      });
      this.defineProperty('scaleX', function() {
        return this._scaleX;
      }, function(value) {
        this._scaleX = value;
        this._width = this._context.canvas.width * value;
        this._requestRender(false);
      });
      this.defineProperty('scaleY', function() {
        return this._scaleY;
      }, function(value) {
        this._scaleY = value;
        this._height = this._context.canvas.height * value;
        this._requestRender(false);
      });
      this.defineProperty('matrix', function() {
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
      this.blendMode = BlendMode.NORMAL;
      this.filters = [];
      this._context = document.createElement('canvas').getContext('2d');
      this._context.canvas.width = this._context.canvas.height = 0;
      this._stacks = [];
      this._drawn = false;
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
      this._measureSize();
      if (this._parent != null) this._parent._requestRender(true);
      return this;
    };

    DisplayObject.prototype._render = function() {
      this._drawn = false;
      this._applySize();
      this._execStacks();
      return this._applyFilters();
    };

    DisplayObject.prototype._measureSize = function() {
      var b, bounds, delta, rect, stack, _i, _len, _ref;
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
      return this._context.setTransform(1, 0, 0, 1, 0, 0);
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
      this._context.strokeStyle = 'rgba(0, 0, 255, .8)';
      this._context.lineWidth = 1;
      return this._context.strokeRect(0, 0, this._context.canvas.width, this._context.canvas.height);
    };

    DisplayObject.prototype.hitTestPoint = function(point) {
      return this.hitTest(point.x, point.y);
    };

    DisplayObject.prototype.hitTest = function(stageX, stageY) {
      var local;
      local = this.globalToLocal(stageX, stageY);
      return this._hitTest(local.x, local.y);
    };

    DisplayObject.prototype._hitTest = function(localX, localY) {
      return this._bounds.contains(localX, localY);
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
      return new Point(x, y);
    };

    return DisplayObject;

  })();

}).call(this);
}, "display/GradientType": function(exports, require, module) {(function() {
  var GradientType;

  module.exports = GradientType = {
    LINEAR: 'linear',
    RADIAL: 'radial'
  };

}).call(this);
}, "display/Graphics": function(exports, require, module) {(function() {
  var CapsStyle, GradientType, Graphics, JointStyle, Point, Rectangle, _ELLIPSE_CUBIC_BEZIER_HANDLE, _PI, _PI_1_2, _PI_2;

  GradientType = require('display/GradientType');

  CapsStyle = require('display/CapsStyle');

  JointStyle = require('display/JointStyle');

  Point = require('geom/Point');

  Rectangle = require('geom/Rectangle');

  _PI = Math.PI;

  _PI_1_2 = _PI / 2;

  _PI_2 = _PI * 2;

  _ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3;

  module.exports = Graphics = (function() {

    Graphics.toColorString = function(color, alpha) {
      if (color == null) color = 0;
      if (alpha == null) alpha = 1;
      return "rgba(" + (color >> 16 & 0xff) + "," + (color >> 8 & 0xff) + "," + (color & 0xff) + "," + (alpha < 0 ? 0 : alpha > 1 ? 1 : alpha) + ")";
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
      this._context.fillStyle = this._context.strokeStyle = 'rgba(0,0,0,0)';
      this._context.translate(-this._displayObject._bounds.x, -this._displayObject._bounds.y);
      drawingCounter = 0;
      _ref = this._stacks;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        stack = _ref[i];
        method = stack.method;
        isDrawing = method.indexOf('draw') === 0;
        if (method === 'moveTo' || method === 'lineTo' || method === 'quadraticCurveTo' || method === 'cubicCurveTo' || isDrawing) {
          drawingCounter++;
        } else if (drawingCounter !== 0) {
          drawingCounter = 0;
          if (isDrawing) this._context.closePath();
          this._context.fill();
          this._context.stroke();
        }
        this._clockwise = drawingCounter === 1 ? 1 : -1;
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
      if (color == null) color = 0x000000;
      if (alpha == null) alpha = 1;
      if (capsStyle == null) capsStyle = CapsStyle.NONE;
      if (jointStyle == null) jointStyle = JointStyle.BEVEL;
      if (miterLimit == null) miterLimit = 10;
      this._stacks.push({
        method: 'lineStyle',
        arguments: [thickness, color, alpha, capsStyle, jointStyle, miterLimit],
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
      if (color == null) color = 0x000000;
      if (alpha == null) alpha = 1;
      this._stacks.push({
        method: 'beginFill',
        arguments: [color, alpha]
      });
      return this._requestRender(true);
    };

    Graphics.prototype._beginFill = function(color, alpha) {
      this._context.fillStyle = Graphics.toColorString(color, alpha);
    };

    Graphics.prototype.beginGradientFill = function(type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio) {
      if (matrix == null) matrix = null;
      if (spreadMethod == null) spreadMethod = 'pad';
      if (interpolationMethod == null) interpolationMethod = 'rgb';
      if (focalPointRatio == null) focalPointRatio = 0;
      this._stacks.push({
        method: 'beginGradientFill',
        arguments: [type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio]
      });
      return this._requestRender(true);
    };

    Graphics.prototype._beginGradientFill = function(type, colors, alphas, ratios, matrix, focalPointRatio) {
      var a, b, cB, cBL, cBR, cCenter, cDst, cL, cR, cSrc, cTL, dNormal, focalRadius, gradient, i, len, long, ratio, v0, v1, vCB, vCL, vNormal, vR, x1p, x2p, y1p, y2p, _len;
      len = ratios.length;
      if (colors.length !== len || alphas.length !== len) {
        throw new TypeError('Invalid length of colors, alphas or ratios.');
      }
      cTL = matrix.transformPoint(new Point(-1638.4 / 2, -1638.4 / 2));
      cBR = matrix.transformPoint(new Point(1638.4 / 2, 1638.4 / 2));
      cBL = matrix.transformPoint(new Point(-1638.4 / 2, 1638.4 / 2));
      v1 = cBR.clone().subtract(cTL).divide(2);
      cCenter = cTL.clone().add(v1);
      switch (type) {
        case 'linear':
          v0 = cBL.clone().subtract(cTL);
          dNormal = v1.distance * Math.abs(Math.sin(v1.angle - v0.angle));
          vNormal = v0.clone().rotate(Math.PI / 2).normalize(dNormal);
          cSrc = cCenter.clone().add(vNormal);
          cDst = cCenter.clone().subtract(vNormal);
          gradient = this._context.createLinearGradient(cSrc.x, cSrc.y, cDst.x, cDst.y);
          break;
        case 'radial':
          cR = matrix.transformPoint(new Point(1638.4 / 2, 0));
          vR = cR.clone().subtract(cCenter);
          cL = cTL.clone().add(cBL).divide(2);
          cB = cBR.clone().add(cBL).divide(2);
          vCL = cL.clone().subtract(cCenter);
          vCB = cB.clone().subtract(cCenter);
          x1p = vCL.x * vCL.x;
          y1p = vCL.y * vCL.y;
          x2p = vCB.x * vCB.x;
          y2p = vCB.y * vCB.y;
          a = Math.sqrt((y1p * x2p - x1p * y2p) / (y1p - y2p));
          b = Math.sqrt((x1p * y2p - y1p * x2p) / (x1p - x2p));
          long = Math.max(a, b);
          focalRadius = long * focalPointRatio;
          gradient = this._context.createRadialGradient(cCenter.x, cCenter.y, long, cCenter.x + focalRadius * Math.cos(vR.angle), cCenter.y + focalRadius * Math.sin(vR.angle), 0);
          ratios = ratios.slice();
          ratios.reverse();
      }
      for (i = 0, _len = ratios.length; i < _len; i++) {
        ratio = ratios[i];
        gradient.addColorStop(ratio / 0xff, Graphics.toColorString(colors[i], alphas[i]));
      }
      return this._context.fillStyle = gradient;
    };

    Graphics.prototype.endFill = function(color, alpha) {
      if (color == null) color = 0x000000;
      if (alpha == null) alpha = 1;
      this._stacks.push({
        method: 'endFill',
        arguments: [color, alpha]
      });
      return this._requestRender(true);
    };

    Graphics.prototype._endFill = function(color, alpha) {};

    Graphics.prototype.moveTo = function(x, y) {
      this._stacks.push({
        method: 'moveTo',
        arguments: [x, y],
        rect: new Rectangle(x, y, 0, 0)
      });
      return this._requestRender(true);
    };

    Graphics.prototype._moveTo = function(x, y) {
      this._context.moveTo(x, y);
    };

    Graphics.prototype.lineTo = function(x, y, thickness) {
      this._stacks.push({
        method: 'lineTo',
        arguments: [x, y],
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
        method: 'drawPath',
        arguments: [commands, data, clockwise],
        rect: rect
      });
      return this._requestRender(true);
    };

    Graphics.prototype._drawPath = function(commands, data, clockwise) {
      var c, command, i, j, rData, _i, _len, _len2;
      if (clockwise === 0) clockwise = this._clockwise;
      if (clockwise < 0) {
        commands = commands.slice();
        c = commands.shift();
        commands.reverse();
        commands.unshift(c);
        rData = [];
        j = 0;
        for (_i = 0, _len = commands.length; _i < _len; _i++) {
          command = commands[_i];
          rData.unshift(data[j++], data[j++]);
        }
        data = rData;
      }
      j = 0;
      for (i = 0, _len2 = commands.length; i < _len2; i++) {
        command = commands[i];
        switch (command) {
          case 0:
            this._context.moveTo(data[j++], data[j++]);
            break;
          case 1:
            this._context.lineTo(data[j++], data[j++]);
            break;
          case 2:
            this._context.quadraticCurveTo(data[j++], data[j++], data[j++], data[j++]);
            break;
          case 3:
            this._context.bezierCurveTo(data[j++], data[j++], data[j++], data[j++], data[j++], data[j++]);
        }
      }
      if (data[0] === data[data.length - 2] && data[1] === data[data.length - 1]) {
        return this._context.closePath();
      }
    };

    Graphics.prototype.quadraticCurveTo = function(x1, y1, x2, y2) {
      this._stacks.push({
        method: 'quadraticCurveTo',
        arguments: [x1, y1, x2, y2],
        rect: new Rectangle(x1, y1).contain(x2, y2)
      });
      return this._requestRender(true);
    };

    Graphics.prototype.curveTo = Graphics.prototype.quadraticCurveTo;

    Graphics.prototype._quadraticCurveTo = function(x1, y1, x2, y2) {
      return this._context.quadraticCurveTo(x1, y1, x2, y2);
    };

    Graphics.prototype.cubicCurveTo = function(x1, y1, x2, y2, x3, y3) {
      this._stacks.push({
        method: 'cubicCurveTo',
        arguments: [x1, y1, x2, y2, x3, y3],
        rect: new Rectangle(x1, y1).contain(x2, y2).contain(x3, y3)
      });
      return this._requestRender(true);
    };

    Graphics.prototype.bezierCurveTo = Graphics.prototype.cubicCurveTo;

    Graphics.prototype._cubicCurveTo = function(x1, y1, x2, y2, x3, y3) {
      return this._context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    };

    Graphics.prototype.drawRectangle = function(rect) {
      return this.drawRect(rect.x, rect.y, rect.width, rect.height);
    };

    Graphics.prototype.drawRect = function(x, y, width, height) {
      var b, r;
      if (height == null) height = width;
      r = x + width;
      b = y + height;
      return this.drawPath([0, 1, 1, 1, 1], [x, y, r, y, r, b, x, b, x, y], 0);
    };

    Graphics.prototype.drawRoundRectangle = function(rect, ellipseW, ellipseH) {
      if (ellipseH == null) ellipseH = ellipseW;
      return this.drawRoundRect(rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH);
    };

    Graphics.prototype.drawRoundRect = function(x, y, width, height, ellipseW, ellipseH) {
      if (ellipseH == null) ellipseH = ellipseW;
      return this.drawPath([0, 1, 2, 1, 2, 1, 2, 1, 2], [x + ellipseW, y, x + width - ellipseW, y, x + width, y, x + width, y + ellipseH, x + width, y + height - ellipseH, x + width, y + height, x + width - ellipseW, y + height, x + ellipseW, y + height, x, y + height, x, y + height - ellipseH, x, y + ellipseH, x, y, x + ellipseW, y], 0);
    };

    Graphics.prototype.drawCircle = function(x, y, radius) {
      this._stacks.push({
        method: 'drawCircle',
        arguments: [x, y, radius],
        rect: new Rectangle(x - radius, y - radius, radius * 2, radius * 2)
      });
      return this._requestRender(true);
    };

    Graphics.prototype._drawCircle = function(x, y, radius) {
      this._context.moveTo(x + radius, y);
      this._context.arc(x, y, radius, 0, _PI_2, this._clockwise < 0);
    };

    Graphics.prototype.drawEllipse = function(x, y, width, height) {
      var handleHeight, handleWidth;
      width /= 2;
      height /= 2;
      x += width;
      y += height;
      handleWidth = width * _ELLIPSE_CUBIC_BEZIER_HANDLE;
      handleHeight = height * _ELLIPSE_CUBIC_BEZIER_HANDLE;
      return this.drawPath([0, 3, 3, 3, 3], [x + width, y, x + width, y + handleHeight, x + handleWidth, y + height, x, y + height, x - handleWidth, y + height, x - width, y + handleHeight, x - width, y, x - width, y - handleHeight, x - handleWidth, y - height, x, y - height, x + handleWidth, y - height, x + width, y - handleHeight, x + width, y], 0);
    };

    Graphics.prototype.drawRegularPolygon = function(x, y, radius, length) {
      var commands, data, i, rotation, unitRotation;
      if (length == null) length = 3;
      commands = [];
      data = [];
      unitRotation = _PI_2 / length;
      for (i = 0; 0 <= length ? i <= length : i >= length; 0 <= length ? i++ : i--) {
        commands.push(i === 0 ? 0 : 1);
        rotation = -_PI_1_2 + unitRotation * i;
        data.push(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
      }
      return this.drawPath(commands, data, 0);
    };

    Graphics.prototype.drawRegularStar = function(x, y, outer, length) {
      var cos;
      if (length == null) length = 5;
      cos = Math.cos(_PI / length);
      return this.drawStar(x, y, outer, outer * (2 * cos - 1 / cos), length);
    };

    Graphics.prototype.drawStar = function(x, y, outer, inner, length) {
      var commands, data, i, radius, rotation, unitRotation, _ref;
      if (length == null) length = 5;
      commands = [];
      data = [];
      unitRotation = _PI / length;
      for (i = 0, _ref = length * 2; i <= _ref; i += 1) {
        commands.push(i === 0 ? 0 : 1);
        radius = (i & 1) === 0 ? outer : inner;
        rotation = -_PI_1_2 + unitRotation * i;
        data.push(x + radius * Math.cos(rotation), y + radius * Math.sin(rotation));
      }
      return this.drawPath(commands, data, 0);
    };

    return Graphics;

  })();

}).call(this);
}, "display/InteractiveObject": function(exports, require, module) {(function() {
  var DisplayObject, EventPhase, InteractiveObject, MouseEvent, Point, _RADIAN_PER_DEGREE;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('display/DisplayObject');

  EventPhase = require('events/EventPhase');

  MouseEvent = require('events/MouseEvent');

  Point = require('geom/Point');

  _RADIAN_PER_DEGREE = Math.PI / 180;

  module.exports = InteractiveObject = (function() {

    __extends(InteractiveObject, DisplayObject);

    function InteractiveObject() {
      this._drag = __bind(this._drag, this);      InteractiveObject.__super__.constructor.call(this);
    }

    InteractiveObject.prototype._hitTest = function(localX, localY) {
      return this._context.isPointInPath(localX - this._bounds.x, localY - this._bounds.y);
    };

    InteractiveObject.prototype._propagateMouseEvent = function(event) {
      var child, e, hit, i, pt;
      if (this._mouseEnabled && event._isPropagationStopped === false) {
        event = event.clone();
        pt = this._getTransform().invert().transformPoint(new Point(event.localX, event.localY));
        event.localX = pt.x;
        event.localY = pt.y;
        hit = this._hitTest(event.localX, event.localY);
        if (hit === true && this._mouseIn === false) {
          e = event.clone();
          e.type = MouseEvent.MOUSE_OVER;
          this._targetMouseEvent(e);
          e = event.clone();
          e.type = MouseEvent.ROLL_OVER;
          e.bubbles = false;
          this._targetMouseEvent(e);
          this._mouseIn = true;
          if (this._buttonMode) this.__stage._canvas.style.cursor = 'pointer';
        } else if (hit === false && this._mouseIn === true) {
          e = event.clone();
          e.type = MouseEvent.MOUSE_OUT;
          this._targetMouseEvent(e);
          e = event.clone();
          e.type = MouseEvent.ROLL_OUT;
          e.bubbles = false;
          this._targetMouseEvent(e);
          this._mouseIn = false;
          if (this !== this.__stage) this.__stage._canvas.style.cursor = 'default';
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
      event = event.clone();
      event.eventPhase = EventPhase.CAPTURING_PHASE;
      event.currentTarget = this;
      this.dispatchEvent(event);
      return event;
    };

    InteractiveObject.prototype._targetMouseEvent = function(event) {
      var _ref;
      event = event.clone();
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
      event = event.clone();
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

  })();

}).call(this);
}, "display/JointStyle": function(exports, require, module) {(function() {
  var JointStyle;

  module.exports = JointStyle = {
    BEVEL: 'bevel',
    MITER: 'miter',
    ROUND: 'round'
  };

}).call(this);
}, "display/Loader": function(exports, require, module) {(function() {
  var Bitmap, Loader, Sprite;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Bitmap = require('display/Bitmap');

  Sprite = require('display/Sprite');

  module.exports = Loader = (function() {

    __extends(Loader, Sprite);

    function Loader() {
      Loader.__super__.constructor.call(this);
    }

    Loader.prototype.load = function(url) {
      var img;
      var _this = this;
      img = new Image();
      img.src = url;
      return img.addEventListener('load', function(e) {
        var bitmap;
        bitmap = new Bitmap();
        bitmap.draw(img);
        _this.content = bitmap;
        _this.addChild(_this.content);
        return _this.dispatchEvent(new Event(Event.COMPLETE));
      });
    };

    return Loader;

  })();

}).call(this);
}, "display/Shape": function(exports, require, module) {(function() {
  var DisplayObject, Graphics, Shape;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DisplayObject = require('display/DisplayObject');

  Graphics = require('display/Graphics');

  module.exports = Shape = (function() {

    __extends(Shape, DisplayObject);

    function Shape() {
      Shape.__super__.constructor.call(this);
      this.graphics = new Graphics(this);
    }

    Shape.prototype._execStacks = function() {
      this.graphics._execStacks();
    };

    Shape.prototype.hitTestPoint = function(point) {
      return this.hitTest(point.x, point.y);
    };

    Shape.prototype.hitTest = function(x, y) {
      var local;
      local = this.globalToLocal(x, y);
      if (this._bounds.containsPoint(local)) {
        return this._hitTest(local.x, local.y);
      } else {
        return false;
      }
    };

    Shape.prototype._hitTest = function(localX, localY) {
      return this._context.isPointInPath(localX - this._bounds.x, localY - this._bounds.y);
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

    return Shape;

  })();

}).call(this);
}, "display/Sprite": function(exports, require, module) {(function() {
  var Blend, BlendMode, Graphics, InteractiveObject, Sprite;

  Graphics = require('display/Graphics');

  InteractiveObject = require('display/InteractiveObject');

  Blend = require('display/Blend');

  BlendMode = require('display/BlendMode');

  module.exports = Sprite = (function() {

    __extends(Sprite, InteractiveObject);

    function Sprite() {
      Sprite.__super__.constructor.call(this);
      this.defineProperty('_stage', null, function(value) {
        var child, _i, _len, _ref;
        _ref = this._children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          child._stage = value;
        }
        this.__stage = value;
      });
      this.defineProperty('mouseEnabled', function() {
        return this._mouseEnabled;
      }, function(value) {
        return this._mouseEnabled = value;
      });
      this.defineProperty('mouseChildren', function() {
        return this._mouseChildren;
      }, function(value) {
        return this._mouseChildren = value;
      });
      this.defineProperty('buttonMode', function() {
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

    Sprite.prototype._execStacks = function() {
      this.graphics._execStacks();
    };

    Sprite.prototype.addChild = function() {
      var child, children, _i, _len;
      children = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        child = children[_i];
        child._stage = this.__stage;
        child._parent = this;
        this._children.push(child);
      }
      return this._requestRender(true);
    };

    Sprite.prototype.addChildAt = function(child, index) {
      if (index < 0 || index > this._children.length) {
        throw new TypeError("index is out of range");
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
      this._drawn = false;
      this._applySize();
      this._execStacks();
      this._drawChildren();
      return this._applyFilters();
    };

    Sprite.prototype._measureSize = function() {
      var b, bounds, child, rect, x, y, _i, _len, _ref;
      Sprite.__super__._measureSize.call(this);
      rect = this._rect;
      bounds = this._bounds;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        rect.union(child._rect);
        b = child._bounds.clone();
        b.x += child.x;
        b.y += child.y;
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
      this._rect = rect;
      this._bounds = bounds;
    };

    Sprite.prototype._drawBounds = function() {
      this._context.strokeStyle = 'rgba(255, 0, 0, .8)';
      this._context.lineWidth = 1;
      this._context.strokeRect(0, 0, this._width, this._height);
    };

    Sprite.prototype._drawChildren = function() {
      var child, dst, src, _i, _len, _ref;
      _ref = this._children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if ((child._bounds != null) && child._bounds.width > 0 && child._bounds.height > 0) {
          if (isNaN(child.x || isNaN(child._bounds.x || isNaN(child.y || isNaN(child._bounds.y))))) {
            throw new Error('invalid position');
          }
          if (child._drawn) child._render();
          child._getTransform().setTo(this._context);
          this._context.globalAlpha = child._alpha < 0 ? 0 : child._alpha > 1 ? 1 : child._alpha;
          if (child.blendMode === BlendMode.NORMAL) {
            this._context.drawImage(child._context.canvas, child._bounds.x - this._bounds.x, child._bounds.y - this._bounds.y);
          } else {
            src = this._context.getImageData(child._bounds.x - this._bounds.x, child._bounds.y - this._bounds.y, child._bounds.width, child._bounds.height);
            dst = child._context.getImageData(0, 0, child._bounds.width, child._bounds.height);
            this._context.putImageData(Blend.scan(src, dst, child.blendMode), child._bounds.x - this._bounds.x, child._bounds.y - this._bounds.y);
          }
          this._context.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    };

    Sprite.prototype.hitTestPoint = function(x, y) {
      var bounds, child, hit, i;
      bounds = this._bounds.clone().offset(this.x, this.y);
      hit = false;
      if (bounds.contains(x, y)) {
        hit = this._context.isPointInPath(x - bounds.x, y - bounds.y);
        if (!hit) {
          i = this._children.length;
          while (i--) {
            child = this._children[i];
            hit |= child.hitTestPoint(x - this.x, y - this.y);
            if (hit) break;
          }
        }
      }
      return hit;
    };

    return Sprite;

  })();

}).call(this);
}, "display/Stage": function(exports, require, module) {(function() {
  var Event, EventPhase, MouseEvent, Rectangle, Sprite, Stage, TextField, TextFormat, Ticker;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Sprite = require('display/Sprite');

  Event = require('events/Event');

  EventPhase = require('events/EventPhase');

  MouseEvent = require('events/MouseEvent');

  Rectangle = require('geom/Rectangle');

  TextField = require('text/TextField');

  TextFormat = require('text/TextFormat');

  Ticker = require('timers/Ticker');

  module.exports = Stage = (function() {

    __extends(Stage, Sprite);

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
      this.defineProperty('frameRate', function() {
        return this._frameRate;
      });
      if (canvasOrWidth instanceof HTMLCanvasElement) {
        canvas = canvasOrWidth;
        this._width = canvas.width;
        this._height = canvas.height;
      } else if (!isNaN(Number(canvasOrWidth)) && !isNaN(Number(height))) {
        canvas = document.createElement('canvas');
        this._width = canvas.width = canvasOrWidth;
        this._height = canvas.height = height;
      } else {
        throw new TypeError('');
      }
      this._canvas = canvas;
      this.__stage = this;
      this._context = canvas.getContext('2d');
      this._bounds = new Rectangle(0, 0, canvas.width, canvas.height);
      this.overrideMouseWheel = false;
      this._startTime = this._time = (new Date()).getTime();
      this.currentFrame = 0;
      this._frameRate = 60;
      Ticker.getInstance().addHandler(this._enterFrame);
      canvas.addEventListener('click', this._onClick, false);
      canvas.addEventListener('mousedown', this._onMouseDown, false);
      canvas.addEventListener('mouseup', this._onMouseUp, false);
      canvas.addEventListener('mousemove', this._onMouseMove, false);
      canvas.addEventListener('mousewheel', this._onMouseWheel, false);
    }

    Stage.prototype.getTimer = function() {
      return new Date().getTime() - this._startTime;
    };

    Stage.prototype._enterFrame = function(time) {
      this.currentFrame++;
      if ((this.currentFrame % 30) === 0) {
        this._frameRate = (300000 / (time - this._time) >> 0) / 10;
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
        if (child._drawn) child._render();
      }
      this._context.canvas.width = this._width;
      this._drawChildren();
    };

    Stage.prototype._requestRender = function() {
      this._drawn = true;
    };

    Stage.prototype._hitTest = function(localX, localY) {
      return this._bounds.contains(localX, localY);
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

  })();

}).call(this);
}, "events/Event": function(exports, require, module) {(function() {
  var Event;
  var __slice = Array.prototype.slice;

  module.exports = Event = (function() {

    Event.ENTER_FRAME = 'enterFrame';

    Event.COMPLETE = 'complete';

    function Event(type, bubbles, cancelable) {
      this.type = type;
      this.bubbles = bubbles != null ? bubbles : false;
      this.cancelable = cancelable != null ? cancelable : false;
      this._isPropagationStopped = false;
      this._isPropagationStoppedImmediately = false;
      this._isDefaultPrevented = false;
    }

    Event.prototype.clone = function() {
      var event;
      event = new Event(this.type, this.bubbles, this.cancelable);
      event.currentTarget = this.currentTarget;
      event.target = this.target;
      return event;
    };

    Event.prototype.formatToString = function() {
      var args, className;
      className = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return '';
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

  })();

}).call(this);
}, "events/EventDispatcher": function(exports, require, module) {(function() {
  var EventDispatcher, EventPhase, Klass;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Klass = require('core/Klass');

  EventPhase = require('events/EventPhase');

  module.exports = EventDispatcher = (function() {

    __extends(EventDispatcher, Klass);

    function EventDispatcher() {
      this._events = {};
    }

    EventDispatcher.prototype.addEventListener = function(type, listener, useCapture, priority) {
      if (useCapture == null) useCapture = false;
      if (priority == null) priority = 0;
      if (typeof listener !== 'function') {
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
          if ((obj.useCapture && event.eventPhase === EventPhase.CAPTURING_PHASE) || (obj.useCapture === false && event.eventPhase !== EventPhase.CAPTURING_PHASE)) {
            (function(obj, event) {
              return setTimeout((function() {
                return obj.listener(event);
              }), 0);
            })(obj, event);
            if (event._isPropagationStoppedImmediately) break;
          }
        }
      }
      return !event._isDefaultPrevented;
    };

    EventDispatcher.prototype.emit = EventDispatcher.dispatchEvent;

    return EventDispatcher;

  })();

}).call(this);
}, "events/EventPhase": function(exports, require, module) {(function() {
  var EventPhase;

  module.exports = EventPhase = {
    CAPTURING_PHASE: 1,
    AT_TARGET: 2,
    BUBBLING_PHASE: 3
  };

}).call(this);
}, "events/KeyboardEvent": function(exports, require, module) {(function() {
  var Event, KeyboardEvent;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Event = require('events/Event');

  module.exports = KeyboardEvent = (function() {

    __extends(KeyboardEvent, Event);

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
      KeyboardEvent.__super__.constructor.call(this, 'Event');
    }

    return KeyboardEvent;

  })();

}).call(this);
}, "events/MouseEvent": function(exports, require, module) {(function() {
  var Event, MouseEvent;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Event = require('events/Event');

  module.exports = MouseEvent = (function() {

    __extends(MouseEvent, Event);

    MouseEvent.CLICK = 'click';

    MouseEvent.CONTEXT_MENU = 'contextMenu';

    MouseEvent.DOUBLE_CLICK = 'doubleClick';

    MouseEvent.MIDDLE_CLICK = 'middleClick';

    MouseEvent.MIDDLE_MOUSE_DOWN = 'middleMouseDown';

    MouseEvent.MIDDLE_MOUSE_UP = 'middleMouseUp';

    MouseEvent.MOUSE_DOWN = 'mouseDown';

    MouseEvent.MOUSE_MOVE = 'mouseMove';

    MouseEvent.MOUSE_OUT = 'mouseOut';

    MouseEvent.MOUSE_OVER = 'mouseOver';

    MouseEvent.MOUSE_UP = 'mouseUp';

    MouseEvent.MOUSE_WHEEL = 'mouseWheel';

    MouseEvent.RIGHT_CLICK = 'rightClick';

    MouseEvent.RIGHT_MOUSE_DOWN = 'rightMouseDown';

    MouseEvent.RIGHT_MOUSE_UP = 'rightMouseUp';

    MouseEvent.ROLL_OUT = 'rollOut';

    MouseEvent.ROLL_OVER = 'rollOver';

    function MouseEvent(type, bubbles, cancelable, localX, localY, relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta, commandKey, controlKey, clickCount) {
      if (bubbles == null) bubbles = false;
      if (cancelable == null) cancelable = false;
      this.localX = localX != null ? localX : NaN;
      this.localY = localY != null ? localY : NaN;
      this.relatedObject = relatedObject != null ? relatedObject : null;
      if (ctrlKey == null) ctrlKey = false;
      if (altKey == null) altKey = false;
      if (shiftKey == null) shiftKey = false;
      if (buttonDown == null) buttonDown = false;
      if (delta == null) delta = 0;
      if (commandKey == null) commandKey = false;
      if (controlKey == null) controlKey = false;
      if (clickCount == null) clickCount = 0;
      MouseEvent.__super__.constructor.call(this, type, bubbles, cancelable);
    }

    MouseEvent.prototype.clone = function() {
      var event;
      event = new MouseEvent(this.type, this.bubbles, this.cancelable, this.localX, this.localY, this.relatedObject, this.ctrlKey, this.altKey, this.shiftKey, this.buttonDown, this.delta, this.commandKey, this.controlKey, this.clickCount);
      event.currentTarget = this.currentTarget;
      event.target = this.target;
      event.stageX = this.stageX;
      event.stageY = this.stageY;
      return event;
    };

    return MouseEvent;

  })();

}).call(this);
}, "filters/BilateralFilter": function(exports, require, module) {(function() {
  var BilateralFilter, KernelFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = BilateralFilter = (function() {

    __extends(BilateralFilter, KernelFilter);

    function BilateralFilter(radiusX, radiusY, sigmaDistance, sigmaColor) {
      var dx, dy, i, kernel, s, _ref, _ref2, _ref3;
      if (sigmaDistance == null) sigmaDistance = 1;
      if (sigmaColor == null) sigmaColor = 1;
      kernel = [];
      s = 2 * sigmaDistance * sigmaDistance;
      for (dy = _ref = 1 - radiusY; dy < radiusY; dy += 1) {
        for (dx = _ref2 = 1 - radiusX; dx < radiusX; dx += 1) {
          kernel.push(Math.exp(-(dx * dx + dy * dy) / s));
        }
      }
      BilateralFilter.__super__.constructor.call(this, radiusX, radiusY, kernel);
      this.colorWeightMap = [];
      s = 2 * sigmaColor * sigmaColor;
      for (i = 0, _ref3 = 0xff * 3; i < _ref3; i += 1) {
        this.colorWeightMap[i] = Math.exp(-i * i * s);
      }
    }

    BilateralFilter.prototype._runKernel = function(kernel, pixels, x, y, width, height) {
      var absX, absY, b, cB, cG, cR, g, h, i, p, r, relX, relY, totalWeight, w, weight;
      p = pixels[y + this.radiusY - 1][x + this.radiusX - 1];
      cR = p[0];
      cG = p[1];
      cB = p[2];
      r = g = b = 0;
      totalWeight = 0;
      h = this.radiusY * 2 - 1;
      w = this.radiusX * 2 - 1;
      i = 0;
      for (relY = 0; relY < h; relY += 1) {
        absY = y + relY;
        for (relX = 0; relX < w; relX += 1) {
          absX = x + relX;
          p = pixels[absY][absX];
          weight = kernel[i] * this.colorWeightMap[Math.abs(p[0] - cR) + Math.abs(p[1] - cG) + Math.abs(p[2] - cB)];
          totalWeight += weight;
          r += p[0] * weight;
          g += p[1] * weight;
          b += p[2] * weight;
          i++;
        }
      }
      return [r / totalWeight, g / totalWeight, b / totalWeight];
    };

    return BilateralFilter;

  })();

}).call(this);
}, "filters/BlurFilter": function(exports, require, module) {(function() {
  var BlurFilter, KernelFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = BlurFilter = (function() {

    __extends(BlurFilter, KernelFilter);

    function BlurFilter(radiusX, radiusY) {
      var invert, kernel, length, side;
      side = radiusX * 2 - 1;
      length = side * side;
      invert = 1 / length;
      kernel = [];
      while (length--) {
        kernel.push(invert);
      }
      BlurFilter.__super__.constructor.call(this, radiusX, radiusY, kernel);
    }

    return BlurFilter;

  })();

}).call(this);
}, "filters/ColorMatrixFilter": function(exports, require, module) {(function() {
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
}, "filters/DeficiencyType": function(exports, require, module) {
  module.exports = DeficiencyType({
    PROTANOPIA: 'protanopia',
    PROTANOMALY: 'protanomaly',
    DEUTERANOPIA: 'deuteranopia',
    DEUTERNOMALY: 'deuteranomaly',
    TRITANOPIA: 'tritanopia',
    TRITANOMALY: 'tritanomaly',
    ACHROMATOSIA: 'achromatopsia',
    ACHROMATOMALY: 'achromatomaly'
  });
}, "filters/DoubleFilter": function(exports, require, module) {(function() {
  var DoubleFilter, KernelFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = DoubleFilter = (function() {

    __extends(DoubleFilter, KernelFilter);

    function DoubleFilter() {
      DoubleFilter.__super__.constructor.apply(this, arguments);
    }

    DoubleFilter.prototype._evaluatePixel = function(pixels, x, y, width, height) {
      var b, g, h, i, p, r, w, _ref;
      r = g = b = 0;
      h = this.radiusY * 2 - 1;
      w = this.radiusX * 2 - 1;
      for (i = 0, _ref = this.kernel.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
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

  })();

}).call(this);
}, "filters/Filter": function(exports, require, module) {(function() {
  var Filter;

  module.exports = Filter = (function() {

    function Filter() {}

    Filter.prototype.scan = function(graphics) {
      var out, pixels, src;
      src = graphics.getImageData();
      pixels = this._getPixels(src);
      out = graphics.createImageData();
      this._setPixels(out, pixels);
      return out;
    };

    Filter.prototype._getPixels = function(imageData) {
      var data, height, i, pixels, width, x, y;
      data = imageData.data;
      width = imageData.width;
      height = imageData.height;
      pixels = [];
      i = 0;
      for (y = 0; y < height; y += 1) {
        pixels[y] = [];
        for (x = 0; x < width; x += 1) {
          pixels[y][x] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
          i += 4;
        }
      }
      return pixels;
    };

    Filter.prototype._setPixels = function(imageData, pixels) {
      var data, height, i, p, width, x, y;
      data = imageData.data;
      width = imageData.width;
      height = imageData.height;
      i = 0;
      for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
          p = this._evaluatePixel(pixels, x, y, width, height);
          data[i] = p[0];
          data[i + 1] = p[1];
          data[i + 2] = p[2];
          data[i + 3] = p[3];
          i += 4;
        }
      }
    };

    Filter.prototype._evaluatePixel = function(pixels, x, y, width, height) {
      return pixels[y][x];
    };

    return Filter;

  })();

}).call(this);
}, "filters/GaussianFilter": function(exports, require, module) {(function() {
  var GaussianFilter, KernelFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = GaussianFilter = (function() {

    __extends(GaussianFilter, KernelFilter);

    function GaussianFilter(radiusX, radiusY, sigma) {
      var dx, dy, i, kernel, s, w, weight, _ref, _ref2, _ref3;
      if (sigma == null) sigma = 1;
      s = 2 * sigma * sigma;
      weight = 0;
      kernel = [];
      for (dy = _ref = 1 - radiusY; dy < radiusY; dy += 1) {
        for (dx = _ref2 = 1 - radiusX; dx < radiusX; dx += 1) {
          w = 1 / (s * Math.PI) * Math.exp(-(dx * dx + dy * dy) / s);
          weight += w;
          kernel.push(w);
        }
      }
      for (i = 0, _ref3 = kernel.length; i < _ref3; i += 1) {
        kernel[i] /= weight;
      }
      GaussianFilter.__super__.constructor.call(this, radiusX, radiusY, kernel);
    }

    return GaussianFilter;

  })();

}).call(this);
}, "filters/KernelFilter": function(exports, require, module) {(function() {
  var Filter, KernelFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Filter = require('filters/Filter');

  module.exports = KernelFilter = (function() {

    __extends(KernelFilter, Filter);

    function KernelFilter(radiusX, radiusY, kernel) {
      this.radiusX = radiusX;
      this.radiusY = radiusY;
      this.kernel = kernel;
    }

    KernelFilter.prototype.scan = function(imageData, newImageData) {
      var pixels, x, y, _ref, _ref2, _ref3;
      pixels = this._getPixels(imageData);
      for (y = 0, _ref = this.radiusY - 1; y < _ref; y += 1) {
        pixels.unshift(pixels[0].concat());
        pixels.push(pixels[pixels.length - 1].concat());
      }
      for (y = 0, _ref2 = pixels.length; y < _ref2; y += 1) {
        for (x = 0, _ref3 = this.radiusX - 1; x < _ref3; x += 1) {
          pixels[y].unshift(pixels[y][0].concat());
          pixels[y].push(pixels[y][pixels[y].length - 1].concat());
        }
      }
      this._setPixels(newImageData, pixels);
      return newImageData;
    };

    KernelFilter.prototype._evaluatePixel = function(pixels, x, y, width, height) {
      var p;
      p = this._runKernel(this.kernel, pixels, x, y, width, height);
      p[3] = pixels[y + this.radiusY - 1][x + this.radiusX - 1][3];
      return p;
    };

    KernelFilter.prototype._runKernel = function(kernel, pixels, x, y, width, height) {
      var absX, absY, b, f, g, h, i, p, r, relX, relY, w;
      r = g = b = 0;
      h = this.radiusY * 2 - 1;
      w = this.radiusX * 2 - 1;
      i = 0;
      for (relY = 0; relY < h; relY += 1) {
        absY = y + relY;
        for (relX = 0; relX < w; relX += 1) {
          absX = x + relX;
          p = pixels[absY][absX];
          f = kernel[i];
          r += p[0] * f;
          g += p[1] * f;
          b += p[2] * f;
          i++;
        }
      }
      return [r, g, b];
    };

    return KernelFilter;

  })();

}).call(this);
}, "filters/LaplacianFilter": function(exports, require, module) {(function() {
  var KernelFilter, LaplacianFilter, _2_DIRECTION, _4_DIRECTION;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  _2_DIRECTION = [0, 1, 0, 1, -4, 1, 0, 1, 0];

  _4_DIRECTION = [1, 1, 1, 1, -8, 1, 1, 1, 1];

  module.exports = LaplacianFilter = (function() {

    __extends(LaplacianFilter, KernelFilter);

    function LaplacianFilter(is4Direction) {
      if (is4Direction == null) is4Direction = false;
      LaplacianFilter.__super__.constructor.call(this, 2, 2, (is4Direction ? _4_DIRECTION : _2_DIRECTION));
    }

    return LaplacianFilter;

  })();

}).call(this);
}, "filters/MedianFilter": function(exports, require, module) {(function() {
  var KernelFilter, MedianFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = MedianFilter = (function() {

    __extends(MedianFilter, KernelFilter);

    function MedianFilter() {
      MedianFilter.__super__.constructor.apply(this, arguments);
    }

    MedianFilter.prototype._runKernel = function(kernel, pixels, x, y, width, height) {
      var absX, absY, h, i, ps, relX, relY, w;
      ps = [];
      h = this.radiusY * 2 - 1;
      w = this.radiusX * 2 - 1;
      i = 0;
      for (relY = 0; relY < h; relY += 1) {
        absY = y + relY;
        for (relX = 0; relX < w; relX += 1) {
          absX = x + relX;
          ps[i] = pixels[absY][absX];
          i++;
        }
      }
      ps.sort(this._sortAsSum);
      return ps[i >> 1];
    };

    MedianFilter.prototype._sortAsSum = function(a, b) {
      var i, sumA, sumB;
      sumA = sumB = 0;
      for (i = 0; i < 3; i += 1) {
        sumA += a[i];
        sumB += b[i];
      }
      return sumA - sumB;
    };

    return MedianFilter;

  })();

}).call(this);
}, "filters/PrewittFilter": function(exports, require, module) {(function() {
  var DoubleFilter, PrewittFilter, _KERNEL;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DoubleFilter = require('filters/DoubleFilter');

  _KERNEL = [[-1, 0, 1, -1, 0, 1, -1, 0, 1], [-1, -1, -1, 0, 0, 0, 1, 1, 1]];

  module.exports = PrewittFilter = (function() {

    __extends(PrewittFilter, DoubleFilter);

    function PrewittFilter() {
      PrewittFilter.__super__.constructor.call(this, 2, 2, _KERNEL);
    }

    return PrewittFilter;

  })();

}).call(this);
}, "filters/SobelFilter": function(exports, require, module) {(function() {
  var DoubleFilter, SobelFilter, _KERNEL;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  DoubleFilter = require('filters/DoubleFilter');

  _KERNEL = [[-1, 0, 1, -2, 0, 2, -1, 0, 1], [-1, -2, -1, 0, 0, 0, 1, 2, 1]];

  module.exports = SobelFilter = (function() {

    __extends(SobelFilter, DoubleFilter);

    function SobelFilter() {
      SobelFilter.__super__.constructor.call(this, 2, 2, _KERNEL);
    }

    return SobelFilter;

  })();

}).call(this);
}, "filters/UnsharpMaskFilter": function(exports, require, module) {(function() {
  var KernelFilter, UnsharpMaskFilter;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  KernelFilter = require('filters/KernelFilter');

  module.exports = UnsharpMaskFilter = (function() {

    __extends(UnsharpMaskFilter, KernelFilter);

    function UnsharpMaskFilter(radiusX, radiusY, amount) {
      var i, invert, kernel, length, side;
      this.amount = amount != null ? amount : 1;
      side = radiusX * 2 - 1;
      length = i = side * side;
      invert = 1 / length;
      kernel = [];
      while (i--) {
        kernel.push(-invert);
      }
      kernel[length >> 1] = 1 + (1 - invert) * this.amount;
      UnsharpMaskFilter.__super__.constructor.call(this, radiusX, radiusY, kernel);
    }

    return UnsharpMaskFilter;

  })();

}).call(this);
}, "geom/ColorMatrix": function(exports, require, module) {(function() {
  var ColorMatrix, StringUtil, _IDENTITY, _LUMA_B, _LUMA_B2, _LUMA_G, _LUMA_G2, _LUMA_R, _LUMA_R2, _ONETHIRD, _RAD;

  StringUtil = require('utils/StringUtil');

  _LUMA_R = 0.212671;

  _LUMA_G = 0.71516;

  _LUMA_B = 0.072169;

  _LUMA_R2 = 0.3086;

  _LUMA_G2 = 0.6094;

  _LUMA_B2 = 0.0820;

  _ONETHIRD = 1 / 3;

  _IDENTITY = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];

  _RAD = Math.PI / 180;

  module.exports = ColorMatrix = (function() {

    function ColorMatrix(matrix) {
      if (matrix instanceof ColorMatrix) {
        this.matrix = matrix.matrix.concat();
      } else if (Array.isArray(matrix)) {
        this.matrix = matrix.concat();
      } else {
        this.reset();
      }
    }

    ColorMatrix.prototype.toString = function() {
      var i, l, t, tmp, v, x, y, _len, _ref, _ref2, _ref3, _ref4;
      tmp = [];
      _ref = this.matrix;
      for (i = 0, _len = _ref.length; i < _len; i++) {
        v = _ref[i];
        if (i % 5 === 0) t = [];
        t.push(String(v));
        if (i % 5 === 4 || i === this.matrix.length - 1) tmp.push(t);
      }
      for (x = 0; x < 5; x++) {
        l = 0;
        for (y = 0, _ref2 = tmp.length; y < _ref2; y += 1) {
          l = Math.max(l, tmp[y][x].length);
        }
        for (y = 0, _ref3 = tmp.length; y < _ref3; y += 1) {
          tmp[y][x] = StringUtil.padLeft(tmp[y][x], l);
        }
      }
      for (y = 0, _ref4 = tmp.length; y < _ref4; y += 1) {
        tmp[y] = tmp[y].join(', ');
        if (y !== tmp.length - 1) tmp[y] += ',';
      }
      return tmp.join('\n');
    };

    ColorMatrix.prototype.clone = function() {
      return new ColorMatrix(this.matrix);
    };

    ColorMatrix.prototype.reset = function() {
      return this.matrix = _IDENTITY.concat();
    };

    ColorMatrix.prototype.concat = function(src) {
      var dst, i, out, x, y;
      dst = this.matrix;
      out = [];
      for (y = 0; y < 4; y++) {
        i = 5 * y;
        for (x = 0; x < 5; x++) {
          out[i + x] = src[i] * dst[x] + src[i + 1] * dst[x + 5] + src[i + 2] * dst[x + 10] + src[i + 3] * dst[x + 15];
        }
        out[i + 4] += src[i + 4];
      }
      return this.matrix = out;
    };

    ColorMatrix.prototype.invert = function() {
      return this.concat([-1, 0, 0, 0, 0xff, 0, -1, 0, 0, 0xff, 0, 0, -1, 0, 0xff, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.adjustSaturation = function(s) {
      var iblum, iglum, irlum;
      irlum = -s * _LUMA_R;
      iglum = -s * _LUMA_G;
      iblum = -s * _LUMA_B;
      ++s;
      return this.concat([irlum + s, iglum, iblum, 0, 0, irlum, iglum + s, iblum, 0, 0, irlum, iglum, iblum + s, 0, 0, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.adjustContrast = function(r, g, b) {
      if (g == null) g = r;
      if (b == null) b = r;
      return this.concat([1 + r, 0, 0, 0, -0x80 * r, 0, 1 + g, 0, 0, -0x80 * g, 0, 0, 1 + b, 0, -0x80 * b, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.adjustBrightness = function(r, g, b) {
      if (g == null) g = r;
      if (b == null) b = r;
      return this.concat([1, 0, 0, 0, 0xff * r, 0, 1, 0, 0, 0xff * g, 0, 0, 1, 0, 0xff * b, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.adjustHue = function(degree) {
      var B, G, R, c, l, m, n, s;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      degree *= _RAD;
      c = Math.cos(degree);
      s = Math.sin(degree);
      l = 1 - c;
      m = l - s;
      n = l + s;
      return this.concat([R * m + c, G * m, B * m + s, 0, 0, R * l + s * 0.143, G * l + c + s * 0.14, B * l + s * -0.283, 0, 0, R * n - s, G * n, B * n + c, 0, 0, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.rotateHue = function(degree) {
      this._initHue();
      this.concat(this._preHue.matrix);
      this.rotateBlue(degree);
      return this.concat(this._postHue.matrix);
    };

    ColorMatrix.prototype.luminance2Alpha = function() {
      return this.concat([0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, _LUMA_R, _LUMA_G, _LUMA_B, 0, 0]);
    };

    ColorMatrix.prototype.adjustAlphaContrast = function(amount) {
      return this.concat([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, amount + 1, -0x80 * amount]);
    };

    ColorMatrix.prototype.colorize = function(rgb, amount) {
      var B, G, R, b, g, invAmount, r;
      if (amount == null) amount = 1;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      r = ((rgb >> 16) & 0xFF) / 0xFF;
      g = ((rgb >> 8) & 0xFF) / 0xFF;
      b = (rgb & 0xFF) / 0xFF;
      invAmount = 1 - amount;
      return this.concat([invAmount + amount * r * R, amount * r * G, amount * r * B, 0, 0, amount * g * R, invAmount + amount * g * G, amount * g * B, 0, 0, amount * b * R, amount * b * G, invAmount + amount * b * B, 0, 0, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.setChannels = function(r, g, b, a) {
      var af, bf, gf, rf;
      if (r == null) r = 1;
      if (g == null) g = 2;
      if (b == null) b = 4;
      if (a == null) a = 8;
      rf = ((r & 1) === 1 ? 1 : 0) + ((r & 2) === 2 ? 1 : 0) + ((r & 4) === 4 ? 1 : 0) + ((r & 8) === 8 ? 1 : 0);
      if (rf > 0) rf = 1 / rf;
      gf = ((g & 1) === 1 ? 1 : 0) + ((g & 2) === 2 ? 1 : 0) + ((g & 4) === 4 ? 1 : 0) + ((g & 8) === 8 ? 1 : 0);
      if (gf > 0) gf = 1 / gf;
      bf = ((b & 1) === 1 ? 1 : 0) + ((b & 2) === 2 ? 1 : 0) + ((b & 4) === 4 ? 1 : 0) + ((b & 8) === 8 ? 1 : 0);
      if (bf > 0) bf = 1 / bf;
      af = ((a & 1) === 1 ? 1 : 0) + ((a & 2) === 2 ? 1 : 0) + ((a & 4) === 4 ? 1 : 0) + ((a & 8) === 8 ? 1 : 0);
      if (af > 0) af = 1 / af;
      return this.concat([((r & 1) === 1 ? rf : 0), ((r & 2) === 2 ? rf : 0), ((r & 4) === 4 ? rf : 0), ((r & 8) === 8 ? rf : 0), 0, ((g & 1) === 1 ? gf : 0), ((g & 2) === 2 ? gf : 0), ((g & 4) === 4 ? gf : 0), ((g & 8) === 8 ? gf : 0), 0, ((b & 1) === 1 ? bf : 0), ((b & 2) === 2 ? bf : 0), ((b & 4) === 4 ? bf : 0), ((b & 8) === 8 ? bf : 0), 0, ((a & 1) === 1 ? af : 0), ((a & 2) === 2 ? af : 0), ((a & 4) === 4 ? af : 0), ((a & 8) === 8 ? af : 0), 0]);
    };

    ColorMatrix.prototype.blend = function(matrix, amount) {
      var i, v, _len, _ref, _results;
      _ref = matrix.matrix;
      _results = [];
      for (i = 0, _len = _ref.length; i < _len; i++) {
        v = _ref[i];
        _results.push(this.matrix[i] = this.matrix[i] * (1 - amount) + v * amount);
      }
      return _results;
    };

    ColorMatrix.prototype.average = function(r, g, b) {
      if (r == null) r = _ONETHIRD;
      if (g == null) g = _ONETHIRD;
      if (b == null) b = _ONETHIRD;
      return this.concat([r, g, b, 0, 0, r, g, b, 0, 0, r, g, b, 0, 0, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.threshold = function(threshold, factor) {
      var B, G, R, t;
      if (factor == null) factor = 0x100;
      R = factor * _LUMA_R;
      G = factor * _LUMA_G;
      B = factor * _LUMA_B;
      t = -factor * threshold;
      return this.concat([R, G, B, 0, t, R, G, B, 0, t, R, G, B, 0, t, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.desaturate = function() {
      var B, G, R;
      R = _LUMA_R;
      G = _LUMA_G;
      B = _LUMA_B;
      return this.concat([R, G, B, 0, 0, R, G, B, 0, 0, R, G, B, 0, 0, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.randomize = function(amount) {
      var b1, b2, b3, g1, g2, g3, inv_amount, o1, o2, o3, r1, r2, r3;
      if (amount == null) amount = 1;
      inv_amount = 1 - amount;
      r1 = inv_amount + (amount * (Math.random() - Math.random()));
      g1 = amount * (Math.random() - Math.random());
      b1 = amount * (Math.random() - Math.random());
      o1 = (amount * 0xFF) * (Math.random() - Math.random());
      r2 = amount * (Math.random() - Math.random());
      g2 = inv_amount + (amount * (Math.random() - Math.random()));
      b2 = amount * (Math.random() - Math.random());
      o2 = (amount * 0xFF) * (Math.random() - Math.random());
      r3 = amount * (Math.random() - Math.random());
      g3 = amount * (Math.random() - Math.random());
      b3 = inv_amount + (amount * (Math.random() - Math.random()));
      o3 = (amount * 0xFF) * (Math.random() - Math.random());
      return this.concat([r1, g1, b1, 0, o1, r2, g2, b2, 0, o2, r3, g3, b3, 0, o3, 0, 0, 0, 1, 0]);
    };

    ColorMatrix.prototype.setMultiplicators = function(r, g, b, a) {
      if (r == null) r = 1;
      if (g == null) g = 1;
      if (b == null) b = 1;
      if (a == null) a = 1;
      return this.concat([r, 0, 0, 0, 0, 0, g, 0, 0, 0, 0, 0, b, 0, 0, 0, 0, 0, a, 0]);
    };

    ColorMatrix.prototype.clearChannels = function(r, g, b, a) {
      if (r == null) r = false;
      if (g == null) g = false;
      if (b == null) b = false;
      if (a == null) a = false;
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
        return this.matrix[15] = this.matrix[16] = this.matrix[17] = this.matrix[18] = this.matrix[19] = 0;
      }
    };

    ColorMatrix.prototype.thresholdAlpha = function(threshold, factor) {
      if (factor == null) factor = 0x100;
      return this.concat([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, factor, -factor * threshold]);
    };

    ColorMatrix.prototype.averageRGB2Alpha = function() {
      return this.concat([0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, _ONETHIRD, _ONETHIRD, _ONETHIRD, 0, 0]);
    };

    ColorMatrix.prototype.invertAlpha = function() {
      return this.concat([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, 0xff]);
    };

    ColorMatrix.prototype.rgb2Alpha = function(r, g, b) {
      return this.concat([0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, 0, 0, 0, 0, 0xff, r, g, b, 0, 0]);
    };

    ColorMatrix.prototype.setAlpha = function(alpha) {
      return this.concat([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, alpha, 0]);
    };

    ColorMatrix.prototype.rotateRed = function(degree) {
      return this._rotateColor(degree, 2, 1);
    };

    ColorMatrix.prototype.rotateGreen = function(degree) {
      return this._rotateColor(degree, 0, 2);
    };

    ColorMatrix.prototype.rotateBlue = function(degree) {
      return this._rotateColor(degree, 1, 0);
    };

    ColorMatrix.prototype._rotateColor = function(degree, x, y) {
      var mat;
      degree *= _RAD;
      mat = _IDENTITY.concat();
      mat[x + x * 5] = mat[y + y * 5] = Math.cos(degree);
      mat[y + x * 5] = Math.sin(degree);
      mat[x + y * 5] = -Math.sin(degree);
      return this.concat(mat);
    };

    ColorMatrix.prototype.shearRed = function(green, blue) {
      return this._shearColor(0, 1, green, 2, blue);
    };

    ColorMatrix.prototype.shearGreen = function(red, blue) {
      return this._shearColor(1, 0, red, 2, blue);
    };

    ColorMatrix.prototype.shearBlue = function(red, green) {
      return this._shearColor(2, 0, red, 1, green);
    };

    ColorMatrix.prototype._shearColor = function(x, y1, d1, y2, d2) {
      var mat;
      mat = _IDENTITY.concat();
      mat[y1 + x * 5] = d1;
      mat[y2 + x * 5] = d2;
      return this.concat(mat);
    };

    ColorMatrix.prototype.applyColorDeficiency = function(type) {
      switch (type) {
        case 'Protanopia':
          this.concat([.567, .433, .0, .0, .0, .558, .442, .0, .0, .0, .0, .242, .758, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Protanomaly':
          this.concat([.817, .183, .0, .0, .0, .333, .667, .0, .0, .0, .0, .125, .875, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Deuteranopia':
          this.concat([.625, .375, .0, .0, .0, .7, .3, .0, .0, .0, .0, .3, .7, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Deuteranomaly':
          this.concat([.8, .2, .0, .0, .0, .258, .742, .0, .0, .0, .0, .142, .858, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Tritanopia':
          this.concat([.95, .05, .0, .0, .0, .0, .433, .567, .0, .0, .0, .475, .525, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Tritanomaly':
          this.concat([.967, .033, .0, .0, .0, .0, .733, .267, .0, .0, .0, .183, .817, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Achromatopsia':
          this.concat([.299, .587, .114, .0, .0, .299, .587, .114, .0, .0, .299, .587, .114, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
        case 'Achromatomaly':
          this.concat([.618, .320, .062, .0, .0, .163, .775, .062, .0, .0, .163, .320, .516, .0, .0, .0, .0, .0, 1.0, .0]);
          break;
      }
    };

    ColorMatrix.prototype.applyMatrix = function(rgba) {
      var a, a2, b, b2, g, g2, m, r, r2;
      a = (rgba >>> 24) & 0xff;
      r = (rgba >>> 16) & 0xff;
      g = (rgba >>> 8) & 0xff;
      b = rgba & 0xff;
      m = this.matrix;
      r2 = 0.5 + r * m[0] + g * m[1] + b * m[2] + a * m[3] + m[4];
      g2 = 0.5 + r * m[5] + g * m[6] + b * m[7] + a * m[8] + m[9];
      b2 = 0.5 + r * m[10] + g * m[11] + b * m[12] + a * m[13] + m[14];
      a2 = 0.5 + r * m[15] + g * m[16] + b * m[17] + a * m[18] + m[19];
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
      var m, oA, oB, oG, oR, sA, sB, sG, sR;
      if (values.length !== 4) throw new TypeError("values length isn't 4");
      m = this.matrix;
      sR = values[0];
      sG = values[1];
      sB = values[2];
      sA = values[3];
      oR = sR * m[0] + sG * m[1] + sB * m[2] + sA * m[3] + m[4];
      oG = sR * m[5] + sG * m[6] + sB * m[7] + sA * m[8] + m[9];
      oB = sR * m[10] + sG * m[11] + sB * m[12] + sA * m[13] + m[14];
      oA = sR * m[15] + sG * m[16] + sB * m[17] + sA * m[18] + m[19];
      values[0] = oR;
      values[1] = oG;
      values[2] = oB;
      return values[3] = oA;
    };

    ColorMatrix.prototype._initHue = function() {
      var green, greenRotation, lum, red;
      greenRotation = 39.182655;
      if (!this._hueInitialized) {
        this._hueInitialized = true;
        this._preHue = new ColorMatrix();
        this._preHue.rotateRed(45);
        this._preHue.rotateGreen(-greenRotation);
        lum = [_LUMA_R2, _LUMA_G2, _LUMA_B2, 1.0];
        this._preHue.transformVector(lum);
        red = lum[0] / lum[2];
        green = lum[1] / lum[2];
        this._preHue.shearBlue(red, green);
        this._postHue = new ColorMatrix();
        this._postHue.shearBlue(-red, -green);
        this._postHue.rotateGreen(greenRotation);
        return this._postHue.rotateRed(-45.0);
      }
    };

    return ColorMatrix;

  })();

}).call(this);
}, "geom/Matrix": function(exports, require, module) {(function() {
  var Matrix, Point, StringUtil, _cos, _sin, _tan;

  Point = require('geom/Point');

  StringUtil = require('utils/StringUtil');

  _sin = Math.sin;

  _cos = Math.cos;

  _tan = Math.tan;

  module.exports = Matrix = (function() {

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
      return new Point(this.xx * pt.x + this.yx * pt.y + this.ox, this.xy * pt.x + this.yy * pt.y + this.oy);
    };

    Matrix.prototype.deltaTransformPoint = function(pt) {
      return new Point(this.xx * pt.x + this.yx * pt.y, this.xy * pt.x + this.yy * pt.y);
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

  })();

}).call(this);
}, "geom/Point": function(exports, require, module) {(function() {
  var Klass, Point;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Klass = require('core/Klass');

  module.exports = Point = (function() {

    __extends(Point, Klass);

    Point.cross = function(src, dst) {
      return src.distance * dst.distance * Math.sin(dst.angle - src.angle);
    };

    function Point(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      this.defineProperty('angle', function() {
        return Math.atan2(this.y, this.x);
      }, function(angle) {
        var radius;
        radius = Math.sqrt(this.x * this.x + this.y * this.y);
        this.x = radius * Math.cos(angle);
        this.y = radius * Math.sin(angle);
      });
      this.defineProperty('DISTANCE', function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }, function(distance) {
        var ratio;
        ratio = distance / Math.sqrt(this.x * this.x + this.y * this.y);
        this.x *= ratio;
        this.y *= ratio;
      });
    }

    Point.prototype.clone = function() {
      return new Point(this.x, this.y);
    };

    Point.prototype.toString = function() {
      return "(" + this.x + ", " + this.y + ")";
    };

    Point.prototype.equals = function(pt) {
      return this.x === pt.x && this.y === pt.y;
    };

    Point.prototype.distanceFrom = function(pt) {
      var x, y;
      x = this.x - pt.x;
      y = this.y - pt.y;
      return Math.sqrt(x * x + y * y);
    };

    Point.prototype.normalize = function(thickness) {
      var ratio;
      if (thickness == null) thickness = 1;
      ratio = thickness / Math.sqrt(this.x * this.x + this.y * this.y);
      this.x *= ratio;
      this.y *= ratio;
      return this;
    };

    Point.prototype.add = function(pt) {
      this.x += pt.x;
      this.y += pt.y;
      return this;
    };

    Point.prototype.subtract = function(pt) {
      this.x -= pt.x;
      this.y -= pt.y;
      return this;
    };

    Point.prototype.divide = function(num) {
      this.x /= num;
      this.y /= num;
      return this;
    };

    Point.prototype.angle = function() {
      return Math.atan2(this.y, this.x);
    };

    Point.between = function(src, dst, ratio) {
      if (ratio == null) ratio = 0.5;
      return new Point(src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio);
    };

    Point.prototype.rotate = function(angle) {
      var radius;
      angle += Math.atan2(this.y, this.x);
      radius = Math.sqrt(this.x * this.x + this.y * this.y);
      this.x = radius * Math.cos(angle);
      this.y = radius * Math.sin(angle);
      return this;
    };

    return Point;

  })();

}).call(this);
}, "geom/Quadtree": function(exports, require, module) {(function() {
  var Quadtree, StringUtil, _padLeft, _pow, _separate;

  StringUtil = require('utils/StringUtil');

  _pow = Math.pow;

  _padLeft = StringUtil.padLeft;

  _separate = function(n) {
    n = (n | (n << 8)) & 0x00ff00ff;
    n = (n | (n << 4)) & 0x0f0f0f0f;
    n = (n | (n << 2)) & 0x33333333;
    return (n | (n << 1)) & 0x55555555;
  };

  module.exports = Quadtree = (function() {

    Quadtree.coordToZOrder = function(x, y) {
      return _separate(x) | (_separate(y) << 1);
    };

    function Quadtree(level) {
      if (level == null) level = 3;
      this._level = level;
      this._sides = _pow(2, this._level);
      this._spaces = this._sides * this._sides;
      this._bits = (this._spaces - 1).toString(2).length;
    }

    Quadtree.prototype.coordsToIndex = function(x0, y0, x1, y1) {
      var i, len, level, m0, m1, shift;
      m0 = Quadtree.coordToZOrder(x0, y0);
      m1 = Quadtree.coordToZOrder(x1, y1);
      level = m0 ^ m1;
      len = this._bits / 2;
      for (i = 0; 0 <= len ? i < len : i > len; 0 <= len ? i++ : i--) {
        if (!((level & (3 << 2 * (len - i - 1))) !== 0)) continue;
        shift = 2 * (len - i);
        break;
      }
      m1 >>= shift;
      return (_pow(4, i) - 1) / 3 + m1;
    };

    Quadtree.prototype.toBitString = function(n) {
      return _padLeft(n.toString(2), this._bits, '0');
    };

    return Quadtree;

  })();

}).call(this);
}, "geom/QuadtreeSpace": function(exports, require, module) {(function() {
  var Quadtree, QuadtreeSpace, Rectangle;

  Quadtree = require('geom/Quadtree');

  Rectangle = require('geom/Rectangle');

  module.exports = QuadtreeSpace = (function() {

    function QuadtreeSpace(rectangle, level, debusSprite) {
      var Shape, TextField, TextFormat, container, format, grid, textField, x, y, _ref, _ref2;
      this.rectangle = rectangle;
      this.debusSprite = debusSprite != null ? debusSprite : null;
      this.quadtree = new Quadtree(level);
      this._widthPerSide = this.rectangle.width / this.quadtree._sides;
      this._heightPerSide = this.rectangle.height / this.quadtree._sides;
      this._storage = [];
      if (this.debugSprite) {
        Shape = require('display/Shape');
        TextField = require('display/TextField');
        TextFormat = require('display/styles/TextFormat');
        container = (new Sprite()).addTo(this.debugSprite);
        grid = (new Shape()).addTo(container);
        format = new TextFormat('monospace', 12, false, false, false, 'center', 'middle');
      }
      for (x = 0, _ref = this.quadtree._sides; x < _ref; x += 1) {
        for (y = 0, _ref2 = this.quadtree._sides; y < _ref2; y += 1) {
          grid.drawRect(this._widthPerSide * x, this._heightPerSide * y, this._widthPerSide, this._heightPerSide);
          textField = new TextField(Quadtree.coordToZOrder(x, y), format);
          textField.x = this._widthPerSide * (x + 0.5);
          textField.y = this._heightPerSide * (y + 0.5);
          textField.addTo(container);
          this._fixedShape = (new Shape()).addTo(container);
          this._floatingShape = (new Shape()).addTo(container);
        }
      }
    }

    QuadtreeSpace.prototype.add = function(rect, fixed) {
      if (fixed == null) fixed = false;
      rect.apply(rect.intersection(this.rectangle));
      this._storage.push({
        rectangle: rect,
        fixed: fixed
      });
      if ((this.debugSprite != null) && fixed) {
        this._fixedShape.drawRect(rect.x - this.rectangle.x, rect.y - this.rectangle.y, rect.width, rect.height);
        this._fixedShape.stroke(1, 0xff0000);
      }
    };

    QuadtreeSpace.prototype.remove = function(rect) {
      var i;
      i = this._storage.length;
      while (i-- > 0) {
        if (rect === this._storage[i].rectangle) {
          this._storage.splice(i, 1);
          break;
        }
      }
    };

    QuadtreeSpace.prototype.detectCollision = function() {
      var collisions, dst, i, index, j, k, l, linear, obj, objects, objs, rect, src, _i, _len, _ref;
      if (this.debugSprite != null) this._floatingShape.clear();
      linear = [];
      _ref = this._storage;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        obj = _ref[_i];
        this._update2DPosition(obj);
        index = this.quadtree.coordsToIndex(obj.x0, obj.y0, obj.x1, obj.y1);
        if (linear[index] != null) linear[index] = [];
        linear[index].push(obj);
        if ((this.debugSprite != null) && obj.fixed === false) {
          rect = obj.rectangle;
          this._floatingShape.drawRect(rect.x - this.rectangle.x, rect.y - this.rectangle.y, rect.width, rect.height);
          this._floatingShape.stroke(1, 0x0000ff);
        }
      }
      collisions = [];
      i = linear.length;
      while (i--) {
        objects = linear[i];
        if (objects != null) {
          j = objects.length;
          while (j--) {
            src = objects[j].rectangle;
            k = j;
            while (k--) {
              dst = objects[k].rectangle;
              if (src.intersects(dst)) collisions.push([src, dst]);
            }
            k = i;
            while ((k = k - 1 >> 2) >= 0) {
              objs = linear[k];
              if (objs != null) {
                l = objs.length;
                while (l--) {
                  dst = objs[l].rectangle;
                  if (src.intersects(dst)) collisions.push([src, dst]);
                }
              }
            }
          }
        }
      }
      return collisions;
    };

    QuadtreeSpace.prototype._update2DPosition = function(obj) {
      var rect;
      rect = obj.rectangle;
      obj.x0 = this._validatePos((rect.x - this.rectangle.x) / this._widthPerSide);
      obj.y0 = this._validatePos((rect.y - this.rectangle.y) / this._heightPerSide);
      obj.x1 = this._validatePos((rect.x + rect.width - this.rectangle.x) / this._widthPerSide);
      obj.y1 = this._validatePos((rect.y + rect.height - this.rectangle.y) / this._heightPerSide);
      return obj.x0 !== -1 && obj.y0 !== -1 && obj.x1 !== -1 && obj.y1 !== -1;
    };

    QuadtreeSpace.prototype._validatePos = function(n) {
      if (n < 0 || this.quadtree._sides < n) {
        return -1;
      } else if (n === this.quadtree._sides) {
        return this.quadtree._sides - 1;
      } else {
        return n >> 0;
      }
    };

    return QuadtreeSpace;

  })();

}).call(this);
}, "geom/Rectangle": function(exports, require, module) {(function() {
  var Rectangle, _max, _min, _sqrt;

  _min = Math.min;

  _max = Math.max;

  _sqrt = Math.sqrt;

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

    Rectangle.prototype.apply = function(rect) {
      this.x = rect.x;
      this.y = rect.y;
      this.width = rect.width;
      this.height = rect.height;
      return this;
    };

    Rectangle.prototype.contains = function(x, y) {
      return (this.x < x && x < this.x + this.width) && (this.y < y && y < this.y + this.height);
    };

    Rectangle.prototype.containsPoint = function(point) {
      var _ref, _ref2;
      return (this.x < (_ref = point.x) && _ref < this.x + this.width) && (this.y < (_ref2 = point.y) && _ref2 < this.y + this.height);
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
      var b, h, l, r, t, w;
      l = _min(this.x, rect.x);
      r = _max(this.x + this.width, rect.x + rect.width);
      w = r - l;
      t = _min(this.y, rect.y);
      b = _max(this.y + this.height, rect.y + rect.height);
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
      if (w <= 0) return new Rectangle();
      t = _max(this.y, rect.y);
      b = _min(this.y + this.height, rect.y + rect.height);
      h = b - t;
      if (h <= 0) return new Rectangle();
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
    if (value instanceof Date) value = DateFormat.stringifyJSON(value);
    if (typeof replacer === 'function') value = replacer.call(holder, key, value);
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
        if (!value) return 'null';
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
              if (v) partial.push(__quote(k) + (gap ? ': ' : ':') + v);
            }
          }
        } else {
          for (k in value) {
            if (!__hasProp.call(value, k)) continue;
            v = __str(k, value, replacer, gap, indent);
            if (v) partial.push(__quote(k) + (gap ? ': ' : ':') + v);
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
      if (separate == null) separate = '&';
      if (equal == null) equal = '=';
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
      if (separator == null) separator = '&';
      if (equal == null) equal = '=';
      query = {};
      queries = string.split(separator);
      _results = [];
      for (_i = 0, _len = queries.length; _i < _len; _i++) {
        q = queries[_i];
        keyValue = q.split(equal);
        key = keyValue[0];
        value = keyValue[1];
        if (key in query) {
          key = decodeURIComponent(key);
          if (typeof query[key] === 'string') query[key] = [query[key]];
          _results.push(query[key].push(decodeURIComponent(value)));
        } else {
          _results.push(query[key] = decodeURIComponent(value));
        }
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
}, "text/TextField": function(exports, require, module) {(function() {
  var Graphics, InteractiveObject, Matrix, Rectangle, TextField, TextFormat;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Graphics = require('display/Graphics');

  InteractiveObject = require('display/InteractiveObject');

  TextFormat = require('text/TextFormat');

  Matrix = require('geom/Matrix');

  Rectangle = require('geom/Rectangle');

  module.exports = TextField = (function() {

    __extends(TextField, InteractiveObject);

    function TextField(text, textFormat) {
      if (text == null) text = '';
      if (textFormat == null) textFormat = new TextFormat;
      TextField.__super__.constructor.call(this);
      this.defineProperty('text', function() {
        return this._texts.join('\n');
      }, function(text) {
        this._texts = this._stacks[0].arguments[0] = text.split(/\r?\n/);
        return this._requestRender(true);
      });
      this.defineProperty('textFormat', function() {
        return this._textFormat;
      }, function(textFormat) {
        this._textFormat = this._stacks[0].arguments[1] = textFormat;
        return this._requestRender(true);
      });
      this.defineProperty('maxWidth', function() {
        return this._maxWidth;
      }, function(maxWidth) {
        this._maxWidth = this._stacks[0].arguments[2] = value;
        return this._requestRender(true);
      });
      this._stacks.push({
        method: 'drawText',
        arguments: []
      });
      this.text = text;
      this.textFormat = textFormat;
    }

    TextField.prototype._measureSize = function() {
      var bounds, rect, text, _i, _len, _ref;
      if ((this._texts != null) && (this._textFormat != null)) {
        rect = new Rectangle;
        this._context.font = this._textFormat.toStyleSheet();
        _ref = this._texts;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          text = _ref[_i];
          rect.width = Math.max(rect.width, (this._context.measureText(text)).width);
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

  })();

}).call(this);
}, "text/TextFormat": function(exports, require, module) {(function() {
  var TextFormat, TextFormatAlign, TextFormatBaseline, TextFormatFont;

  TextFormatAlign = require('text/TextFormatAlign');

  TextFormatBaseline = require('text/TextFormatBaseline');

  TextFormatFont = require('text/TextFormatFont');

  module.exports = TextFormat = (function() {

    function TextFormat(font, size, color, alpha, bold, italic, smallCaps, align, baseline, leading) {
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
      return "" + (this.italic ? 'italic' : 'normal') + " " + (this.smallCaps ? 'small-caps' : 'normal') + " " + (this.bold ? 'bold' : 'normal') + " " + this.size + "px " + font;
    };

    return TextFormat;

  })();

}).call(this);
}, "text/TextFormatAlign": function(exports, require, module) {(function() {
  var TextFormatAlign;

  module.exports = TextFormatAlign = {
    START: 'start',
    END: 'end',
    LEFT: 'left',
    RIGHT: 'right',
    CENTER: 'center'
  };

}).call(this);
}, "text/TextFormatBaseline": function(exports, require, module) {(function() {
  var TextFormatBaseline;

  module.exports = TextFormatBaseline = {
    TOP: 'top',
    HANGING: 'hanging',
    MIDDLE: 'middle',
    ALPHABETIC: 'alphabetic',
    IDEOGRAPHIC: 'ideographic',
    BOTTOM: 'bottom'
  };

}).call(this);
}, "text/TextFormatFont": function(exports, require, module) {(function() {
  var TextFormatFont;

  module.exports = TextFormatFont = {
    SERIF: 'serif',
    SANS_SERIF: 'sans-serif',
    CURSIVE: 'cursive',
    MONOSPACE: 'monospace',
    FANTASY: 'fantasy'
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
      if (name == null) name = null;
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
}, "timers/Ticker": function(exports, require, module) {(function() {
  var Ticker, _instance, _internal, _ticker;

  _ticker = (function() {
    return this.requestAnimationFrame || this.webkitRequestAnimationFrame || this.mozRequestAnimationFrame || this.oRequestAnimationFrame || this.msRequestAnimationFrame || function(callback) {
      return setTimeout((function() {
        return callback((new Date()).getTime());
      }), 1000 / 60);
    };
  })();

  _instance = null;

  _internal = false;

  module.exports = Ticker = (function() {

    Ticker.getInstance = function() {
      if (_instance == null) {
        _internal = true;
        _instance = new Ticker;
      }
      return _instance;
    };

    function Ticker() {
      this._onAnimationFrame = __bind(this._onAnimationFrame, this);      if (_internal === false) {
        throw new Error("Ticker is singleton model, call Ticker.getInstance().");
      }
      _internal = false;
      this._handlers = [];
      this._continuous = false;
    }

    Ticker.prototype.addHandler = function(handler) {
      this._handlers.push(handler);
      if (this._continuous === false) {
        this._continuous = true;
        _ticker(this._onAnimationFrame);
      }
    };

    Ticker.prototype.removeHandler = function(handler) {
      this._handlers.splice(this._handlers.indexOf(handler), 1);
      if (this._handlers.length === 0) this._continuous = false;
    };

    Ticker.prototype._onAnimationFrame = function(time) {
      var handler, _fn, _i, _len, _ref;
      _ref = this._handlers;
      _fn = function(handler) {
        return setTimeout((function() {
          return handler(time);
        }), 0);
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handler = _ref[_i];
        _fn(handler);
      }
      if (this._continuous === true) _ticker(this._onAnimationFrame);
    };

    return Ticker;

  })();

}).call(this);
}, "timers/Timer": function(exports, require, module) {(function() {
  var EventDispatcher, Timer, _clearInterval, _setInterval;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      if (running) return this.start();
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
      if (repeatCount == null) repeatCount = 0;
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
        if (this._intervalId != null) _clearInterval(this._intervalId);
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
}, "tweens/Easing": function(exports, require, module) {(function() {
  var Easing, _PI, _PI_1_2, _PI_2, _abs, _asin, _cos, _pow, _sin, _sqrt;

  _PI = Math.PI;

  _PI_2 = _PI * 2;

  _PI_1_2 = _PI / 2;

  _abs = Math.abs;

  _pow = Math.pow;

  _sqrt = Math.sqrt;

  _sin = Math.sin;

  _cos = Math.cos;

  _asin = Math.asin;

  module.exports = Easing = (function() {

    function Easing() {}

    Easing.linear = function(t, b, c, d) {
      return c * t / d + b;
    };

    Easing.easeInQuad = function(t, b, c, d) {
      t /= d;
      return c * t * t + b;
    };

    Easing.easeOutQuad = function(t, b, c, d) {
      t /= d;
      return -c * t * (t - 2) + b;
    };

    Easing.easeInOutQuad = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t + b;
      } else {
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }
    };

    Easing.easeOutInQuad = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return -c / 2 * t * (t - 2) + b;
      } else {
        t--;
        return c / 2 * (t * t + 1) + b;
      }
    };

    Easing.easeInCubic = function(t, b, c, d) {
      t /= d;
      return c * t * t * t + b;
    };

    Easing.easeOutCubic = function(t, b, c, d) {
      t = t / d - 1;
      return c * (t * t * t + 1) + b;
    };

    Easing.easeInOutCubic = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
      }
    };

    Easing.easeOutInCubic = function(t, b, c, d) {
      t = t * 2 / d - 1;
      return c / 2 * (t * t * t + 1) + b;
    };

    Easing.easeInQuart = function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t + b;
    };

    Easing.easeOutQuart = function(t, b, c, d) {
      t = t / d - 1;
      return -c * (t * t * t * t - 1) + b;
    };

    Easing.easeInOutQuart = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
      }
    };

    Easing.easeOutInQuart = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return -c / 2 * (t * t * t * t - 1) + b;
      } else {
        return c / 2 * (t * t * t * t + 1) + b;
      }
    };

    Easing.easeInQuint = function(t, b, c, d) {
      t /= d;
      return c * t * t * t * t * t + b;
    };

    Easing.easeOutQuint = function(t, b, c, d) {
      t = t / d - 1;
      return c * (t * t * t * t * t + 1) + b;
    };

    Easing.easeInOutQuint = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
      }
    };

    Easing.easeOutInQuint = function(t, b, c, d) {
      t = t * 2 / d - 1;
      return c / 2 * (t * t * t * t * t + 1) + b;
    };

    Easing.easeInExpo = function(t, b, c, d) {
      return c * _pow(2, 10 * (t / d - 1)) + b;
    };

    Easing.easeOutExpo = function(t, b, c, d) {
      return c * (1 - _pow(2, -10 * t / d)) + b;
    };

    Easing.easeInOutExpo = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return c / 2 * _pow(2, 10 * t) + b;
      } else {
        return c / 2 * (2 - _pow(2, -10 * t)) + b;
      }
    };

    Easing.easeOutInExpo = function(t, b, c, d) {
      t *= 2 / d;
      if (t === 1) {
        return c / 2 + b;
      } else if (t < 1) {
        return c / 2 * (1 - _pow(2, -10 * t)) + b;
      } else {
        return c / 2 * (1 + _pow(2, 10 * (t - 2))) + b;
      }
    };

    Easing.easeInSine = function(t, b, c, d) {
      return -c * (_cos(t / d * _PI_1_2) - 1) + b;
    };

    Easing.easeOutSine = function(t, b, c, d) {
      return c * _sin(t / d * _PI_1_2) + b;
    };

    Easing.easeInOutSine = function(t, b, c, d) {
      return -c / 2 * (_cos(_PI * t / d) - 1) + b;
    };

    Easing.easeOutInSine = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return c / 2 * _sin(t * _PI_1_2) + b;
      } else {
        return -c / 2 * (_cos((t - 1) * _PI_1_2) - 2) + b;
      }
    };

    Easing.easeInCirc = function(t, b, c, d) {
      t /= d;
      return -c * (_sqrt(1 - t * t) - 1) + b;
    };

    Easing.easeOutCirc = function(t, b, c, d) {
      t = t / d - 1;
      return c * _sqrt(1 - t * t) + b;
    };

    Easing.easeInOutCirc = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        return -c / 2 * (_sqrt(1 - t * t) - 1) + b;
      } else {
        t -= 2;
        return c / 2 * (_sqrt(1 - t * t) + 1) + b;
      }
    };

    Easing.easeOutInCirc = function(t, b, c, d) {
      t = t * 2 / d - 1;
      if (t < 0) {
        return c / 2 * _sqrt(1 - t * t) + b;
      } else {
        return -c / 2 * (_sqrt(1 - t * t) - 2) + b;
      }
    };

    Easing.easeInBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t /= d;
        return c * t * t * ((_s + 1) * t - _s) + b;
      };
    };

    Easing.easeInBack = Easing.easeInBackWith();

    Easing.easeOutBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t = t / d - 1;
        return c * (t * t * ((_s + 1) * t + _s) + 1) + b;
      };
    };

    Easing.easeOutBack = Easing.easeOutBackWith();

    Easing.easeInOutBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s * 1.525;
        t *= 2 / d;
        if (t < 1) {
          return c / 2 * (t * t * ((_s + 1) * t - _s)) + b;
        } else {
          t -= 2;
          return c / 2 * (t * t * ((_s + 1) * t + _s) + 2) + b;
        }
      };
    };

    Easing.easeInOutBack = Easing.easeInOutBackWith();

    Easing.easeOutInBackWith = function(s) {
      if (s == null) s = 1.70158;
      return function(t, b, c, d) {
        var _s;
        _s = s;
        t = t * 2 / d - 1;
        if (t < 0) {
          return c / 2 * (t * t * ((_s + 1) * t + _s) + 1) + b;
        } else {
          return c / 2 * (t * t * ((_s + 1) * t - _s) + 1) + b;
        }
      };
    };

    Easing.easeOutInBack = Easing.easeOutInBackWith();

    Easing.easeInBounce = function(t, b, c, d) {
      t = 1 - t / d;
      if (t < 0.36363636363636365) {
        return -c * (7.5625 * t * t - 1) + b;
      } else if (t < 0.7272727272727273) {
        t -= 0.5454545454545454;
        return -c * (7.5625 * t * t - 0.25) + b;
      } else if (t < 0.9090909090909091) {
        t -= 0.8181818181818182;
        return -c * (7.5625 * t * t - 0.0625) + b;
      } else {
        t -= 0.9545454545454546;
        return -c * (7.5625 * t * t - 0.015625) + b;
      }
    };

    Easing.easeOutBounce = function(t, b, c, d) {
      t /= d;
      if (t < 0.36363636363636365) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 0.7272727272727273) {
        t -= 0.5454545454545454;
        return c * (7.5625 * t * t + 0.75) + b;
      } else if (t < 0.9090909090909091) {
        t -= 0.8181818181818182;
        return c * (7.5625 * t * t + 0.9375) + b;
      } else {
        t -= 0.9545454545454546;
        return c * (7.5625 * t * t + 0.984375) + b;
      }
    };

    Easing.easeInOutBounce = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        t = 1 - t;
        if (t < 0.36363636363636365) {
          return -c / 2 * (7.5625 * t * t - 1) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return -c / 2 * (7.5625 * t * t - 0.25) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return -c / 2 * (7.5625 * t * t - 0.0625) + b;
        } else {
          t -= 0.9545454545454546;
          return -c / 2 * (7.5625 * t * t - 0.015625) + b;
        }
      } else {
        t -= 1;
        if (t < 0.36363636363636365) {
          return c / 2 * (7.5625 * t * t + 1) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return c / 2 * (7.5625 * t * t + 1.75) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return c / 2 * (7.5625 * t * t + 1.9375) + b;
        } else {
          t -= 0.9545454545454546;
          return c / 2 * (7.5625 * t * t + 1.984375) + b;
        }
      }
    };

    Easing.easeOutInBounce = function(t, b, c, d) {
      t *= 2 / d;
      if (t < 1) {
        if (t < 0.36363636363636365) {
          return c / 2 * (7.5625 * t * t) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return c / 2 * (7.5625 * t * t + 0.75) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return c / 2 * (7.5625 * t * t + 0.9375) + b;
        } else {
          t -= 0.9545454545454546;
          return c / 2 * (7.5625 * t * t + 0.984375) + b;
        }
      } else {
        t = 2 - t;
        if (t < 0.36363636363636365) {
          return -c / 2 * (7.5625 * t * t - 2) + b;
        } else if (t < 0.7272727272727273) {
          t -= 0.5454545454545454;
          return -c / 2 * (7.5625 * t * t - 1.25) + b;
        } else if (t < 0.9090909090909091) {
          t -= 0.8181818181818182;
          return -c / 2 * (7.5625 * t * t - 1.0625) + b;
        } else {
          t -= 0.9545454545454546;
          return -c / 2 * (7.5625 * t * t - 1.015625) + b;
        }
      }
    };

    Easing.easeInElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t / d - 1;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_2 * _asin(c / _a);
        }
        return -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b;
      };
    };

    Easing.easeInElastic = Easing.easeInElasticWith();

    Easing.easeOutElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t /= d;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_2 * _asin(c / _a);
        }
        return _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c;
      };
    };

    Easing.easeOutElastic = Easing.easeOutElasticWith();

    Easing.easeInOutElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t * 2 / d - 1;
        if (_p === 0) _p = d * 0.45;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_2 * _asin(c / _a);
        }
        if (t < 0) {
          return -_a / 2 * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b;
        } else {
          return _a / 2 * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c;
        }
      };
    };

    Easing.easeInOutElastic = Easing.easeInOutElasticWith();

    Easing.easeOutInElasticWith = function(a, p) {
      if (a == null) a = 0;
      if (p == null) p = 0;
      return function(t, b, c, d) {
        var s, _a, _p;
        _a = a;
        _p = p;
        t = t * 2 / d;
        c /= 2;
        if (_p === 0) _p = d * 0.3;
        if (_a === 0 || _a < _abs(c)) {
          _a = c;
          s = _p / 4;
        } else {
          s = _p / _PI_2 * _asin(c / _a);
        }
        if (t < 1) {
          return _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c;
        } else {
          t -= 2;
          return -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c;
        }
      };
    };

    Easing.easeOutInElastic = Easing.easeOutInElasticWith();

    return Easing;

  })();

}).call(this);
}, "tweens/Tween": function(exports, require, module) {(function() {
  var Easing, Ticker, Tween;

  Ticker = require('timers/Ticker');

  Easing = require('tweens/Easing');

  module.exports = Tween = (function() {

    Tween.tween = function(target, src, dst, duration, easing) {
      if (duration == null) duration = 1000;
      if (easing == null) easing = Easing.linear;
      return new Tween(target, src, dst, duration, easing);
    };

    Tween.to = function(target, dst, duration, easing) {
      if (duration == null) duration = 1000;
      if (easing == null) easing = Easing.linear;
      return new Tween(target, null, dst, duration, easing);
    };

    function Tween(target, src, dst, duration, easing) {
      this.target = target;
      this.src = src;
      this.dst = dst;
      this.duration = duration;
      this.easing = easing;
      this.update = __bind(this.update, this);
      this._ticker = Ticker.getInstance();
    }

    Tween.prototype.play = function() {
      var changer, changers, dst, i, name, src, target, value, _len;
      target = this.target;
      src = this.src;
      dst = this.dst;
      changers = {};
      for (name in src) {
        if (changers[name] == null) changers[name] = [];
        changers[name][0] = src[name];
      }
      for (name in dst) {
        if (changers[name] == null) changers[name] = [];
        changers[name][1] = dst[name];
      }
      for (name in changers) {
        changer = changers[name];
        for (i = 0, _len = changer.length; i < _len; i++) {
          value = changer[i];
          if (value == null) changer[i] = target[name];
        }
      }
      this.changers = changers;
      this._beginningTime = new Date().getTime();
      return this._ticker.addHandler(this.update);
    };

    Tween.prototype.update = function(time) {
      var changer, changers, complete, factor, name, target;
      this.time = time - this._beginningTime;
      if (complete = this.time >= this.duration) {
        this.time = this.duration;
        factor = 1;
        this._ticker.removeHandler(this.update);
      } else {
        factor = this.easing(this.time, 0, 1, this.duration);
      }
      target = this.target;
      changers = this.changers;
      for (name in changers) {
        changer = changers[name];
        target[name] = changer[0] + (changer[1] - changer[0]) * factor;
      }
      if (this.onUpdate != null) this.onUpdate();
      if (complete && (this.onComplete != null)) this.onComplete();
    };

    return Tween;

  })();

}).call(this);
}, "utils/ArrayUtil": function(exports, require, module) {(function() {
  var ArrayUtil, __ceil, __floor, __shift;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

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
      if (fromIndex == null) fromIndex = 0;
      len = array.length;
      fromIndex = fromIndex < 0 ? __ceil(fromIndex) : __floor(fromIndex);
      if (fromIndex < 0) fromIndex += len;
      for (i = fromIndex; i <= len; i += 1) {
        if (i in array && array[i] === searchElement) return i;
      }
      return -1;
    },
    lastIndexOf: typeof Array.prototype.lastIndexOf === 'function' ? function(array, searchElement, fromIndex) {
      return Array.prototype.lastIndexOf.apply(__shift.call(arguments), arguments);
    } : function(array, searchElement, fromIndex) {
      var i, len;
      if (fromIndex == null) fromIndex = Number.MAX_VALUE;
      len = array.length;
      fromIndex = fromIndex < 0 ? __ceil(fromIndex) : __floor(fromIndex);
      if (fromIndex < 0) {
        fromIndex += len;
      } else {
        fromIndex = len - 1;
      }
      for (i = fromIndex; i >= -1; i += -1) {
        if (i in array && array[i] === searchElement) return i;
      }
      return -1;
    },
    filter: typeof Array.prototype.filter === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.filter.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len, _results;
      if (thisObject == null) thisObject = null;
      if (typeof callback !== 'function') throw new TypeError();
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
      if (thisObject == null) thisObject = null;
      if (typeof callback !== 'function') throw new TypeError();
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array) callback.call(thisObject, val, i, array);
      }
    },
    every: typeof Array.prototype.every === 'function' ? function(array, callvack, thisObject) {
      return Array.prototype.every.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len;
      if (thisObject == null) thisObject = null;
      if (typeof callback !== 'function') throw new TypeError();
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array && !callback.call(thisObject, val, i, array)) return false;
      }
      return true;
    },
    map: typeof Array.prototype.map === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.map.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len, _results;
      if (thisObject == null) thisObject = null;
      if (typeof callback !== 'function') throw new TypeError();
      _results = [];
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i in array) _results.push(callback.call(thisObject, val, i, array));
      }
      return _results;
    },
    some: typeof Array.prototype.some === 'function' ? function(array, callback, thisObject) {
      return Array.prototype.some.apply(__shift.call(arguments), arguments);
    } : function(array, callback, thisObject) {
      var i, val, _len;
      if (thisObject == null) thisObject = null;
      if (typeof callback !== 'function') throw new TypeError();
      for (i = 0, _len = array.length; i < _len; i++) {
        val = array[i];
        if (i(fo(array && callback.call(thisObject, val, i, array)))) return true;
      }
      return false;
    },
    reduce: typeof Array.prototype.reduce === 'function' ? function(array, callback, initialValue) {
      return Array.prototype.reduce.apply(__shift.call(arguments), arguments);
    } : function(array, callback, initialValue) {
      var i, len, val, _ref;
      if (initialValue == null) initialValue = null;
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
      if (initialValue == null) initialValue = null;
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
      if (length == null) length = 1;
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
      if (index == null) index = 1;
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
        if (!ArrayUtil.isArray(row)) throw new TypeError('Element isn\'t Array.');
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
  var MathUtil, PI, abs, acos, max, min, random;

  PI = Math.PI;

  abs = Math.abs;

  max = Math.max;

  min = Math.min;

  random = Math.random;

  acos = Math.acos;

  module.exports = MathUtil = (function() {

    function MathUtil() {}

    MathUtil.DPR = 180 / PI;

    MathUtil.RPD = PI / 180;

    MathUtil.PI = PI;

    MathUtil.PI2 = PI * 2;

    MathUtil.PI_2 = PI / 2;

    MathUtil._PI = 1 / PI;

    MathUtil._PI2 = 1 / MathUtil.PI2;

    MathUtil.degToRad = function(degree) {
      return degree * this.RPD;
    };

    MathUtil.wrapPi = function(theta) {
      theta += this.PI;
      theta -= (theta * this._PI2 >> 0) * this.PI2;
      theta -= this.PI;
      return theta;
    };

    MathUtil.safeAcos = function(x) {
      if (x <= -1) {
        return this.PI;
      } else if (x >= 1) {
        return 0;
      } else {
        return acos(x);
      }
    };

    MathUtil.nearestIn = function(num, nums) {
      var compared, n, _i, _len;
      compared = [];
      for (_i = 0, _len = nums.length; _i < _len; _i++) {
        n = nums[_i];
        compared.push(abs(n - num));
      }
      return nums[compared.indexOf(min.apply(null, compared))];
    };

    MathUtil.randomBetween = function(a, b) {
      return a + (b - a) * random();
    };

    MathUtil.convergeBetween = function(num, a, b) {
      min = min(a, b);
      max = max(a, b);
      if (num < min) {
        return min;
      } else if (num > max) {
        return max;
      } else {
        return num;
      }
    };

    return MathUtil;

  })();

}).call(this);
}, "utils/ObjectUtil": function(exports, require, module) {(function() {
  var DateFormat, JSON, ObjectUtil;

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
      if (separator == null) separator = null;
      if (limit == null) limit = -1;
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
      if (padding == null) padding = ' ';
      string = String(string);
      while (string.length < length) {
        string = (length - string.length & 1) === 0 ? padding + string : string + padding;
      }
      return string;
    },
    padLeft: function(string, length, padding) {
      if (padding == null) padding = ' ';
      string = String(string);
      while (string.length < length) {
        string = padding + string;
      }
      return string;
    },
    padRight: function(string, length, padding) {
      if (padding == null) padding = ' ';
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
})();
