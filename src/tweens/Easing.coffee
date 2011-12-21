# **Package:** *tweens*<br/>
# **Inheritance:** *Object* → *Easing*<br/>
# **Subclasses:** -
#
# The definition of easing types.<br/>
# You can access this module by doing:<br/>
# `require('tweens/Easing')`

_PI = Math.PI
_PI_2 = _PI * 2
_PI_1_2 = _PI / 2
_abs = Math.abs
_pow = Math.pow
_sqrt = Math.sqrt
_sin = Math.sin
_cos = Math.cos
_asin = Math.asin

module.exports = class Easing

# t: current time
# b: begin value
# c: change value
# d: duration
  @linear:(t, b, c, d)->
    c * t / d + b

  @easeInQuad:(t, b, c, d)->
    t /= d
    c * t * t + b

  @easeOutQuad:(t, b, c, d)->
    t /= d
    -c * t * (t - 2) + b

  @easeInOutQuad:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      c / 2 * t * t + b
    else
      t--
      -c / 2 * (t * (t - 2) - 1) + b

  @easeOutInQuad:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      -c / 2 * t * (t - 2) + b
    else
      t--
      c / 2 * (t * t + 1) + b

  @easeInCubic:(t, b, c, d)->
    t /= d
    c * t * t * t + b

  @easeOutCubic:(t, b, c, d)->
    t = t / d - 1
    c * (t * t * t + 1) + b

  @easeInOutCubic:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      c / 2 * t * t * t + b
    else
      t -= 2
      c / 2 * (t * t * t + 2) + b

  @easeOutInCubic:(t, b, c, d)->
    t = t * 2 / d - 1
    c / 2 * (t * t * t + 1) + b

  @easeInQuart:(t, b, c, d)->
    t /= d
    c * t * t * t * t + b

  @easeOutQuart:(t, b, c, d)->
    t = t / d - 1
    -c * (t * t * t * t - 1) + b

  @easeInOutQuart:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      c / 2 * t * t * t * t + b
    else
      t -= 2
      -c / 2 * (t * t * t * t - 2) + b

  @easeOutInQuart:(t, b, c, d)->
    t = t * 2 / d - 1
    if t < 0
      -c / 2 * (t * t * t * t - 1) + b
    else
      c / 2 * (t * t * t * t + 1) + b

  @easeInQuint:(t, b, c, d)->
    t /= d
    c * t * t * t * t * t + b

  @easeOutQuint:(t, b, c, d)->
    t = t / d - 1
    c * (t * t * t * t * t + 1) + b

  @easeInOutQuint:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      c / 2 * t * t * t * t * t + b
    else
      t -= 2
      c / 2 * (t * t * t * t * t + 2) + b

  @easeOutInQuint:(t, b, c, d)->
    t = t * 2 / d - 1
    c / 2 * (t * t * t * t * t + 1) + b

  @easeInExpo:(t, b, c, d)->
    c * _pow(2, 10 * (t / d - 1)) + b

  @easeOutExpo:(t, b, c, d)->
    c * (1 - _pow(2, -10 * t / d)) + b

  @easeInOutExpo:(t, b, c, d)->
    t = t * 2 / d - 1
    if t < 0
      c / 2 * _pow(2, 10 * t) + b
    else
      c / 2 * (2 - _pow(2, -10 * t)) + b

  @easeOutInExpo:(t, b, c, d)->
    t *= 2 / d
    if t is 1
      c / 2 + b
    else if t < 1
      c / 2 * (1 - _pow(2, -10 * t)) + b
    else
      c / 2 * (1 + _pow(2, 10 * (t - 2))) + b

  @easeInSine:(t, b, c, d)->
    -c * (_cos(t / d * _PI_1_2) - 1) + b

  @easeOutSine:(t, b, c, d)->
    c * _sin(t / d * _PI_1_2) + b

  @easeInOutSine:(t, b, c, d)->
    -c / 2 * (_cos(_PI * t / d) - 1) + b

  @easeOutInSine:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      c / 2 * _sin(t * _PI_1_2) + b
    else
      -c / 2 * (_cos((t - 1) * _PI_1_2) - 2) + b

  @easeInCirc:(t, b, c, d)->
    t /= d
    -c * (_sqrt(1 - t * t) - 1) + b

  @easeOutCirc:(t, b, c, d)->
    t = t / d - 1
    c * _sqrt(1 - t * t) + b

  @easeInOutCirc:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      -c / 2 * (_sqrt(1 - t * t) - 1) + b
    else
      t -= 2
      c / 2 * (_sqrt(1 - t * t) + 1) + b

  @easeOutInCirc:(t, b, c, d)->
    t = t * 2 / d - 1
    if t < 0
      c / 2 * _sqrt(1 - t * t) + b
    else
      -c / 2 * (_sqrt(1 - t * t) - 2) + b

  @easeInBackWith:(s = 1.70158)->
    (t, b, c, d)->
      _s = s
      t /= d
      c * t * t * ((_s + 1) * t - _s) + b
  @easeInBack:Easing.easeInBackWith()

  @easeOutBackWith:(s = 1.70158)->
    (t, b, c, d)->
      _s = s
      t = t / d - 1
      c * (t * t * ((_s + 1) * t + _s) + 1) + b
  @easeOutBack:@easeOutBackWith()

  @easeInOutBackWith:(s = 1.70158)->
    (t, b, c, d)->
      _s = s * 1.525
      t *= 2 / d
      if t < 1
        c / 2 * (t * t * ((_s + 1) * t - _s)) + b
      else
        t -= 2
        c / 2 * (t * t * ((_s + 1) * t + _s) + 2) + b
  @easeInOutBack:@easeInOutBackWith()

  @easeOutInBackWith:(s = 1.70158)->
    (t, b, c, d)->
      _s = s
      t = t * 2 / d - 1
      if t < 0
        c / 2 * (t * t * ((_s + 1) * t + _s) + 1) + b
      else
        c / 2 * (t * t * ((_s + 1) * t - _s) + 1) + b
  @easeOutInBack:@easeOutInBackWith()

  @easeInBounce:(t, b, c, d)->
    t = 1 - t / d
    if t < 0.36363636363636365   # 4 / 11
      -c * (7.5625 * t * t - 1) + b
    else if t < 0.7272727272727273   # 8 / 11
      t -= 0.5454545454545454   # 6 / 11
      -c * (7.5625 * t * t - 0.25) + b
    else if t < 0.9090909090909091   # 10 / 11
      t -= 0.8181818181818182   # 9 / 11
      -c * (7.5625 * t * t  - 0.0625) + b
    else
      t -= 0.9545454545454546   # 10.5 / 11
      -c * (7.5625 * t * t - 0.015625) + b

  @easeOutBounce:(t, b, c, d)->
    t /= d
    if t < 0.36363636363636365   # 4 / 11
      c * (7.5625 * t * t) + b
    else if t < 0.7272727272727273   # 8 / 11
      t -= 0.5454545454545454   # 6 / 11
      c * (7.5625 * t * t + 0.75) + b
    else if t < 0.9090909090909091   # 10 / 11
      t -= 0.8181818181818182   # 9 / 11
      c * (7.5625 * t * t + 0.9375) + b
    else
      t -= 0.9545454545454546   # 10.5 / 11
      c * (7.5625 * t * t + 0.984375) + b

  @easeInOutBounce:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      t = 1 - t
      if t < 0.36363636363636365   # 4 / 11
        -c / 2 * (7.5625 * t * t - 1) + b
      else if t < 0.7272727272727273   # 8 / 11
        t -= 0.5454545454545454   # 6 / 11
        -c / 2 * (7.5625 * t * t - 0.25) + b
      else if t < 0.9090909090909091   # 10 / 11
        t -= 0.8181818181818182   # 9 / 11
        -c / 2 * (7.5625 * t * t - 0.0625) + b
      else
        t -= 0.9545454545454546   # 10.5 / 11
        -c / 2 * (7.5625 * t * t - 0.015625) + b
    else
      t -= 1
      if t < 0.36363636363636365   # 4 / 11
        c / 2 * (7.5625 * t * t + 1) + b
      else if t < 0.7272727272727273   # 8 / 11
        t -= 0.5454545454545454   # 6 / 11
        c / 2 * (7.5625 * t * t + 1.75) + b
      else if t < 0.9090909090909091   # 10 / 11
        t -= 0.8181818181818182   # 9 / 11
        c / 2 * (7.5625 * t * t + 1.9375) + b
      else
        t -= 0.9545454545454546   # 10.5 / 11
        c / 2 * (7.5625 * t * t + 1.984375) + b


  @easeOutInBounce:(t, b, c, d)->
    t *= 2 / d
    if t < 1
      if t < 0.36363636363636365   # 4 / 11
        c / 2 * (7.5625 * t * t) + b
      else if t < 0.7272727272727273   # 8 / 11
        t -= 0.5454545454545454   # 6 / 11
        c / 2 * (7.5625 * t * t + 0.75) + b
      else if t < 0.9090909090909091   # 10 / 11
        t -= 0.8181818181818182   # 9 / 11
        c / 2 * (7.5625 * t * t + 0.9375) + b
      else
        t -= 0.9545454545454546   # 10.5 / 11
        c / 2 * (7.5625 * t * t + 0.984375) + b
    else
      t = 2 - t
      if t < 0.36363636363636365   # 4 / 11
        -c / 2 * (7.5625 * t * t - 2) + b
      else if t < 0.7272727272727273   # 8 / 11
        t -= 0.5454545454545454   # 6 / 11
        -c / 2 * (7.5625 * t * t - 1.25) + b
      else if t < 0.9090909090909091   # 10 / 11
        t -= 0.8181818181818182   # 9 / 11
        -c / 2 * (7.5625 * t * t - 1.0625) + b
      else
        t -= 0.9545454545454546   # 10.5 / 11
        -c / 2 * (7.5625 * t * t - 1.015625) + b

  @easeInElasticWith:(a = 0, p = 0)->
    (t, b, c, d)->
      _a = a
      _p = p
      t = t / d - 1
      if _p is 0
        _p = d * 0.3
      if _a is 0 or _a < _abs(c)
        _a = c
        s = _p / 4
      else
        s = _p / _PI_2 * _asin(c / _a)
      -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b
  @easeInElastic:@easeInElasticWith()

  @easeOutElasticWith:(a = 0, p = 0)->
    (t, b, c, d)->
      _a = a
      _p = p
      t /= d
      if _p is 0
        _p = d * 0.3
      if _a is 0 or _a < _abs(c)
        _a = c
        s = _p / 4
      else
        s = _p / _PI_2 * _asin(c / _a)
      _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c
  @easeOutElastic:@easeOutElasticWith()

  @easeInOutElasticWith:(a = 0, p = 0)->
    (t, b, c, d)->
      _a = a
      _p = p
      t = t * 2 / d - 1
      if _p is 0
        _p = d * 0.45
      if _a is 0 or _a < _abs(c)
        _a = c
        s = _p / 4
      else
        s = _p / _PI_2 * _asin(c / _a)
      if t < 0
        -_a / 2 * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b
      else
        _a / 2 * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c
  @easeInOutElastic:@easeInOutElasticWith()

  @easeOutInElasticWith:(a = 0, p = 0)->
    (t, b, c, d)->
      _a = a
      _p = p
      t = t * 2 / d
      c /= 2
      if _p is 0
        _p = d * 0.3
      if _a is 0 or _a < _abs(c)
        _a = c
        s = _p / 4
      else
        s = _p / _PI_2 * _asin(c / _a)
      if t < 1
        _a * _pow(2, -10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c
      else
        t -= 2
        -_a * _pow(2, 10 * t) * _sin((t * d - s) * _PI_2 / _p) + b + c
  @easeOutInElastic:@easeOutInElasticWith()

