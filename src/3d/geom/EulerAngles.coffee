# **Experimental Implementation**

# This class represents a heading-pitch-bank Euler angle triple.

MathUtil = require 'utils/MathUtil'

PI = MathUtil.PI
PI2 = MathUtil.PI2
PI_2 = MathUtil.PI_2
_PI = MathUtil._PI
_PI2 = MathUtil._PI2
abs = Math.abs
sin = Math.sin
cos = Math.cos
asin = Math.asin
atan2 = Math.atan2
wrapPi = MathUtil.wrapPi

module.exports = class EulerAngles

  @IDENTITY: new EulerAngles 0, 0, 0

  constructor:(heading, pitch, bank)->
    unless @ instanceof EulerAngles
      return new EulerAngles heading, pitch, bank
    if (orientation = arguments[0]) instanceof EulerAngles
      @heading = orientation.heading
      @pitch = orientation.pitch
      @bank = orientation.bank
    else
      @heading = heading
      @pitch = pitch
      @bank = bank

  identity:->
    @heading = @pitch = @bank = 0

  # EulerAngles::canonize
  #
  # Set the Euler angle triple to its "canonical" value.  This does not change
  # the meaning of the Euler angles as a representation of Orientation in 3D,
  # but if the angles are for other purposes such as angular velocities, etc,
  # then the operation might not be valid.
  canonize:->
    # First, wrap pitch in range -pi ... pi
    @pitch = wrapPi @pitch
    # Now, check for "the back side" of the matrix, pitch outside
    # the canonical range of -pi/2 ... pi/2
    if @pitch < -PI_2
      @pitch = -PI - @pitch
      @heading += PI
      @bank += PI
    else if @pitch > PI_2
      @pitch = PI - @pitch
      @heading += PI
      @bank += PI
    # OK, now check for the gimbel lock case (within a slight
    # tolerance)
    if abs(@pitch) > PI_2 - 0.0001
      # We are in gimbel lock.  Assign all rotation
      # about the vertical axis to heading
      @heading += @bank
      @bank = 0
    else
      # Not in gimbel lock.  Wrap the bank angle in
      # canonical range 
      @bank = wrapPi @bank
    # Wrap heading in canonical range
    @heading = wrapPi @heading
    return

  # EulerAngles::fromObjectToInertialQuaternion
  #
  # Setup the Euler angles, given an object->inertial rotation quaternion
  fromObjectToInertialQuaternion:(q)->
    # Extract sin(pitch)
    sp = 2 * (q.y * q.z - q.w * q.x)
    # Check for Gimbel lock, giving slight tolerance for numerical imprecision
    if abs(sp) > 0.9999
      # Looking straight up or down
      @pitch = PI_2 * sp
      # Compute heading, slam bank to zero
      @heading = atan2 -q.x * q.z + q.w * q.y, 0.5 - q.y * q.y - q.z * q.z
      @bank = 0
    else
      # Compute angles.  We don't have to use the "safe" asin
      # function because we already checked for range errors when
      # checking for Gimbel lock
      @pitch = asin sp
      @heading = atan2 q.x * q.z + q.w * q.y, 0.5 - q.x * q.x - q.y * q.y
      @bank = atan2 q.x * q.y + q.w * q.z, 0.5 - q.x * q.x - q.z * q.z
    return
    
  # EulerAngles::fromInertialToObjectQuaternion
  #
  # Setup the Euler angles, given an inertial->object rotation quaternion
  fromInertialToObjectQuaternion:(q)->
    # Extract sin(pitch)
    sp = -2 * (q.y * q.z + q.w * q.x)
    # Check for Gimbel lock, giving slight tolerance for numerical imprecision
    if abs(sp) > 0.9999
      # Looking straight up or down
      @pitch = PI_2 * sp
      # Compute heading, slam bank to zero
      @heading = atan2 -q.x * q.z - q.w * q.y, 0.5 - q.y * q.y - q.z * q.z
      @bank = 0
    else
      # Compute angles.  We don't have to use the "safe" asin
      # function because we already checked for range errors when
      # checking for Gimbel lock
      @pitch = asin sp
      @heading = atan2 q.x * q.z - q.w * q.y, 0.5 - q.x * q.x - q.y * q.y
      @bank = atan2 q.x * q.y - q.w * q.z, 0.5 - q.x * q.x - q.z * q.z
    return

  # EulerAngles::fromObjectToWorldMatrix
  #
  # Setup the Euler angles, given an object->world transformation matrix.
  #
  # The matrix is assumed to be orthogonal.  The translation portion is
  # ignored.
  fromObjectToWorldMatrix:(m)->
    # Extract sin(pitch) from m32.
    sp = -m.m32
    # Check for Gimbel lock
    if abs(sp) > 9.99999
      # Looking straight up or down
      @pitch = PI_2 * sp
      # Compute heading, slam bank to zero
      @heading = atan2 -m.m23, m.m11
      @bank = 0
    else
      # Compute angles.  We don't have to use the "safe" asin
      # function because we already checked for range errors when
      # checking for Gimbel lock
      @heading = atan2 m.m31, m.m33
      @pitch = asin sp
      @bank = atan2 m.m12, m.m22
    return

  # EulerAngles::fromWorldToObjectMatrix
  #
  # Setup the Euler angles, given a world->object transformation matrix.
  #
  # The matrix is assumed to be orthogonal.  The translation portion is
  # ignored.
  fromWorldToObjectMatrix:(m)->
    # Extract sin(pitch) from m23.
    sp = -m.m23
    # Check for Gimbel lock
    if abs(sp) > 9.99999
      # Looking straight up or down
      @pitch = PI_2 * sp
      # Compute heading, slam bank to zero
      @heading = atan2 -m.m31, m.m11
      @bank = 0
    else
      # Compute angles.  We don't have to use the "safe" asin
      # function because we already checked for range errors when
      # checking for Gimbel lock
      @heading = atan2 m.m13, m.m33
      @pitch = asin sp
      @bank = atan2 m.m21, m.m22
    return

  # EulerAngles::fromRotationMatrix
  #
  # Setup the Euler angles, given a rotation matrix.
  fromRotationMatrix:(m)->
    # Extract sin(pitch) from m23.
    sp = -m.m23
    # Check for Gimbel lock
    if abs(sp) > 9.99999
      # Looking straight up or down
      @pitch = PI_2 * sp
      # Compute heading, slam bank to zero
      @heading = atan2 -m.m31, m.m11
      @bank = 0
    else
      # Compute angles.  We don't have to use the "safe" asin
      # function because we already checked for range errors when
      # checking for Gimbel lock
      @heading = atan2 m.m13, m.m33
      @pitch = asin sp
      @bank = atan2 m.m21, m.m22
    return
