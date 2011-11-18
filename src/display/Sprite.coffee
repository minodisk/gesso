# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* > *Shape* > *Sprite*<br/>
# **Subclasses:** *Stage*
#
# The *Sprite* can contain children.<br/>
# You can access this module by doing:<br/>
# `require('display/Sprite')`

Shape = require('display/Shape')
Blend = require('display/Blend')
BlendMode = require('display/BlendMode')
Rectangle = require('geom/Rectangle')

_RADIAN_PER_DEGREE = Math.PI / 180
_ceil = Math.ceil

module.exports = class Sprite extends Shape

  Sprite::__defineSetter__ '_stage', (value) ->
    child._stage = value for child in @_children
    @__stage = value
    return

  # ### new Sprite()
  # Creates a new *Sprite* object.
  constructor: ->
    super 'Sprite'
    @_children = []

  # ### addChild(children...:*DisplayObject*):*Sprite*
  # Adds a child *DisplayObject* object to this object.
  addChild: (children...) ->
    for child in children
      child._stage = @_stage
      child._parent = @
      @_children.push child
    @_requestRender true

  # ### removeChild(children...:*DisplayObject*):*Sprite*
  # Removes the specified child *DisplayObject* from this object.
  removeChild: (children...) ->
    for child in children
      index = @_children.indexOf child
      @_children.splice index, 1 if index isnt -1
    @_requestRender true

  # ### _render():*void*
  # [private] Renders this object.
  _render: ->
    @_drawn = false
    @_measureSize()
    @_applySize()
    @_execStacks()
    @_drawChildren()
    @_applyFilters()
    @_drawBounds()

  _measureSize: ->
    super()
    for child in @_children
      child._render() if child._drawn
      bounds = child._bounds.clone()
      bounds.x += child.x
      bounds.y += child.y
      @_bounds.union bounds
    radius = _ceil @_bounds.measureFarDistance(0, 0)
    @_bounds.x = @_bounds.y = -radius
    @_bounds.width = @_bounds.height = radius * 2

  _drawBounds: ->
    @_context.strokeStyle = 'rgba(255, 0, 0, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_width, @_height

  # ### _render():*void*
  # [private] Draws children on this object.
  _drawChildren: ->
    for child in @_children
      if child.blendMode is BlendMode.NORMAL
        if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
          throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y
          @_context.translate child._x, child._y
          @_context.scale child._scaleX, child._scaleY
          @_context.rotate child._rotation * _RADIAN_PER_DEGREE
          @_context.globalAlpha = if child._alpha < 0 then 0 else if child._alpha > 1 then 1 else child._alpha
          @_context.drawImage child._context.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
          @_context.setTransform 1, 0, 0, 1, 0, 0
    return
