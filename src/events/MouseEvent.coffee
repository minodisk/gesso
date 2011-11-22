Event = require 'events/Event'

module.exports = class MouseEvent extends Event

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

  constructor: (type, bubbles = true, cancelable = false, @localX = NaN, @localY = NaN, @relatedObject = null, ctrlKey = false, altKey = false, shiftKey = false, buttonDown = false, delta = 0, commandKey = false, controlKey = false, clickCount = 0) ->
    super type, bubbles, cancelable

  clone: ->
    event = new MouseEvent @type, @bubbles, @cancelable, @localX, @localY, @relatedObject, @ctrlKey, @altKey, @shiftKey, @buttonDown, @delta, @commandKey, @controlKey, @clickCount
    event.currentTarget = @currentTarget
    event.target = @target
    event.stageX = @stageX
    event.stageY = @stageY
    event
