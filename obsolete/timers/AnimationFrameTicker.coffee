_requestAnimationFrame = do ->
  @requestAnimationFrame or
  @webkitRequestAnimationFrame or
  @mozRequestAnimationFrame or
  @oRequestAnimationFrame or
  @msRequestAnimationFrame or
  (callback) -> setTimeout (()->callback((new Date()).getTime())), 1000 / 60
_instance = null
_internal = false

class AnimationFrameTicker

  @getInstance: ->
    unless _instance?
      _internal = true
      _instance = new AnimationFrameTicker
    _instance

  constructor: ->
    if _internal is false
      throw new Error "Ticker is singleton model, call Ticker.getInstance()."
    _internal = false

    @_handlers = []
    @_continuous = false
    @_counter = 0

  addHandler: (handler) ->
    @_handlers.push handler
    if @_continuous is false
      @_continuous = true
      _requestAnimationFrame @_onAnimationFrame
    return

  removeHandler: (handler) ->
    @_handlers.splice @_handlers.indexOf(handler), 1
    if @_handlers.length is 0
      @_continuous = false
    return

  _onAnimationFrame: (time) =>
    @_counter++
    for handler in @_handlers
      do (handler) ->
        setTimeout (-> handler time), 0
    if @_continuous is true
      _requestAnimationFrame @_onAnimationFrame
    return
