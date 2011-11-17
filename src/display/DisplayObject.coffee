# **Package:** *display*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject*<br/>
# **Subclasses:** *Bitmap*, *Shape*, *TextField*
#
# The base class for all objects that can be placed on the display list.<br/>
# You can access this module by doing:<br/>
# `require('display/DisplayObject')`

EventDispatcher = require 'events/EventDispatcher'
BlendMode = require 'display/blends/BlendMode'
Rectangle = require 'geom/Rectangle'

_RADIAN_PER_DEGREE = Math.PI / 180
_max = Math.max
_min = Math.min
_ceil = Math.ceil
_sqrt = Math.sqrt

module.exports = class DisplayObject extends EventDispatcher

  # ## toColorString()
  # [static] Generates string of color style.
  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  # ## new DisplayObject()
  # Creates a new *DisplayObject* instance.
  constructor: ->
    super 'DisplayObject'
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
    @blendMode = BlendMode.NORMAL
    @filters = []
    @_input = (document.createElement 'canvas').getContext '2d'
    @_input.canvas.width = @_input.canvas.height = 0
    @_output = (document.createElement 'canvas').getContext '2d'
    @_output.canvas.width = @_output.canvas.height = 0
    @_stacks = []
    @_drawn = false
    @_transformed = false

  # ## stage
  # [read-only] The *Stage* of this object.
  DisplayObject::__defineGetter__ 'stage', -> @__stage
  DisplayObject::__defineSetter__ '_stage', (value) ->
    @__stage = value
    return

  # ## parent
  # [read-only] The *Sprite* object that contains this object.
  DisplayObject::__defineGetter__ 'parent', -> @_parent

  # ## x
  # The x coordinate of this object relative to parent coordinate space.
  DisplayObject::__defineGetter__ 'x', -> @_x
  DisplayObject::__defineSetter__ 'x', (value) ->
    @_x = value
    @_requestRender false
    return

  # ## y
  # The y coordinate of this object relative to parent coordinate space.
  DisplayObject::__defineGetter__ 'y', -> @_y
  DisplayObject::__defineSetter__ 'y', (value) ->
    @_y = value
    @_requestRender false
    return

  # ## alpha
  # The alpha transparency value of this object, between 0.0 and 1.0.
  DisplayObject::__defineGetter__ 'alpha', -> @_alpha
  DisplayObject::__defineSetter__ 'alpha', (value) ->
    @_alpha = value
    @_requestRender false, true
    return

  # ## rotation
  # The rotation of this object, in degrees.
  DisplayObject::__defineGetter__ 'rotation', -> @_rotation
  DisplayObject::__defineSetter__ 'rotation', (value) ->
    @_rotation = value
    @_requestRender false, true
    return

  # ## width
  # The width of this object, in pixels.
  DisplayObject::__defineGetter__ 'width', -> @_width
  DisplayObject::__defineSetter__ 'width', (value) ->
    @_width = value
    @_scaleX = value / @_input.canvas.width unless @_input.canvas.width is 0
    @_requestRender false, true
    return

  # ## height
  # The height of this object, in pixels.
  DisplayObject::__defineGetter__ 'height', -> @_height
  DisplayObject::__defineSetter__ 'height', (value) ->
    @_height = value
    @_scaleY = value / @_input.canvas.height unless @_input.canvas.height is 0
    @_requestRender false, true
    return

  # ## scaleX
  # The horizontal scale of this object.
  DisplayObject::__defineGetter__ 'scaleX', -> @_scaleX
  DisplayObject::__defineSetter__ 'scaleX', (value) ->
    @_scaleX = value
    @_width = @_input.canvas.width * value
    @_requestRender false, true
    return

  # ## scaleY
  # The vertical scale of this object.
  DisplayObject::__defineGetter__ 'scaleY', -> @_scaleY
  DisplayObject::__defineSetter__ 'scaleY', (value) ->
    @_scaleY = value
    @_height = @_input.canvas.height * value
    @_requestRender false, true
    return

  # ## set()
  # Sets property to this object. Returns self for method chain.
  set: (propertyName, value) ->
    @[propertyName] = value
    @

  # ## clear()
  # Clears the drawn graphics.
  clear: ->
    @_input.canvas.width = @rect.width
    @_requestRender true

  # ## addTo()
  # Adds this object to *Sprite* object.
  addTo: (parent) ->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)

  # ## get_bounds()
  # Calculates a rectangle that defines the area of this object object relative
  # to target coordinate space.
  get_bounds: (targetCoordinateSpace) ->

  # ## _render()
  # [private] Draws on canvas if needs redrawing.
  # Copies the image to another canvas if needs transformation.
  _render: ->
    if @_drawn
      @_drawn = false

      # union _bounds
      rect = new Rectangle()
      delta = 0
      for stack in @_stacks
        rect.union stack.rect if stack.rect?
        delta = _max delta, stack.delta if stack.delta?
      @_bounds = rect.clone()
      offset = _ceil delta / 2
      delta = offset * 2
      offset *= -1
      @_bounds.offset offset, offset
      @_bounds.inflate delta, delta

      # computes minimal _bounds when context is transformed
      radius = _ceil @_bounds.measureFarDistance(0, 0)
      @_bounds.x = @_bounds.y = -radius
      @_bounds.width = @_bounds.height = radius * 2

      # apply size to canvas
      @_input.canvas.width = @_width = @_bounds.width
      @_input.canvas.height = @_height = @_bounds.height

      @_input.strokeStyle = 'rgba(0, 0, 255, .8)'
      @_input.lineWidth = 1
      @_input.strokeRect 0, 0, @_width, @_height

      # call stacks
      @_input.translate -@_bounds.x, -@_bounds.y
      @["_#{ stack.method }"].apply @, stack.arguments for stack in @_stacks

      # apply filters
      if (@filters.length > 0)
        imageData = @_input.getImageData @_bounds.x, @_bounds.y, @_bounds.width, @_bounds.height
        newImageData = @_input.createImageData @_bounds.width, @_bounds.height
        filter.scan imageData, newImageData for filter in @filters
        @_input.putImageData newImageData, @_bounds.x, @_bounds.y

    #if @_transformed then @_transform() else @_output = @_input
    @_output = @_input
    return

  _transform: ->
    @_transformed = false
    # reset transforming canvas
    @_output.canvas.width = @_bounds.width * @_scaleX
    @_output.canvas.height = @_bounds.height * @_scaleY

    @_output.strokeStyle = 'rgba(255, 0, 0, .8)'
    @_output.lineWidth = 1
    @_output.strokeRect 0, 0, @_output.canvas.width, @_output.canvas.height

    # apply transform
    @_output.globalAlpha = if @_alpha < 0 then 0 else if @_alpha > 1 then 1 else @_alpha
    @_output.scale @_scaleX, @_scaleY if @_scaleX isnt 1 or @_scaleY isnt 1
    @_output.translate -@_bounds.x, -@_bounds.y if @_bounds.x isnt 0 or @_bounds.y isnt 0
    @_output.rotate @_rotation * _RADIAN_PER_DEGREE if @_rotation isnt 0
    @_output.drawImage @_input.canvas, @_bounds.x, @_bounds.y

  # ## _requestRender()
  # [private] Requests rendering to parent.
  _requestRender: (cache, transform) ->
    @_drawn = true if cache
    @_transformed = true if transform
    @_parent._requestRender true if @_parent?
    @