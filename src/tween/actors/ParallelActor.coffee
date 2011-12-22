GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class ParallelActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @running is false and @currentPhase < @totalPhase
      @running = true
      for actor in @_actors
        if actor instanceof EasingTween
          if @onError then actor.onError = @onError
          actor.onComplete = @next
          actor.play()
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
