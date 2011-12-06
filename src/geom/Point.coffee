Klass = require 'core/Klass'

module.exports = class Point extends Klass

  @cross:(src, dst)->
    src.distance * dst.distance * Math.sin(dst.angle - src.angle)

  constructor: (@x = 0, @y = 0) ->

    @defineProperty 'angle'
      , ->
        Math.atan2 @y, @x
      , (angle)->
        radius = Math.sqrt @x * @x + @y * @y
        @x = radius * Math.cos angle
        @y = radius * Math.sin angle
        return

    @defineProperty 'distance'
      , ->
        Math.sqrt @x * @x + @y * @y
      , (distance)->
        ratio = distance / Math.sqrt(@x * @x + @y * @y)
        @x *= ratio
        @y *= ratio
        return

  clone: ->
    new Point @x, @y

  toString: ->
    "(#{ @x }, #{ @y })"

  equals: (pt) ->
    @x is pt.x and @y is pt.y

  distanceFrom: (pt) ->
    x = @x - pt.x
    y = @y - pt.y
    Math.sqrt x * x + y * y

  normalize: (thickness = 1) ->
    ratio = thickness / Math.sqrt(@x * @x + @y * @y)
    @x *= ratio
    @y *= ratio
    @

  add: (pt) ->
    @x += pt.x
    @y += pt.y
    @

  subtract: (pt) ->
    @x -= pt.x
    @y -= pt.y
    @

  divide: (num)->
    @x /= num
    @y /= num
    @

  angle:->
    Math.atan2 @y, @x

  @between: (src, dst, ratio = 0.5) ->
    new Point src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio

  rotate: (angle) ->
    angle += Math.atan2 @y, @x
    radius = Math.sqrt @x * @x + @y * @y
    @x = radius * Math.cos angle
    @y = radius * Math.sin angle
    @
