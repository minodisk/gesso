# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Sprite* →
# *Sprite* → *Stage*<br/>
# **Subclasses:** -
#
# The *Stage* class represents the root drawing area.<br/>
# You can access this module by doing:<br/>
# `require('display/Stage')`

Sprite = require 'display/Sprite'
Event = require 'events/Event'
EventPhase = require 'events/EventPhase'
MouseEvent = require 'events/MouseEvent'
Rectangle = require 'geom/Rectangle'
TextField = require 'text/TextField'
TextFormat = require 'text/TextFormat'
Ticker = require 'timers/Ticker'

module.exports = class Stage extends Sprite

  _getWidth:->
    @_width

  _getHeight:->
    @_height

  # ### new Stage(canvas:*HTMLCanvasElement*)
  # ### new Stage(width:*int*, height:*int*)
  # Creates a new *Stage* object.
  constructor: (canvasOrWidth, height = null) ->
    super()

    # ### frameRate:*Number*
    # Effective frame rate rounded off to one decimal places, in fps.
    # *Stage* updates `frameRate` once in every 30 frames.
    @defineProperty 'frameRate'
      , ->
        @_frameRate

    if canvasOrWidth instanceof HTMLCanvasElement
      canvas = canvasOrWidth
      @_width = canvas.width
      @_height = canvas.height
    else if not isNaN(Number canvasOrWidth) && not isNaN(Number height)
      canvas = document.createElement 'canvas'
      @_width = canvas.width = canvasOrWidth
      @_height = canvas.height = height
    else
      throw new TypeError ''
    @_canvas = canvas
    @__stage = @
    @_context = canvas.getContext '2d'
    @_bounds = new Rectangle 0, 0, canvas.width, canvas.height
    @overrideMouseWheel = false
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    @_frameRate = 60

    Ticker.getInstance().addHandler @_enterFrame
    canvas.addEventListener 'click', @_onClick, false
    canvas.addEventListener 'mousedown', @_onMouseDown, false
    canvas.addEventListener 'mouseup', @_onMouseUp, false
    canvas.addEventListener 'mousemove', @_onMouseMove, false
    canvas.addEventListener 'mousewheel', @_onMouseWheel, false

  # ### getTimer():*int*
  # Computes elapsed time since *Stage* constructed, in milliseconds.
  getTimer: ->
    new Date().getTime() - @_startTime

  # ### _enterFrame(time:*int*):*void*
  # [private] The handler of enter frame.
  _enterFrame: (time) =>
    @currentFrame++
    if (@currentFrame % 30) is 0
      @_frameRate = (300000 / (time - @_time) >> 0) / 10
      @_time = time
    @dispatchEvent new Event(Event.ENTER_FRAME)
    if @_drawn
      @_drawn = false
      @_render()
    return

  # ### _render():*void*
  # [private] Renders children, then draws children on this object.
  _render: ->
    child._render() for child in @_children when child._drawn
    @_context.canvas.width = @_width
    @_drawChildren()
    return

  # ### _requestRender():*void*
  # [private] Reserves rendering on next frame.
  _requestRender: ->
    @_drawn = true
    return

  _hitTest: (localX, localY) ->
    @_bounds.contains localX, localY

  _onClick: (e) =>
    e.preventDefault()
    event = new MouseEvent MouseEvent.CLICK, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseDown: (e) =>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_DOWN, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseUp: (e) =>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_UP, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseMove: (e) =>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_MOVE, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseWheel: (e) =>
    if @overrideMouseWheel
      e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_WHEEL, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _setMousePosition: (event, nativeEvent) ->
    event.stageX = event.localX = if nativeEvent.offsetX? then nativeEvent.offsetX else nativeEvent.pageX - @_canvas.offsetLeft
    event.stageY = event.localY = if nativeEvent.offsetY? then nativeEvent.offsetY else nativeEvent.pageY - @_canvas.offsetTop
    event.delta = if nativeEvent.wheelDelta? then nativeEvent.wheelDelta else if nativeEvent.detail? then nativeEvent.detail else 0
