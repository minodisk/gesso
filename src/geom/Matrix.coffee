# **Package:** *geom*<br/>
# **Inheritance:** *Object* > *Matrix*<br/>
# **Subclasses:** -
#
# The *Matrix* is 3 x 3 matrix. You can translate, scale, rotate, and skew
# display object.<br/>
#
#              |a c x|
#     Matrix = |b d y|
#              |0 0 1|
#
# You can access this module by doing:<br/>
# `require('geom/Matrix')`

_sin = Math.sin
_cos = Math.cos
_tan = Math.tan

module.exports = class Matrix

  # ### createGradientBox(x:*Number*, y:*Number*, width:*Number*, height:*Number*, rotation:*Number*):*Matrix*
  # Creates the gradient style of *Matrix* expected by the `beginGradientFill()
  # and `lineGradientFill()` methods of *Shape* object.
  @createGradationBox: (x, y, width, height, rotation)->
    threshold = height / width
    tan = Math.tan rotation
    width1_2 = width / 2
    height1_2 = height / 2
    centerX = x + width1_2
    centerY = y + height1_2
    if tan > -threshold and tan < threshold
      dx = width1_2 * (if Math.cos(rotation) < 0 then -1 else 1)
      dxt = dx * tan
      x0:centerX - dx
      y0:centerY - dxt
      x1:centerX + dx
      y1:centerY + dxt
    else
      dy = height1_2 * (if Math.sin(rotation) < 0 then -1 else 1)
      dyt = dy / tan
      x0:centerX - dyt
      y0:centerY - dy
      x1:centerX + dyt
      y1:centerY + dy

  # ### new Matrix(a:*Number* = 1, b:*Number* = 0, c:*Number* = 0, d:*Number* = 1, x:*Number* = 0, y:*Number* = 0)
  # Creates a new Matrix object.
  constructor: (@a = 1, @b = 0, @c = 0, @d = 1, @x = 0, @y = 0) ->

  # ### clone():*Matrix*
  # Copies this object.
  clone: ->
    new Matrix @a, @b, @c, @d, @x, @y

  # ### apply(matrix:*Matrix*):*void*
  # Applies the properties of specified *Matrix* object to this object.
  apply: (matrix) ->
    @_apply matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y
  _apply: (a, b, c, d, x, y) ->
    @a = a
    @b = b
    @c = c
    @d = d
    @x = x
    @y = y
    @

  # ### setTo(context:*CanvasRenderingContext2D*):*void*
  # Sets transform to specified *CanvasRenderingContext2D* object.
  setTo: (context) ->
    context.setTransform @a, @b, @c, @d, @x, @y

  # ### concat(matrix:*Matrix*):*Matrix*
  # Concatenates the specified *Matrix* to this object.
  concat: (matrix) ->
    @_concat matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y
  _concat:(a, b, c, d, x, y)->
    @a = @a * a + @c * b + @x * 0
    @b = @b * a + @d * b + @y * 0
    @c = @a * c + @c * d + @x * 0
    @d = @b * c + @d * d + @y * 0
    @x = @a * x + @c * y + @x * 1
    @y = @b * x + @d * y + @y * 1
    @

  # ### translate(tx:*Number*, ty:*Number*):*Matrix*
  # Applies a translating transformation to this object.
  translate:(tx, ty)->
    @_concat 1, 0, 0, 1, tx, ty

  # ### scale(sx:*Number*, sy:*Number*):*Matrix*
  # Applies a scaling transformation to this object.
  scale:(sx, sy)->
    @_concat sx, 0, 0, sy, 0, 0

  # ### rotate(angle:*Number*):*Matrix*
  # Applies a rotation transformation to this object.
  rotate:(angle)->
    c = _cos angle
    s = _sin angle
    @_concat c, s, -s, c, 0, 0

  # ### skew(skewX:*Number*, skewY:*Number*):*Matrix*
  # Applies a skewing transformation to this object.
  skew:(skewX, skewY)->
    @_concat 0, _tan(skewY), _tan(skewX), 0, 0, 0
