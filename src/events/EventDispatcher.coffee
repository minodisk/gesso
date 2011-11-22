module.exports = class EventDispatcher

  constructor: ->
    @_events = {}

  addEventListener: (type, listener) ->
    throw new Error '' if typeof listener isnt 'function'
    @_events[type] = [] unless @_events[type]?
    @_events[type].push listener
    @

  dispatchEvent: (event) ->
    event.currentTarget = @
    handlers = @_events[event.type]
    if handlers?
      for handler in handlers
        handler event
        break if event._isPropagationStoppedImmediately
    return

  EventDispatcher::addListener = EventDispatcher::on = @addEventListener
  EventDispatcher::emit = @dispatchEvent
