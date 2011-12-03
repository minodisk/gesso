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
    super()

    @defineProperty '_stage'
      , null
      , (value) ->
        child._stage = value for child in @_children
        @__stage = value
        return

    @defineProperty 'mouseEnabled'
      , ->
        @_mouseEnabled
      , (value) ->
        @_mouseEnabled = value

    @defineProperty 'mouseChildren'
      , ->
        @_mouseChildren
      , (value) ->
        @_mouseChildren = value

    @defineProperty 'buttonMode'
      , ->
        @_buttonMode
      , (value) ->
        @_buttonMode = value

    @_children = []
    @_mouseEnabled = true
    @_mouseChildren = true
    @_buttonMode = false
    @_mouseIn = false

  # ### addChild(children...:*DisplayObject*):*Sprite*
  # Adds a child *DisplayObject* object to this object.
  addChild: (children...) ->
    for child in children
      child._stage = @__stage
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
    #@_measureSize()
    @_applySize()
    @_execStacks()
    @_drawChildren()
    @_applyFilters()
    #@_drawBounds()

  # ### _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize: ->
    super()

    rect = @_rect
    bounds = @_bounds

    for child in @_children
      rect.union child._rect
      b = child._bounds.clone()
      b.x += child.x
      b.y += child.y
      bounds.union b

    x = Math.floor bounds.x
    if x isnt bounds.x
      bounds.width++
    y = Math.floor bounds.y
    if y isnt bounds.y
      bounds.height++
    bounds.x = x
    bounds.y = y
    bounds.width = Math.ceil bounds.width
    bounds.height = Math.ceil bounds.height

    @_width = rect.width
    @_height = rect.height
    @_rect = rect
    @_bounds = bounds
    return

  # ### _drawBounds():*void*
  # [private] Draws the bounds of this object for debug.
  _drawBounds: ->
    @_context.strokeStyle = 'rgba(255, 0, 0, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_width, @_height
    return

  # ### _render():*void*
  # [private] Draws children on this object.
  _drawChildren: ->
    for child in @_children
      if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
        throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y

        child._render() if child._drawn
        child._getTransform().setTo(@_context)
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

      hit = @_hitTest event.localX, event.localY
      if hit is true and @_mouseIn is false
        e = event.clone()
        e.type = MouseEvent.MOUSE_OVER
        @_targetMouseEvent e

        e = event.clone()
        e.type = MouseEvent.ROLL_OVER
        e.bubbles = false
        @_targetMouseEvent e

        @_mouseIn = true
        if @_buttonMode
          @__stage._canvas.style.cursor = 'pointer'
      else if hit is false and @_mouseIn is true
        e = event.clone()
        e.type = MouseEvent.MOUSE_OUT
        @_targetMouseEvent e

        e = event.clone()
        e.type = MouseEvent.ROLL_OUT
        e.bubbles = false
        @_targetMouseEvent e

        @_mouseIn = false
        if @ isnt @__stage
          @__stage._canvas.style.cursor = 'default'

      if @_mouseChildren
        i = @_children.length
        while i--
          child = @_children[i]
          if child._propagateMouseEvent?
            e = child._propagateMouseEvent event
            if e?
              @_captureMouseEvent e
              return
          if child._hitTest? event.localX - child.x, event.localY - child.y
            hit = true

      if hit
        return @_targetMouseEvent event

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
    if event.bubbles
      @_parent?._bubbleMouseEvent event
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

  startDrag: (lockCenter = false) ->
    @__stage.addEventListener MouseEvent.MOUSE_MOVE, @_drag

  _drag: (e) =>
    @x = e.stageX
    @y = e.stageY

  stopDrag: ->
    @__stage.removeEventListener MouseEvent.MOUSE_MOVE, @_drag
