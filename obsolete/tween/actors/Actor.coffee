

class Actor extends EventDispatcher

  constructor:->

  stop:->

  reset:->

  _onPlay:->
    @onPlay? @

  _onComplete:->
    @onComplete? @

  _onError:(err)->
    if err instanceof Error
      if typeof @onError is 'function'
        @onError err
      else
        throw err
    return
