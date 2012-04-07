# **Experimental Implementation**

class Scene

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

