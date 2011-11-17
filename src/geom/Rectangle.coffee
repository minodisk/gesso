# **Package:** *geom*<br/>
# **Inheritance:** *Object* > *Rectangle*<br/>
# **Subclasses:** -
#
# The *Rectangle* class represents an area defined by x, y, width and height.
# <br/>
# You can access this module by doing:<br/>
# `require('geom/Rectangle')`

_min = Math.min
_max = Math.max
_sqrt = Math.sqrt

module.exports = class Rectangle

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
    l = _min @x, rect.x
    r = _max @x + @width, rect.x + rect.width
    w = r - l
    t = _min @y, rect.y
    b = _max @y + @height, rect.y + rect.height
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
