Sprite = require('display/Sprite')
TextField = require('display/TextField')
TextFormat = require('display/styles/TextFormat')
Capabilities = require('system/Capabilities')

_tick = do ->
  @requestAnimationFrame or
  @webkitRequestAnimationFrame or
  @mozRequestAnimationFrame or
  @oRequestAnimationFrame or
  @msRequestAnimationFrame or
  (callback)-> setTimeout (()->callback((new Date()).getTime())), 1000 / 60

module.exports = class Stage extends Sprite

  Stage::__defineGetter__ 'debug', -> @_debug
  Stage::__defineSetter__ 'debug', (debug) ->
    @_debug = debug
    unless @_debugTextField?
      @_debugTextField = new TextField
      @_debugTextField.format = new TextFormat 'monospace', 13, 0xffffff
      console.log @_debugTextField.format
      @addChild @_debugTextField

  constructor:(canvasOrWidth, height = null)->
    super('Stage')
    throw new Error("Canvas isn't supported") unless Capabilities.supports.canvas
    if canvasOrWidth instanceof HTMLCanvasElement
      @_canvas = canvasOrWidth
      @width = @_canvas.width
      @height = @_canvas.height
    else if not isNaN(Number(canvasOrWidth)) && not isNaN(Number(height))
      @_canvas = document.createElement('canvas')
      @width = @_canvas.width = canvasOrWidth
      @height = @_canvas.height = height
    else
      throw new TypeError()
    @_context = @_canvas.getContext('2d')
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    _tick @_onAnimationFrame

  getTime:->
    (new Date()).getTime() - @_startTime

  getAverageFrameRate:()->
    @getTime() / @currentFrame

  _onAnimationFrame:(time)=>
    @currentFrame++
    if (@currentFrame % 30) is 0
      @frameRate = (300000 / (time - @_time) >> 0) / 10
      @_time = time
      @_debugTextField.text = "fps: #{ @frameRate }" if @_debugTextField?
    @dispatchEvent 'enterFrame'
    if @_isRender
      @render()
      @_isRender = false
    _tick @_onAnimationFrame

  _requestRender:->
    @_isRender = true
    return