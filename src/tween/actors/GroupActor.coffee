Actor = require 'tween/actors/Actor'

module.exports = class GroupActor extends Actor

  constructor:(actors)->
    super()
    for actor in actors
      unless actor instanceof Actor then throw new TypeError "'actors' must be inspected Actor instance."
    @_actors = actors
    @currentPhase = 0
    @totalPhase = actors.length
    @userData = {}

  stop:->
    super()
    for tween in @_actors
      if tween instanceof Actor then tween.stop()
    return

  reset:->
    super()
    @currentPhase = 0
    for tween in @_actors
      if tween instanceof Actor then tween.reset()
    return
