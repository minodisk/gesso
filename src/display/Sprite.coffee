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
      if @__stage?.debug
        @_drawBounds()

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

      b.transform child._getTransform()
#      b.x += child.x
#      b.y += child.y

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

        matrix = new Matrix 1, 0, 0, 1, @_bounds.x, @_bounds.y
        matrix.concat child._getTransform()
        matrix.translate -@_bounds.x, -@_bounds.y
        matrix.setTo @_context

        @_context.globalAlpha = if child._alpha < 0 then 0 else if child._alpha > 1 then 1 else child._alpha
        @_context.drawImage child._context.canvas, child._bounds.x - @_bounds.x, child._bounds.y - @_bounds.y
        @_context.setTransform 1, 0, 0, 1, 0, 0
    return
