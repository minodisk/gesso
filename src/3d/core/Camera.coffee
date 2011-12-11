# **Experimental Implementation**

Class = require 'core/Klass'
EulerAngles = require '3d/geom/EulerAngles'
Matrix = require '3d/geom/Matrix'
Vector = require '3d/geom/Vector'

tan = Math.tan
atan = Math.atan

module.exports = class Camera extends Class

  # ## new Camera(scene:*Scene*):*void*
  constructor:->

    # ## fov:*Number*
    @defineProperty 'fov'
      , ->
        @_fov
      , (fov) ->
        @_fov = fov
        @_zoom = 1 / tan(fov / 2)
        return

    # ## zoom:*Number*
    @defineProperty 'zoom'
      , ->
        @_zoom
      , (zoom) ->
        @_zoom = zoom
        @_fov = 2 * atan(1 / zoom)
        return

    @position = new Vector 0, 0, 0
    @orientation = new EulerAngles 0, 0, 0
    @_scene = null
    @_screenList = []

  addScreen:(screen)->
    screen._camera = @
    @_screenList.push screen

  snap:(displayList)->
    sceneToCamera = new Matrix
    sceneToCamera.setupParentToLocal @position, @orientation
    for displayObject in displayList
      displayObject.position
    for screen in @_screenList
      screen.refresh displayList