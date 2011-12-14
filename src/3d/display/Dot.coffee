# **Experimental Implementation**

DisplayObject = require '3d/display/DisplayObject'
Vector = require '3d/geom/Vector'

module.exports = class Dot extends DisplayObject

  constructor:->
    super()
    @vertices[0] = new Vector 0, 0, 0
    @color = 0

  drawAt:(screen, vertices)->
    graphics = screen.graphics
    graphics.beginFill @color
    graphics.drawCircle vertices[0].x, vertices[0].y, 1
    graphics.endFill()
