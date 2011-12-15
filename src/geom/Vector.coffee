Klass = require 'core/Klass'

sin = Math.sin
cos = Math.cos
atan2 = Math.atan2
sqrt = Math.sqrt

module.exports = class Vector extends Klass

  @crossProduct:(a, b)->
    a.distance * b.distance * sin(b.angle - a.angle)

  @dotProduct:(a, b)->

  @distance:(a, b)->
    x = a.x - b.x
    y = a.y - b.y
    sqrt x * x + y * y

  @between:(src, dst, ratio = 0.5) ->
    new Vector src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio

  constructor:(@x = 0, @y = 0) ->
    if @x instanceof Vector
      src = @x
      @x = src.x
      @y = src.y

    @defineProperty 'direction'
      , ->
        atan2 @y, @x
      , (direction)->
        magnitude = sqrt @x * @x + @y * @y
        @x = magnitude * cos direction
        @y = magnitude * sin direction
        return

    @defineProperty 'magnitude'
      , ->
        sqrt @x * @x + @y * @y
      , (magnitude)->
        ratio = magnitude / sqrt(@x * @x + @y * @y)
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
    ratio = thickness / sqrt(@x * @x + @y * @y)
    @x *= ratio
    @y *= ratio
    @
