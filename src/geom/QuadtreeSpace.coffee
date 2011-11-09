Quadtree = require 'geom/Quadtree'
Rectangle = require 'geom/Rectangle'

module.exports = class QuadtreeSpace

  constructor:(@rectangle, level, @debusSprite = null)->
    @quadtree = new Quadtree level
    @_widthPerSide = @rectangle.width / @quadtree._sides
    @_heightPerSide = @rectangle.height / @quadtree._sides
    @_storage = []
    if @debugSprite
      Shape = require 'display/Shape'
      TextField = require 'display/TextField'
      TextFormat = require 'display/styles/TextFormat'
      container = (new Sprite()).addTo @debugSprite
      grid = (new Shape()).addTo container
      format = new TextFormat 'monospace', 12, false, false, false, 'center', 'middle'
    for x in [0...@quadtree._sides] by 1
      for y in [0...@quadtree._sides] by 1
        grid.drawRect @_widthPerSide * x, @_heightPerSide * y, @_widthPerSide, @_heightPerSide
        textField = new TextField Quadtree.coordToZOrder(x, y), format
        textField.x = @_widthPerSide * (x + 0.5)
        textField.y = @_heightPerSide * (y + 0.5)
        textField.addTo container
        @_fixedShape = (new Shape()).addTo container
        @_floatingShape = (new Shape()).addTo container

  add:(rect, fixed = false)->
    rect.apply rect.intersection(@rectangle)
    @_storage.push
      rectangle: rect
      fixed: fixed
    if @debugSprite? and fixed
      @_fixedShape.drawRect rect.x - @rectangle.x, rect.y - @rectangle.y, rect.width, rect.height
      @_fixedShape.stroke 1, 0xff0000
    return

  remove:(rect)->
    i = @_storage.length
    while i-- > 0
      if rect is @_storage[i].rectangle
        @_storage.splice i, 1
        break
    return

  detectCollision:->
    @_floatingShape.clear() if @debugSprite?
    linear = []
    for obj in @_storage
      @_update2DPosition(obj)
      index = @quadtree.coordsToIndex obj.x0, obj.y0, obj.x1, obj.y1
      linear[index] = [] if linear[index]?
      linear[index].push obj
      if @debugSprite? and obj.fixed is false
        rect = obj.rectangle
        @_floatingShape.drawRect rect.x - @rectangle.x, rect.y - @rectangle.y, rect.width, rect.height
        @_floatingShape.stroke 1, 0x0000ff

    collisions = []
    i = linear.length
    while i--
      objects = linear[i]
      if objects?
        j = objects.length
        while j--
          src = objects[j].rectangle
          k = j
          while k--
            dst = objects[k].rectangle
            collisions.push [ src, dst ] if src.intersects dst
          k = i
          while (k = k - 1 >> 2) >= 0
            objs = linear[k]
            if objs?
              l = objs.length
              while l--
                dst = objs[l].rectangle
                collisions.push [ src, dst ] if src.intersects dst
    collisions

  _update2DPosition:(obj)->
    rect = obj.rectangle
    obj.x0 = @_validatePos (rect.x - @rectangle.x) / @_widthPerSide
    obj.y0 = @_validatePos (rect.y - @rectangle.y) / @_heightPerSide
    obj.x1 = @_validatePos (rect.x + rect.width - @rectangle.x) / @_widthPerSide
    obj.y1 = @_validatePos (rect.y + rect.height - @rectangle.y) / @_heightPerSide
    obj.x0 isnt -1 and obj.y0 isnt -1 and obj.x1 isnt -1 and obj.y1 isnt -1

  _validatePos: (n)->
    if n < 0 or @quadtree._sides < n
      -1
    else if n is @quadtree._sides
      @quadtree._sides - 1
    else
      n >> 0



