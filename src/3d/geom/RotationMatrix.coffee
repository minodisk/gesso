# **Experimental Implementation**

# Implement a simple 3x3 matrix that is used for ROTATION ONLY.  The
# matrix is assumed to be orthogonal.  The direction of transformation
# is specified at the time of transformation.
#
# MATRIX ORGANIZATION
#
# A user of this class should rarely care how the matrix is organized.
# However, it is of course important that internally we keep everything
# straight.
#
# The matrix is assumed to be a rotation matrix only, and therefore
# orthoganal.  The "forward" direction of transformation (if that really
# even applies in this case) will be from inertial to object space.
# To perform an object->inertial rotation, we will multiply by the
# transpose.
#
# In other words:
#
# Inertial to object:
#
#                  | m11 m12 m13 |
#     [ ix iy iz ] | m21 m22 m23 | = [ ox oy oz ]
#                  | m31 m32 m33 |
#
# Object to inertial:
#
#                  | m11 m21 m31 |
#     [ ox oy oz ] | m12 m22 m32 | = [ ix iy iz ]
#                  | m13 m23 m33 |
#
# Or, using column vector notation:
#
# Inertial to object:
#
#     | m11 m21 m31 | | ix |   | ox |
#     | m12 m22 m32 | | iy | = | oy |
#     | m13 m23 m33 | | iz |   | oz |
#
# Object to inertial:
#
#     | m11 m12 m13 | | ox |   | ix |
#     | m21 m22 m23 | | oy | = | iy |
#     | m31 m32 m33 | | oz |   | iz |

Vector = require '3d/geom/Vector'

sin = Math.sin
cos = Math.cos

module.exports = class RotationMatrix

  constructor:(m11, m12, m13, m21, m22, m23, m31, m32, m33)->
    unless @ instanceof RotationMatrix
      return new RotationMatrix m11, m12, m13, m21, m22, m23, m31, m32, m33
    if (m = arguments[0]) instanceof RotationMatrix
      @m11 = m.m11
      @m12 = m.m12
      @m13 = m.m13
      @m21 = m.m21
      @m22 = m.m22
      @m23 = m.m23
      @m31 = m.m31
      @m32 = m.m32
      @m33 = m.m33
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

  # RotationMatrix::identity
  #
  # Set the matrix to the identity matrix
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
    return

  # RotationMatrix::setup
  #
  # Setup the matrix with the specified orientation
  setup:(orientation)->
    # Fetch sine and cosine of angles
    sh = sin orientation.heading
    ch = cos orientation.heading
    sp = sin orientation.pitch
    cp = cos orientation.pitch
    sb = sin orientation.bank
    cb = cos orientation.bank
    # Fill in the matrix elements
    @m11 = ch * cb + sh * sp * sb
    @m12 = -ch * sb + sh * sp * cb
    @m13 = sh * cp
    @m21 = sb * cp
    @m22 = cb * cp
    @m23 = -sp
    @m31 = -sh * cb + ch * sp * sb
    @m32 = sb * sh + ch * sp * cb
    @m33 = ch * cp
    return

  # RotationMatrix::fromInertialToObjectQuaternion
  #
  # Setup the matrix, given a quaternion that performs an inertial->object
  # rotation
  fromInertialToObjectQuaternion:(q)->
    # Fill in the matrix elements.
    wx = q.w * q.x
    wy = q.w * q.y
    wz = q.w * q.z
    xx = q.x * q.x
    xy = q.x * q.y
    xz = q.x * q.z
    yy = q.y * q.y
    yz = q.y * q.z
    zz = q.z * q.z
    @m11 = 1 - 2 * (yy + zz)
    @m12 = 2 * (xy + wz)
    @m13 = 2 * (xz - wy)
    @m21 = 2 * (xy - wz)
    @m22 = 1 - 2 * (xx + zz)
    @m23 = 2 * (yz + wx)
    @m31 = 2 * (xz + wy)
    @m32 = 2 * (yz - wx)
    @m33 = 1 - 2 * (xx + yy)
    return

  # RotationMatrix::fromObjectToInertialQuaternion
  #
  # Setup the matrix, given a quaternion that performs an object->inertial
  # rotation
  fromObjectToInertialQuaternion:(q)->
    # Fill in the matrix elements.
    wx = q.w * q.x
    wy = q.w * q.y
    wz = q.w * q.z
    xx = q.x * q.x
    xy = q.x * q.y
    xz = q.x * q.z
    yy = q.y * q.y
    yz = q.y * q.z
    zz = q.z * q.z
    @m11 = 1 - 2 * (yy + zz)
    @m12 = 2 * (xy - wz)
    @m13 = 2 * (xz + wy)
    @m21 = 2 * (xy + wz)
    @m22 = 1 - 2 * (xx + zz)
    @m23 = 2 * (yz - wx)
    @m31 = 2 * (xz - wy)
    @m32 = 2 * (yz + wx)
    @m33 = 1 - 2 * (xx + yy)
    return

  # inertialToObject(v:*Vector*):*Vector*
  # Rotate a vector from inertial to object space
  inertialToObject:(v)->
    # Perform the matrix multiplication in the "standard" way.
    new Vector(
      @m11 * v.x + @m21 * v.y + @m31 * v.z
      @m12 * v.x + @m22 * v.y + @m32 * v.z
      @m13 * v.x + @m23 * v.y + @m33 * v.z
      )

  # objectToInertial(v:*Vector*):*Vector*
  # Rotate a vector from object to inertial space
  objectToInertial:(v)->
    # Multiply by the transpose
    new Vector(
      @m11 * v.x + @m12 * v.y + @m13 * v.z
      @m21 * v.x + @m22 * v.y + @m23 * v.z
      @m31 * v.x + @m32 * v.y + @m33 * v.z
      )
