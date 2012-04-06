GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class ParallelActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @currentPhase < @totalPhase
      for actor in @_actors
        if actor instanceof EasingTween
          if @onError then actor.onError = @onError
          actor.onComplete = @next
          actor.play()
      @_onPlay()
    return

  next:(err)=>
    if err instanceof Error
      if @onError?
        @onError err
        return
      else
        throw err
    setTimeout (=>
      if ++@currentPhase >= @totalPhase
        @currentPhase = @totalPhase
        @stop()
        @_onComplete()
    ), 0
    return
