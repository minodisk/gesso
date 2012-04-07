# **Experimental Implementation**

# class Vector - a simple 3D vector class

sqrt = Math.sqrt

class Vector

  @ZERO:new Vector 0, 0, 0

  @equals:(a, b)->
    a.x is b.x and a.y is b.y and a.z is b.z

  @notEquals:(a, b)->
    a.x isnt b.x or a.y isnt b.y or a.z isnt b.z

  @add:(a, b)->
    new Vector a.x + b.x, a.y + b.y, a.z + b.z

  @subtract:(a, b)->
    new Vector a.x - b.x, a.y - b.y, a.z - b.z

  # Multiplication and division by scalar
  @multiply:(m, s)->
    new Vector m.x * s, m.y * s, m.z * s

  @divide:(m, d)->
    new Vector m.x / d, m.y / d, m.z / d

  # Vector dot product.  We overload the standard
  # multiplication symbol to do this
  @dotProduct:(a, b)->
    a.x * b.x + a.y * b.y + a.z * b.z

  # Compute the cross product of two vectors
  @crossProduct:(a, b)->
    new Vector(
      a.y * b.z - a.z * b.y
      a.z * b.x - a.x * b.z
      a.x * b.y - a.y * b.x
      )

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
    dPow = @x * @x + @y * @y + @z * @z
    if dPow > 0
      d = sqrt dPow
      @x /= d
      @y /= d
      @z /= d
    return
