# **Package:** *tweens*<br/>
# **Inheritance:** *Object* → *Tween*<br/>
# **Subclasses:** -
#
# Tween<br/>
# You can access this module by doing:<br/>
# `require('tween/Tween')`

Ticker = require 'timers/Ticker'
Easing = require 'tween/Easing'
FunctionTween = require 'tween/actors/FunctionActor'
ParallelTween = require 'tween/actors/ParallelActor'
RepeatTween = require 'tween/actors/RepeatActor'
SerialTween = require 'tween/actors/SerialActor'
EasingTween = require 'tween/actors/EasingActor'

_slice = Array.prototype.slice

module.exports = class Tween

  @serial:(tweens...)->
    new SerialTween tweens

  @parallel:(tweens...)->
    new ParallelTween tweens

  @repeat:(tween, repeatCount)->
    new RepeatTween tween, repeatCount

  @func:(func, async = false)->
    new FunctionTween func, async

  @wait:(delay)->
    return (tween)->
      setTimeout tween.next, delay

  @tween:(target, src, dst, duration = 1000, easing = Easing.linear)->
    new EasingTween target, src, dst, duration, easing

  @to:(target, dst, duration = 1000, easing = Easing.linear)->
    new EasingTween target, null, dst, duration, easing

  constructor:->
    @_ticker = Ticker.getInstance()
    @running = false

  reset:->
    @running = false
    @currentPhase = 0
    for tween in @_tweens
      if tween instanceof Tween then tween.reset()
    return
