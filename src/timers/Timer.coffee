###*
The `Timer` class is the interface to timers, which let you run code on a
specified time sequence. Use the `start()` method to start a timer.
Add an event listener for the timer event to set up code to be run on the timer
interval.<br/>
You can create `Timer` objects to run once or repeat at specified intervals
to execute code on a schedule. Depending on the SWF file's framerate or
the runtime environment (available memory and other factors),
the runtime may dispatch events at slightly offset intervals.
For example, if a SWF file is set to play at 10 frames per second (fps),
which is 100 millisecond intervals, but your timer is set to fire an event
at 80 milliseconds, the event will be dispatched close to the 100 millisecond
interval. Memory-intensive scripts may also offset the events.
###
exports.timers.Timer = class Timer extends EventDispatcher

  @TIMER         : "timer"
  @TIMER_COMPLETE: "timerComplete"

  ###*
  Constructs a new `Timer` object with the specified `delay` and `repeatCount` states.
  @param delay Number      The delay, in milliseconds, between timer events.
  @param repeatCount int   The total number of times the timer is set to run.
  ###
  constructor: (delay, repeatCount = 0)->
    super()

    ###*
    @property delay Number  The delay, in milliseconds, between timer events.
    ###
    @defineProperty "delay", ->
      @_delay
    , (value)->
      running = @_running
      @stop()
      @_delay = value
      if running
        @start()
      return

    ###*
    @property repeatCount int    The total number of times the timer is set to run.
    ###
    @defineProperty "repeatCount", ->
      @_repeatCount
    , (value)->
      @_repeatCount = value
      isEndless = @_repeatCount is 0
      isComplete = @_currentCount >= @_repeatCount
      if not isEndless and isComplete
        @stop()
      return

    ###*
    [read-only] The total number of times the timer has fired since it started at zero.
    ###
    @defineProperty "currentCount", ->
      @_currentCount

    ###*
    [read-only] The timer's current state; true if the timer is running, otherwise false.
    ###
    @defineProperty "running", ->
      @_running

    @_delay = delay
    @_repeatCount = repeatCount
    @reset()

  ###*
  Stops the timer, if it is running, and sets the `currentCount` property back to 0, like the reset button of a stopwatch.
  ###
  reset: ->
    @stop()
    @_currentCount = 0

  ###*
  Starts the timer, if it is not already running.
  ###
  start: ->
    isEndless = @_repeatCount is 0
    isComplete = @_currentCount >= @_repeatCount
    if not @_running and (isEndless or not isComplete)
      if @_intervalId?
        clearInterval @_intervalId
      @_running = true
      @_intervalId = setInterval @_onInterval, @_delay

  ###*
  Stops the timer.
  ###
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
