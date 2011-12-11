# **Experimental Implementation**

# Implement a 3D axially aligned bounding box

Vector = require '3d/geom/Vector'

MAX_VALUE = Number.MAX_VALUE
MIN_VALUE = -MAX_VALUE
MIN_VECTOR = new Vector MIN_VALUE, MIN_VALUE, MIN_VALUE
MAX_VECTOR = new Vector MAX_VALUE, MAX_VALUE, MAX_VALUE

module.exports = class AABB

  # intersectAABBs
  #
  # Check if two AABBs intersect, and return true if so.  Optionally return
  # the AABB of their intersection if an intersection is detected
  @intersectAABBs:(box1, box2, boxIntersect)->
    # Check for no overlap
    if box1.min.x > box2.max.x or
       box1.max.x < box2.min.x or
       box1.min.y > box2.max.y or
       box1.max.y < box2.min.y or
       box1.min.z > box2.max.z or
       box1.max.z < box2.min.z
      return false
    # We have overlap.  Compute AABB of intersection, if they want it
    if boxIntersect?
      boxIntersect.min.x = max box1.min.x, box2.min.x
      boxIntersect.max.x = min box1.max.x, box2.max.x
      boxIntersect.min.y = max box1.min.y, box2.min.y
      boxIntersect.max.y = min box1.max.y, box2.max.y
      boxIntersect.min.z = max box1.min.z, box2.min.z
      boxIntersect.max.z = min box1.max.z, box2.max.z
    # They intersected
    true

  # intersectMovingAABB
  #
  # Return parametric point in time when a moving AABB collides
  # with a stationary AABB.  Returns > 1 if no intersection
  @intersectMovingAABB:(stationaryBox, movingBox, d)->
    # Initialize interval to contain all the time under consideration
    tEnter = 0
    tLeave = 1

    # Compute interval of overlap on each dimension, and intersect
    # this interval with the interval accumulated so far.  As soon as
    # an empty interval is detected, return a negative result
    # (no intersection.)  In each case, we have to be careful for
    # an infinite of empty interval on each dimension

    # Check x-axis
    if d.x is 0
      # Empty or infinite inverval on x
      if stationaryBox.min.x >= movingBox.max.x or
         stationaryBox.max.x <= movingBox.min.x
        # Empty time interval, so no intersection
        return MAX_VALUE
      # Inifinite time interval - no update necessary
    else
      # Divide once
      oneOverD = 1 / d.x
      # Compute time value when they begin and end overlapping
      xEnter = (stationaryBox.min.x - movingBox.max.x) * oneOverD
      xLeave = (stationaryBox.max.x - movingBox.min.x) * oneOverD
      # Check for interval out of order
      if xEnter > xLeave
        swap xEnter, xLeave
      # Update interval
      if xEnter > tEnter then tEnter = xEnter
      if xLeave < tLeave then tLeave = xLeave
      # Check if this resulted in empty interval
      if tEnter > tLeave
        return MAX_VALUE

    # Check y-axis
    if d.y is 0
      # Empty or infinite inverval on y
      if stationaryBox.min.y >= movingBox.max.y or
         stationaryBox.max.y <= movingBox.min.y
        # Empty time interval, so no intersection
        return MAX_VALUE
      # Inifinite time interval - no update necessary
    else
      # Divide once
      oneOverD = 1 / d.y
      # Compute time value when they begin and end overlapping
      yEnter = (stationaryBox.min.y - movingBox.max.y) * oneOverD
      yLeave = (stationaryBox.max.y - movingBox.min.y) * oneOverD
      # Check for interval out of order
      if yEnter > yLeave
        swap yEnter, yLeave
      # Update interval
      if yEnter > tEnter then tEnter = yEnter
      if yLeave < tLeave then tLeave = yLeave
      # Check if this resulted in empty interval
      if tEnter > tLeave
        return MAX_VALUE

    # Check z-axis
    if d.z is 0
      # Empty or infinite inverval on z
      if stationaryBox.min.z >= movingBox.max.z or
         stationaryBox.max.z <= movingBox.min.z
        # Empty time interval, so no intersection
        return MAX_VALUE
      # Inifinite time interval - no update necessary
    else
      # Divide once
      oneOverD = 1 / d.z
      # Compute time value when they begin and end overlapping
      zEnter = (stationaryBox.min.z - movingBox.max.z) * oneOverD
      zLeave = (stationaryBox.max.z - movingBox.min.z) * oneOverD
      # Check for interval out of order
      if zEnter > zLeave
        swap zEnter, zLeave
      # Update interval
      if zEnter > tEnter then tEnter = zEnter
      if zLeave < tLeave then tLeave = zLeave
      # Check if this resulted in empty interval
      if tEnter > tLeave
        return MAX_VALUE

    # OK, we have an intersection.  Return the parametric point in time
    # where the intersection occurs
    tEnter

  constructor:->
    unless @ instanceof AABB
      return new AABB
    if (box = arguments[0]) instanceof AABB
      @min = new Vector box.min
      @max = new Vector box.max
    else
      @min = new Vector MIN_VECTOR
      @max = new Vector MAX_VECTOR

  # Query for dimentions
  size:->
    @max.subtract @min
  xSize:->
    @max.x - @min.x
  ySize:->
    @max.y - @min.y
  zSize:->
    @max.z - @min.z
  center:->
    @min.add(max).multiply(0.5)

  # AABB::corner
  # Return one of the 8 corner points.  The points are numbered as follows:
  #
  #    6              7
  #      ------------
  #     /|          /|
  #  2 / |       3 / |      +Y
  #   /-----------/  |           +Z
  #   |  |        |  |      |
  #   |4 |--------|--| 5    |  /
  #   | /         | /       | /
  #   |/          |/        |/
  #   ------------          ------------ +X
  #  0            1        O
  #
  # Bit 0 selects min.x vs. max.x
  # Bit 1 selects min.y vs. max.y
  # Bit 2 selects min.z vs. max.z
  corner:(i)->
    if i < 0 or 7 < i
      throw new TypeError "'i' must be specified between 0 and 7."
    new Vector(
      if i & 1 then @max.x else @min.x
      if i & 2 then @max.y else @min.y
      if i & 4 then @max.z else @min.z
      )

  # AABB::empty
  #
  # "Empty" the box, by setting the values to really
  # large/small numbers
  empty:->
    @min.x = @min.y = @.min.z = MAX_VALUE
    @max.x = @max.y = @.max.z = MIN_VALUE
    return

  # AABB::add
  #
  # Add a point to the box
  # Add an AABB to the box
  add:(p)->
    if p instanceof AABB
      box = p
      @add box.min
      @add box.max
      return
    @min.x = p.x if p.x < @min.x
    @max.x = p.x if p.x > @max.x
    @min.y = p.y if p.y < @min.y
    @max.y = p.y if p.y > @max.y
    @min.z = p.z if p.z < @min.z
    @max.z = p.z if p.z > @max.z
    return

  # AABB::setToTransformedBox
  #
  # Transform the box and compute the new AABB.  Remember, this always
  # results in an AABB that is at least as big as the origin, and may be
  # considerably bigger.
  setTransformedBox:(box, m)->
    # If we're empty, then bail
    if box.isEmpty()
      @empty()
      return
    # Start with the translation portion
    @min = @max = getTranslation(m)
    # Examine each of the 9 matrix elements
    # and compute the new AABB
    if m.m11 > 0
      @min.x += m.m11 * box.min.x
      @max.x += m.m11 * box.max.x
    else
      @min.x += m.m11 * box.max.x
      @max.x += m.m11 * box.min.x
    if m.m12 > 0
      @min.y += m.m12 * box.min.x
      @max.y += m.m12 * box.max.x
    else
      @min.y += m.m12 * box.max.x
      @max.y += m.m12 * box.min.x
    if m.m13 > 0
      @min.z += m.m13 * box.min.x
      @max.z += m.m13 * box.max.x
    else
      @min.z += m.m13 * box.max.x
      @max.z += m.m13 * box.min.x
    if m.m21 > 0
      @min.x += m.m21 * box.min.y
      @max.x += m.m21 * box.max.y
    else
      @min.x += m.m21 * box.max.y
      @max.x += m.m21 * box.min.y
    if m.m22 > 0
      @min.y += m.m22 * box.min.y
      @max.y += m.m22 * box.max.y
    else
      @min.y += m.m22 * box.max.y
      @max.y += m.m22 * box.min.y
    if m.m23 > 0
      @min.z += m.m23 * box.min.y
      @max.z += m.m23 * box.max.y
    else
      @min.z += m.m23 * box.max.y
      @max.z += m.m23 * box.min.y
    if m.m31 > 0
      @min.x += m.m31 * box.min.z
      @max.x += m.m31 * box.max.z
    else
      @min.x += m.m31 * box.max.z
      @max.x += m.m31 * box.min.z
    if m.m32 > 0
      @min.y += m.m32 * box.min.z
      @max.y += m.m32 * box.max.z
    else
      @min.y += m.m32 * box.max.z
      @max.y += m.m32 * box.min.z
    if m.m33 > 0
      @min.z += m.m33 * box.min.z
      @max.z += m.m33 * box.max.z
    else
      @min.z += m.m33 * box.max.z
      @max.z += m.m33 * box.min.z
    return

  # AABB::isEmpty
  #
  # Return true if the box is enmpty
  isEmpty:->
    @min.x > @max.x or @min.y > @max.y or @min.z > @max.z

  # AABB::contains
  #
  # Return true if the box contains a point
  contains:(p)->
    p.x >= @min.x and p.x <= @max.x and
    p.y >= @min.y and p.y <= @max.y and
    p.z >= @min.z and p.z <= @max.z

  # AABB::closestPointTo
  #
  # Return the closest point on this box to another point
  closestPointTo:(p)->
    # "Push" p into the box, on each dimension
    new Vector (
      (if p.x < @min.x then @min.x else if p.x > @max.x then @max.x else p.x)
      (if p.y < @min.y then @min.y else if p.y > @max.y then @max.y else p.y)
      (if p.z < @min.z then @min.z else if p.z > @max.z then @max.z else p.z)
    )

  # AABB::intersectsSphere
  #
  # Return true if we intersect a sphere.  Uses Arvo's algorithm.
  intersectsSphere:(center, radius)->
    # Find the closest point on box to the point
    closestPoint = closestPointTo center
    # Check if it's within range
    Vector.distanceSquared(center, closestPoint) < radius * radius

  # AABB::rayIntersect
  #
  # Parametric intersection with a ray.  Returns parametric point
  # of intsersection in range 0...1 or a really big number (>1) if no
  # intersection.
  #
  # From "Fast Ray-Box Intersection," by Woo in Graphics Gems I,
  # page 395.
  #
  # See 12.9.11
  #
  # rayOrg: orgin of the ray
  # rayDelta: length and direction of the ray
  # returnNormal: optionally, the normal is returned
  rayIntersect:(rayOrg, rayDelta, returnNormal)->
    # Check for point inside box, trivial reject, and determine parametric
    # distance to each front face
    inside = true
    if rayOrg.x < @min.x
      xt = @min.x - rayOrg.x
      if xt > rayDelta.x then return MAX_VALUE
      xt /= rayDelta.x
      inside = false
      xn = -1
    else if rayOrg.x > @max.x
      xt = @max.x - rayOrg.x
      if xt < rayDelta.x then return MAX_VALUE
      xt /= rayDelta.x
      inside = false
      xn = 1
    else
      xt = -1
    if rayOrg.y < @min.y
      yt = @min.y - rayOrg.y
      if yt > rayDelta.y then return MAX_VALUE
      yt /= rayDelta.y
      inside = false
      yn = -1
    else if rayOrg.y > @max.y
      yt = @max.y - rayOrg.y
      if yt < rayDelta.y then return MAX_VALUE
      yt /= rayDelta.y
      inside = false
      yn = 1
    else
      yt = -1
    if rayOrg.z < @min.z
      zt = @min.z - rayOrg.z
      if zt > rayDelta.z then return MAX_VALUE
      zt /= rayDelta.z
      inside = false
      zn = -1
    else if rayOrg.z > @max.z
      zt = @max.z - rayOrg.z
      if zt < rayDelta.z then return MAX_VALUE
      zt /= rayDelta.z
      inside = false
      zn = 1
    else
      zt = -1
    # Inside box?
    if inside
      if returnNormal?
        returnNormal = -rayDelta
        returnNormal.normalize()
      return 0
    # Select farthest plane - this is
    # the plane of intersection.
    which = 0
    t = xt
    if yt > t
      which = 1
      t = yt
    if zt > t
      which = 2
      t = zt
    switch which
      when 0 # intersect with yz plane
        float y = rayOrg.y + rayDelta.y*t
        if y < @min.y || y > @max.y then return MAX_VALUE
        float z = rayOrg.z + rayDelta.z*t
        if z < @min.z || z > @max.z then return MAX_VALUE
        if returnNormal?
          returnNormal.x = xn
          returnNormal.y = 0
          returnNormal.z = 0
      when 1 # intersect with xz plane
        float x = rayOrg.x + rayDelta.x*t
        if x < @min.x || x > @max.x then return MAX_VALUE
        float z = rayOrg.z + rayDelta.z*t
        if z < @min.z || z > @max.z then return MAX_VALUE
        if returnNormal?
          returnNormal.x = 0
          returnNormal.y = yn
          returnNormal.z = 0
      when 2 # intersect with xy plane
        float x = rayOrg.x + rayDelta.x*t
        if x < @min.x || x > @max.x then return MAX_VALUE
        float y = rayOrg.y + rayDelta.y*t
        if y < @min.y || y > @max.y then return MAX_VALUE
        if returnNormal?
          returnNormal.x = 0
          returnNormal.y = 0
          returnNormal.z = zn
    # Return parametric point of intersection
    t

  # AABB::classifyPlane
  #
  # Perform static AABB-plane intersection test.  Returns:
  #
  # <0: Box is completely on the BACK side of the plane
  # >0: Box is completely on the FRONT side of the plane
  # 0 : Box intersects the plane
  classifyPlane:(n, d)->
    # Inspect the normal and compute the minimum and maximum
    # D values.
    if n.x > 0
      minD = n.x * @min.x
      maxD = n.x * @max.x
     else
      minD = n.x * @max.x
      maxD = n.x * @min.x
    if n.y > 0
      minD += n.y * @min.y
      maxD += n.y * @max.y
     else
      minD += n.y * @max.y
      maxD += n.y * @min.y
    if n.z > 0
      minD += n.z * @min.z
      maxD += n.z * @max.z
     else
      minD += n.z * @max.z
      maxD += n.z * @min.z
    # Check if completely on the front side of the plane
    if minD >= d
      return +1
    # Check if completely on the back side of the plane
    if maxD <= d
      return -1
    # We straddle the plane
    0

  # AABB::intersectPlane
  #
  # Perform dynamic AABB-plane intersection test.
  #
  # n		is the plane normal (assumed to be normalized)
  # planeD	is the D value of the plane equation p.n = d
  # dir		dir is the direction of movement of the AABB.
  #
  # The plane is assumed to be stationary.
  #
  # Returns the parametric point of intersection - the distance traveled
  # before an intersection occurs.  If no intersection, a REALLY big
  # number is returned.  You must check against the length of the
  # displacement.
  #
  # Only intersections with the front side of the plane are detected
  intersectPlane:(n, planeD, dir)->
    # Make sure they are passing in normalized vectors
    unless abs(Vector.magnitudeSquared(n) - 1) < 0.01
      throw new TypeError "'n' must specified Vector."
    unless abs(Vector.magnitudeSquared(dir) - 1) < 0.01
      throw new TypeError "'dir' must specified Vector."
    # Compute glancing angle, make sure we are moving towards
    # the front of the plane
    dot = Vector.innerProduct n, dir
    if dot >= 0
      return MAX_VALUE
    # Inspect the normal and compute the minimum and maximum
    # D values.  minD is the D value of the "frontmost" corner point
    if n.x > 0
      minD = n.x * @min.x
      maxD = n.x * @max.x
     else
      minD = n.x * @max.x
      maxD = n.x * @min.x
    if n.y > 0
      minD += n.y * @min.y
      maxD += n.y * @max.y
     else
      minD += n.y * @max.y
      maxD += n.y * @min.y
    if n.z > 0
      minD += n.z * @min.z
      maxD += n.z * @max.z
     else
      minD += n.z * @max.z
      maxD += n.z * @min.z
    # Check if we're already completely on the other
    # side of the plane
    if maxD <= planeD
      return MAX_VALUE
    # Perform standard raytrace equation using the
    # frontmost corner point
    t = planeD - minD / dot
    # Were we already penetrating?
    if t < 0
      return 0
    # Return it.  If > l, then we didn't hit in time.  That's
    # the condition that the caller should be checking for.
    t
