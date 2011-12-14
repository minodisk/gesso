# **Experimental Implementation**

Matrix = require '3d/geom/Matrix'

module.exports = class Scene

  constructor:->
    @_cameraList = []
    @_displayList = []

  addCamera:(camera)->
    camera._scene = @
    @_cameraList.push camera

  addChild:(displayObject)->
    displayObject._scene = @
    @_displayList.push displayObject

  render:->

