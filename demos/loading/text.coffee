NUMBERS = [
  'zero'
  'one'
  'two'
  'three'
  'four'
  'five'
  'six'
  'seven'
  'eight'
  'nine'
  'ten'
  'eleven'
  'twelve'
  'thirteen'
  'fourteen'
  'fifteen'
  'sixteen'
  'seventeen'
  'eighteen'
  'nineteen'
  'twenty'
  'thirty'
  'forty'
  'fifty'
  'sixty'
  'seventy'
  'eighty'
  'ninety'
  'hundred'
]
toRGB = (h, s, v)->
  if s is 0
    r = v
    g = v
    b = v
  else
    h %= 360
    hi = h / 60 >> 0
    f = h / 60 - hi
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch hi
      when 0
        r = v
        g = t
        b = p
      when 1
        r = q
        g = v
        b = p
      when 2
        r = p
        g = v
        b = t
      when 3
        r = p
        g = q
        b = v
      when 4
        r = t
        g = p
        b = v
      when 5
        r = v
        g = p
        b = q
  r * 0xff << 16 | g * 0xff << 8 | b * 0xff
toColorString = (color = 0, alpha = 1)->
  "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"
ticker = do ->
  #@requestAnimationFrame or
  #@webkitRequestAnimationFrame or
  #@mozRequestAnimationFrame or
  #@oRequestAnimationFrame or
  #@msRequestAnimationFrame or
  (callback) -> setTimeout (()->callback((new Date()).getTime())), 1000 / 30

class Loading

  constructor:(@canvas, @onComplete)->
    @width = @canvas.width
    @height = @canvas.height
    @x = @width / 2 >> 0
    @y = @height / 2 >> 0
    @context = @canvas.getContext '2d'
    @context.translate @x, @y
    @context.textBaseline = 'alphabetic'

    @updated = false

  update:(ratio)->
    @ratio = ratio
    if @ratio is 0
      @updated = true
      @currentFrame = 0
      ticker @onTicker
    if @ratio is 1
      @updated = false

    percent = ratio * 100
    percent >>= 0
    if percent < 20
      percent = NUMBERS[percent]
    else
      ones = percent % 10
      tenth = percent / 10
      percent = NUMBERS[18 + (tenth >> 0)]
      if ones isnt 0
        percent += '-' + NUMBERS[ones]
    @percent = percent
    return

  onTicker:(time)=>
    @currentFrame++

    @context.fillStyle = '#ffffff'
    @context.fillRect -@x, -@y, @canvas.width, @canvas.height

    alpha = 1
    unless @updated
      unless @completeFrame?
        @completeFrame = @currentFrame
      deltaFrame = @currentFrame - @completeFrame
      if deltaFrame > 15
        alpha = 1 - (deltaFrame - 15) / 8
      if alpha <= 0
        if @onComplete?
          setTimeout @onComplete, 0
          return

    hue = 180 + 180 * @ratio
    gradient = @context.createLinearGradient 0, 0, @width, 0
    maxRotation = 90
    for rotation in [0...maxRotation]
      gradient.addColorStop rotation / maxRotation, toColorString(toRGB(hue + rotation, 1, 1), alpha)

    @context.fillStyle = gradient
    @context.fillRect -@x, 0, @width * @ratio, 1
    @context.font = '900 24px "Helvetica", "Arial"'
    @context.textAlign = 'right'
    @context.fillText @percent, 0, 0
    @context.font = '100 24px "Helvetica", "Arial"'
    @context.textAlign = 'left'
    @context.fillText 'percent', 0, 0

    ticker @onTicker
    return

document.addEventListener 'DOMContentLoaded', (e)->
  loading = new Loading document.querySelector('canvas'), -> alert 'complete'
  counter = 0
  loading.update counter
  intervalId = setInterval (->
    loading.update ++counter / 100
    if counter is 100
      clearInterval intervalId
  ), 50
  return
