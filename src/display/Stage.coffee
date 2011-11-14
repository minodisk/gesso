# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* > *Shape* >
# *Sprite* > *Stage*<br/>
# **Subclasses:** -
#
# The *Stage* class represents the root drawing area.<br/>
# You can access this module by doing:<br/>
# `require('display/Stage')`

Sprite = require 'display/Sprite'
TextField = require 'text/TextField'
TextFormat = require 'text/TextFormat'
Capabilities = require 'system/Capabilities'

_ceil = Math.ceil
_round = Math.round
_tick = do ->
  @requestAnimationFrame or
  @webkitRequestAnimationFrame or
  @mozRequestAnimationFrame or
  @oRequestAnimationFrame or
  @msRequestAnimationFrame or
  (callback) -> setTimeout (()->callback((new Date()).getTime())), 1000 / 60

module.exports = class Stage extends Sprite

  # ## new Stage(canvas:*HTMLCanvasElement*)
  # ## new Stage(width:*int*, height:*int*)
  # Creates a new *Stage* instance.
  constructor: (canvasOrWidth, height = null) ->
    super 'Stage'
    throw new Error "Canvas isn't supported" unless Capabilities.supports.canvas
    if canvasOrWidth instanceof HTMLCanvasElement
      canvas = canvasOrWidth
      @width = canvas.width
      @height = canvas.height
    else if not isNaN(Number canvasOrWidth) && not isNaN(Number height)
      canvas = document.createElement 'canvas'
      @width = canvas.width = canvasOrWidth
      @height = canvas.height = height
    else
      throw new TypeError()
    @_drawing = canvas.getContext '2d'
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    @_frameRate = 60
    _tick @_enterFrame
    return

  # ## frameRate:*Number*
  # Effective frame rate rounded off to one decimal places, in fps.
  # *Stage* updates `frameRate` once in every 30 frames.
  Stage::__defineGetter__ 'frameRate', -> @_frameRate

  # ## getTimer():*int*
  # Computes elapsed time since *Stage* constructed, in milliseconds.
  getTimer: ->
    (new Date()).getTime() - @_startTime

  # ## _enterFrame(time:*int*):*void*
  # [private] Handler on enter frame.
  _enterFrame: (time) =>
    @currentFrame++
    if (@currentFrame % 30) is 0
      @_frameRate = (300000 / (time - @_time) >> 0) / 10
      @_time = time
    @dispatchEvent 'enterFrame'
    if @_cache
      @_cache = false
      @_render()
    _tick @_enterFrame
    return

  # ## _render():*void*
  # [private] Renders children and draws children on canvas.
  _render: ->
    @_drawing.canvas.width = @_width
    for child in @_children
      child._render()
      @_drawChild child
    return

  # ## _requestRender():*void*
  # [private] Reserves rendering on next frame.
  _requestRender: ->
    @_cache = true
    return
