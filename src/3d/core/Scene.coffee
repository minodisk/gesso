# **Experimental Implementation**

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
    for camera in @_cameraList
      camera.snap @_displayList
