# **Experimental Implementation**

# Implement a 4x3 transformation matrix.  This class can represent
# any 3D affine transformation.

# class Matrix
#
# Implement a 4x3 transformation matrix.  This class can represent
# any 3D affine transformation.

# MATRIX ORGANIZATION
#
# The purpose of this class is so that a user might perform transformations
# without fiddling with plus or minus signs or transposing the matrix
# until the output "looks right."  But of course, the specifics of the
# internal representation is important.  Not only for the implementation
# in this file to be correct, but occasionally direct access to the
# matrix variables is necessary, or beneficial for optimization.  Thus,
# we document our matrix conventions here.
#
# We use row vectors, so multiplying by our matrix looks like this:
#
#               | m11 m12 m13 |
#     [ x y z ] | m21 m22 m23 | = [ x' y' z' ]
#               | m31 m32 m33 |
#               | tx  ty  tz  |
#
# Strict adherance to linear algebra rules dictates that this
# multiplication is actually undefined.  To circumvent this, we can
# consider the input and output vectors as having an assumed fourth
# coordinate of 1.  Also, since we cannot technically invert a 4x3 matrix
# according to linear algebra rules, we will also assume a rightmost
# column of [ 0 0 0 1 ].  This is shown below:
#
#                 | m11 m12 m13 0 |
#     [ x y z 1 ] | m21 m22 m23 0 | = [ x' y' z' 1 ]
#                 | m31 m32 m33 0 |
#                 | tx  ty  tz  1 |
#
# In case you have forgotten your linear algebra rules for multiplying
# matrices (which are described in section 7.1.6 and 7.1.7), see the
# definition of operator* for the expanded computations.

abs = Math.abs
sin = Math.sin
cos = Math.cos
tan = Math.tan

class Matrix

  @IDENTITY = new Matrix 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0

  # ## multiply(a:*Vector*, b:*Matrix*):*Vector*
  # [static]
  # Transform the point.
  #
  # ## multiply(a:*Matrix*, *Matrix*):*Matrix*
  # [static]
  # Matrix concatenation.
  @multiply:(a, b)->
    unless b instanceof Matrix
      throw new TypeError "'b' must be specified an instance of Matrix."

    if a instanceof Vector
      # Grind through the linear algebra.
      new Vector(
        a.x * b.m11 + a.y * b.m21 + a.z * b.m31 + b.tx
        a.x * b.m12 + a.y * b.m22 + a.z * b.m32 + b.ty
        a.x * b.m13 + a.y * b.m23 + a.z * b.m33 + b.tz
        )
    else if a instanceof Matrix
      new Matrix(
        # Compute the upper 3x3 (linear transformation) portion
        a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31
        a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32
        a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33
        a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31
        a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32
        a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33
        a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31
        a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32
        a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33
        # Compute the translation portion
        a.tx * b.m11 + a.ty * b.m21 + a.tz * b.m31 + b.tx
        a.tx * b.m12 + a.ty * b.m22 + a.tz * b.m32 + b.ty
        a.tx * b.m13 + a.ty * b.m23 + a.tz * b.m33 + b.tz
        )
    else
      throw new TypeError "'a' must be specified an instance of Vector or Matrix."

  # ## determinant(m:*Matrix*):*Number*
  # [static]
  # Compute the determinant of the 3x3 portion of the matrix.
  @determinant:(m)->
    m.m11 * (m.m22 * m.m33 - m.m23 * m.m32) +
    m.m12 * (m.m23 * m.m31 - m.m21 * m.m33) +
    m.m13 * (m.m21 * m.m32 - m.m22 * m.m31)

  # ## inverse(m:*Matrix*):*Matrix*
  # [static]
  # Compute the inverse of a matrix.  We use the classical adjoint divided
  # by the determinant method.
  @invert:(m)->
    # Compute the determinant
    det = @determinant m
    # If we're singular, then the determinant is zero and there's
    # no inverse
    unless abs(det) > 0.000001
      throw new TypeError "Zero matrix doesn't have inverse matrix."
    # Compute one over the determinant, so we divide once and
    # can *multiply* per element
    oneOverDet = 1 / det
    # Compute the 3x3 portion of the inverse, by
    # dividing the adjoint by the determinant
    new Matrix(
      (m.m22 * m.m33 - m.m23 * m.m32) * oneOverDet
      (m.m13 * m.m32 - m.m12 * m.m33) * oneOverDet
      (m.m12 * m.m23 - m.m13 * m.m22) * oneOverDet

      (m.m23 * m.m31 - m.m21 * m.m33) * oneOverDet
      (m.m11 * m.m33 - m.m13 * m.m31) * oneOverDet
      (m.m13 * m.m21 - m.m11 * m.m23) * oneOverDet

      (m.m21 * m.m32 - m.m22 * m.m31) * oneOverDet
      (m.m12 * m.m31 - m.m11 * m.m32) * oneOverDet
      (m.m11 * m.m22 - m.m12 * m.m21) * oneOverDet

      -(m.tx * r.m11 + m.ty * r.m21 + m.tz * r.m31)
      -(m.tx * r.m12 + m.ty * r.m22 + m.tz * r.m32)
      -(m.tx * r.m13 + m.ty * r.m23 + m.tz * r.m33)
      )

  constructor:(m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz)->
    unless @ instanceof Matrix
      return new Matrix m11, m12, m13, m21, m22, m23, m31, m32, m33, tx, ty, tz
    if (m = arguments[0]) instanceof Matrix
      @m11 = m.m11
      @m12 = m.m12
      @m13 = m.m13
      @m21 = m.m21
      @m22 = m.m22
      @m23 = m.m23
      @m31 = m.m31
      @m32 = m.m32
      @m33 = m.m33
      @tx = m.tx
      @ty = m.ty
      @tz = m.tz
    else
      @m11 = m11
      @m12 = m12
      @m13 = m13
      @m21 = m21
      @m22 = m22
      @m23 = m23
      @m31 = m31
      @m32 = m32
      @m33 = m33
      @tx = tx
      @ty = ty
      @tz = tz

  setupView:(camera)->
    z = Vector.subtract(camera.target.position, camera.position)
    z.normalize()
    x = Vector.crossProduct(camera.up, z)
    x.normalize()
    y = Vector.crossProduct(z, x)
    #console.log z, x, y
    @m11 = x.x
    @m12 = y.x
    @m13 = z.x
    @m21 = x.y
    @m22 = y.y
    @m23 = z.y
    @m31 = x.z
    @m32 = y.z
    @m33 = z.z
    @tx = -Vector.dotProduct camera.position, x
    @ty = -Vector.dotProduct camera.position, y
    @tz = -Vector.dotProduct camera.position, z
    return

  setupProjection:(camera, screen)->
    sy = 1 / tan(camera.fov / 2)
    sx = sy * screen.screenHeight / screen.screenWidth
    sz = camera.far / (camera.far - camera.near)
    @m11 = sx
    @m12 = 0
    @m13 = 0
    @m21 = 0
    @m22 = sy
    @m23 = 0
    @m31 = 0
    @m32 = 0
    @m33 = sz
    @tx = 0
    @ty = 0
    @tz = -sz * camera.near
    return

  setupScreen:(screen)->
    w = screen.screenWidth / 2
    h = screen.screenHeight / 2
    @m11 = w
    @m12 = 0
    @m13 = 0
    @m21 = 0
    @m22 = -h
    @m23 = 0
    @m31 = 0
    @m32 = 0
    @m33 = 1
    @tx = w
    @ty = h
    @tz = 0

  # identity():*void*
  # Set the matrix to identity
  identity:->
    @m11 = 1
    @m12 = 0
    @m13 = 0
    @m21 = 0
    @m22 = 1
    @m23 = 0
    @m31 = 0
    @m32 = 0
    @m33 = 1
    @tx = 0
    @ty = 0
    @tz = 0
    return

  # zeroTranslation():*void*
  # Zero the 4th row of the matrix, which contains the translation portion.
  zeroTranslation:->
    @tx = @ty = @tz = 0
    return

  # setTranslation(d:*Vector*):*void*
  # Sets the translation portion of the matrix in vector form
  setTranslation:(d)->
    @tx = d.x
    @ty = d.y
    @tz = d.z
    return

  # setTranslation(d:*Vector*):*void*
  # Sets the translation portion of the matrix in vector form
  setupTranslation:(d)->
    # Set the linear transformation portion to identity
    @m11 = 1
    @m12 = 0
    @m13 = 0
    @m21 = 0
    @m22 = 1
    @m23 = 0
    @m31 = 0
    @m32 = 0
    @m33 = 1
    # Set the translation portion
    @tx = d.x
    @ty = d.y
    @tz = d.z
    return

  # setupLocalToParent(pos:*Vector*, orient:*EulerAngles*):*void*
  # setupLocalToParent(pos:*Vector*, orient:*RotationMatrix*):*void*
  # Setup the matrix to perform a local -> parent transformation, given
  # the position and orientation of the local reference frame within the
  # parent reference frame.
  # A very common use of this will be to construct a object -> world matrix.
  # As an example, the transformation in this case is straightforward.  We
  # first rotate from object space into inertial space, then we translate
  # into world space.
  # We allow the orientation to be specified using either euler angles,
  # or a RotationMatrix
  setupLocalToParent:(pos, orient)->
    if orient instanceof EulerAngles
      # Create a rotation matrix.
      orientMatrix = new RotationMatrix
      orientMatrix.setup orient
      orient = orientMatrix
    # Copy the rotation portion of the matrix.  According to
    # the comments in RotationMatrix.cpp, the rotation matrix
    # is "normally" an inertial->object matrix, which is
    # parent->local.  We want a local->parent rotation, so we
    # must transpose while copying
    @m11 = orient.m11
    @m12 = orient.m21
    @m13 = orient.m31
    @m21 = orient.m12
    @m22 = orient.m22
    @m23 = orient.m32
    @m31 = orient.m13
    @m32 = orient.m23
    @m33 = orient.m33
    # Now set the translation portion.  Translation happens "after"
    # the 3x3 portion, so we can simply copy the position
    # field directly
    @tx = pos.x
    @ty = pos.y
    @tz = pos.z
    return

  # setupParentToLocal(pos:*Vector*, orient:*EulerAngles*):*void*
  # setupParentToLocal(pos:*Vector*, orient:*RotationMatrix*):*void*
  # Setup the matrix to perform a parent -> local transformation, given
  # the position and orientation of the local reference frame within the
  # parent reference frame.
  # A very common use of this will be to construct a world -> object matrix.
  # To perform this transformation, we would normally FIRST transform
  # from world to inertial space, and then rotate from inertial space into
  # object space.  However, out 4x3 matrix always translates last.  So
  # we think about creating two matrices T and R, and then concatonating
  # M = TR.
  # We allow the orientation to be specified using either euler angles,
  # or a RotationMatrix
  setupParentToLocal:(pos, orient)->
    if orient instanceof EulerAngles
      # Create a rotation matrix.
      matrix = new RotationMatrix
      matrix.setup orient
      orient = matrix
    # Copy the rotation portion of the matrix.  We can copy the
    # elements directly (without transposing) according
    # to the layout as commented in RotationMatrix.cpp
    @m11 = orient.m11
    @m12 = orient.m12
    @m13 = orient.m13
    @m21 = orient.m21
    @m22 = orient.m22
    @m23 = orient.m23
    @m31 = orient.m31
    @m32 = orient.m32
    @m33 = orient.m33
    # Now set the translation portion.  Normally, we would
    # translate by the negative of the position to translate
    # from world to inertial space.  However, we must correct
    # for the fact that the rotation occurs "first."  So we
    # must rotate the translation portion.  This is the same
    # as create a translation matrix T to translate by -pos,
    # and a rotation matrix R, and then creating the matrix
    # as the concatenation of TR
    @tx = -(pos.x * @m11 + pos.y * @m21 + pos.z * @m31)
    @ty = -(pos.x * @m12 + pos.y * @m22 + pos.z * @m32)
    @tz = -(pos.x * @m13 + pos.y * @m23 + pos.z * @m33)
    return

  # ## setupRotate(axis:*int*, theta:*Number*):*void*
  # ## setupRotate(axis:*Vector*, theta:*Number*):*void*
  # Setup the matrix to perform a rotation about a cardinal axis
  # The axis of rotation is specified using a 1-based index:
  #	1 => rotate about the x-axis
  #	2 => rotate about the y-axis
  #	3 => rotate about the z-axis
  # theta is the amount of rotation, in radians.  The left-hand rule is
  # used to define "positive" rotation.
  # The translation portion is reset.
  setupRotate:(axis, theta)->
    # Get sin and cosine of rotation angle
    s = sin theta
    c = cos theta
    unless axis instanceof Vector
      # Check which axis they are rotating about
      switch axis
        when 1  # Rotate about the x-axis
          @m11 = 1
          @m12 = 0
          @m13 = 0
          @m21 = 0
          @m22 = c
          @m23 = s
          @m31 = 0
          @m32 = -s
          @m33 = c
        when 2  # Rotate about the y-axis
          @m11 = c
          @m12 = 0
          @m13 = -s
          @m21 = 0
          @m22 = 1
          @m23 = 0
          @m31 = s
          @m32 = 0
          @m33 = c
        when 3  # Rotate about the z-axis
          @m11 = c
          @m12 = s
          @m13 = 0
          @m21 = -s
          @m22 = c
          @m23 = 0
          @m31 = 0
          @m32 = 0
          @m33 = 1
        else    # bogus axis index
          throw new Error "'axis' must be specified 1, 2 or 3."
    else
      # Compute 1 - cos(theta) and some common subexpressions
      a = 1 - c
      ax = a * axis.x
      ay = a * axis.y
      az = a * axis.z
      # Set the matrix elements.  There is still a little more
      # opportunity for optimization due to the many common
      # subexpressions.  We'll let the compiler handle that...
      @m11 = ax * axis.x + c
      @m12 = ax * axis.y + axis.z * s
      @m13 = ax * axis.z - axis.y * s
      @m21 = ay * axis.x - axis.z * s
      @m22 = ay * axis.y + c
      @m23 = ay * axis.z + axis.x * s
      @m31 = az * axis.x + axis.y * s
      @m32 = az * axis.y - axis.x * s
      @m33 = az * axis.z + c
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # fromQuaternion(q:*Quaternion*):*void*
  # Setup the matrix to perform a rotation, given the angular displacement
  # in quaternion form.
  # The translation portion is reset.
  fromQuaternion:(q)->
    # Compute a few values to optimize common subexpressions
    ww = 2 * q.w
    xx = 2 * q.x
    yy = 2 * q.y
    zz = 2 * q.z
    # Set the matrix elements.
    wwx = ww * q.x
    wwy = ww * q.y
    wwz = ww * q.z
    xxx = xx * q.x
    xxy = xx * q.y
    xxz = xx * q.z
    yyy = yy * q.y
    yyz = yy * q.z
    zzz = yy * q.z
    @m11 = 1 - yyy - zzz
    @m12 = xxy + wwz
    @m13 = xxz - wwy
    @m21 = xxy - wwz
    @m22 = 1 - xxx - zzz
    @m23 = yyz + wwx
    @m31 = xxz + wwy
    @m32 = yyz - wwx
    @m33 = 1 - xxx - yyy
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # setupScale(v:Number):*void*
  # Setup the matrix to perform scale on each axis.  For uniform scale by k,
  # use a vector of the form Vector(k,k,k)
  # The translation portion is reset.
  setupScale:(v)->
    # Set the matrix elements.  Pretty straightforward
    @m11 = s.x
    @m12 = 0
    @m13 = 0
    @m21 = 0
    @m22 = s.y
    @m23 = 0
    @m31 = 0
    @m32 = 0
    @m33 = s.z
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # ## setupScaleAlongAxis(axis:*int*, x:*Number*):*void*
  # Setup the matrix to perform scale along an arbitrary axis.
  # The axis is specified using a unit vector.
  # The translation portion is reset.
  setupScaleAlongAxis:(axis, x)->
    # Quick sanity check to make sure they passed in a unit vector
    # to specify the axis
    unless abs(Vector.magnitudeSquared(axis) - 1) < 0.01
      throw new TypeError "'axis' must be specified a unit vector."
    # Compute k-1 and some common subexpressions
    a = k - 1
    ax = a * axis.x
    ay = a * axis.y
    az = a * axis.z
    # Fill in the matrix elements.  We'll do the common
    # subexpression optimization ourselves here, since diagonally
    # opposite matrix elements are equal
    @m11 = ax * axis.x + 1
    @m22 = ay * axis.y + 1
    @m33 = az * axis.z + 1
    @m21 = @m21 = ax * axis.y
    @m13 = @m31 = ax * axis.z
    @m23 = @m32 = ay * axis.z
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # setupShear(axis:*int*, s:*Number*, t:*Number*):*void*
  # Setup the matrix to perform a shear
  # The type of shear is specified by the 1-based "axis" index.  The effect
  # of transforming a point by the matrix is described by the pseudocode
  # below:
  #	axis == 1  =>  y += s*x, z += t*x
  #	axis == 2  =>  x += s*y, z += t*y
  #	axis == 3  =>  x += s*z, y += t*z
  # The translation portion is reset.
  setupShear:(axis, s, t)->
    # Check which type of shear they want
    switch axis
      when 1  # Shear y and z using x
        @m11 = 1
        @m12 = s
        @m13 = t
        @m21 = 0
        @m22 = 1
        @m23 = 0
        @m31 = 0
        @m32 = 0
        @m33 = 1
      when 2  # Shear x and z using y
        @m11 = 1
        @m12 = 0
        @m13 = 0
        @m21 = s
        @m22 = 1
        @m23 = t
        @m31 = 0
        @m32 = 0
        @m33 = 1
      when 3  # Shear x and y using z
        @m11 = 1
        @m12 = 0
        @m13 = 0
        @m21 = 0
        @m22 = 1
        @m23 = 0
        @m31 = s
        @m32 = t
        @m33 = 1
      else    # bogus axis index
        throw new TypeError "axis must be specified 1, 2 or 3."
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # setupProject(n:*Number*):*void*
  # Setup the matrix to perform a projection onto a plane passing
  # through the origin.  The plane is perpendicular to the
  # unit vector n.
  setupProject:(n)->
    # Quick sanity check to make sure they passed in a unit vector
    # to specify the axis
    unless abs(Vector.magnitudeSquared(n) - 1) < 0.1
      throw new TypeError "'n' must be specified a unit vector."
    # Fill in the matrix elements.  We'll do the common
    # subexpression optimization ourselves here, since diagonally
    # opposite matrix elements are equal
    @m11 = 1 - n.x * n.x
    @m22 = 1 - n.y * n.y
    @m33 = 1 - n.z * n.z
    @m12 = @m21 = -n.x * n.y
    @m13 = @m31 = -n.x * n.z
    @m23 = @m32 = -n.y * n.z
    # Reset the translation portion
    @tx = @ty = @tz = 0
    return

  # ## setupReflect(axis:*int*, k:*Number* = 0):*void*
  # Setup the matrix to perform a reflection about a plane parallel
  # to a cardinal plane.
  # axis is a 1-based index which specifies the plane to project about:
  #	1 => reflect about the plane x=k
  #	2 => reflect about the plane y=k
  #	3 => reflect about the plane z=k
  # The translation is set appropriately, since translation must occur if
  # k != 0
  #
  # ## setupReflect(axis:*Vector*, k:*Number* = 0):*void*
  # Setup the matrix to perform a reflection about an arbitrary plane
  # through the origin.  The unit vector n is perpendicular to the plane.
  # The translation portion is reset.
  setupReflect:(axis, k = 0)->
    unless axis instanceof Vector
      # Check which plane they want to reflect about
      switch axis
        when 1  # Reflect about the plane x=k
          @m11 = -1
          @m12 = 0
          @m13 = 0
          @m21 = 0
          @m22 = 1
          @m23 = 0
          @m31 = 0
          @m32 = 0
          @m33 = 1
          @tx = 2 * k
          @ty = 0
          @tz = 0
        when 2  # Reflect about the plane y=k
          @m11 = 1
          @m12 = 0
          @m13 = 0
          @m21 = 0
          @m22 = -1
          @m23 = 0
          @m31 = 0
          @m32 = 0
          @m33 = 1
          @tx = 0
          @ty = 2 * k
          @tz = 0
        when 2  # Reflect about the plane z=k
          @m11 = 1
          @m12 = 0
          @m13 = 0
          @m21 = 0
          @m22 = 1
          @m23 = 0
          @m31 = 0
          @m32 = 0
          @m33 = -1
          @tx = 0
          @ty = 0
          @tz = 2 * k
        else    # bogus axis index
          throw new TypeError "'axis' must be specified 1, 2 or 3."
    else
      n = axis
      # Quick sanity check to make sure they passed in a unit vector
      # to specify the axis
      unless abss(Vector.magnitudeSquared(n) - 1) < 0.01
        throw new TypeError "'n' must be specified a unit vector."
      # Compute common subexpressions
      ax = -2 * n.x
      ay = -2 * n.y
      az = -2 * n.z
      # Fill in the matrix elements.  We'll do the common
      # subexpression optimization ourselves here, since diagonally
      # opposite matrix elements are equal
      @m11 = 1 + ax * n.x
      @m22 = 1 + ay * n.y
      @m33 = 1 + az * n.z
      @m12 = @m21 = ax * n.y
      @m13 = @m31 = ax * n.z
      @m23 = @m32 = ay * n.z
      # Reset the translation portion
      @tx = @ty = @tz = 0
    return

  # ## getTranslation(m:*Matrix*):*Vector*
  # Return the translation row of the matrix in vector form
  getTranslation:(m)->
    new Vector m.tx, m.ty, m.tz

  # ## getPositionFromParentToLocalMatrix(m:*Matrix*):*Vector*
  # matrix (such as a world -> object matrix)
  # We assume that the matrix represents a rigid transformation.  (No scale,
  # skew, or mirroring)
  getPositionFromParentToLocalMatrix:(m)->
    # Multiply negative translation value by the
    # transpose of the 3x3 portion.  By using the transpose,
    # we assume that the matrix is orthogonal.  (This function
    # doesn't really make sense for non-rigid transformations...)
    new Vector(
      -(m.tx * m.m11 + m.ty * m.m12 + m.tz * m.m13)
      -(m.tx * m.m21 + m.ty * m.m22 + m.tz * m.m23)
      -(m.tx * m.m31 + m.ty * m.m32 + m.tz * m.m33)
      )

  # ## getPositionFromLocalToParentMatrix(m:*Matrix*):*Vector*
  # Extract the position of an object given a local -> parent transformation
  # matrix (such as an object -> world matrix)
  getPositionFromLocalToParentMatrix:(m)->
    # Position is simply the translation portion
    new Vector m.tx, m.ty, m.tz
