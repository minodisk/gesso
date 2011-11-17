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

  # ### toColorString():*String*
  # [static] Generates string of color style.
  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  # ### new DisplayObject()
  # Creates a new *DisplayObject* object.
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
    @_cache = document.createElement('canvas').getContext('2d')
    @_cache.canvas.width = @_cache.canvas.height = 0
    @_stacks = []
    @_drawn = false

  # ### stage:*Stage*
  # [read-only] The *Stage* of this object.
  DisplayObject::__defineGetter__ 'stage', -> @__stage
  DisplayObject::__defineSetter__ '_stage', (value) ->
    @__stage = value
    return

  # ### parent:*Sprite*
  # [read-only] The *Sprite* object that contains this object.
  DisplayObject::__defineGetter__ 'parent', -> @_parent

  # ### x:*Number*
  # The x coordinate of this object relative to parent coordinate space.
  DisplayObject::__defineGetter__ 'x', -> @_x
  DisplayObject::__defineSetter__ 'x', (value) ->
    @_x = value
    @_requestRender false
    return

  # ### y:*Number*
  # The y coordinate of this object relative to parent coordinate space.
  DisplayObject::__defineGetter__ 'y', -> @_y
  DisplayObject::__defineSetter__ 'y', (value) ->
    @_y = value
    @_requestRender false
    return

  # ### alpha:*Number*
  # The alpha transparency value of this object, between 0.0 and 1.0.
  DisplayObject::__defineGetter__ 'alpha', -> @_alpha
  DisplayObject::__defineSetter__ 'alpha', (value) ->
    @_alpha = value
    @_requestRender false
    return

  # ### rotation:*Number*
  # The rotation of this object, in degrees.
  DisplayObject::__defineGetter__ 'rotation', -> @_rotation
  DisplayObject::__defineSetter__ 'rotation', (value) ->
    @_rotation = value
    @_requestRender false
    return

  # ### width:*Number*
  # The width of this object, in pixels.
  DisplayObject::__defineGetter__ 'width', -> @_width
  DisplayObject::__defineSetter__ 'width', (value) ->
    @_width = value
    @_scaleX = value / @_cache.canvas.width unless @_cache.canvas.width is 0
    @_requestRender false
    return

  # ### height:*Number*
  # The height of this object, in pixels.
  DisplayObject::__defineGetter__ 'height', -> @_height
  DisplayObject::__defineSetter__ 'height', (value) ->
    @_height = value
    @_scaleY = value / @_cache.canvas.height unless @_cache.canvas.height is 0
    @_requestRender false
    return

  # ### scaleX:*Number*
  # The horizontal scale of this object.
  DisplayObject::__defineGetter__ 'scaleX', -> @_scaleX
  DisplayObject::__defineSetter__ 'scaleX', (value) ->
    @_scaleX = value
    @_width = @_cache.canvas.width * value
    @_requestRender false
    return

  # ### scaleY:*Number*
  # The vertical scale of this object.
  DisplayObject::__defineGetter__ 'scaleY', -> @_scaleY
  DisplayObject::__defineSetter__ 'scaleY', (value) ->
    @_scaleY = value
    @_height = @_cache.canvas.height * value
    @_requestRender false
    return

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
  get_bounds: (targetCoordinateSpace) ->

  # ### _render():*void*
  # [private] Renders this object.
  _render: ->
    if @_drawn
      @_drawn = false

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

      console.log @_bounds.x, @_bounds.y, @_bounds.width, @_bounds.height

      #radius = _ceil @_bounds.measureFarDistance(0, 0)
      #@_bounds.x = @_bounds.y = -radius
      #@_bounds.width = @_bounds.height = radius * 2

      @_cache.canvas.width = @_width = @_bounds.width
      @_cache.canvas.height = @_height = @_bounds.height

      @_cache.strokeStyle = 'rgba(0, 0, 255, .8)'
      @_cache.lineWidth = 1
      @_cache.strokeRect 0, 0, @_width, @_height

      @_cache.translate -@_bounds.x, -@_bounds.y
      @["_#{ stack.method }"].apply @, stack.arguments for stack in @_stacks

      if (@filters.length > 0)
        imageData = @_cache.getImageData @_bounds.x, @_bounds.y, @_bounds.width, @_bounds.height
        newImageData = @_cache.createImageData @_bounds.width, @_bounds.height
        filter.scan imageData, newImageData for filter in @filters
        @_cache.putImageData newImageData, @_bounds.x, @_bounds.y
    return

  # ### _requestRender():*DisplayObject*
  # [private] Requests rendering to parent.
  _requestRender: (drawn) ->
    @_drawn = true if drawn
    @_parent._requestRender true if @_parent?
    @