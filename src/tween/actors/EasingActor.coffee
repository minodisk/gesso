Ticker = require 'timers/Ticker'
Actor = require 'tween/actors/Actor'

module.exports = class EasingActor extends Actor

  constructor:(target, src, dst, duration, easing)->
    super()
    @target = target
    @src = src
    @dst = dst
    @duration = duration
    @easing = easing
    @_ticker = Ticker.getInstance()

  play:->
    target = @target
    src = @src
    dst = @dst
    changers = {}
    for name of src
      unless changers[name]? then changers[name] = []
      changers[name][0] = src[name]
    for name of dst
      unless changers[name]? then changers[name] = []
      changers[name][1] = dst[name]
    for name of changers
      changer = changers[name]
      for value, i in changer
        unless value? then changer[i] = target[name]
    @changers = changers
    @_beginningTime = new Date().getTime()
    @_ticker.addHandler @_update
    @onPlay?()
    return

  stop:->
    @running = false
    return

  _update:(time)=>
    @time = time - @_beginningTime
    if complete = @time >= @duration
      @time = @duration
      factor = 1
      @_ticker.removeHandler @_update
    else
      factor = @easing(@time, 0, 1, @duration)
    target = @target
    changers = @changers
    for name of changers
      changer = changers[name]
      target[name] = changer[0] + (changer[1] - changer[0]) * factor
    @onUpdate?()
    if complete and @onComplete?
      @onComplete @
    return
