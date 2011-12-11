# **Experimental Implementation**

# class Vector - a simple 3D vector class

sqrt = Math.sqrt

module.exports = class Vector

  @ZERO:new Vector 0, 0, 0

  # Compute the magnitude of a vector
  @magnitude:(a)->
    sqrt a.x * a.x + a.y * a.y + a.z * a.z

  # Compute the magnitude of a vector, squared.
  @magnitudeSquared:(a)->
    a.x * a.x + a.y * a.y + a.z * a.z

  # Compute the distance between two points
  @distance:(a, b)->
    dx = a.x - b.x
    dy = a.y - b.y
    dz = a.z - b.z
    sqrt dx * dx + dy * dy + dz * dz

  # Compute the distance between two points, squared.  Often useful
  # when comparing distances, since the square root is slow
  @distanceSquared:(a, b)->
    dx = a.x - b.x
    dy = a.y - b.y
    dz = a.z - b.z
    dx * dx + dy * dy + dz * dz

  constructor:(x, y, z)->
    unless @ instanceof Vector
      return new Vector x, y, z
    if (v = arguments[0]) instanceof Vector
      @x = v.x
      @y = v.y
      @z = v.z
    else
      @x = x
      @y = y
      @z = z

  apply:(v)->
    @x = v.x
    @y = v.y
    @z = v.z
    return

  equals:(v)->
    @x is v.x and @y is v.y and @z is v.z

  notEquals:(v)->
    @x isnt v.x or @y isnt v.y or @z isnt v.z

  add:(v)->
    new Vector @x + v.x, @y + v.y, @z + v.z

  subtract:(v)->
    new Vector @x - v.x, @y - v.y, @z - v.z

  # Multiplication and division by scalar
  multiply:(s)->
    new Vector @x * s, @y * s, @z * s

  divide:(d)->
    new Vector @x / d, @y / d, @z / d

  # Set the vector to zero
  zero:->
    @x = @y = @z = 0
    return

  # Unary minus returns the negative of the vector
  invert:->
    @a *= -1
    @b *= -1
    @c *= -1
    return

  # Normalize the vector
  normalize:->
    dPow = x * x + y * y + z * z
    if dPow > 0
      d = sqrt dPow
      @a /= d
      @b /= d
      @c /= d
    return

  # Vector dot product.  We overload the standard
  # multiplication symbol to do this
  innerProduct:(v)->
    @x * v.x + @y * v.y + @z * v.z

  # Compute the cross product of two vectors
  crossProduct:(v)->
    new Vector(
      @y * v.z - @z * v.y
      @z * v.x - @x * v.z
      @x * v.y - @y * v.x
      )
