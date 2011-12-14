# **Experimental Implementation**

Shape = require 'display/Shape'

module.exports = class Screen extends Shape

  constructor:->
    super()
    @screenWidth = 480
    @screenHeight = 360
    @_camera = null
