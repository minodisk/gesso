exports.events.KeyboardEvent = class KeyboardEvent extends Event

  constructor: (@type, @bubbles = false, @cancelable = false, charCodeValue = 0, keyCodeValue = 0, keyLocationValue = 0, ctrlKeyValue = false, altKeyValue = false, shiftKeyValue = false, controlKeyValue = false, commandKeyValue = false) ->
    super 'Event'
