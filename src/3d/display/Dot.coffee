# **Experimental Implementation**

DisplayObject = require '3d/display/DisplayObject'
Vector = require '3d/geom/Vector'

module.exports = class Dot extends DisplayObject

  constructor:->
    super()
    @vertices.push new Vector(0, 0, 0)
    @color = 0
