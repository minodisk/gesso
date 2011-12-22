FunctionActor = require 'tween/actors/FunctionActor'

module.exports = class WaitActor extends FunctionActor

  constructor:(delay)->
    super ((tween)->
      setTimeout tween.next, delay
    ), null, true
