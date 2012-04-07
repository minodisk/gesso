# **Package:** *tweens*<br/>
# **Inheritance:** *Object* → *Tween*<br/>
# **Subclasses:** -
#
# Tween<br/>
# You can access this module by doing:<br/>

_slice = Array.prototype.slice

class Tween

  @serial:(actors...)->
    new SerialActor actors

  @parallel:(actors...)->
    new ParallelActor actors

  @repeat:(actor, repeatCount)->
    new RepeatActor actor, repeatCount

  @func:(func, params...)->
    new FunctionActor func, params, false

  @funcAsync:(func, params...)->
    new FunctionActor func, params, true

  @wait:(delay)->
    new WaitActor delay

  @tween:(target, src, dst, duration = 1000, easing = Easing.linear)->
    new EasingTween target, src, dst, duration, easing

  @to:(target, dst, duration = 1000, easing = Easing.linear)->
    new EasingTween target, null, dst, duration, easing
