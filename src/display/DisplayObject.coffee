EventDispatcher = require 'events/EventDispatcher'
BlendMode = require 'display/blends/BlendMode'
Matrix = require 'geom/Matrix'
Rectangle = require 'geom/Rectangle'

_RADIAN_PER_DEGREE = Math.PI / 180

module.exports = class DisplayObject extends EventDispatcher

  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  constructor: ()  ->
    super('DisplayObject')
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
    @rect = new Rectangle()
    @filters = []
    @_canvas = document.createElement 'canvas'
    @_canvas.width = @_canvas.height = 0
    @_context = @_canvas.getContext '2d'
    @_stacks = []
    @_rerender = false

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
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'rotation', -> @_rotation
  DisplayObject::__defineSetter__ 'rotation', (value) ->
    @_rotation = value
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'width', -> @_width
  DisplayObject::__defineSetter__ 'width', (value) ->
    @_width = value
    @_scaleX = value / @_canvas.width unless @_canvas.width is 0
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'height', -> @_height
  DisplayObject::__defineSetter__ 'height', (value) ->
    @_height = value
    @_scaleY = value / @_canvas.height unless @_canvas.height is 0
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'scaleX', -> @_scaleX
  DisplayObject::__defineSetter__ 'scaleX', (value) ->
    @_scaleX = value
    @_width = @_canvas.width * value
    @_requestRender false
    return

  DisplayObject::__defineGetter__ 'scaleY', -> @_scaleY
  DisplayObject::__defineSetter__ 'scaleY', (value) ->
    @_scaleY = value
    @_height = @_canvas.height * value
    @_requestRender false
    return

  render: ->
    if @_rerender
      @_rerender = false
      @rect = new Rectangle()
      delta = 0
      for stack in @_stacks
        @rect.union stack.rect if stack.rect?
        delta = Math.max delta, stack.delta if stack.delta?
      @bounds = @rect.clone()
      offset = Math.ceil delta / 2
      delta = offset * 2
      offset *= -1
      @bounds.offset offset, offset
      @bounds.inflate delta, delta
      @_canvas.width = @bounds.width
      @_canvas.height = @bounds.height
      @["_#{ stack.method }"].apply this, stack.arguments for stack in @_stacks
      if (@filters.length > 0)
        imageData = @_context.getImageData @bounds.x, @bounds.y, @bounds.width, @bounds.height
        newImageData = @_context.createImageData @bounds.width, @bounds.height
        filter.scan imageData, newImageData for filter in @filters
        @_context.putImageData newImageData, @bounds.x, @bounds.y
    return

  clear: ->
    @_canvas.width = @rect.width
    @_requestRender true

  addTo: (parent) ->
    throw new TypeError "parent #{ parent } isn't display object container" unless parent instanceof Sprite
    parent.addChild(@)

  set: (propertyName, value) ->
    @[propertyName] = value
    @

  _requestRender: (rerender) ->
    @_rerender = true if rerender
    @_parent._requestRender() if @_parent?
    @