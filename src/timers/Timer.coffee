EventDispatcher = require('events/EventDispatcher')

_setInterval = setInterval
_clearInterval = clearInterval

module.exports = class Timer extends EventDispatcher

    Timer::__defineGetter__ 'delay', -> @_delay
    Timer::__defineSetter__ 'delay', (delay)->
        running = @_running
        @stop()
        @_delay = delay
        @start() if running

    Timer::__defineGetter__ 'repeatCount', -> @_repeatCount
    Timer::__defineSetter__ 'repeatCount', (repeatCount)->
        @_repeatCount = repeatCount
        @stop() if @_repeatCount isnt 0 and @_currentCount >= @_repeatCount

    Timer::__defineGetter__ 'currentCount', -> @_currentCount

    Timer::__defineGetter__ 'running', -> @_running

    constructor:(delay, repeatCount = 0)->
        @delay = Number(delay)
        throw new Error 'Timer constructor requires delay as Number.' if isNaN @delay
        @reset()

    reset:->
        @stop()
        @_currentCount = 0
        return

    start:->
        if @_running isnt true and (@_repeatCount is 0 or @_currentCount < @_repeatCount)
            _clearInterval @_intervalId if @_intervalId?
            @_running = true
            @_intervalId = _setInterval @_onInterval, @_delay
        return

    stop:->
        @_running = false
        if @_intervalId?
            _clearInterval @_intervalId
            @_intervalId = null
        return

    _onInterval:=>
        @dispatchEvent 'timer'
        if @_repeatCount isnt 0 and ++@_currentCount >= @_repeatCount
            @stop()
            @dispatchEvent 'timerComplete'
        return
