# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *Bitmap*<br/>
# **Subclasses:** -
#
# The *Bitmap* class represents bitmap images.<br/>
# You can access this module by doing:<br/>

exports.display.Bitmap = class Bitmap extends DisplayObject

  # ## new Bitmap()
  # Creates a new *Bitmap* object.
  constructor:->
    super 'Bitmap'

  # ## draw(data:***, x:*Number* = 0, y:*Number* = 0):*void*
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement*, or *DisplayObject* object onto this object.
  draw:(data, x = 0, y = 0)->
    if data instanceof DisplayObject
      data = data._context.canvas
    if data instanceof Image or data instanceof HTMLImageElement or
       data instanceof HTMLCanvasElement or data instanceof HTMLVideoElement
      @drawImage data, x, y
      return

    if data instanceof ImageData
      @drawImageData data, x, y
      return

    throw new TypeError "data isn't drawable object"
    return

  # ## drawImage(image:***, x:*Number* = 0, y:*Number* = 0):*void*
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement* object onto this object, without checking type of
  # the source object.
  drawImage:(image, x = 0, y = 0)->
    @_stacks.push
      method   : 'drawImage'
      arguments: [ image, x, y ]
      rect     : new Rectangle x, y, image.width, image.height
    @_requestRender true
  _drawImage:(image, x, y)->
    @_context.drawImage image, x, y, image.width, image.height
    return

  drawImageData:(imageData, x = 0, y = 0)->
    return

  applyFilter:(srcBitmap, srcRect, dstPoint, filter)->
    return
