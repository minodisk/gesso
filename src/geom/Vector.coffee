exports.geom.Vector = class Vector extends Class

  @crossProduct:(a, b)->
    a.distance * b.distance * _sin(b.angle - a.angle)

  @dotProduct:(a, b)->

  @distance:(a, b)->
    x = a.x - b.x
    y = a.y - b.y
    _sqrt x * x + y * y

  @between:(src, dst, ratio = 0.5) ->
    new Vector src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio

  constructor:(@x = 0, @y = 0) ->
    if @x instanceof Vector
      src = @x
      @x = src.x
      @y = src.y

    @defineProperty 'direction'
      , ->
        _atan2 @y, @x
      , (direction)->
        magnitude = _sqrt @x * @x + @y * @y
        @x = magnitude * _cos direction
        @y = magnitude * _sin direction
        return

    @defineProperty 'magnitude'
      , ->
        _sqrt @x * @x + @y * @y
      , (magnitude)->
        ratio = magnitude / _sqrt(@x * @x + @y * @y)
        @x *= ratio
        @y *= ratio
        return

  add:(b)->
    new Vector @x + b.x, @y + b.y

  subtract:(b)->
    new Vector @x - b.x, @y - b.y

  divide:(b)->
    new Vector @x / b, @y / b

  toString:->
    "(#{ @x }, #{ @y })"

  equals:(pt)->
    @x is pt.x and @y is pt.y

  normalize:(thickness = 1)->
    ratio = thickness / _sqrt(@x * @x + @y * @y)
    @x *= ratio
    @y *= ratio
    @

  transform: (matrix)->
    m = new Matrix 1, 0, 0, 1, @x, @y
    m.concat matrix
    @x = m.ox
    @y = m.oy
    @
