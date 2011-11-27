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
