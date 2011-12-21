EasingTween = require 'tween/actors/EasingActor'
GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class SerialActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @running is false and @currentPhase < @totalPhase
      @running = true
      tween = @_tweens[@currentPhase]
      if tween instanceof EasingTween
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
        tween = @_tweens[@currentPhase]
        if tween instanceof EasingTween
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
