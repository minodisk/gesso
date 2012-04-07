# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *InteractiveObject*<br/>
# **Subclasses:** *Sprite*
#
# You can access this module by doing:<br/>

_RADIAN_PER_DEGREE = Math.PI / 180

class InteractiveObject extends DisplayObject

  constructor:->
    super()

  _propagateMouseEvent:(event)->
    if @_mouseEnabled and event._isPropagationStopped is false
      event = new MouseEvent event
      pt = @_getTransform().invert().transformPoint(new Vector(event.localX, event.localY))
      event.localX = pt.x
      event.localY = pt.y

      hit = @_hitTest event.localX, event.localY

      if hit is true and @_mouseIn is false
        e = new MouseEvent event
        e.type = MouseEvent.MOUSE_OVER
        @_targetMouseEvent e

        e = new MouseEvent event
        e.type = MouseEvent.ROLL_OVER
        e.bubbles = false
        @_targetMouseEvent e

        @_mouseIn = true
        if @_buttonMode
          @__stage._canvas.style.cursor = 'pointer'
      else if hit is false and @_mouseIn is true
        e = new MouseEvent event
        e.type = MouseEvent.MOUSE_OUT
        @_targetMouseEvent e

        e = new MouseEvent event
        e.type = MouseEvent.ROLL_OUT
        e.bubbles = false
        @_targetMouseEvent e

        @_mouseIn = false
        if @ isnt @__stage
          @__stage._canvas.style.cursor = 'default'

      if @_mouseChildren
        i = @_children.length
        while i--
          child = @_children[i]
          if child._propagateMouseEvent?
            e = child._propagateMouseEvent event
            if e?
              @_captureMouseEvent e
              return
          if child._hitTest? event.localX - child.x, event.localY - child.y
            hit = true

      if hit
        return @_targetMouseEvent event

    return

  _captureMouseEvent: (event) ->
    event = new MouseEvent event
    event.eventPhase = EventPhase.CAPTURING_PHASE
    event.currentTarget = @
    @dispatchEvent event
    event

  _targetMouseEvent: (event) ->
    event = new MouseEvent event
    event.eventPhase = EventPhase.AT_TARGET
    event.target = event.currentTarget = @
    @dispatchEvent event
    if event.bubbles
      @_parent?._bubbleMouseEvent event
    event

  _bubbleMouseEvent: (event) ->
    event = new MouseEvent event
    event.eventPhase = EventPhase.BUBBLING_PHASE
    event.currentTarget = @
    @dispatchEvent event
    @_parent?._bubbleMouseEvent event
    event

  startDrag: (lockCenter = false) ->
    @__stage.addEventListener MouseEvent.MOUSE_MOVE, @_drag

  _drag: (e) =>
    @x = e.stageX
    @y = e.stageY

  stopDrag: ->
    @__stage.removeEventListener MouseEvent.MOUSE_MOVE, @_drag
