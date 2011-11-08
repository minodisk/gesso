module.exports = class EventDispatcher

  constructor:->
    @_events = {}

  addEventListener:(type, listener, args)->
    throw new Error '' if typeof listener isnt 'function'
    @_events[type] = [] unless @_events[type]?
    @_events[type].push ()=>
      listener.apply(@, args)
      return
    @

  dispatchEvent:(type)->
    handlers = @_events[type]
    if handlers?
      handler() for handler in handlers
    return

  EventDispatcher::addListener = EventDispatcher::on = @addEventListener
  EventDispatcher::emit = @dispatchEvent
