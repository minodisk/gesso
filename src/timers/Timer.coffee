exports.timers.Timer = class Timer extends EventDispatcher

  @TIMER         : "timer"
  @TIMER_COMPLETE: "timerComplete"

  constructor: (delay, repeatCount = 0)->
    super()

    @defineProperty "delay", ->
      @_delay
    , (value)->
      running = @_running
      @stop()
      @_delay = value
      if running
        @start()
      return

    @defineProperty "repeatCount", ->
      @_repeatCount
    , (value)->
      @_repeatCount = value
      isEndless = @_repeatCount is 0
      isComplete = @_currentCount >= @_repeatCount
      if not isEndless and isComplete
        @stop()
      return

    @defineProperty "currentCount", ->
      @_currentCount

    @defineProperty "running", ->
      @_running

    @_delay = delay
    @_repeatCount = repeatCount
    @reset()

  reset: ->
    @stop()
    @_currentCount = 0

  start: ->
    isEndless = @_repeatCount is 0
    isComplete = @_currentCount >= @_repeatCount
    if not @_running and (isEndless or not isComplete)
      if @_intervalId?
        clearInterval @_intervalId
      @_running = true
      @_intervalId = setInterval @_onInterval, @_delay

  stop: ->
    @_running = false
    if @_intervalId
      clearInterval @_intervalId
      @_intervalId = null

  _onInterval: =>
    isEndless = @_repeatCount is 0
    isComplete = ++@_currentCount >= @_repeatCount
    @dispatchEvent new Event Timer.TIMER
    if not isEndless and isComplete
      @stop()
      @dispatchEvent new Event Timer.TIMER_COMPLETE
