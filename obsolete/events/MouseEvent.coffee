

class MouseEvent extends Event

  @CLICK = 'click'
  @CONTEXT_MENU = 'contextMenu'
  @DOUBLE_CLICK = 'doubleClick'
  @MIDDLE_CLICK = 'middleClick'
  @MIDDLE_MOUSE_DOWN = 'middleMouseDown'
  @MIDDLE_MOUSE_UP = 'middleMouseUp'
  @MOUSE_DOWN = 'mouseDown'
  @MOUSE_MOVE = 'mouseMove'
  @MOUSE_OUT = 'mouseOut'
  @MOUSE_OVER = 'mouseOver'
  @MOUSE_UP = 'mouseUp'
  @MOUSE_WHEEL = 'mouseWheel'
  @RIGHT_CLICK = 'rightClick'
  @RIGHT_MOUSE_DOWN = 'rightMouseDown'
  @RIGHT_MOUSE_UP = 'rightMouseUp'
  @ROLL_OUT = 'rollOut'
  @ROLL_OVER = 'rollOver'

  constructor: (type, bubbles = false, cancelable = false, localX = NaN, localY = NaN, relatedObject = null, ctrlKey = false, altKey = false, shiftKey = false, buttonDown = false, delta = 0, commandKey = false, controlKey = false, clickCount = 0)->
    unless @ instanceof MouseEvent then return new MouseEvent type, bubbles, cancelable, localX, localY, relatedObject, ctrlKey, altKey, shiftKey, buttonDown, delta, commandKey, controlKey, clickCount
    if type instanceof MouseEvent
      event = type
      type = event.type
      bubbles = event.bubbles
      cancelable = event.cancelable
      localX = event.localX
      localY = event.localY
      relatedObject = event.relatedObject
      ctrlKey = event.ctrlKey
      altKey = event.altKey
      shiftKey = event.shiftKey
      buttonDown = event.buttonDown
      delta = event.delta
      commandKey = event.commandKey
      controlKey = event.controlKey
      clickCount = event.clickCount
      currentTarget = event.currentTarget
      target = event.target
      stageX = event.stageX
      stageY = event.stageY
    super type, bubbles, cancelable
    @localX = localX
    @localY = localY
    @relatedObject = relatedObject
    @ctrlKey = ctrlKey
    @altKey = altKey
    @shiftKey = shiftKey
    @buttonDown = buttonDown
    @delta = delta
    @commandKey = commandKey
    @controlKey = controlKey
    @clickCount = clickCount
    @currentTarget = currentTarget
    @target = target
    @stageX = stageX
    @stageY = stageY
