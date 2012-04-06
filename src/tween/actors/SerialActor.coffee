EasingActor = require 'tween/actors/EasingActor'
FunctionActor = require 'tween/actors/FunctionActor'
GroupActor = require 'tween/actors/GroupActor'

_slice = Array.prototype.slice

module.exports = class SerialActor extends GroupActor
  
  constructor:(tweens)->
    super(tweens)

  play:->
    if @currentPhase < @totalPhase
      @_act()
      @_onPlay()
    return

  next:(err)=>
    @_onError err
    if ++@currentPhase < @totalPhase
      @_act()
    else
      @currentPhase = @totalPhase
      @stop()
      @_onComplete()
    return

  _act:->
    actor = @_actors[@currentPhase]
    if @onError then actor.onError = @onError
    actor.onComplete = @next
    unless actor instanceof FunctionActor
      actor.play()
    else
      args = _slice.call arguments
      args.unshift @
      actor.play.apply actor, args
