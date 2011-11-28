Ticker = require 'timers/Ticker'
Easing = require 'tweens/Easing'

module.exports = class Tween

  @tween: (target, src, dst, duration = 1, easing = Easing.linear) ->
    new Tween target, src, dst, duration, easing

  @to: (target, dst, duration = 1, easing = Easing.linear) ->
    new Tween target, null, dst, duration, easing

  constructor: (@target, @src, @dst, duration, @easing) ->
    @duration = duration * 1000
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

    @_time = new Date().getTime()
    @_ticker.addHandler @update

  update: (time) =>
    time -= @_time
    if complete = time >= @duration
      factor = 1
    else
      factor = @easing(time, 0, 1, @duration)

    target = @target
    changers = @changers
    for name of changers
      changer = changers[name]
      target[name] = changer[0] + (changer[1] - changer[0]) * factor

    if complete && @onComplete?
      @onComplete()
