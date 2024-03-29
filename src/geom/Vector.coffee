exports.geom.Vector = class Vector extends Class

  @polar: (distance, angle)->
    new Vector distance * _cos(angle), distance * _sin(angle)

  @add: (pt0, pt1)->
    new Vector pt0.x + pt1.x, pt0.y + pt1.y

  @subtract: (pt0, pt1)->
    new Vector pt0.x - pt1.x, pt0.y - pt1.y

  @multiple: (pt, num)->
    new Vector pt.x * num, pt.y * num

  @divide: (pt, num)->
    new Vector pt.x / num, pt.y / num

  @crossProduct: (a, b)->
    a.distance * b.distance * _sin(b.angle - a.angle)

  @dotProduct: (a, b)->

  @distance  : (a, b)->
    x = a.x - b.x
    y = a.y - b.y
    _sqrt x * x + y * y

  @between: (src, dst, ratio = 0.5)->
    new Vector src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio

  constructor: (@x = 0, @y = 0)->
    super()

    @defineProperty 'distance', ->
      _sqrt @x * @x + @y * @y

    @defineProperty 'angle', ->
      _atan2 @y, @x

  clone: ->
    new Vector @x, @y

  add: (pt)->
    @x += pt.x
    @y += pt.y
    @

  subtract: (pt)->
    @x -= pt.x
    @y -= pt.y
    @

  multiple: (num)->
    @x *= num
    @y *= num
    @

  divide: (num)->
    @x /= num
    @y /= num
    @

  toString: ->
    "(#{ @x }, #{ @y })"

  toPolar: ->
    new Polar @distance, @angle

  equals: (pt)->
    @x is pt.x and @y is pt.y

  normalize: (thickness = 1)->
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
