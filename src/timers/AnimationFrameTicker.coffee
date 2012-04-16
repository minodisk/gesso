exports.text.AnimationFrameTicker = class AnimationFrameTicker

  @getInstance: ->
    unless @_instance?
      @_internal = true
      @_instance = new AnimationFrameTicker
    @_instance

  constructor: ->
    unless AnimationFrameTicker._internal
      throw new Error "AnimationFrameTicker: call AnimationFrameTicker.getInstance()"
    AnimationFrameTicker._internal = false
    @_handlers = []
    @_running = false
    @_counter = 0

  addHandler: (handler)->
    if @_handlers.indexOf(handler) is -1
      @_handlers.push handler
      if @_running is false
        @_running = true
        _requestAnimationFrame @_onAnimationFrame
    return

  removeHandler: (handler)->
    @_handlers.splice @_handlers.indexOf(handler), 1
    if @_handlers.length is 0
      @_running = false
    return

  _onAnimationFrame: (time)=>
#    if @_counter++ % 2 is 0
#      for handler in @_handlers
#        do (handler)=>
#          setTimeout =>
#            if @_running
#              handler time
#          , 0+ % 2 is 0
    @_counter++
    for handler in @_handlers
      do (handler)=>
        setTimeout =>
          if @_running
            handler time
        , 0
    if @_running is true
      _requestAnimationFrame @_onAnimationFrame
    return
