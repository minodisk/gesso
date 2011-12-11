# **Experimental Implementation**

Shape = require 'display/Shape'

module.exports = class Screen extends Shape

  constructor:->
    super()
    @_camera = null

  refresh:(displayList)->
    for object in displayList
      console.log object, object.x, object.y
      @graphics.beginFill object.color
      @graphics.drawCircle object.x, object.y, 2
      @graphics.endFill()
