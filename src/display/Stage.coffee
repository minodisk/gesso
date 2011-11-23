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

_tick = do ->
  @requestAnimationFrame or
  @webkitRequestAnimationFrame or
  @mozRequestAnimationFrame or
  @oRequestAnimationFrame or
  @msRequestAnimationFrame or
  (callback) -> setTimeout (()->callback((new Date()).getTime())), 1000 / 60

module.exports = class Stage extends Sprite

  # ### new Stage(canvas:*HTMLCanvasElement*)
  # ### new Stage(width:*int*, height:*int*)
  # Creates a new *Stage* object.
  constructor: (canvasOrWidth, height = null) ->
    super 'Stage'
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
    @_context = canvas.getContext '2d'
    @_bounds = new Rectangle 0, 0, canvas.width, canvas.height
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    @_frameRate = 60
    _tick @_enterFrame
    canvas.addEventListener 'click', @_onClick, false
    canvas.addEventListener 'mousemove', @_onMouseMove, false
    return

  # ### frameRate:*Number*
  # Effective frame rate rounded off to one decimal places, in fps.
  # *Stage* updates `frameRate` once in every 30 frames.
  Stage::__defineGetter__ 'frameRate', -> @_frameRate

  # ### getTimer():*int*
  # Computes elapsed time since *Stage* constructed, in milliseconds.
  getTimer: ->
    (new Date()).getTime() - @_startTime

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
    _tick @_enterFrame
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

  _onClick: (e) =>
    event = new MouseEvent MouseEvent.CLICK
    event.stageX = event.localX = e.offsetX
    event.stageY = event.localY = e.offsetY
    @_propagateMouseEvent event

  _onMouseMove: (e) =>
    event = new MouseEvent MouseEvent.MOUSE_MOVE
    event.stageX = event.localX = e.offsetX
    event.stageY = event.localY = e.offsetY
    @_propagateMouseEvent event
