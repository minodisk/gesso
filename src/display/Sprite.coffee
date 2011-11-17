# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* > *Sprite*<br/>
# **Subclasses:** *Stage*
#
# The *Sprite* can contain children.<br/>
# You can access this module by doing:<br/>
# `require('display/Sprite')`

DisplayObject = require('display/DisplayObject')
Blend = require('display/blends/Blend')
BlendMode = require('display/blends/BlendMode')
Rectangle = require('geom/Rectangle')

_RADIAN_PER_DEGREE = Math.PI / 180
_ceil = Math.ceil

module.exports = class Sprite extends DisplayObject

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
  # [private] Renders children, then measures bounds of this object.
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
      radius = _ceil @_bounds.measureFarDistance(0, 0)
      @_bounds.x = @_bounds.y = -radius
      @_bounds.width = @_bounds.height = radius * 2

      @_width = @_cache.canvas.width = @_bounds.width
      @_height = @_cache.canvas.height = @_bounds.height

      @_drawChildren()

      @_cache.strokeStyle = 'rgba(255, 0, 0, .8)'
      @_cache.lineWidth = 1
      @_cache.strokeRect 0, 0, @_width, @_height
      @_cache.strokeRect @_width / 2 - 5, @_height / 2 - 5, 10, 10
    return

  # ### _render():*void*
  # [private] Draws children on this object.
  _drawChildren: ->
    for child in @_children
      if child.blendMode is BlendMode.NORMAL
        if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
          throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y
          @_cache.translate child._x, child._y
          @_cache.scale child._scaleX, child._scaleY
          @_cache.rotate child._rotation * _RADIAN_PER_DEGREE
          @_cache.globalAlpha = if child._alpha < 0 then 0 else if child._alpha > 1 then 1 else child._alpha
          @_cache.drawImage child._cache.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
          @_cache.setTransform 1, 0, 0, 1, 0, 0
    return
