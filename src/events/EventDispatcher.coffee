EventPhase = require 'events/EventPhase'

module.exports = class EventDispatcher

  constructor: ->
    @_events = {}

  addEventListener: (type, listener, useCapture = false, priority = 0) ->
    throw new TypeError "listener isn't function" if typeof listener isnt 'function'
    @_events[type] = [] unless @_events[type]?
    @_events[type].push
      listener: listener
      useCapture: useCapture
      priority: priority
    @_events[type].sort @_sortOnPriorityInDescendingOrder
    @

  _sortOnPriorityInDescendingOrder: (a, b) ->
    b.priority - a.priority

  dispatchEvent: (event) ->
    event.currentTarget = @
    objs = @_events[event.type]
    if objs?
      for obj in objs when (obj.useCapture and event.eventPhase is EventPhase.CAPTURING_PHASE) or (obj.useCapture is false and event.eventPhase isnt EventPhase.CAPTURING_PHASE)
        obj.listener event
        break if event._isPropagationStoppedImmediately
    !event._isDefaultPrevented

  EventDispatcher::addListener = EventDispatcher::on = @addEventListener
  EventDispatcher::emit = @dispatchEvent
