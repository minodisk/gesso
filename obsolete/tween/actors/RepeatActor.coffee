

class RepeatActor extends SerialActor

  constructor:(tween, repeatCount)->
    tweens = []
    while repeatCount--
      tweens.push tween
    super(tweens)

  next:->
    tween = @_actors[@currentPhase]
    if tween instanceof Tween
      tween.reset()
    @_serial.next.apply @, arguments
    return
