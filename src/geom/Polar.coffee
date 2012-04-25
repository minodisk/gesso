exports.geom.Polar = class Polar extends Class

  constructor: (@distance = 0, @angle = 0)->
    super()

    @defineProperty 'x', ->
      @distance * _cos @angle

    @defineProperty 'y', ->
      @distance * _sin @angle

  toString: ->
    "(#{@distance}, #{@angle * _DEGREE_PER_RADIAN})"

  toPoint: ->
    new Point @distance * _cos @angle, @distance * _sin @angle

  add: (pol)->
    @distance += pol.distance
    @angle += pol.angle
    @

  subtract: (pol)->
    @distance -= pol.distance
    @angle -= pol.angle
    @

  multiple: (num)->
    @distance *= num
    @

  divide: (num)->
    @distance /= num
    @