Klass = require 'core/Klass'
EventPhase = require 'events/EventPhase'

module.exports = class EventDispatcher extends Klass

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
  addListener: @addEventListener
  on: @addEventListener

  removeEventListener: (type, listener) ->
    if storage = @_events[type]
      i = storage.length
      while i--
        if storage[i].listener is listener
          storage.splice i, 1
      if storage.length is 0
        delete @_events[type]
    @

  dispatchEvent: (event) ->
    event.currentTarget = @
    objs = @_events[event.type]
    if objs?
      for obj, i in objs
        if (obj.useCapture and event.eventPhase is EventPhase.CAPTURING_PHASE) or (obj.useCapture is false and event.eventPhase isnt EventPhase.CAPTURING_PHASE)
          do (obj, event) ->
            setTimeout((->
              obj.listener(event)
            ), 0)
          break if event._isPropagationStoppedImmediately
    !event._isDefaultPrevented
  emit: @dispatchEvent
