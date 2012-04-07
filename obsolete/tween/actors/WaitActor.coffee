

class WaitActor extends FunctionActor

  constructor:(delay)->
    super ((tween)->
      setTimeout tween.next, delay
    ), null, true
