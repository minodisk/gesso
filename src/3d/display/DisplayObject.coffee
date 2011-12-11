# **Experimental Implementation**

EulerAngles = require '3d/geom/EulerAngles'
Vector = require '3d/geom/Vector'

module.exports = class DisplayObject

  constructor:->
    @position = new Vector
    @orientation = new EulerAngles
    @vertices = []
