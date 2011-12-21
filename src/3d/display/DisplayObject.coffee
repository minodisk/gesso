# **Experimental Implementation**

EulerAngles = require '3d/geom/EulerAngles'
Vector = require '3d/geom/Vector'
Class = require 'core/Class'

module.exports = class DisplayObject extends Class

  constructor:->
    @position = new Vector 0, 0, 0
    @orientation = new EulerAngles 0, 0, 0
    @vertices = []
    @color = 0

  drawAt:(screen)->
