Ticker = require 'timers/Ticker'
Easing = require 'tweens/Easing'

module.exports = class Tween

  @tween: (target, src, dst, duration = 1000, easing = Easing.linear) ->
    new Tween target, src, dst, duration, easing

  @to: (target, dst, duration = 1000, easing = Easing.linear) ->
    new Tween target, null, dst, duration, easing

  constructor: (@target, @src, @dst, @duration, @easing) ->
    @_ticker = Ticker.getInstance()

  play: ->
    target = @target
    src = @src
    dst = @dst
    changers = {}
    for name of src
      unless changers[name]?
        changers[name] = []
      changers[name][0] = src[name]
    for name of dst
      unless changers[name]?
        changers[name] = []
      changers[name][1] = dst[name]
    for name of changers
      changer = changers[name]
      for value, i in changer
        unless value?
          changer[i] = target[name]
    @changers = changers

    @_beginningTime = new Date().getTime()
    @_ticker.addHandler @update

  update: (time) =>
    @time = time - @_beginningTime
    if complete = @time >= @duration
      @time = @duration
      factor = 1
      @_ticker.removeHandler @update
    else
      factor = @easing(@time, 0, 1, @duration)

    target = @target
    changers = @changers
    for name of changers
      changer = changers[name]
      target[name] = changer[0] + (changer[1] - changer[0]) * factor

    if @onUpdate?
      @onUpdate()
    if complete and @onComplete?
      @onComplete()

    return
