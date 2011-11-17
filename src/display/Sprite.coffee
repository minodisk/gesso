DisplayObject = require('display/DisplayObject')
Blend = require('display/blends/Blend')
BlendMode = require('display/blends/BlendMode')
Rectangle = require('geom/Rectangle')

_ceil = Math.ceil

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
    if @_drawn
      @_drawn = false

      @_bounds = new Rectangle()
      for child in @_children
        child._render()
        bounds = child._bounds.clone()
        bounds.x += child.x
        bounds.y += child.y
        @_bounds.union bounds
      # computes minimal _bounds when context is transformed
      radius = _ceil @_bounds.measureFarDistance(0, 0)
      @_bounds.x = @_bounds.y = -radius
      @_bounds.width = @_bounds.height = radius * 2

      @_width = @_input.canvas.width = @_bounds.width
      @_height = @_input.canvas.height = @_bounds.height

      @_drawChildren()

      @_input.strokeStyle = 'rgba(255, 0, 0, .8)'
      @_input.lineWidth = 1
      @_input.strokeRect 0, 0, @_width, @_height
      @_input.strokeRect @_width / 2 - 5, @_height / 2 - 5, 10, 10

    if @_transformed then @_transform() else @_output = @_input
    return

  _drawChildren: ->
    for child in @_children
      if child.blendMode is BlendMode.NORMAL
        if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
          throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y
          #console.log @_bounds.x, @_bounds.y, @_bounds.width, @_bounds.height, child.x, child.y, child._bounds.x, child._bounds.y, child._bounds.width, child._bounds.height
          @_input.drawImage child._output.canvas, child._x + child._bounds.x * child._scaleX - @_bounds.x, child._y + child._bounds.y * child._scaleY - @_bounds.y
    return
