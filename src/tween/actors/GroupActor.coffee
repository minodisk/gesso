Actor = require 'tween/actors/Actor'

module.exports = class GroupActor extends Actor

  constructor:(tweens)->
    super()
    @_tweens = tweens
    @currentPhase = 0
    @totalPhase = tweens.length
    @userData = {}

  stop:->
    @running = false
    for tween in @_tweens
      if tween instanceof Actor then tween.stop()
    return
