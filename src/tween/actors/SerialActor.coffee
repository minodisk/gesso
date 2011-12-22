EasingActor = require 'tween/actors/EasingActor'
FunctionActor = require 'tween/actors/FunctionActor'
GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class SerialActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @running is false and @currentPhase < @totalPhase
      @running = true
      actor = @_actors[@currentPhase]
      if @onError then actor.onError = @onError
      actor.onComplete = @next
      unless actor instanceof FunctionActor
        actor.play()
      else
        args = _slice.call arguments
        args.unshift @
        actor.play.apply actor, args
      @onPlay?()
    return

  next:(err)=>
    if err instanceof Error
      if @onError?
        @onError err
        return
      else
        throw err
    if @running
      if ++@currentPhase < @totalPhase
        tween = @_actors[@currentPhase]
        if @onError then tween.onError = @onError
        tween.onComplete = @next
        unless tween instanceof FunctionActor
          tween.play()
        else
          args = _slice.call arguments
          args.unshift @
          tween.play.apply tween, args
      else
        @stop()
        @onComplete?()
    return
