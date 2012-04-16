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

    # ## VERSION:*String*
    # [read-only] The version of graphics.
    @defineProperty 'VERSION', ->
      _VERSION

    # ## stage:*Stage*
    # [read-only] The *Stage* of this object.
    @defineProperty 'stage'
      , ->
        @__stage
      , null

    @defineProperty '_stage'
      , null
      , (value)->
        if @_children?
          for child in @_children
            child._stage = value
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
#    @_matrix.clone().createBox(@_scaleX, @_scaleY, @_rotation * _RADIAN_PER_DEGREE, 0, 0)
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
      if @__stage?.debug
        @_drawBounds()

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
    @_context.strokeStyle = 'rgb(255, 0, 0)'
    @_context.lineWidth = 2
    @_context.strokeRect 0, 0, @_context.canvas.width, @_context.canvas.height
    return

  hitTest:(x, y)->
    if x instanceof Vector
      pt = x
      x = pt.x
      y = pt.y
    local = @globalToLocal x, y
    @_hitTest local.x, local.y
  _hitTest:(localX, localY)->
    if @_bounds?
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
