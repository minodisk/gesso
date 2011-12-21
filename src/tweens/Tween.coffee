# **Package:** *tweens*<br/>
# **Inheritance:** *Object* → *Tween*<br/>
# **Subclasses:** -
#
# Tween<br/>
# You can access this module by doing:<br/>
# `require('tweens/Tween')`

Ticker = require 'timers/Ticker'
Easing = require 'tweens/Easing'

_slice = Array.prototype.slice

module.exports = class Tween

  @serial:(tweens...)->
    t = new Tween
    t._setupSerial tweens
    t

  @parallel:(tweens...)->
    t = new Tween
    t._serupParallel tweens
    t

  @repeat:(tween, repeatCount)->
    t = new Tween
    t._setupRepeat tween, repeatCount
    t

  @tween:(target, src, dst, duration = 1000, easing = Easing.linear)->
    t = new Tween
    t._setupTween target, src, dst, duration, easing
    t

  @to:(target, dst, duration = 1000, easing = Easing.linear)->
    t = new Tween
    t._setupTween target, null, dst, duration, easing
    t

  constructor:->
    @_ticker = Ticker.getInstance()

  _setupSerial:(tweens)=>
    @_tweens = tweens
    @running = false
    @currentPhase = 0
    @totalPhase = tweens.length
    @userData = {}
    @play = @_playSerial
    @next = @_nextSerial
    @stop = @_stopTweens
    return
  _playSerial:=>
    if @running is false and @currentPhase < @totalPhase
      @running = true
      tween = @_tweens[@currentPhase]
      if tween instanceof Tween
        if @onError then tween.onError = @onError
        tween.onComplete = @next
        tween.play()
      else
        args = _slice.call arguments
        if args[0] instanceof Error
          @onError args[0]
          return
        args.unshift @
        tween.apply null, args
    return
  _nextSerial:(err)=>
    if err instanceof Error
      if @onError?
        @onError err
        return
      else
        throw err
    if @running
      if ++@currentPhase < @totalPhase
        tween = @_tweens[@currentPhase]
        if tween instanceof Tween
          if @onError then tween.onError = @onError
          tween.onComplete = @next
          tween.play()
        else
          args = _slice.call arguments
          args.unshift @
          tween.apply null, args
      else
        @stop()
        @onComplete?()
    return

  _setupParallel:(tweens)=>
    @_tweens = tweens
    @running = false
    @currentPhase = 0
    @totalPhase = tweens.length
    @userData = {}
    @play = @_playParallel
    @next = @_nextParallel
    @stop = @_stopTweens
    return
  _playParallel:=>
    if @running is false and @currentPhase < @totalPhase
      @running = true
      for tween in @_tweens
        if tween instanceof Tween
          if @onError then tween.onError = @onError
          tween.onComplete = @next
          tween.play()
    return
  _playNext:(err)=>
    if err instanceof Error
      if @onError?
        @onError err
        return
      else
        throw err
    setTimeout (=>
      if @running and ++@currentPhase >= @totalPhase
        @stop
        @onComplete?()
    ), 0
    return

  _setupRepeat:(tween, repeatCount)=>
    @_tweens = []
    @running = false
    @currentPhase = 0
    @totalPhase = repeatCount
    @userData = {}
    @play = @_playRepeat
    @next = @_nextRepeat
    @stop = @_stopTweens
    while repeatCount--
      @_tweens.push tween
    return
  _playRepeat: @_playSerial
  _nextRepeat:=>
    tween = @_tweens[@currentPhase]
    if tween instanceof Tween
      tween.reset()
    @_serial.next.apply @, arguments
    return

  _stopTweens:->
    @running = false
    for tween in @_tweens
      if tween instanceof Tween then tween.stop()
    return

  _setupTween:(target, src, dst, duration, easing)->
    @target = target
    @src = src
    @dst = dst
    @duration = duration
    @easing = easing
    @play = @_playTween
    @stop = @_stopTween
  _playTween:=>
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
    @_ticker.addHandler @_updateTween
    return
  _updateTween:(time)=>
    @time = time - @_beginningTime
    if complete = @time >= @duration
      @time = @duration
      factor = 1
      @_ticker.removeHandler @_updateTween
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
  _stopTween:=>
    @running = false

  reset:->
    @running = false
    @currentPhase = 0
    for tween in @_tweens
      if tween instanceof Tween then tween.reset()
    return
