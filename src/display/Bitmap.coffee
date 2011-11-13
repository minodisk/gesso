DisplayObject = require('display/DisplayObject')
Rectangle = require('geom/Rectangle')

module.exports = class Bitmap extends DisplayObject

  constructor:->
    super 'Bitmap'

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
        img.addEventListener 'load', ((e) => @drawImage img, x, y), false
      return img
    if data instanceof DisplayObject
      data = data._drawing.canvas
    if data instanceof HTMLCanvasElement or data instanceof HTMLVideoElement
      @drawImage data, x, y
      return
    else if data instanceof ImageData
      @drawImageData data, x, y
      return
    throw new TypeError "data isn't drawable object"

  drawImage:(image, x = 0, y = 0)->
    @_stacks.push
      method   : 'drawImage'
      arguments: [ image, x, y ]
      rect     : new Rectangle x, y, image.width, image.height
    @_requestRender true
  _drawImage:(image, x, y)->
    @_drawing.drawImage image, x, y, image.width, image.height
    return

  drawImageData:(imageData, x = 0, y = 0)->
    return
