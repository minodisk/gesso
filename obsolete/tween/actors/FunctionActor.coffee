

class FunctionActor extends Actor
  
  constructor:(@func, @params, @async)->
    super()

  play:->
    @func @
    unless @async then @next()

  next:=>
    @onComplete?()
