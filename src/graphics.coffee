###
graphicsJS
The MIT License (MIT)
Copyright (c) 2011 minodisk
###

unless @mn? then @mn = {}
unless @mn.dsk? then @mn.dsk = {}
exports = @mn.dsk
unless exports.core? then exports.core = {}
unless exports.events? then exports.events = {}
unless exports.display? then exports.display = {}
unless exports.text? then exports.text = {}
unless exports.geom? then exports.geom = {}
unless exports.timers? then exports.timers = {}

_PI = Math.PI
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2
_ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3
sin = Math.sin
cos = Math.cos
atan2 = Math.atan2
sqrt = Math.sqrt
_min = Math.min
_max = Math.max
_sqrt = Math.sqrt
_sin = Math.sin
_cos = Math.cos
_tan = Math.tan
_RADIAN_PER_DEGREE = Math.PI / 180
_requestAnimationFrame = do ->
  @requestAnimationFrame or
  @webkitRequestAnimationFrame or
  @mozRequestAnimationFrame or
  @oRequestAnimationFrame or
  @msRequestAnimationFrame or
  (callback) -> setTimeout (()->callback((new Date()).getTime())), 1000 / 60

exports.core.Class = class Class

  defineProperty: do ->
    if Object.defineProperty?
      (prop, getter, setter) ->
        descriptor = {}
        descriptor.get = getter if getter?
        descriptor.set = setter if setter?
        descriptor.enumerable = true
        descriptor.configuable = false
        Object.defineProperty @, prop, descriptor
    else if Object.prototype.__defineGetter__? and Object.prototype.__defineSetter__?
      (prop, getter, setter) ->
        @prototype.__defineGetter__ prop, getter if getter?
        @prototype.__defineSetter__ prop, setter if setter?
    else
      throw new Error "Doesn't support 'getter/setter' properties."

exports.events.EventPhase = EventPhase =

  CAPTURING_PHASE: 1
  AT_TARGET      : 2
  BUBBLING_PHASE : 3

exports.events.Event = class Event

  @ENTER_FRAME: 'enterFrame'
  @COMPLETE: 'complete'

  constructor:(type, bubbles = false, cancelable = false)->
    unless @ instanceof Event then return new Event type, bubbles, cancelable
    if type instanceof Event
      event = type
      type = event.type
      bubbles = event.bubbles
      cancelable = event.cancelable
      @currentTarget = event.currentTarget
      @target = event.target
    @type = type
    @bubbles = bubbles
    @cancelable = cancelable
    @_isPropagationStopped = false
    @_isPropagationStoppedImmediately = false
    @_isDefaultPrevented = false

  formatToString:(className, args...)->
    ''

  stopPropagation:->
    @_isPropagationStopped = true
    return

  stopImmediatePropagation:->
    @_isPropagationStopped = true
    @_isPropagationStoppedImmediately = true
    return

  isDefaultPrevented:->
    @_isDefaultPrevented

  preventDefault:->
    @_isDefaultPrevented = true
    return

exports.events.KeyboardEvent = class KeyboardEvent extends Event

  constructor: (@type, @bubbles = false, @cancelable = false, charCodeValue = 0, keyCodeValue = 0, keyLocationValue = 0, ctrlKeyValue = false, altKeyValue = false, shiftKeyValue = false, controlKeyValue = false, commandKeyValue = false) ->
    super 'Event'

exports.events.MouseEvent = class MouseEvent extends Event

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

exports.events.EventDispatcher = class EventDispatcher extends Class

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

exports.display.CapsStyle = CapsStyle =

  NONE  : 'butt'
  BUTT  : 'butt'
  ROUND : 'round'
  SQUARE: 'square'

exports.display.GradientType = GradientType =

  LINEAR: 'linear'
  RADIAL: 'radial'

exports.display.JointStyle = JointStyle =

  BEVEL: 'bevel'
  MITER: 'miter'
  ROUND: 'round'

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject*<br/>
# **Subclasses:** *Bitmap*, *Shape*, *TextField*
#
# The base class for all objects that can be placed on the display list.<br/>
# You can access this module by doing:<br/>
exports.display.DisplayObject = class DisplayObject extends EventDispatcher

  _getWidth:->
    @_measureSize()
    @_width
  _setWidth:(value)->
    @_width = value
    @_scaleX = value / @_context.canvas.width unless @_context.canvas.width is 0
    @_requestRender false
    return

  _getHeight:->
    @_measureSize()
    @_height
  _setHeight:(value)->
    @_height = value
    @_scaleY = value / @_context.canvas.height unless @_context.canvas.height is 0
    @_requestRender false
    return

  # ## new DisplayObject()
  # Creates a new *DisplayObject* object.
  constructor:->
    super()

    # ## stage:*Stage*
    # [read-only] The *Stage* of this object.
    @defineProperty 'stage'
      , ->
        @__stage
      , (value)->
        @__stage = value
        return

    # ## parent:*Sprite*
    # [read-only] The *Sprite* object that contains this object.
    @defineProperty 'parent'
      , ->
        @_parent

    # ## x:*Number*
    # The x coordinate of this object relative to parent coordinate space.
    @defineProperty 'x'
      , ->
        @_x
      , (value)->
        @_x = value
        @_requestRender false
        return

    # ## y:*Number*
    # The y coordinate of this object relative to parent coordinate space.
    @defineProperty 'y'
      , ->
        @_y
      , (value)->
        @_y = value
        @_requestRender false
        return

    # ## alpha:*Number*
    # The alpha transparency value of this object, between 0.0 and 1.0.
    @defineProperty 'alpha'
      , ->
        @_alpha
      , (value)->
        @_alpha = value
        @_requestRender false
        return

    # ## rotation:*Number*
    # The rotation of this object, in degrees.
    @defineProperty 'rotation'
      , ->
        @_rotation
      , (value)->
        @_rotation = value
        @_requestRender false
        return

    # ## width:*Number*
    # The width of this object, in pixels.
    @defineProperty 'width', @_getWidth, @_setWidth

    # ## height:*Number*
    # The height of this object, in pixels.
    @defineProperty 'height', @_getHeight, @_setHeight

    # ## scaleX:*Number*
    # The horizontal scale of this object.
    @defineProperty 'scaleX'
      , ->
        @_scaleX
      , (value)->
        @_scaleX = value
        @_width = @_context.canvas.width * value
        @_requestRender false
        return

    # ## scaleY:*Number*
    # The vertical scale of this object.
    @defineProperty 'scaleY'
      , ->
        @_scaleY
      , (value)->
        @_scaleY = value
        @_height = @_context.canvas.height * value
        @_requestRender false
        return

    @defineProperty 'matrix'
      , ->
        @_matrix
      , (matrix)->
        @_matrix = matrix
        @_requestRender false
        return

    @__stage = null
    @_parent = null
    @_x = 0
    @_y = 0
    @_width = 0
    @_height = 0
    @_scaleX = 1
    @_scaleY = 1
    @_rotation = 0
    @_alpha = 1
    @_matrix = new Matrix
#    @blendMode = BlendMode.NORMAL
    @filters = []
    @_context = document.createElement('canvas').getContext('2d')
    @_context.canvas.width = @_context.canvas.height = 0
    @_stacks = []
    @_drawn = false
    @_measured = false

  _getTransform:->
    @_matrix.clone().createBox(@_scaleX, @_scaleY, @_rotation * _RADIAN_PER_DEGREE, @_x, @_y)

  # ## set():*DisplayObject*
  # Sets property to this object. Returns self for method chain.
  set:(propertyName, value)->
    @[propertyName] = value
    @

  # ## addTo():*DisplayObject*
  # Adds this object to *Sprite* object.
  addTo:(parent)->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)
    @

  # ## get_bounds():*DisplayObject*
  # Calculates a rectangle that defines the area of this object object relative
  # to target coordinate space.

  # ## _requestRender():*DisplayObject*
  # [private] Requests rendering to parent.
  _requestRender:(drawn = false)->
    @_drawn |= drawn
    @_measured = false
    #@_hitTested = false
    @_parent._requestRender true if @_parent?
    @

  # ## _render():*void*
  # [private] Renders this object.
  _render:->
    if @_drawn
      @_drawn = false
      @_measureSize()
      @_applySize()
      @_execStacks()
      @_applyFilters()
      #@_drawBounds()

  # ## _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize:->
    unless @_measured
      delta = 0
      for stack in @_stacks
        if stack.delta?
          delta = stack.delta
        if stack.rect?
          unless rect?
            rect = stack.rect.clone()
          else
            rect.union stack.rect
          b = stack.rect.clone()
          b.offset -delta / 2, -delta / 2
          b.inflate delta, delta
          unless bounds?
            bounds = b
          else
            bounds.union b
      unless rect?
        rect = new Rectangle
      unless bounds?
        bounds = new Rectangle
      else
        bounds.adjustOuter()
      @_width = rect.width
      @_height = rect.height
      @_rect = rect
      @_bounds = bounds
      @_measured = true
    return

  # ## _applySize():*void*
  # [private] Applies the bounds to internal canvas of this object.
  _applySize:->
    @_context.canvas.width = @_bounds.width
    @_context.canvas.height = @_bounds.height

  # ## _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks:->
    @_context.translate -@_bounds.x, -@_bounds.y
    for stack in @_stacks
      @["_#{ stack.method }"].apply @, stack.arguments
    @_context.setTransform 1, 0, 0, 1, 0, 0
    return

  # ## _applyFilters():*void*
  # [private] Applies the filters to this object.
  _applyFilters:->
    if (@filters.length > 0)
      imageData = @_context.getImageData 0, 0, @_bounds.width, @_bounds.height
      newImageData = @_context.createImageData @_bounds.width, @_bounds.height
      filter.scan imageData, newImageData for filter in @filters
      @_context.putImageData newImageData, 0, 0
    return

  # ## _drawBounds():*void*
  # [private] Draws the bounds of this object for debug.
  _drawBounds:->
    @_context.strokeStyle = 'rgba(0, 0, 255, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_context.canvas.width, @_context.canvas.height

  hitTest:(x, y)->
    if x instanceof Vector
      pt = x
      x = pt.x
      y = pt.y
    local = @globalToLocal x, y
    @_hitTest local.x, local.y
  _hitTest:(localX, localY)->
    @_context.isPointInPath localX - @_bounds.x, localY - @_bounds.y
#    unless @_hitTested
#      if @_context.canvas.width isnt 0 and @_context.canvas.height isnt 0
#        @_imageData = @_context.getImageData 0, 0, @_context.canvas.width, @_context.canvas.height
#      else
#        @_imageData = null
#      @_hitTested = true
#    if @_imageData? and @_bounds.contains localX, localY
#      i = 4 * (@_imageData.width * ((localY - @_bounds.y >> 0) - 1) + (localX - @_bounds.x >> 0))
#      @_imageData.data[i + 3] isnt 0
#    else
#      false

  getPixel32:(x, y)->
    iData = @_context.getImageData x, y, 1, 1
    data = iData.data
    data[3] << 24 | data[2] << 16 | data[1] << 8 | data[0]

  globalToLocalPoint:(point)->
    @globalToLocal point.x, point.y

  globalToLocal:(x, y)->
    displayObject = @
    while displayObject
      x -= displayObject.x
      y -= displayObject.y
      displayObject = displayObject._parent
    new Vector x, y

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *Bitmap*<br/>
# **Subclasses:** -
#
# The *Bitmap* class represents bitmap images.<br/>
# You can access this module by doing:<br/>
exports.display.Bitmap = class Bitmap extends DisplayObject

  # ## new Bitmap()
  # Creates a new *Bitmap* object.
  constructor:->
    super 'Bitmap'

  # ## draw(data:***, x:*Number* = 0, y:*Number* = 0):*void*
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement*, or *DisplayObject* object onto this object.
  draw:(data, x = 0, y = 0)->
    if data instanceof DisplayObject
      data = data._context.canvas
    if data instanceof Image or data instanceof HTMLImageElement or
       data instanceof HTMLCanvasElement or data instanceof HTMLVideoElement
      @drawImage data, x, y
      return

    if data instanceof ImageData
      @drawImageData data, x, y
      return

    throw new TypeError "data isn't drawable object"
    return

  # ## drawImage(image:***, x:*Number* = 0, y:*Number* = 0):*void*
  # Draws the source *Image*, *HTMLImageElement*, *HTMLCanvasElement*,
  # *HTMLVideoElement* object onto this object, without checking type of
  # the source object.
  drawImage:(image, x = 0, y = 0)->
    @_stacks.push
      method   : 'drawImage'
      arguments: [ image, x, y ]
      rect     : new Rectangle x, y, image.width, image.height
    @_requestRender true
  _drawImage:(image, x, y)->
    @_context.drawImage image, x, y, image.width, image.height
    return

  drawImageData:(imageData, x = 0, y = 0)->
    return

  applyFilter:(srcBitmap, srcRect, dstPoint, filter)->
    return

exports.display.Graphics = class Graphics

  # ## toColorString():*String*
  # [static] Generates string of color style.
  @toColorString:(color = 0, alpha = 1)->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  constructor:(@_displayObject)->
    @_context = @_displayObject._context
    @_stacks = @_displayObject._stacks

  _requestRender:->
    @_displayObject._requestRender.apply @_displayObject, arguments
    @

  _execStacks:->
    @_context.fillStyle = @_context.strokeStyle = 'rgba(0,0,0,0)'
    @_context.translate -@_displayObject._bounds.x, -@_displayObject._bounds.y
    drawingCounter = 0
    for stack, i in @_stacks
      method = stack.method

      isDrawing = method.indexOf('draw') is 0
      if method is 'moveTo' or
         method is 'lineTo' or
         method is 'quadraticCurveTo' or
         method is 'cubicCurveTo' or
         isDrawing
        drawingCounter++
      else if drawingCounter isnt 0
        drawingCounter = 0
        if isDrawing
          @_context.closePath()
        @_context.fill()
        @_context.stroke()

      if drawingCounter is 1
        @_context.beginPath()
      @["_#{ stack.method }"].apply @, stack.arguments

    if drawingCounter isnt 0
      drawingCounter = 0
      if isDrawing
        @_context.closePath()
      @_context.fill()
      @_context.stroke()

    @_context.setTransform 1, 0, 0, 1, 0, 0

  # ## clear():*Graphics*
  # Clears the drawn graphics.
  clear:->
    while @_stacks.length
      @_stacks.pop()
    @_context.canvas.width = @_context.canvas.height = 0
    @_requestRender true

  lineStyle:(thickness = 1, color = 0x000000, alpha = 1, capsStyle = CapsStyle.NONE, jointStyle = JointStyle.BEVEL, miterLimit = 10)->
    @_stacks.push
      method   : 'lineStyle'
      arguments: [thickness, color, alpha, capsStyle, jointStyle, miterLimit]
      delta    : thickness
    @_requestRender true
  _lineStyle:(thickness, color, alpha, capsStyle, jointStyle, miterLimit)->
    @_context.lineWidth = thickness
    @_context.strokeStyle = Graphics.toColorString color, alpha
    @_context.lineCaps = capsStyle
    @_context.lineJoin = jointStyle
    @_context.miterLimit = miterLimit
    return

  beginFill:(color = 0x000000, alpha = 1)->
    @_stacks.push
      method   :'beginFill'
      arguments:[color, alpha]
    @_requestRender true
  _beginFill:(color, alpha)->
    @_context.fillStyle = Graphics.toColorString color, alpha
    return

  beginGradientFill:(type, colors, alphas, ratios, matrix = null, focalPointRatio = 0)->
    @_stacks.push
      method   : 'beginGradientFill'
      arguments: [type, colors, alphas, ratios, matrix, focalPointRatio]
    @_requestRender true
  _beginGradientFill:(type, colors, alphas, ratios, matrix, focalPointRatio)->
    len = ratios.length
    throw new TypeError 'Invalid length of colors, alphas or ratios.' if colors.length isnt len || alphas.length isnt len

    cTL = matrix.transformPoint new Vector(-1638.4 / 2, -1638.4 / 2)
    cBR = matrix.transformPoint new Vector(1638.4 / 2, 1638.4 / 2)
    cBL = matrix.transformPoint new Vector(-1638.4 / 2, 1638.4 / 2)
    v1 = cBR.subtract(cTL).divide(2)
    cCenter = cTL.add(v1)

    switch type
      when 'linear'
        v0 = cBL.subtract(cTL)
        dNormal = v1.magnitude * Math.abs(Math.sin(v1.direction - v0.direction))
        v0.direction += Math.PI / 2
        vNormal = v0.normalize(dNormal)
        cSrc = cCenter.add(vNormal)
        cDst = cCenter.subtract(vNormal)
        gradient = @_context.createLinearGradient cSrc.x, cSrc.y, cDst.x, cDst.y
      when 'radial'
        cR = matrix.transformPoint new Vector(1638.4 / 2, 0)
        vR = cR.subtract(cCenter)
        cL = cTL.add(cBL).divide(2)
        cB = cBR.add(cBL).divide(2)
        vCL = cL.subtract(cCenter)
        vCB = cB.subtract(cCenter)
        x1p = vCL.x * vCL.x
        y1p = vCL.y * vCL.y
        x2p = vCB.x * vCB.x
        y2p = vCB.y * vCB.y
        a = Math.sqrt (y1p * x2p - x1p * y2p) / (y1p - y2p)
        b = Math.sqrt (x1p * y2p - y1p * x2p) / (x1p - x2p)
        long = Math.max a, b
        focalRadius = long * focalPointRatio
        gradient = @_context.createRadialGradient cCenter.x, cCenter.y, long, cCenter.x + focalRadius * Math.cos(vR.direction), cCenter.y + focalRadius * Math.sin(vR.direction), 0
        ratios = ratios.slice()
        ratios.reverse()

    for ratio, i in ratios
      gradient.addColorStop ratio / 0xff, Graphics.toColorString(colors[i], alphas[i])
    @_context.fillStyle = gradient

  endFill:(color = 0x000000, alpha = 1)->
    @_stacks.push
      method   :'endFill'
      arguments:[color, alpha]
    @_requestRender true
  _endFill:(color, alpha)->
    return

  moveTo:(x, y)->
    @_stacks.push
      method   : 'moveTo'
      arguments: [x, y]
      rect     : new Rectangle x, y, 0, 0
    @_requestRender true
  _moveTo:(x, y)->
    @_context.moveTo x, y
    return

  lineTo:(x, y, thickness)->
    @_stacks.push
      method   : 'lineTo'
      arguments: [x, y]
      rect     : new Rectangle x, y, 0, 0
    @_requestRender true
  _lineTo:(x, y)->
    @_context.lineTo x, y
    return

  drawPath:(commands, data, clockwise = 0)->
    rect = new Rectangle data[0], data[1], 0, 0
    for i in [1...data.length / 2] by 1
      j = i * 2
      rect.contain data[j], data[j + 1]
    @_stacks.push
      method   : 'drawPath'
      arguments: [commands, data, clockwise]
      rect     : rect
    @_requestRender true
  _drawPath:(commands, data, clockwise)->
    if clockwise < 0
      d = []
      i = 0
      for command in commands
        switch command
          when 0, 1 then d.unshift data[i++], data[i++]
          when 2
            i += 4
            d.unshift data[i - 2], data[i - 1], data[i - 4], data[i - 3]
          when 3
            i += 6
            d.unshift data[i - 2], data[i - 1], data[i - 4], data[i - 3], data[i - 6], data[i - 5]
      data = d

      commands = commands.slice()
      c = commands.shift()
      commands.reverse()
      commands.unshift c
    i = 0
    for command in commands
      switch command
        when 0 then @_context.moveTo data[i++], data[i++]
        when 1 then @_context.lineTo data[i++], data[i++]
        when 2 then @_context.quadraticCurveTo data[i++], data[i++], data[i++], data[i++]
        when 3 then @_context.bezierCurveTo data[i++], data[i++], data[i++], data[i++], data[i++], data[i++]
    # If the ending point of path is equal with the starting point of path,
    if data[0] is data[data.length - 2] and data[1] is data[data.length - 1]
      # close path.
      @_context.closePath()

  quadraticCurveTo:(x1, y1, x2, y2)->
    @_stacks.push
      method   : 'quadraticCurveTo'
      arguments: [x1, y1, x2, y2]
      rect     : new Rectangle(x1, y1).contain(x2, y2)
    @_requestRender true
  curveTo: Graphics::quadraticCurveTo
  _quadraticCurveTo:(x1, y1, x2, y2)->
    @_context.quadraticCurveTo x1, y1, x2, y2

  cubicCurveTo:(x1, y1, x2, y2, x3, y3)->
    @_stacks.push
      method   : 'cubicCurveTo'
      arguments: [x1, y1, x2, y2, x3, y3]
      rect     : new Rectangle(x1, y1).contain(x2, y2).contain(x3, y3)
    @_requestRender true
  bezierCurveTo: Graphics::cubicCurveTo
  _cubicCurveTo:(x1, y1, x2, y2, x3, y3)->
    @_context.bezierCurveTo x1, y1, x2, y2, x3, y3

  drawRectangle:(rect, clockwise = 0)->
    @drawRect rect.x, rect.y, rect.width, rect.height, clockwise
  drawRect:(x, y, width, height = width, clockwise = 0)->
    r = x + width
    b = y + height
    @drawPath [0, 1, 1, 1, 1], [x, y, r, y, r, b, x, b, x, y], clockwise

  drawRectangleWithoutPath:(rect)->
    @drawRectWithoutPath rect.x, rect.y, rect.width, rect.height
  drawRectWithoutPath:(x, y, width, height = width)->
    @_stacks.push
      method   : 'drawRectWithoutPath'
      arguments: [x, y, width, height]
      rect     : new Rectangle x, y, width, height
    @_requestRender true
  _drawRectWithoutPath:(x, y, width, height)->
    @_context.fillRect x, y, width, height
    @_context.strokeRect x, y, width, height

  drawRoundRectangle:(rect, ellipseW, ellipseH = ellipseW, clockwise = 0)->
    @drawRoundRect rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH, clockwise
  drawRoundRect:(x, y, width, height, ellipseW, ellipseH = ellipseW, clockwise = 0)->
    @drawPath [0, 1, 2, 1, 2, 1, 2, 1, 2], [
      x + ellipseW, y
      x + width - ellipseW, y
      x + width, y, x + width, y + ellipseH
      x + width, y + height - ellipseH
      x + width, y + height, x + width - ellipseW, y + height
      x + ellipseW, y + height
      x, y + height, x, y + height - ellipseH
      x, y + ellipseH
      x, y, x + ellipseW, y
      ], clockwise

  drawCircle:(x, y, radius, clockwise = 0)->
    @_stacks.push
      method   : 'drawCircle'
      arguments: [x, y, radius, clockwise]
      rect     : new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawCircle:(x, y, radius, clockwise)->
    @_context.moveTo x + radius, y
    @_context.arc x, y, radius, 0, _PI_2, clockwise < 0
    return

  drawEllipse:(x, y, width, height, clockwise = 0)->
    width /= 2
    height /= 2
    x += width
    y += height
    handleWidth = width * _ELLIPSE_CUBIC_BEZIER_HANDLE
    handleHeight = height * _ELLIPSE_CUBIC_BEZIER_HANDLE
    @drawPath [0, 3, 3, 3, 3], [
      x + width, y
      x + width, y + handleHeight, x + handleWidth, y + height, x, y + height
      x - handleWidth, y + height, x - width, y + handleHeight, x - width, y
      x - width, y - handleHeight, x - handleWidth, y - height, x, y - height
      x + handleWidth, y - height, x + width, y - handleHeight, x + width, y
      ], clockwise

  drawRegularPolygon:(x, y, radius, length = 3, clockwise = 0)->
    commands = []
    data = []
    unitRotation = _PI_2 / length
    for i in [0..length]
      commands.push if i is 0 then 0 else 1
      rotation = -_PI_1_2 + unitRotation * i
      data.push x + radius * Math.cos(rotation), y + radius * Math.sin(rotation)
    @drawPath commands, data, clockwise

  drawRegularStar:(x, y, outer, length = 5, clockwise = 0)->
    cos = Math.cos _PI / length
    @drawStar x, y, outer, outer * (2 * cos - 1 / cos), length, clockwise
  drawStar:(x, y, outer, inner, length = 5, clockwise = 0)->
    commands = []
    data = []
    unitRotation = _PI / length
    for i in [0..length * 2] by 1
      commands.push if i is 0 then 0 else 1
      radius = if (i & 1) is 0 then outer else inner
      rotation = -_PI_1_2 + unitRotation * i
      data.push x + radius * Math.cos(rotation), y + radius * Math.sin(rotation)
    @drawPath commands, data, clockwise

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *InteractiveObject*<br/>
# **Subclasses:** *Sprite*
#
# You can access this module by doing:<br/>
exports.display.InteractiveObject = class InteractiveObject extends DisplayObject

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

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Shape*<br/>
# **Subclasses:** *Sprite*
#
# The *Shape* can draw a vector shape.
#
# You can access this module by doing:<br/>
exports.display.Shape = class Shape extends DisplayObject

  constructor:->
    super()
    @graphics = new Graphics @

  # ## _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks:->
    @graphics._execStacks()
    return

  clip:->
    @_stacks.push
      method   :'clip'
      arguments:ArrayUtil.toArray arguments
    @_requestRender true
  _clip:->
    @_context.clip()
    return

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *InteractiveObject* → *Sprite*<br/>
# **Subclasses:** *Stage*
#
# The *Sprite* can contain children.<br/>
# You can access this module by doing:<br/>
exports.display.Sprite = class Sprite extends InteractiveObject

  # ## new Sprite()
  # Creates a new *Sprite* object.
  constructor:->
    super()

    @defineProperty '_stage'
      , null
      , (value)->
        child._stage = value for child in @_children
        @__stage = value
        return

    @defineProperty 'mouseEnabled'
      , ->
        @_mouseEnabled
      , (value)->
        @_mouseEnabled = value

    @defineProperty 'mouseChildren'
      , ->
        @_mouseChildren
      , (value)->
        @_mouseChildren = value

    @defineProperty 'buttonMode'
      , ->
        @_buttonMode
      , (value)->
        @_buttonMode = value

    @graphics = new Graphics @
    @_children = []
    @_mouseEnabled = true
    @_mouseChildren = true
    @_buttonMode = false
    @_mouseIn = false

  # ## addChild(children...:*DisplayObject*):*Sprite*
  # Adds a child *DisplayObject* object to this object.
  addChild:(child)->
    unless child instanceof DisplayObject then throw new TypeError "Child must be specified in DisplayObject."
    child._stage = @__stage
    child._parent = @
    @_children.push child
    @_requestRender true

  addChildAt:(child, index)->
    unless child instanceof DisplayObject then throw new TypeError "Child must be specified in DisplayObject."
    if index < 0 or index > @_children.length then throw new TypeError "Index is out of range."
    @_children.splice index, 0, child
    @_requestRender true

  # ## removeChild(children...:*DisplayObject*):*Sprite*
  # Removes the specified child *DisplayObject* from this object.
  removeChild:(children...)->
    for child in children
      index = @_children.indexOf child
      @_children.splice index, 1 if index isnt -1
    @_requestRender true

  # ## _render():*void*
  # [private] Renders this object.
  _render:->
    if @_drawn
      @_drawn = false
      @_measureSize()
      @_applySize()
      @_execStacks()
      @_drawChildren()
      @_applyFilters()
      #@_drawBounds()

  # ## _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize:->
    super()
    rect = @_rect
    bounds = @_bounds
    for child in @_children
      child._render()
      rect.union child._rect
      b = child._bounds.clone()
      b.x += child.x
      b.y += child.y
      bounds.union b
    x = Math.floor bounds.x
    if x isnt bounds.x
      bounds.width++
    y = Math.floor bounds.y
    if y isnt bounds.y
      bounds.height++
    bounds.x = x
    bounds.y = y
    bounds.width = Math.ceil bounds.width
    bounds.height = Math.ceil bounds.height
    @_width = rect.width
    @_height = rect.height
    @_rect = rect
    @_bounds = bounds
    return

  # ## _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks:->
    @graphics._execStacks()
    return

  # ## _drawChildren():*void*
  # [private] Draws children in this object.
  _drawChildren:->
    for child in @_children
      if child._bounds? and child._bounds.width > 0 and child._bounds.height > 0
        throw new Error 'invalid position' if isNaN child.x or isNaN child._bounds.x or isNaN child.y or isNaN child._bounds.y
        child._getTransform().setTo(@_context)
        @_context.globalAlpha = if child._alpha < 0 then 0 else if child._alpha > 1 then 1 else child._alpha
#        if child.blendMode is BlendMode.NORMAL
#          @_context.drawImage child._context.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
#        else
#          src = @_context.getImageData child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y, child._bounds.width, child._bounds.height
#          dst = child._context.getImageData 0, 0, child._bounds.width, child._bounds.height
#          @_context.putImageData Blend.scan(src, dst, child.blendMode), child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
        @_context.drawImage child._context.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
        @_context.setTransform 1, 0, 0, 1, 0, 0
    return

  # ## _drawBounds():*void*
  # [private] Draws the bounds of this object for debug.
  _drawBounds:->
    @_context.strokeStyle = 'rgba(255, 0, 0, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_width, @_height
    return

exports.display.Loader = class Loader extends Sprite

  constructor: ->
    super()

  load: (url) ->
    img = new Image()
    img.src = url
    img.addEventListener 'load', (e) =>
      bitmap = new Bitmap()
      bitmap.draw img
      @content = bitmap
      @addChild @content
      @dispatchEvent new Event(Event.COMPLETE)

# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Sprite* →
# *Sprite* → *Stage*<br/>
# **Subclasses:** -
#
# The *Stage* class represents the root drawing area.<br/>
# You can access this module by doing:<br/>
exports.display.Stage = class Stage extends Sprite

  _getWidth:->
    @_width

  _getHeight:->
    @_height

  # ## new Stage(canvas:*HTMLCanvasElement*)
  # ## new Stage(width:*int*, height:*int*)
  # Creates a new *Stage* object.
  constructor:(canvasOrWidth, height = null)->
    super()

    # ## frameRate:*Number*
    # Effective frame rate rounded off to one decimal places, in fps.
    # *Stage* updates `frameRate` once in every 30 frames.
    @defineProperty 'frameRate'
      , ->
        @_frameRate

    if canvasOrWidth instanceof HTMLCanvasElement
      canvas = canvasOrWidth
      @_width = canvas.width
      @_height = canvas.height
    else if notisNaN(Number canvasOrWidth) && notisNaN(Number height)
      canvas = document.createElement 'canvas'
      @_width = canvas.width = canvasOrWidth
      @_height = canvas.height = height
    else
      throw new TypeError ''
    @_canvas = canvas
    @__stage = @
    @_context = canvas.getContext '2d'
    @_bounds = new Rectangle 0, 0, canvas.width, canvas.height
    @overrideMouseWheel = false
    @_startTime = @_time = (new Date()).getTime()
    @currentFrame = 0
    @_frameRate = 60

    AnimationFrameTicker.getInstance().addHandler @_enterFrame
    canvas.addEventListener 'click', @_onClick, false
    canvas.addEventListener 'mousedown', @_onMouseDown, false
    canvas.addEventListener 'mouseup', @_onMouseUp, false
    canvas.addEventListener 'mousemove', @_onMouseMove, false
    canvas.addEventListener 'mousewheel', @_onMouseWheel, false

  # ## getTimer():*int*
  # Computes elapsed time since *Stage* constructed, in milliseconds.
  getTimer:->
    new Date().getTime() - @_startTime

  # ## _enterFrame(time:*int*):*void*
  # [private] The handler of enter frame.
  _enterFrame:(time)=>
    @currentFrame++
    if (@currentFrame % 30) is 0
      @_frameRate = (300000 / (time - @_time) >> 0) / 10
      @_time = time
    @dispatchEvent new Event(Event.ENTER_FRAME)
    if @_drawn
      @_drawn = false
      @_render()
    return

  # ## _render():*void*
  # [private] Renders children, then draws children on this object.
  _render:->
    for child in @_children
      child._render()
    @_context.canvas.width = @_width
    @_drawChildren()
    return

  _hitTest:(localX, localY)->
    true

  # ## _requestRender():*void*
  # [private] Reserves rendering on next frame.
  _requestRender:->
    @_drawn = true
    return

  _onClick:(e)=>
    e.preventDefault()
    event = new MouseEvent MouseEvent.CLICK, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseDown:(e)=>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_DOWN, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseUp:(e)=>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_UP, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseMove:(e)=>
    e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_MOVE, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _onMouseWheel:(e)=>
    if @overrideMouseWheel
      e.preventDefault()
    event = new MouseEvent MouseEvent.MOUSE_WHEEL, true
    @_setMousePosition event, e
    @_propagateMouseEvent event

  _setMousePosition:(event, nativeEvent)->
    event.stageX = event.localX = if nativeEvent.offsetX? then nativeEvent.offsetX else nativeEvent.pageX - @_canvas.offsetLeft
    event.stageY = event.localY = if nativeEvent.offsetY? then nativeEvent.offsetY else nativeEvent.pageY - @_canvas.offsetTop
    event.delta = if nativeEvent.wheelDelta? then nativeEvent.wheelDelta else if nativeEvent.detail? then nativeEvent.detail else 0

_instance = null
_internal = false
exports.timers.AnimationFrameTicker = class AnimationFrameTicker

  @getInstance: ->
    unless _instance?
      _internal = true
      _instance = new AnimationFrameTicker
    _instance

  constructor: ->
    if _internal is false
      throw new Error "Ticker is singleton model, call Ticker.getInstance()."
    _internal = false

    @_handlers = []
    @_continuous = false
    @_counter = 0

  addHandler: (handler) ->
    @_handlers.push handler
    if @_continuous is false
      @_continuous = true
      _requestAnimationFrame @_onAnimationFrame
    return

  removeHandler: (handler) ->
    @_handlers.splice @_handlers.indexOf(handler), 1
    if @_handlers.length is 0
      @_continuous = false
    return

  _onAnimationFrame: (time) =>
    @_counter++
    for handler in @_handlers
      do (handler) ->
        setTimeout (-> handler time), 0
    if @_continuous is true
      _requestAnimationFrame @_onAnimationFrame
    return

exports.text.TextFormatAlign = TextFormatAlign =

  START : 'start'
  END   : 'end'
  LEFT  : 'left'
  RIGHT : 'right'
  CENTER: 'center'

exports.text.TextFormatBaseline = TextFormatBaseline =

  TOP        : 'top'
  HANGING    : 'hanging'
  MIDDLE     : 'middle'
  ALPHABETIC : 'alphabetic'
  IDEOGRAPHIC: 'ideographic'
  BOTTOM     : 'bottom'

exports.text.TextFormatFont = TextFormatFont =

  SERIF     : 'serif'
  SANS_SERIF: 'sans-serif'
  CURSIVE   : 'cursive'
  MONOSPACE : 'monospace'
  FANTASY   : 'fantasy'

# **Package:** *text*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Shape* →
# *TextField*<br/>
# **Subclasses:** -
#
# The *TextField* class is used to create display objects for text display and
# input.<br/>
# You can access this module by doing:<br/>
exports.text.TextField = class TextField extends InteractiveObject

  # ## new TextField()
  # Creates a new *TextField* object.
  constructor:(text = '', textFormat = new TextFormat)->
    super()

    # ## text:*String*
    # The text in this *TextField*.
    @defineProperty 'text'
      , ->
        @_texts.join '\n'
      , (text)->
        @_texts = @_stacks[0].arguments[0] = text.split /\r?\n/
        @_requestRender true

    # ## textFormat:*TextFormat*
    # The *TextFormat* applied to this *TextField*.
    @defineProperty 'textFormat'
      , ->
        @_textFormat
      , (textFormat)->
        @_textFormat = @_stacks[0].arguments[1] = textFormat
        @_requestRender true

    # ## maxWidth:*Number*
    # The max width of the text, in pixels.
    @defineProperty 'maxWidth'
      , ->
        @_maxWidth
      , (maxWidth)->
        @_maxWidth = @_stacks[0].arguments[2] = value
        @_requestRender true

    @_stacks.push
      method   : 'drawText'
      arguments: []
    @text = text
    @textFormat = textFormat

  # ## _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize:->
    if @_texts? and @_textFormat?
      rect = new Rectangle
      @_context.font = @_textFormat.toStyleSheet()
      for text in @_texts
        rect.width = Math.max rect.width, (@_context.measureText text).width
        rect.height += @_textFormat.size * 1.2 + @_textFormat.leading

      @_width = rect.width
      @_height = rect.height
      @_rect = rect

      bounds = rect.clone()
      bounds.x = -bounds.width
      bounds.width *= 2
      bounds.y = -bounds.height
      bounds.height *= 2
      @_bounds = bounds
    return

  # ## _drawText(texts:*Array*, textFormat:*TextFormat*):*void*
  # [private] Draws text onto this object.
  _drawText:(texts, textFormat)->
    @_context.font = textFormat.toStyleSheet()
    @_context.textAlign = textFormat.align
    @_context.textBaseline = textFormat.baseline
    @_context.fillStyle = Graphics.toColorString textFormat.color, textFormat.alpha
    lineHeight = textFormat.size + textFormat.leading
    for text, i in @_texts
      @_context.fillText text, 0, lineHeight * i
    return

exports.text.TextFormat = class TextFormat

  constructor:(@font = TextFormatFont.SANS_SERIF, @size = 16, @color = 0, @alpha = 1, @bold = false, @italic = false, @smallCaps = false, @align = TextFormatAlign.START, @baseline = TextFormatBaseline.TOP, @leading = 0)->
    if @font instanceof TextFormat
      textFormat = @font
      @font = textFormat.font
      @size = textFormat.size
      @color = textFormat.color
      @alpha = textFormat.alpha
      @bold = textFormat.bold
      @italic = textFormat.italic
      @smallCaps = textFormat.smallCaps
      @align = textFormat.align
      @baseline = textFormat.baseline
      @leading = textFormat.leading

  toStyleSheet:()->
    premitive = false
    for key, value of TextFormatFont when value is @font
      premitive = true
      break
    font = if premitive then @font else "'#{ @font }'"
    "#{ if @italic then 'italic' else 'normal' } #{ if @smallCaps then 'small-caps' else 'normal' } #{ if @bold then 'bold' else 'normal' } #{ @size }px #{ font }"

# **Package:** *geom*<br/>
# **Inheritance:** *Object* → *Matrix*<br/>
# **Subclasses:** -
#
# The *Matrix* is 3 x 3 matrix. You can translate, scale, rotate, and skew
# display object.<br/>
#
#              |xx yx ox|
#     Matrix = |xy yy oy|
#              |0  0  1 |
#
# You can access this module by doing:<br/>
exports.geom.Matrix = class Matrix

  # ## new Matrix(a:*Number* = 1, b:*Number* = 0, c:*Number* = 0, d:*Number* = 1, x:*Number* = 0, y:*Number* = 0)
  # Creates a new Matrix object.
  constructor: (@xx = 1, @xy = 0, @yx = 0, @yy = 1, @ox = 0, @oy = 0) ->

  identity:->
    @xx = 1
    @xy = 0
    @yx = 0
    @yy = 1
    @ox = 0
    @oy = 0

  # ## clone():*Matrix*
  # Copies this object.
  clone: ->
    new Matrix @xx, @xy, @yx, @yy, @ox, @oy

  toString: ->
    "#{ @xx } #{ @yx } #{ @ox }\n
#{ @xy } #{ @yy } #{ @oy }\n
0 0 1"

  # ## apply(matrix:*Matrix*):*void*
  # Applies the properties of specified *Matrix* object to this object.
  apply: (matrix) ->
    @_apply matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy
  _apply: (xx, xy, yx, yy, ox, oy) ->
    @xx = xx
    @xy = xy
    @yx = yx
    @yy = yy
    @ox = ox
    @oy = oy
    @

  # ## setTo(context:*CanvasRenderingContext2D*):*void*
  # Sets transform to specified *CanvasRenderingContext2D* object.
  setTo: (context) ->
    context.setTransform @xx, @xy, @yx, @yy, @ox, @oy

  # ## concat(matrix:*Matrix*):*Matrix*
  # Concatenates the specified *Matrix* to this object.
  #
  #     |xx yx ox||@xx @yx @ox|   |xx*@xx+yx*@xy xx*@yx+yx*@yy xx*@ox+yx*@oy+ox|
  #     |xy yy oy||@xy @yy @oy| = |xy*@xx+yy*@xy xy*@yx+yy*@yy xy*@ox+yy*@oy+oy|
  #     |0  0  1 ||0   0   1  |   |0             0             1               |
  concat: (matrix) ->
    @_concat matrix.xx, matrix.xy, matrix.yx, matrix.yy, matrix.ox, matrix.oy
  _concat:(xx, xy, yx, yy, ox, oy)->
    _xx = @xx
    _xy = @xy
    _yx = @yx
    _yy = @yy
    _ox = @ox
    _oy = @oy
    @xx = xx * _xx + yx * _xy
    @xy = xy * _xx + yy * _xy
    @yx = xx * _yx + yx * _yy
    @yy = xy * _yx + yy * _yy
    @ox = xx * _ox + yx * _oy + ox
    @oy = xy * _ox + yy * _oy + oy
    @

  # ## translate(tx:*Number*, ty:*Number*):*Matrix*
  # Applies a translating transformation to this object.
  translate:(tx, ty)->
    @_concat 1, 0, 0, 1, tx, ty

  # ## scale(sx:*Number*, sy:*Number*):*Matrix*
  # Applies a scaling transformation to this object.
  scale:(sx, sy)->
    @_concat sx, 0, 0, sy, 0, 0

  # ## rotate(angle:*Number*):*Matrix*
  # Applies a rotation transformation to this object.
  rotate:(angle)->
    c = _cos angle
    s = _sin angle
    @_concat c, s, -s, c, 0, 0

  # ## skew(skewX:*Number*, skewY:*Number*):*Matrix*
  # Applies a skewing transformation to this object.
  skew:(skewX, skewY)->
    @_concat 0, _tan(skewY), _tan(skewX), 0, 0, 0

  #     d = xx*yy - xy*yx
  #     |xx yx ox|-1   |yy/d  -yx/d (yx*oy-yy*ox)/d|
  #     |xy yy oy|   = |-xy/d xx/d  (xy*ox-xx*oy)/d|
  #     |0  0  1 |     |0     0     1              |
  invert: ->
    xx = @xx
    xy = @xy
    yx = @yx
    yy = @yy
    ox = @ox
    oy = @oy
    d = xx * yy - xy * yx
    @xx = yy / d
    @xy = -xy / d
    @yx = -yx / d
    @yy = xx / d
    @ox = (yx * oy - yy * ox) / d
    @oy = (xy * ox - xx * oy) / d
    @

  #     |@xx @yx @ox||1 0 pt.x|   |@xx @yx @xx*pt.x+@yx*pt.y+@ox|
  #     |@xy @yy @oy||0 1 pt.y| = |@xy @yy @xy*pt.x+@yy*pt.y+@oy|
  #     |0   0   1  ||0 0 1   |   |0   0   1                    |
  transformPoint: (pt) ->
    new Vector @xx * pt.x + @yx * pt.y + @ox, @xy * pt.x + @yy * pt.y + @oy

  deltaTransformPoint: (pt)->
    new Vector @xx * pt.x + @yx * pt.y, @xy * pt.x + @yy * pt.y

  #     |1 0 tx||sx 0  0||c -s 0|   |sx 0  tx||c -s 0|   |sx*c -sx*s tx|
  #     |0 1 ty||0  sy 0||s c  0| = |0  sy ty||s c  0| = |sy*s sy*c  ty|
  #     |0 0 1 ||0  0  1||0 0  1|   |0  0  1 ||0 0  1|   |0    0     1 |
  createBox: (scaleX, scaleY, rotation = 0, tx = 0, ty = 0)->
    c = _cos rotation
    s = _sin rotation
    @_concat scaleX * c, scaleY * s, -scaleX * s, scaleY * c, tx, ty

  # ## createGradientBox(x:*Number*, y:*Number*, width:*Number*, height:*Number*, rotation:*Number*):*Matrix*
  # Creates the gradient style of *Matrix* expected by the `beginGradientFill()
  # and `lineGradientFill()` methods of *Shape* object.
  createGradientBox: (width, height, rotation = 0, x = 0, y = 0)->
    @createBox width / 1638.4, height / 1638.4, rotation, x + width / 2, y + height / 2

# **Package:** *geom*<br/>
# **Inheritance:** *Object* > *Rectangle*<br/>
# **Subclasses:** -
#
# The *Rectangle* class represents an area defined by x, y, width and height.
# <br/>
# You can access this module by doing:<br/>
exports.geom.Rectangle = class Rectangle

  # ## new Rectangle(x:*Number* = 0, y:*Number* = 0, width:*Number* = 0, height:*Number* = 0)
  # Creates a new *Rectangle* instance.
  constructor: (@x = 0, @y = 0, @width = 0, @height = 0) ->

  # ## toString():*String*
  # Creates *String* composed of x, y, width and height.
  toString: ->
    "[Rectangle x=#{ @x } y=#{ @y } width=#{ @width } height=#{ @height }]"

  # ## clone():*Rectangle*
  # Clones this object.
  clone: ->
    new Rectangle @x, @y, @width, @height

  # ## apply(rect:*Rectangle*):*Rectangle*
  # Applies target properties to this object.
  apply: (rect) ->
    @x = rect.x
    @y = rect.y
    @width = rect.width
    @height = rect.height
    @

  contains: (x, y) ->
    @x < x < @x + @width and @y < y < @y + @height

  containsPoint: (point) ->
    @x < point.x < @x + @width and @y < point.y < @y + @height

  contain: (x, y) ->
    if x < @x
      @width += @x - x
      @x = x
    else if x > @x + @width
      @width = x - @x
    if y < @y
      @height += @y - y
      @y = y
    else if y > @y + @height
      @height = y - @y
    @

  # ## offset(dx:*Number*, dy:*Number*):*Rectangle*
  # Add x and y to this object.
  offset: (dx, dy) ->
    @x += dx
    @y += dy
    @

  # ## offsetPoint(pt:*Point*):*Rectangle*
  # Add x and y to this object using a *Point* object as a parameter.
  offsetPoint: (pt) ->
    @x += pt.x
    @y += pt.y
    @

  inflate: (dw, dh) ->
    @width += dw
    @height += dh
    @

  inflatePoint: (pt) ->
    @width += pt.x
    @height += pt.y
    @

  deflate: (dw, dh) ->
    @width -= dw
    @height -= dh
    @

  deflatePoint: (pt) ->
    @width -= pt.x
    @height -= pt.y
    @

  union: (rect) ->
    l = if @x < rect.x then @x else rect.x
    r1 = @x + @width
    r2 = rect.x + rect.width
    r = if r1 > r2 then r1 else r2
    w = r - l
    t = if @y < rect.y then @y else rect.y
    b1 = @y + @height
    b2 = rect.y + rect.height
    b = if b1 > b2 then b1 else b2
    h = b - t
    @x = l
    @y = t
    @width = if w < 0 then 0 else w
    @height = if h < 0 then 0 else h
    @

  isEmpty: ->
    @x is 0 and @y is 0 and @width is 0 and @height is 0

  intersects: (rect) ->
    l = _max @x, rect.x
    r = _min @x + @width, rect.x + rect.width
    w = r - l
    return false if w <= 0
    t = _max @y, rect.y
    b = _min @y + @height, rect.y + rect.height
    h = b - t
    return false if h <= 0
    true

  intersection: (rect) ->
    l = _max @x, rect.x
    r = _min @x + @width, rect.x + rect.width
    w = r - l
    return new Rectangle() if w <= 0
    t = _max @y, rect.y
    b = _min @y + @height, rect.y + rect.height
    h = b - t
    return new Rectangle() if h <= 0
    new Rectangle l, t, w, h

  measureFarDistance: (x, y) ->
    l = @x
    r = @x + @width
    t = @y
    b = @y + @height
    dl = x - l
    dr = x - r
    dt = y - t
    db = y - b
    dl = dl * dl
    dr = dr * dr
    dt = dt * dt
    db = db * db
    min = _max dl + dt, dr + dt, dr + db, dl + db
    _sqrt min

  adjustOuter: ->
    x = Math.floor @x
    y = Math.floor @y
    if x isnt @x
      @width++
    if y isnt @y
      @height++
    @x = x
    @y = y
    @width = Math.ceil @width
    @height = Math.ceil @height

exports.geom.Vector = class Vector extends Class

  @crossProduct:(a, b)->
    a.distance * b.distance * sin(b.angle - a.angle)

  @dotProduct:(a, b)->

  @distance:(a, b)->
    x = a.x - b.x
    y = a.y - b.y
    sqrt x * x + y * y

  @between:(src, dst, ratio = 0.5) ->
    new Vector src.x + (dst.x - src.x) * ratio, src.y + (dst.y - src.y) * ratio

  constructor:(@x = 0, @y = 0) ->
    if @x instanceof Vector
      src = @x
      @x = src.x
      @y = src.y

    @defineProperty 'direction'
      , ->
        atan2 @y, @x
      , (direction)->
        magnitude = sqrt @x * @x + @y * @y
        @x = magnitude * cos direction
        @y = magnitude * sin direction
        return

    @defineProperty 'magnitude'
      , ->
        sqrt @x * @x + @y * @y
      , (magnitude)->
        ratio = magnitude / sqrt(@x * @x + @y * @y)
        @x *= ratio
        @y *= ratio
        return

  add:(b)->
    new Vector @x + b.x, @y + b.y

  subtract:(b)->
    new Vector @x - b.x, @y - b.y

  divide:(b)->
    new Vector @x / b, @y / b

  toString:->
    "(#{ @x }, #{ @y })"

  equals:(pt)->
    @x is pt.x and @y is pt.y

  normalize:(thickness = 1)->
    ratio = thickness / sqrt(@x * @x + @y * @y)
    @x *= ratio
    @y *= ratio
    @
