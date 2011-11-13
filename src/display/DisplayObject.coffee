EventDispatcher = require 'events/EventDispatcher'
BlendMode = require 'display/blends/BlendMode'
Matrix = require 'geom/Matrix'
Rectangle = require 'geom/Rectangle'

_RADIAN_PER_DEGREE = Math.PI / 180
_max = Math.max
_min = Math.min
_ceil = Math.ceil
_sqrt = Math.sqrt

module.exports = class DisplayObject extends EventDispatcher

  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  constructor: ->
    super 'DisplayObject'
    @__stage = null
    @_parent = null
    @_x = 0
    @_y = 0
    @_matrix = new Matrix()
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
    @_refresh = false
    @_transform = false

  DisplayObject::__defineGetter__ 'stage', -> @__stage
  DisplayObject::__defineSetter__ '_stage', (value) ->
    @__stage = value
    return

  DisplayObject::__defineGetter__ 'parent', -> @_parent

  DisplayObject::__defineGetter__ 'x', -> @_x
  DisplayObject::__defineSetter__ 'x', (value) ->
    @_x = value
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'y', -> @_y
  DisplayObject::__defineSetter__ 'y', (value) ->
    @_y = value
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'alpha', -> @_alpha
  DisplayObject::__defineSetter__ 'alpha', (value) ->
    @_alpha = value
    @_requestRender false, true
    return

  DisplayObject::__defineGetter__ 'rotation', -> @_rotation
  DisplayObject::__defineSetter__ 'rotation', (value) ->
    @_rotation = value
    @_requestRender false, true
    return

  DisplayObject::__defineGetter__ 'width', -> @_width
  DisplayObject::__defineSetter__ 'width', (value) ->
    @_width = value
    @_scaleX = value / @_drawing.canvas.width unless @_drawing.canvas.width is 0
    @_requestRender false, true
    return

  DisplayObject::__defineGetter__ 'height', -> @_height
  DisplayObject::__defineSetter__ 'height', (value) ->
    @_height = value
    @_scaleY = value / @_drawing.canvas.height unless @_drawing.canvas.height is 0
    @_requestRender false, true
    return

  DisplayObject::__defineGetter__ 'scaleX', -> @_scaleX
  DisplayObject::__defineSetter__ 'scaleX', (value) ->
    @_scaleX = value
    @_width = @_drawing.canvas.width * value
    @_requestRender false, true
    return

  DisplayObject::__defineGetter__ 'scaleY', -> @_scaleY
  DisplayObject::__defineSetter__ 'scaleY', (value) ->
    @_scaleY = value
    @_height = @_drawing.canvas.height * value
    @_requestRender false, true
    return

  render: ->
    if @_refresh
      @_refresh = false

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
      #radius = _ceil(_sqrt @bounds.width * @bounds.width + @bounds.height * @bounds.height)
      radius = @bounds.measureFarDistance 0, 0
      @bounds.x = @bounds.y = -radius
      @bounds.width = @bounds.height = radius * 2
      
      # apply size to canvas
      @_drawing.canvas.width = @bounds.width
      @_drawing.canvas.height = @bounds.height

      # draw canvas rect
      #@_drawing.lineWidth = 3
      #@_drawing.strokeStyle = '#ff0000'
      #@_drawing.strokeRect 0, 0, @_drawing.canvas.width, @_drawing.canvas.height

      # call stacks
      @_drawing.translate -@bounds.x, -@bounds.y
      @["_#{ stack.method }"].apply this, stack.arguments for stack in @_stacks

      # apply filters
      if (@filters.length > 0)
        imageData = @_drawing.getImageData @bounds.x, @bounds.y, @bounds.width, @bounds.height
        newImageData = @_drawing.createImageData @bounds.width, @bounds.height
        filter.scan imageData, newImageData for filter in @filters
        @_drawing.putImageData newImageData, @bounds.x, @bounds.y

    if @_transform
      # reset transforming canvas
      @_transforming.canvas.width = @bounds.width * @scaleX
      @_transforming.canvas.height = @bounds.height * @scaleY

      # draw canvas rect
      #@_transforming.lineWidth = 5
      #@_transforming.strokeStyle = '#0000ff'
      #@_transforming.strokeRect 0, 0, @_transforming.canvas.width, @_transforming.canvas.height

      # transform
      @_transforming.scale @scaleX, @scaleY
      @_transforming.translate -@bounds.x, -@bounds.y
      @_transforming.rotate @rotation * _RADIAN_PER_DEGREE
      @_transforming.drawImage @_drawing.canvas, @bounds.x, @bounds.y

    else
      @_transforming = @_drawing

    return

  getRect: (targetCoordinateSpace) ->

  getBounds: (targetCoordinateSpace) ->

  clear: ->
    @_drawing.canvas.width = @rect.width
    @_requestRender true

  addTo: (parent) ->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)

  set: (propertyName, value) ->
    @[propertyName] = value
    @

  _requestRender: (refresh, transform) ->
    @_refresh = true if refresh
    @_transform = true if transform
    @_parent._requestRender true if @_parent?
    @