module.exports = QuadtreeSpace;

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
};