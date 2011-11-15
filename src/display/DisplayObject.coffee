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
    @_drawing = (document.createElement 'canvas').getContext '2d'
    @_drawing.canvas.width = @_drawing.canvas.height = 0
    @_transforming = (document.createElement 'canvas').getContext '2d'
    @_transforming.canvas.width = @_transforming.canvas.height = 0
    @_stacks = []
    @_cache = false
    @_transform = false

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
    @_scaleX = value / @_drawing.canvas.width unless @_drawing.canvas.width is 0
    @_requestRender false, true
    return

  # ## height
  # The height of this object, in pixels.
  DisplayObject::__defineGetter__ 'height', -> @_height
  DisplayObject::__defineSetter__ 'height', (value) ->
    @_height = value
    @_scaleY = value / @_drawing.canvas.height unless @_drawing.canvas.height is 0
    @_requestRender false, true
    return

  # ## scaleX
  # The horizontal scale of this object.
  DisplayObject::__defineGetter__ 'scaleX', -> @_scaleX
  DisplayObject::__defineSetter__ 'scaleX', (value) ->
    @_scaleX = value
    @_width = @_drawing.canvas.width * value
    @_requestRender false, true
    return

  # ## scaleY
  # The vertical scale of this object.
  DisplayObject::__defineGetter__ 'scaleY', -> @_scaleY
  DisplayObject::__defineSetter__ 'scaleY', (value) ->
    @_scaleY = value
    @_height = @_drawing.canvas.height * value
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
    @_drawing.canvas.width = @rect.width
    @_requestRender true

  # ## addTo()
  # Adds this object to *Sprite* object.
  addTo: (parent) ->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)

  # ## getBounds()
  # Calculates a rectangle that defines the area of this object object relative
  # to target coordinate space.
  getBounds: (targetCoordinateSpace) ->

  # ## _render()
  # [private] Draws on canvas if needs redrawing.
  # Copies the image to another canvas if needs transformation.
  _render: ->
    console.log 'render', @_cache, @_transform

    if @_cache
      @_cache = false

      # union bounds
      rect = new Rectangle()
      delta = 0
      for stack in @_stacks
        rect.union stack.rect if stack.rect?
        delta = _max delta, stack.delta if stack.delta?
      @bounds = rect.clone()
      offset = _ceil delta / 2
      delta = offset * 2
      offset *= -1
      @bounds.offset offset, offset
      @bounds.inflate delta, delta

      # calculate minimal bounds when context is transformed
      radius = @bounds.measureFarDistance 0, 0
      @bounds.x = @bounds.y = -radius
      @bounds.width = @bounds.height = radius * 2

      # apply size to canvas
      @_drawing.canvas.width = @bounds.width
      @_drawing.canvas.height = @bounds.height

      # call stacks
      @_drawing.translate -@bounds.x, -@bounds.y
      @["_#{ stack.method }"].apply @, stack.arguments for stack in @_stacks

      # apply filters
      if (@filters.length > 0)
        imageData = @_drawing.getImageData @bounds.x, @bounds.y, @bounds.width, @bounds.height
        newImageData = @_drawing.createImageData @bounds.width, @bounds.height
        filter.scan imageData, newImageData for filter in @filters
        @_drawing.putImageData newImageData, @bounds.x, @bounds.y

    if @_transform
      @_transform = false

      # reset transforming canvas
      @_transforming.canvas.width = @bounds.width * @_scaleX
      @_transforming.canvas.height = @bounds.height * @_scaleY

      # apply transform
      @_transforming.globalAlpha = if @_alpha < 0 then 0 else if @_alpha > 1 then 1 else @_alpha
      @_transforming.scale @_scaleX, @_scaleY if @_scaleX isnt 1 or @_scaleY isnt 1
      @_transforming.translate -@bounds.x, -@bounds.y if @bounds.x isnt 0 or @bounds.y isnt 0
      @_transforming.rotate @_rotation * _RADIAN_PER_DEGREE if @_rotation isnt 0
      @_transforming.drawImage @_drawing.canvas, @bounds.x, @bounds.y

    else
      @_transforming = @_drawing

    return

  # ## _requestRender()
  # [private] Requests rendering to parent.
  _requestRender: (cache, transform) ->
    @_cache = true if cache
    @_transform = true if transform
    @_parent._requestRender true if @_parent?
    @