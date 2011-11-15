DisplayObject = require('display/DisplayObject')
Blend = require('display/blends/Blend')
BlendMode = require('display/blends/BlendMode')
Rectangle = require('geom/Rectangle')

_RADIAN_PER_DEGREE = Math.PI / 180
_sqrt = Math.sqrt

module.exports = class Sprite extends DisplayObject

  Sprite::__defineSetter__ '_stage', (value) ->
    child._stage = value for child in @_children
    @__stage = value
    return

  constructor: ->
    super 'Sprite'
    @_children = []

  addChild: (child) ->
    child._stage = @_stage
    child._parent = @
    @_children.push child
    @_requestRender true
    return

  removeChild: (displayObject) ->
    index = @_children.indexOf displayObject
    @_children.splice index, 1 if index isnt -1
    @_requestRender true
    return

  _render: ->
    @bounds = new Rectangle();
    for child in @_children
      child._render()
      @bounds.union child.bounds
    @_drawing.canvas.width = @bounds.width
    @_drawing.canvas.height = @bounds.height
    for child in @_children
      @_drawChild child
    return
  _drawChild: (child) ->
    if child.blendMode is BlendMode.NORMAL
      throw new Error 'canvas isn\'t set' unless child._transforming.canvas?
      throw new Error 'invalid position' if isNaN child.x or isNaN child.bounds.x or isNaN child.y or isNaN child.bounds.y
      if child.bounds.width > 0 and child.bounds.height > 0
        @_drawing.drawImage child._transforming.canvas, child.x + child.bounds.x * child.scaleX, child.y + child.bounds.y * child.scaleY
    else
      imageData = @getImageData()
      Blend.scan imageData, child.getImageData(), child.blendMode
      @_drawing.putImageData imageData, 0, 0
    @_drawing.setTransform 1, 0, 0, 1, 0, 0
