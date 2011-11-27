module.exports = class Event

  @ENTER_FRAME: 'enterFrame'
  @COMPLETE: 'complete'

  constructor: (@type, @bubbles = false, @cancelable = false) ->
    @_isPropagationStopped = false
    @_isPropagationStoppedImmediately = false
    @_isDefaultPrevented = false

  clone: () ->
    event = new Event @type, @bubbles, @cancelable
    event.currentTarget = @currentTarget
    event.target = @target
    event

  formatToString: (className, arguments...) ->
    ''

  stopPropagation: ->
    @_isPropagationStopped = true
    return

  stopImmediatePropagation: ->
    @_isPropagationStopped = true
    @_isPropagationStoppedImmediately = true
    return

  isDefaultPrevented: ->
    @_isDefaultPrevented

  preventDefault: ->
    @_isDefaultPrevented = true
    return
