PI = Math.PI
abs = Math.abs
max = Math.max
min = Math.min
random = Math.random
acos = Math.acos

module.exports = class MathUtil

  @DPR :180 / PI
  @RPD :PI / 180
  @PI  :PI
  @PI2 :PI * 2
  @PI_2:PI / 2
  @_PI :1 / PI
  @_PI2:1 / @PI2

  @degToRad:(degree)->
    degree * @RPD

  @wrapPi:(theta)->
    theta += @PI
    theta -= (theta * @_PI2 >> 0) * @PI2
    theta -= @PI
    theta

  @safeAcos:(x)->
    if x <= -1
      @PI
    else if x >= 1
      0
    else
      acos x

  @nearestIn:(num, nums) ->
    compared = []
    compared.push(abs(n - num)) for n in nums
    nums[compared.indexOf(min.apply(null, compared))]

  @randomBetween:(a, b) ->
    a + (b - a) * random()

  @convergeBetween:(num, a, b) ->
    min = min(a, b)
    max = max(a, b)
    if num < min then min else if num > max then max else num
