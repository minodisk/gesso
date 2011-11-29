# **Package:** *tweens*<br/>
# **Inheritance:** *Object* → *Easing*<br/>
# **Subclasses:** -
#
# Easing curve definition.<br/>
# see [EasingCurve](EasingCurve.html)<br/>
# You can access this module by doing:<br/>
# `require('tweens/Easing')`

module.exports = class Easing

# t: current time
# b: begin value
# c: change value
# d: duration
  @linear:(t, b, c, d) ->
    c * t / d + b

  @easeInQuad:(t, b, c, d) ->
    c * (t /= d) * t + b

  @easeOutQuad:(t, b, c, d) ->
    -c * (t /= d) * (t - 2) + b

  @easeInOutQuad:(t, b, c, d) ->
    if (t /= d / 2) < 1
      c / 2 * t * t + b
    else
      -c / 2 * ((--t) * (t - 2) - 1) + b

  @easeOutInQuad:(t, b, c, d) ->
    if t < d / 2
      -(c / 2) * (t = (t * 2 / d)) * (t - 2) + b
    else
      (c / 2) * (t = (t * 2 - d) / d) * t + (b + c / 2)

  @easeInCubic:(t, b, c, d) ->
    c * (t /= d) * t * t + b

  @easeOutCubic:(t, b, c, d) ->
    c * ((t = t / d - 1) * t * t + 1) + b

  @easeInOutCubic:(t, b, c, d) ->
    if (t /= d / 2) < 1
      c / 2 * t * t * t + b
    else
      c / 2 * ((t -= 2) * t * t + 2) + b

  @easeOutInCubic:(t, b, c, d) ->
    if t < d / 2
      c / 2 * ((t = t * 2 / d - 1) * t * t + 1) + b
    else
      c / 2 * (t = (t * 2 - d) / d) * t * t + b + c / 2

  @easeInQuart:(t, b, c, d) ->
    return c * (t /= d) * t * t * t + b

  @easeOutQuart:(t, b, c, d) ->
    return -c * ((t = t / d - 1) * t * t * t - 1) + b

  @easeInOutQuart:(t, b, c, d) ->
    if (t /= d / 2) < 1
      c / 2 * t * t * t * t + b
    else
      -c / 2 * ((t -= 2) * t * t * t - 2) + b

  @easeOutInQuart:(t, b, c, d) ->
    if t < d / 2
      -(c / 2) * ((t = (t * 2) / d - 1) * t * t * t - 1) + b
    else
      (c / 2) * (t = (t * 2 - d) / d) * t * t * t + (b + c / 2)

  @easeInQuint:(t, b, c, d) ->
    c * (t /= d) * t * t * t * t + b

  @easeOutQuint:(t, b, c, d) ->
    c * ((t = t / d - 1) * t * t * t * t + 1) + b

  @easeInOutQuint:(t, b, c, d) ->
    if (t /= d / 2) < 1
      c / 2 * t * t * t * t * t + b
    else
      c / 2 * ((t -= 2) * t * t * t * t + 2) + b

  @easeOutInQuint:(t, b, c, d) ->
    if t < d / 2
      (c / 2) * ((t = (t * 2) / d - 1) * t * t * t * t + 1) + b
    else
      (c / 2) * (t = (t * 2 - d) / d) * t * t * t * t + (b + c / 2)

  @easeInExpo:(t, b, c, d) ->
    if t is 0
      b
    else
      c * Math.pow(2, 10 * (t / d - 1)) + b

  @easeOutExpo:(t, b, c, d) ->
    if t is d
      b + c
    else
      c * (1 - Math.pow(2, -10 * t / d)) + b

  @easeInOutExpo:(t, b, c, d) ->
    if t is 0
      b
    else if t is d
      b + c
    else if (t /= d / 2.0) < 1.0
      c / 2 * Math.pow(2, 10 * (t - 1)) + b
    else
      c / 2 * (2 - Math.pow(2, -10 * --t)) + b

  @easeOutInExpo:(t, b, c, d) ->
    if t < d / 2
      if t * 2 is d
        b + c / 2
      else
        c / 2 * (1 - Math.pow(2, -10 * t * 2 / d)) + b
    else
      if t * 2 - d is 0
        b + c / 2
      else
        c / 2 * Math.pow(2, 10 * ((t * 2 - d) / d - 1)) + b + c / 2

  @easeInCirc:(t, b, c, d) ->
    -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b

  @easeOutCirc:(t, b, c, d) ->
    c * Math.sqrt(1 - (t = t / d - 1) * t) + b

  @easeInOutCirc:(t, b, c, d) ->
    if (t /= d / 2) < 1
      -c / 2 * (Math.sqrt(1 - t * t) - 1) + b
    else
      c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b

  @easeOutInCirc:(t, b, c, d) ->
    if t < d / 2
      (c / 2) * Math.sqrt(1 - (t = (t * 2) / d - 1) * t) + b
    else
      -(c / 2) * (Math.sqrt(1 - (t = (t * 2 - d) / d) * t) - 1) + (b + c / 2)

  @easeInSine:(t, b, c, d) ->
    -c * Math.cos(t / d * (Math.PI / 2)) + c + b

  @easeOutSine:(t, b, c, d) ->
    c * Math.sin(t / d * (Math.PI / 2)) + b

  @easeInOutSine:(t, b, c, d) ->
    -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b

  @easeOutInSine:(t, b, c, d) ->
    if t < d / 2
      (c / 2) * Math.sin((t * 2) / d * (Math.PI / 2)) + b
    else
      -(c / 2) * Math.cos((t * 2 - d) / d * (Math.PI / 2)) + (c / 2) + (b + c / 2)

  @easeInBackWith:(s = 1.70158) ->
    (t, b, c, d) ->
      c * (t /= d) * t * ((s + 1) * t - s) + b
  @easeInBack    :Easing.easeInBackWith()

  @easeOutBackWith:(s = 1.70158) ->
    (t, b, c, d) ->
      c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
  @easeOutBack    :@easeOutBackWith()

  @easeInOutBackWith:(s = 1.70158) ->
    (t, b, c, d) ->
      if ((t /= d / 2) < 1)
        return c / 2 * (t * t * (((s * 1.525) + 1) * t - s * 1.525)) + b

      return c / 2 * ((t -= 2) * t * (((s * 1.525) + 1) * t + s * 1.525) + 2) + b
  @easeInOutBack    :@easeInOutBackWith()

  @easeOutInBackWith:(s = 1.70158) ->
    (t, b, c, d) ->
      if (t < d / 2)
        return (c / 2) * ((t = (t * 2) / d - 1) * t * ((s + 1) * t + s) + 1) + b

      return (c / 2) * (t = (t * 2 - d) / d) * t * ((s + 1) * t - s) + (b + c / 2)
  @easeOutInBack    :@easeOutInBackWith()

  @easeInBounce:(t, b, c, d) ->
    if (t = (d - t) / d) < (1 / 2.75)
      c - (c * (7.5625 * t * t)) + b
    else if t < (2 / 2.75)
      c - (c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)) + b
    else if t < (2.5 / 2.75)
      c - (c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)) + b
    else
      c - (c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)) + b

  @easeOutBounce:(t, b, c, d) ->
    if (t /= d) < (1 / 2.75)
      c * (7.5625 * t * t) + b
    else if t < (2 / 2.75)
      c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
    else if t < (2.5 / 2.75)
      c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
    else
      c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b

  @easeInOutBounce:(t, b, c, d) ->
    if t < d / 2
      if (t = (d - t * 2) / d) < (1 / 2.75)
        (c - (c * (7.5625 * t * t))) * 0.5 + b
      else if t < (2 / 2.75)
        (c - (c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75))) * 0.5 + b
      else if t < (2.5 / 2.75)
        (c - (c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375))) * 0.5 + b
      else
        (c - (c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375))) * 0.5 + b
    else
      if (t = (t * 2 - d) / d) < (1 / 2.75)
        (c * (7.5625 * t * t)) * 0.5 + c * 0.5 + b
      else if t < (2 / 2.75)
        (c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)) * 0.5 + c * 0.5 + b
      else if t < (2.5 / 2.75)
        (c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)) * 0.5 + c * 0.5 + b
      else
        (c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)) * 0.5 + c * 0.5 + b


  @easeOutInBounce:(t, b, c, d) ->
    if t < d / 2
      if (t = (t * 2) / d) < (1 / 2.75)
        (c / 2) * (7.5625 * t * t) + b
      else if t < (2 / 2.75)
        (c / 2) * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b
      else if t < (2.5 / 2.75)
        (c / 2) * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b
      else
        (c / 2) * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b
    else
      if (t = (d - (t * 2 - d)) / d) < (1 / 2.75)
        (c / 2) - ((c / 2) * (7.5625 * t * t)) + (b + c / 2)
      else if t < (2 / 2.75)
        (c / 2) - ((c / 2) * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75)) + (b + c / 2)
      else if t < (2.5 / 2.75)
        (c / 2) - ((c / 2) * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375)) + (b + c / 2)
      else
        (c / 2) - ((c / 2) * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375)) + (b + c / 2)

  @easeInElasticWith:(a = 0, p = 0) ->
    (t, b, c, d) ->
      if t is 0
        b
      else if (t /= d) is 1
        b + c
      else
        if p is 0
          p = d * 0.3
        if a is 0 or a < Math.abs(c)
          a = c
          s = p / 4
        else
          s = p / (2 * Math.PI) * Math.asin(c / a)
        -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
  @easeInElastic    :@easeInElasticWith()

  @easeOutElasticWith:(a = 0, p = 0) ->
    (t, b, c, d) ->
      if t is 0
        b
      else if (t /= d) is 1
        b + c
      else
        if p is 0
          p = d * 0.3
        if a is 0 or a < Math.abs(c)
          a = c
          s = p / 4
        else
          s = p / (2 * Math.PI) * Math.asin(c / a)
        a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
  @easeOutElastic    :@easeOutElasticWith()

  @easeInOutElasticWith:(a = 0, p = 0) ->
    (t, b, c, d) ->
      if t is 0
        b
      else if (t /= d / 2) == 2
        b + c
      else
        if p is 0
          p = d * (0.3 * 1.5)
        if a is 0 or a < Math.abs(c)
          a = c
          s = p / 4
        else
          s = p / (2 * Math.PI) * Math.asin(c / a)
        if t < 1
          -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
        else
          a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b
  @easeInOutElastic    :@easeInOutElasticWith()

  @easeOutInElasticWith:(a = 0, p = 0) ->
    (t, b, c, d) ->
      c /= 2
      if t < d / 2
        if (t *= 2) is 0
          b
        else if (t /= d) == 1
          b + c
        else
          if p is 0
            p = d * 0.3
          if a is 0 or a < Math.abs(c)
            a = c
            s = p / 4
          else
            s = p / (2 * Math.PI) * Math.asin(c / a)
          a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
      else
        if (t = t * 2 - d) is 0
          b + c
        else if (t /= d) is 1
          (b + c) + c
        else
          if p is 0
            p = d * 0.3
          if a is 0 or a < Math.abs(c)
            a = c
            s = p / 4
          else
            s = p / (2 * Math.PI) * Math.asin(c / a)
          -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + (b + c)
  @easeOutInElastic    :@easeOutInElasticWith()

