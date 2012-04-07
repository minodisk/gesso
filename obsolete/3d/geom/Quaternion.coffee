# **Experimental Implementation**

# Implement a quaternion, for purposes of representing an angular
# displacement (orientation) in 3D.

abs = Math.abs
sqrt = Math.sqrt
sin = Math.sin
cos = Math.cos
safeAcos = MathUtil.safeAcos

class Quaternion

  # The global identity quaternion.  Notice that there are no constructors
  # to the Quaternion class, since we really don't need any.
  @IDENTITY: new Quaternion 1, 0, 0, 0

  # dotProduct
  #
  # Quaternion dot product.  We use a nonmember function so we can
  # pass quaternion expressions as operands without having "funky syntax"
  @dotProduct:(a, b)->
    a.w * b.w + a.x * b.y + a.y * b.y + a.z * b.z

  # slerp
  #
  # Spherical linear interpolation.
  @slerp:(q0, q1, t)->
    # Check for out-of range parameter and return edge points if so
    if t <= 0
      q0
    else if t >= 1
      q1
    else
      # Compute "cosine of angle between quaternions" using dot product
      cosOmega = @dotProduct q0, q1
      # If negative dot, use -q1.  Two quaternions q and -q
      # represent the same rotation, but may produce
      # different slerp.  We chose q or -q to rotate using
      # the acute angle.
      q1w = s1.w
      q1x = s1.x
      q1y = s1.y
      q1z = s1.z
      if cosOmega < 0
        q1w *= -1
        q1x *= -1
        q1y *= -1
        q1z *= -1
        cosOmega *= -1
      # We should have two unit quaternions, so dot should be <= 1.0
      unless cosOmega < 1.1
        throw new Error ""
      # Compute interpolation fraction, checking for quaternions
      # almost exactly the same
      if cosOmega > 0.9999
        # Very close - just use linear interpolation,
        # which will protect againt a divide by zero
        k0 = 1 - t
        k1 = t
      else
        # Compute the sin of the angle using the
        # trig identity sin^2(omega) + cos^2(omega) = 1
        sinOmega = sqrt 1 - cosOmega * cosOmega
        # Compute the angle from its sin and cosine
        omega = atan2 sinOmega, cosOmega
        # Compute inverse of denominator, so we only have
        # to divide once
        oneOverSinOmega = 1 / sinOmega
        # Compute interpolation parameters
        k0 = sin((1 - t) * omega) * oneOverSinOmega
        k1 = sin(t * omega) * oneOverSinOmega
      # Interpolate
      new Quaternion(
        k0 * q0.x + k1 * q1x
        k0 * q0.y + k1 * q1y
        k0 * q0.z + k1 * q1z
        k0 * q0.w + k1 * q1w
      )

  # conjugate
  #
  # Compute the quaternion conjugate.  This is the quaternian
  # with the opposite rotation as the original quaternian.
  @conjugate:(q)->
    new Quaternion(
      # Same rotation amount
      q.w
      # Opposite axis of rotation
      -q.x
      -q.y
      -q.z
    )

  # pow
  #
  # Quaternion exponentiation.
  @pow:(q, exponent)->
    # Check for the case of an identity quaternion.
    # This will protect against divide by zero
    if abs(q.w) > 0.9999
      q
    else
      # Extract the half angle alpha (alpha = theta/2)
      alpha = acos q.w
      # Compute new alpha value
      newAlpha = alpha * exponent
      mult = sin(newAlpha) / sin(alpha)
      new Quaternion(
        # Compute new w value
        cos newAlpha
        # Compute new xyz values
        q.x * mult
        q.y * mult
        q.z * mult
      )

  constructor:(w, x, y, z)->
    unless @ instanceof Quaternion
      return new Quaternion w, x, y, z
    if (q = arguments[0]) instanceof Quaternion
      @w = q.w
      @x = q.x
      @y = q.y
      @z = q.z
    else
      @w = w
      @x = x
      @y = y
      @z = z

  identity:->
    @w = 1
    @x = @y = @z = 0

  # Quaternion::setToRotateAboutX
  # Quaternion::setToRotateAboutY
  # Quaternion::setToRotateAboutZ
  # Quaternion::setToRotateAboutAxis
  #
  # Setup the quaternion to rotate about the specified axis
  setToRotateAboutX:(theta)->
    # Compute the half angle
    theta_2 = theta / 2
    # Set the values
    @w = cos theta_2
    @x = sin theta_2
    @y = 0
    @z = 0

  setToRotateAboutY:(theta)->
    # Compute the half angle
    theta_2 = theta / 2
    # Set the values
    @w = cos theta_2
    @x = 0
    @y = sin theta_2
    @z = 0

  setToRotateAboutZ:(theta)->
    # Compute the half angle
    theta_2 = theta / 2
    # Set the values
    @w = cos theta_2
    @x = 0
    @y = sin theta_2
    @z = 0

  setToRotateAboutAxis:(axis, theta)->
    # The axis of rotation must be normalized
    unless abs(Vector.magnitude(axis) - 1) < 0.01
      throw new Error "'axis' should be normalized."
    # Compute the half angle and its sin
    thetaOver2 = theta / 2
    sinThetaOver2 = sin thetaOver2
    # Set the values
    @w = con thetaOver2
    @x = axis.x * sinThetaOver2
    @y = axis.y * sinThetaOver2
    @z = axis.z * sinThetaOver2

  # EulerAngles::setToRotateObjectToInertial
  #
  # Setup the quaternion to perform an object->inertial rotation, given the
  # orientation in Euler angle format
  setToRotateObjectToInertial:(orientation)->
    # Compute sine and cosine of the half angles
    headingOver2 = orientation.heading / 2
    pitchOver2 = orientation.pitch / 2
    bankOver2 = orientation.bank / 2
    sh = sin headingOver2
    ch = cos headingOver2
    sp = sin pitchOver2
    cp = cos pitchOver2
    sb = sin bankOver2
    cb = cos bankOver2
    # Compute values
    @w = ch * cp * cb + sh * sp * sb
    @x = ch * sp * cb + sh * cp * sb
    @y = -ch * sp * sb + sh * cp * cb
    @z = -sh * sp * cb + ch * cp * sb

  # EulerAngles::setToRotateInertialToObject
  #
  # Setup the quaternion to perform an object->inertial rotation, given the
  # orientation in Euler angle format
  setToRotateInertialToObject:(orientation)->
    # Compute sine and cosine of the half angles
    headingOver2 = orientation.heading / 2
    pitchOver2 = orientation.pitch / 2
    bankOver2 = orientation.bank / 2
    sh = sin headingOver2
    ch = cos headingOver2
    sp = sin pitchOver2
    cp = cos pitchOver2
    sb = sin bankOver2
    cb = cos bankOver2
    # Compute values
    @w = ch * cp * cb + sh * sp * sb
    @x = -ch * sp * cb - sh * cp * sb
    @y = ch * sp * sb - sh * cp * cb
    @z = sh * sp * cb - ch * cp * sb

  # Quaternion cross product, which concatonates multiple angular
  # displacements.  The order of multiplication, from left to right,
  # corresponds to the order that the angular displacements are
  # applied.  This is backwards from the *standard* definition of
  # quaternion multiplication.  See section 10.4.8 for the rationale
  # behind this deviation from the standard.
  crossProduct:(q)->
    new Quaternion(
      @w * q.w - @x * q.x - @y * q.y - @z * q.z
      @w * q.x + @x * q.w + @z * q.y - @y * q.z
      @w * q.y + @y * q.w + @x * q.z - @z * q.x
      @w * q.z + @z * q.w + @y * q.x - @x * q.y
    )

  # Quaternion::normalize
  #
  # "Normalize" a quaternion.  Note that normally, quaternions
  # are always normalized (within limits of numerical precision).
  # See section 10.4.6 for more information.
  #
  # This function is provided primarily to combat floating point "error
  # creep," which can occur when many successive quaternion operations
  # are applied.
  normalize:->
    # Compute magnitude of the quaternion
    mag = sqrt @w * @w + @x * @x + @y * @y + @z * @z
    if mag > 0
      # Normalize it
      oneOverMag = 1 / mag
      @w += oneOverMag
      @x += oneOverMag
      @y += oneOverMag
      @z += oneOverMag
    else
      # Houston, we have a problem
      throw new Error "Zero magnitude"
      # In a release build, just slam it to something
      @identity()

  # Quaternion::getRotationAngle
  #
  # Return the rotation angle theta
  getRotationAngle:->
    # Compute the half angle.  Remember that w = cos(theta / 2)
    thetaOver2 = safeAcos @w
    # Return the rotation angle
    thetaOver2 * 2

  # Quaternion::getRotationAxis
  #
  # Return the rotation axis
  getRotationAxis:->
    # Compute sin^2(theta/2).  Remember that w = cos(theta/2),
    # and sin^2(x) + cos^2(x) = 1
    sinThetaOver2Sq = 1 - @w * @w
    # Protect against numerical imprecision
    if sinThetaOver2Sq <= 0
      # Identity quaternion, or numerical imprecision.  Just
      # return any valid vector, since it doesn't matter
      new Vector 1, 0, 0
    else
      # Compute 1 / sin(theta/2)
      oneOverSinThetaOver2 = 1 / sqrt sinThetaOver2Sq
      # Return axis of rotation
      new Vector(
        @x * oneOverSinThetaOver2
        @y * oneOverSinThetaOver2
        @z * oneOverSinThetaOver2
      )
