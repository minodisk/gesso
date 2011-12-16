DisplayObject = require '3d/display/DisplayObject'
Vector = require '3d/geom/Vector'
MathUtil = require 'utils/MathUtil'

PI = MathUtil.PI
PI_2 = MathUtil.PI_2
PI2 = MathUtil.PI2

module.exports = class Sphere extends DisplayObject

  constructor:(radius = 100, lngSeg = 8, latSeg = 6)->
    super()

    @_radius = radius
    @_lngSeg = lngSeg
    @_latSeg = latSeg
    @_updateVertices()

    @defineProperty 'radius'
      , ->
        @_radius
      , (radius) ->
        @_radius = radius
        @_updateVertices()
        return

  _updateVertices:->
    @vertices = []
    lngUnitAngle = PI2 / @_lngSeg
    latUnitAngle = PI / @_latSeg
    for lat in [0..@_latSeg] by 1
      console.log lat
      latAngle = latUnitAngle * lat - PI_2
      radius = @_radius * Math.cos latAngle
      y = @_radius * Math.sin latAngle
      for lng in [0...@_lngSeg] by 1
        lngAngle = lngUnitAngle * lng
        x = radius * Math.cos lngAngle
        z = radius * Math.sin lngAngle
        @vertices.push new Vector(x, y, z)

  drawAt:(screen, vertices)->
    graphics = screen.graphics
    for vertex, i in vertices
      graphics.drawRect vertex.x, vertex.y, 1, 1
