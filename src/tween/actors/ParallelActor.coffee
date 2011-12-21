GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class ParallelActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @running is false and @currentPhase < @totalPhase
      @running = true
      for tween in @_tweens
        if tween instanceof EasingTween
          if @onError then tween.onError = @onError
          tween.onComplete = @next
          tween.play()
      @onPlay?()
    return

  next:(err)=>
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
