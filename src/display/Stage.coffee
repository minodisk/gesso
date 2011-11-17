# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* > *Sprite* > *Stage*<br/>
# **Subclasses:** -
#
# The *Stage* class represents the root drawing area.<br/>
# You can access this module by doing:<br/>
# `require('display/Stage')`

Sprite = require 'display/Sprite'
Rectangle = require 'geom/Rectangle'
Capabilities = require 'system/Capabilities'
TextField = require 'text/TextField'
TextFormat = require 'text/TextFormat'

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

  # ### new Stage(canvas:*HTMLCanvasElement*)
  # ### new Stage(width:*int*, height:*int*)
  # Creates a new *Stage* object.
  constructor: (canvasOrWidth, height = null) ->
    super 'Stage'
    throw new Error "Canvas isn't supported" unless Capabilities.supports.canvas
    if canvasOrWidth instanceof HTMLCanvasElement
      canvas = canvasOrWidth
      @_width = canvas.width
      @_height = canvas.height
    else if not isNaN(Number canvasOrWidth) && not isNaN(Number height)
      canvas = document.createElement 'canvas'
      @_width = canvas.width = canvasOrWidth
      @_height = canvas.height = height
    else
      throw new TypeError()
    @_cache = canvas.getContext '2d'
    @_bounds = new Rectangle 0, 0, canvas.width, canvas.height
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    @_frameRate = 60
    _tick @_enterFrame
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
    @dispatchEvent 'enterFrame'
    if @_drawn
      @_drawn = false
      @_render()
    _tick @_enterFrame
    return

  # ### _render():*void*
  # [private] Renders children, then draws children on this object.
  _render: ->
    for child in @_children
      child._render()
    @_cache.canvas.width = @_width
    @_drawChildren()
    return

  # ### _requestRender():*void*
  # [private] Reserves rendering on next frame.
  _requestRender: ->
    @_drawn = true
    return
