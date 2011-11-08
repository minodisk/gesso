_sin = Math.sin
_cos = Math.cos
_tan = Math.tan

###
         |a c x|
Matrix = |b d y|
         |0 0 1|
###

module.exports = class Matrix

  constructor:(@a = 1, @b = 0, @c = 0, @d = 1, @x = 0, @y = 0)->

  clone:->
    new Matrix @a, @b, @c, @d, @x, @y

  concat:(matrix)->
    @_concat matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y
  _concat:(a, b, c, d, x, y)->
    @a = @a * a + @c * b + @x * 0
    @b = @b * a + @d * b + @y * 0
    @c = @a * c + @c * d + @x * 0
    @d = @b * c + @d * d + @y * 0
    @x = @a * x + @c * y + @x * 1
    @y = @b * x + @d * y + @y * 1
    @

  translate:(tx, ty)->
    @_concat 1, 0, 0, 1, tx, ty

  scale:(sx, sy)->
    @_concat sx, 0, 0, sy, 0, 0

  rotate:(angle)->
    c = _cos angle
    s = _sin angle
    @concat c, -s, s, c, 0, 0

  skew:(skewX, skewY)->
    @concat 0, _tan(skewY), _tan(skewX), 0, 0, 0
