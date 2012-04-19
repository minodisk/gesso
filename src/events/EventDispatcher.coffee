exports.events.EventDispatcher = class EventDispatcher extends Class

  constructor: ->
    @_events = {}

  addEventListener: (type, listener, useCapture = false, priority = 0)->
    if typeof type isnt 'string'
      throw new TypeError "EventDispatcher.addEventListener: type isn't string"
    if typeof listener isnt 'function'
      throw new TypeError "EventDispatcher.addEventListener: listener isn't function"

    unless @_events[type]?
      @_events[type] = []
    @_events[type].push
      listener  : listener
      useCapture: useCapture
      priority  : priority
    @_events[type].sort @_sortOnPriorityInDescendingOrder
    @

  _sortOnPriorityInDescendingOrder: (a, b)->
    b.priority - a.priority

  addListener: @addEventListener

  on: @addEventListener

  removeEventListener: (type, listener)->
    if storage = @_events[type]
      i = storage.length
      while i--
        if storage[i].listener is listener
          storage.splice i, 1
      if storage.length is 0
        delete @_events[type]
    @

  dispatchEvent: (event)->
    #TODO is this OK?
    event.currentTarget = @

    if (objs = @_events[event.type])?
#      unless event.currentTarget instanceof Stage
#        console.log objs
      for obj in objs
        if (obj.useCapture and event.eventPhase is EventPhase.CAPTURING_PHASE) or (obj.useCapture is false and event.eventPhase isnt EventPhase.CAPTURING_PHASE)
          do (obj, event)->
            setTimeout ->
              obj.listener event
            , 0
          break if event._isPropagationStoppedImmediately
    !event._isDefaultPrevented

  emit: @dispatchEvent
