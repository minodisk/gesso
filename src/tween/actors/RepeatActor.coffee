SerialActor = require 'tween/actors/SerialActor'

module.exports = class RepeatActor extends SerialActor

  constructor:(tween, repeatCount)->
    tweens = []
    while repeatCount--
      tweens.push tween
    super(tweens)

  next:->
    tween = @_tweens[@currentPhase]
    if tween instanceof Tween
      tween.reset()
    @_serial.next.apply @, arguments
    return
