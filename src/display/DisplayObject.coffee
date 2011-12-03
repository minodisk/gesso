# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject*<br/>
# **Subclasses:** *Bitmap*, *Shape*, *TextField*
#
# The base class for all objects that can be placed on the display list.<br/>
# You can access this module by doing:<br/>
# `require('display/DisplayObject')`

EventDispatcher = require 'events/EventDispatcher'
BlendMode = require 'display/BlendMode'
Matrix = require 'geom/Matrix'
Point = require 'geom/Point'
Rectangle = require 'geom/Rectangle'

_RADIAN_PER_DEGREE = Math.PI / 180

module.exports = class DisplayObject extends EventDispatcher

  # ### toColorString():*String*
  # [static] Generates string of color style.
  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  # ### new DisplayObject()
  # Creates a new *DisplayObject* object.
  constructor: ->
    super()

    # ### stage:*Stage*
    # [read-only] The *Stage* of this object.
    @defineProperty 'stage'
      , ->
        @__stage
      , (value) ->
        @__stage = value
        return


    # ### parent:*Sprite*
    # [read-only] The *Sprite* object that contains this object.
    @defineProperty 'parent'
      , ->
        @_parent

    # ### x:*Number*
    # The x coordinate of this object relative to parent coordinate space.
    @defineProperty 'x'
      , ->
        @_x
      , (value) ->
        @_x = value
        @_requestRender false
        return

    # ### y:*Number*
    # The y coordinate of this object relative to parent coordinate space.
    @defineProperty 'y'
      , ->
        @_y
      , (value) ->
        @_y = value
        @_requestRender false
        return

    # ### alpha:*Number*
    # The alpha transparency value of this object, between 0.0 and 1.0.
    @defineProperty 'alpha'
      , ->
        @_alpha
      , (value) ->
        @_alpha = value
        @_requestRender false
        return

    # ### rotation:*Number*
    # The rotation of this object, in degrees.
    @defineProperty 'rotation'
      , ->
        @_rotation
      , (value) ->
        @_rotation = value
        @_requestRender false
        return

    # ### width:*Number*
    # The width of this object, in pixels.
    @defineProperty 'width'
      , ->
        @_width
      , (value) ->
        @_width = value
        @_scaleX = value / @_context.canvas.width unless @_context.canvas.width is 0
        @_requestRender false
        return

    # ### height:*Number*
    # The height of this object, in pixels.
    @defineProperty 'height'
      , ->
        @_height
      , (value) ->
        @_height = value
        @_scaleY = value / @_context.canvas.height unless @_context.canvas.height is 0
        @_requestRender false
        return

    # ### scaleX:*Number*
    # The horizontal scale of this object.
    @defineProperty 'scaleX'
      , ->
        @_scaleX
      , (value) ->
        @_scaleX = value
        @_width = @_context.canvas.width * value
        @_requestRender false
        return

    # ### scaleY:*Number*
    # The vertical scale of this object.
    @defineProperty 'scaleY'
      , ->
        @_scaleY
      , (value) ->
        @_scaleY = value
        @_height = @_context.canvas.height * value
        @_requestRender false
        return

    @defineProperty 'matrix'
      , ->
        @_matrix
      , (matrix) ->
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
    @blendMode = BlendMode.NORMAL
    @filters = []
    @_context = document.createElement('canvas').getContext('2d')
    @_context.canvas.width = @_context.canvas.height = 0
    @_stacks = []
    @_drawn = false

  _getTransform: ->
    @_matrix.clone().transform(@_x, @_y, @_scaleX, @_scaleY, @_rotation * _RADIAN_PER_DEGREE)

  # ### set():*DisplayObject*
  # Sets property to this object. Returns self for method chain.
  set: (propertyName, value) ->
    @[propertyName] = value
    @

  # ### clear():*DisplayObject*
  # Clears the drawn graphics.
  clear: ->
    @_stacks = []
    @_requestRender true

  # ### addTo():*DisplayObject*
  # Adds this object to *Sprite* object.
  addTo: (parent) ->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)
    @

  # ### get_bounds():*DisplayObject*
  # Calculates a rectangle that defines the area of this object object relative
  # to target coordinate space.

  # ### _requestRender():*DisplayObject*
  # [private] Requests rendering to parent.
  _requestRender: (drawn = false) ->
    @_drawn |= drawn
    @_measureSize()
    @_parent._requestRender true if @_parent?
    @

  # ### _render():*void*
  # [private] Renders this object.
  _render: ->
    @_drawn = false
    #@_measureSize()
    @_applySize()
    @_execStacks()
    @_applyFilters()
    #@_drawBounds()

  # ### _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize: ->
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
    return

  # ### _applySize():*void*
  # [private] Applies the bounds to internal canvas of this object.
  _applySize: ->
    @_context.canvas.width = @_bounds.width
    @_context.canvas.height = @_bounds.height

  # ### _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks: ->
    @_context.translate -@_bounds.x, -@_bounds.y
    @["_#{ stack.method }"].apply @, stack.arguments for stack in @_stacks
    @_context.setTransform 1, 0, 0, 1, 0, 0

  # ### _applyFilters():*void*
  # [private] Applies the filters to this object.
  _applyFilters: ->
    if (@filters.length > 0)
      imageData = @_context.getImageData 0, 0, @_bounds.width, @_bounds.height
      newImageData = @_context.createImageData @_bounds.width, @_bounds.height
      filter.scan imageData, newImageData for filter in @filters
      @_context.putImageData newImageData, 0, 0
    return

  # ### _drawBounds():*void*
  # [private] Draws the bounds of this object for debug.
  _drawBounds: ->
    @_context.strokeStyle = 'rgba(0, 0, 255, .8)'
    @_context.lineWidth = 1
    @_context.strokeRect 0, 0, @_width, @_height

  hitTestPoint: (point) ->
    @hitTest point.x, point.y
  hitTest: (stageX, stageY) ->
    local = @globalToLocal stageX, stageY
    @_hitTest local.x, local.y
  _hitTest: (localX, localY) ->
    @_bounds.contains localX, localY

  globalToLocalPoint: (point) ->
    @globalToLocal point.x, point.y
  globalToLocal: (x, y) ->
    displayObject = @
    while displayObject
      x -= displayObject.x
      y -= displayObject.y
      displayObject = displayObject._parent
    new Point x, y
