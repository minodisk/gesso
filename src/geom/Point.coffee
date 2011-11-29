module.exports = class Point

  constructor: (@x = 0, @y = 0) ->

  clone: ->
    new Point @x, @y

  equals: (pt) ->
    @x is pt.x and @y is pt.y

  distance: (pt) ->
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
