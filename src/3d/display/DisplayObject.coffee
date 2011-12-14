# **Experimental Implementation**

EulerAngles = require '3d/geom/EulerAngles'
Vector = require '3d/geom/Vector'
Klass = require 'core/Klass'

module.exports = class DisplayObject extends Klass

  constructor:->
    @position = new Vector 0, 0, 0
    @orientation = new EulerAngles 0, 0, 0
    @vertices = []
    @color = 0

  drawAt:(screen)->
