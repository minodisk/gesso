# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* >
# *Bitmap*<br/>
# **Subclasses:**
#
# The *Bitmap* class represents bitmap images.<br/>
# You can access this module by doing:<br/>
# `require('display/Bitmap')`

DisplayObject = require('display/DisplayObject')
Rectangle = require('geom/Rectangle')

module.exports = class Bitmap extends DisplayObject

  # ## new Bitmap()
  # Creates a new *Bitmap* instance.
  constructor:->
    super 'Bitmap'

  # ## draw()
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement*, or *DisplayObject* object onto this object.
  draw:(data, x = 0, y = 0)->
    if typeof data is 'string'
      img = new Image()
      img.src = data
    else if data instanceof Image or data instanceof HTMLImageElement
      img = data
    if img?
      if img.complete
        @drawImage img, x, y
      else
        img.addEventListener 'load', ((e) => @drawImage(img, x, y)), false
      return img
    if data instanceof DisplayObject
      data = data._input.canvas
    if data instanceof HTMLCanvasElement or data instanceof HTMLVideoElement
      @drawImage data, x, y
      return
    else if data instanceof ImageData
      @drawImageData data, x, y
      return
    throw new TypeError "data isn't drawable object"

  # ## drawImage()
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement* object onto this object, without checking type of
  # the source object.
  drawImage: (image, x = 0, y = 0) ->
    @_stacks.push
      method   : 'drawImage'
      arguments: [ image, x, y ]
      rect     : new Rectangle x, y, image.width, image.height
    console.log 'drawImage -> @_requestRender true'
    @_requestRender true
  _drawImage: (image, x, y) ->
    @_input.drawImage image, x, y, image.width, image.height
    return

  drawImageData:(imageData, x = 0, y = 0)->
    return
