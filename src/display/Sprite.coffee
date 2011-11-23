# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Shape* →
# *Sprite*<br/>
# **Subclasses:** *Stage*
#
# The *Sprite* can contain children.<br/>
# You can access this module by doing:<br/>
# `require('display/Sprite')`

Shape = require 'display/Shape'
Blend = require 'display/Blend'
BlendMode = require 'display/BlendMode'
EventPhase = require 'events/EventPhase'
MouseEvent = require 'events/MouseEvent'
Point = require 'geom/Point'
Rectangle = require 'geom/Rectangle'

_RADIAN_PER_DEGREE = Math.PI / 180

module.exports = class Sprite extends Shape

  # ### new Sprite()
  # Creates a new *Sprite* object.
  constructor: ->
    super 'Sprite'
    @_children = []
    @_mouseEnabled = true
    @_mouseChildren = true
    @_buttonMode = false

  Sprite::__defineSetter__ '_stage', (value) ->
    child._stage = value for child in @_children
    @__stage = value
    return

  Sprite::__defineGetter__ 'mouseEnabled', -> @_mouseEnabled
  Sprite::__defineSetter__ 'mouseEnabled', (value) ->
    @_mouseEnabled = value

  Sprite::__defineGetter__ 'mouseChildren', -> @_mouseChildren
  Sprite::__defineSetter__ 'mouseChildren', (value) ->
    @_mouseChildren = value

  Sprite::__defineGetter__ 'buttonMode', -> @_buttonMode
  Sprite::__defineSetter__ 'buttonMode', (value) ->
    @_buttonMode = value

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

  # ### _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize: ->
    super()
    for child in @_children
      child._render() if child._drawn
      bounds = child._bounds.clone()
      bounds.x += child.x
      bounds.y += child.y
      @_bounds.union bounds

  # ### _drawBounds():*void*
  # [private] Draws the bounds of this object for debug.
  _drawBounds: ->
    @_context.strokeStyle = 'rgba(255, 0, 0, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_width, @_height

  # ### _render():*void*
  # [private] Draws children on this object.
  _drawChildren: ->
    for child in @_children
      if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
        throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y
        @_context.translate child._x, child._y
        @_context.scale child._scaleX, child._scaleY
        @_context.rotate child._rotation * _RADIAN_PER_DEGREE
        @_context.globalAlpha = if child._alpha < 0 then 0 else if child._alpha > 1 then 1 else child._alpha
        if child.blendMode is BlendMode.NORMAL
          @_context.drawImage child._context.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
        else
          src = @_context.getImageData child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y, child._bounds.width, child._bounds.height
          dst = child._context.getImageData 0, 0, child._bounds.width, child._bounds.height
          @_context.putImageData Blend.scan(src, dst, child.blendMode), child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
        @_context.setTransform 1, 0, 0, 1, 0, 0
    return

  _propagateMouseEvent: (event) ->
    if @_mouseEnabled and event._isPropagationStopped is false
      event = event.clone()
      event.localX -= @x
      event.localY -= @y

      if @_bounds.contains event.localX, event.localY
        hitChildren = false

        if @_mouseChildren
          i = @_children.length
          while i--
            child = @_children[i]
            if child._hitTest? event.localX - child.x, event.localY - child.y
              if child instanceof Sprite
                event = child._propagateMouseEvent event
                if event
                  @_captureMouseEvent event
                return
              hitChildren = true

        if hitChildren or @_hitTest event.localX, event.localY
          event = @_targetMouseEvent event
          @_parent?._bubbleMouseEvent event
          return event

    return

  _captureMouseEvent: (event) ->
    event = event.clone()
    event.eventPhase = EventPhase.CAPTURING_PHASE
    event.currentTarget = @
    @dispatchEvent event
    event

  _targetMouseEvent: (event) ->
    event = event.clone()
    event.eventPhase = EventPhase.AT_TARGET
    event.target = event.currentTarget = @
    @dispatchEvent event
    event

  _bubbleMouseEvent: (event) ->
    event = event.clone()
    event.eventPhase = EventPhase.BUBBLING_PHASE
    event.currentTarget = @
    @dispatchEvent event
    @_parent?._bubbleMouseEvent event
    event

  hitTestPoint: (x, y) ->
    bounds = @_bounds.clone().offset @x, @y
    hit = false
    if bounds.contains x, y
      hit = @_context.isPointInPath x - bounds.x, y - bounds.y
      unless hit
        i = @_children.length
        while i--
          child = @_children[i]
          hit |= child.hitTestPoint x - @x, y - @y
          break if hit
    hit

