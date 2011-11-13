_min = Math.min
_max = Math.max
_sqrt = Math.sqrt

module.exports = class Rectangle

  constructor:(@x = 0, @y = 0, @width = 0, @height = 0)->

  toString:()->
    "[Rectangle x=#{ @x } y=#{ @y } width=#{ @width } height=#{ @height }]"

  clone:()->
    new Rectangle(@x, @y, @width, @height)

  apply:(@x, @y, @width, @height)->

  applyRectangle:(rect)->
    @x = rect.x
    @y = rect.y
    @width = rect.width
    @height = rect.height
    return

  offset:(dx, dy)->
    @x += dx
    @y += dy
    return

  offsetPoint:(pt)->
    @x += pt.x
    @y += pt.y
    return

  inflate:(dw, dh)->
    @width += dw
    @height += dh
    return

  inflatePoint:(pt)->
    @width += pt.x
    @height += pt.y
    return

  deflate:(dw, dh)->
    @width -= dw
    @height -= dh
    return

  deflatePoint:(pt)->
    @width -= pt.x
    @height -= pt.y
    return

  union:(rect)->
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
    return

  isEmpty:()->
    @x is 0 and @y is 0 and @width is 0 and @height is 0

  intersects:(rect)->
    l = _max @x, rect.x
    r = _min @x + @width, rect.x + rect.width
    w = r - l
    return false if w <= 0
    t = _max @y, rect.y
    b = _min @y + @height, rect.y + rect.height
    h = b - t
    return false if h <= 0
    true

  intersection:(rect)->
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
