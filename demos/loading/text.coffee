Stage = require 'display/Stage'
Shape = require 'display/Shape'
Sprite = require 'display/Sprite'
Event = require 'events/Event'
TextField = require 'text/TextField'
TextFormat = require 'text/TextFormat'
TextFormatAlign = require 'text/TextFormatAlign'
TextFormatBaseline = require 'text/TextFormatBaseline'

NUMBERS = [
  'zero'
, 'one'
, 'two'
, 'three'
, 'four'
, 'five'
, 'six'
, 'seven'
, 'eight'
, 'nine'
, 'ten'
, 'eleven'
, 'twelve'
, 'thirteen'
, 'fourteen'
, 'fifteen'
, 'sixteen'
, 'seventeen'
, 'eighteen'
, 'nineteen'
, 'twenty'
, 'thirty'
, 'forty'
, 'fifty'
, 'sixty'
, 'seventy'
, 'eighty'
, 'ninety'
, 'hundred'
]

class Loading

  constructor:(canvas, @onComplete)->
    @stage = new Stage canvas
    @textContainer = new Sprite
    @textContainer.x = @stage.width / 2 >> 0
    @textContainer.y = @stage.height / 2 >> 0
    @stage.addChild @textContainer
    @percentTextField = new TextField
    @percentTextField.textFormat = new TextFormat 'sans-serif', 24, 0x000000, true, false, false, TextFormatAlign.RIGHT, TextFormatBaseline.MIDDLE, 0
    @textContainer.addChild @percentTextField
    @unitTextField = new TextField
    @unitTextField.text = 'percent'
    @unitTextField.textFormat = new TextFormat 'sans-serif', 24, 0x000000, false, false, false, TextFormatAlign.LEFT, TextFormatBaseline.MIDDLE, 0
    @textContainer.addChild @unitTextField
    @running = false

  update:(percent)->
    if percent is 0
      @points = []
      @running = true
      @counter = 0
      @stage.addEventListener Event.ENTER_FRAME, @onEnterFrame
    if percent >= 100
      setTimeout (=> @running = false), 1000

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

  onEnterFrame:(e)=>
    @percentTextField.text =  @percent

  hoge:->
    if @running
      point = new Point 0, 0
      point.xRadius = @x * 1 / 3 * Math.random()
      point.angle = PI2 * Math.random()
      point.dAngle = RPD * if Math.random() < 0.5 then -1 else 1
      point.dy = -(2 + 4 * Math.random())
      point.radius = 1
      @points.push point

    @context.translate @x, @y
    unless @running
      @counter++
      if @counter > 40
        @canvas.width = @canvas.width
        if @onComplete?
          setTimeout @onComplete, 0
        return
      @context.scale 1 + 3 * @counter, 1 + 3 * @counter
      @context.rotate Math.PI / 180 * 2 * @counter

    gradation = @context.createLinearGradient -@x, 0, @width, 0
    gradation.addColorStop 0, toColorString(0xff0000)
    gradation.addColorStop 1, toColorString(0x0000ff)
    @context.fillStyle = gradation
    i = @points.length
    while i--
      point = @points[i]
      point.y += point.dy
      if point.y < -(@y+30)
        @points.splice i, 1
        continue
      point.xRadius += 0.05;
      point.angle += point.dAngle
      point.radius += 0.03
      @context.beginPath()
      @context.arc point.xRadius * Math.cos(point.angle), point.y, point.radius, 0, PI2
      @context.fill()
    @context.font = 'bold 24px sans-serif'
    @context.textAlign = 'right'
    @context.textBaseline = 'middle'
    @context.fillText @percent, 9, -3
    @context.font = 'normal 24px sans-serif'
    @context.textAlign = 'left'
    @context.fillText 'percent', 9, -3

    ticker @onTicker

class Point

  constructor:(@x, @y)->

do(document)->
  loading = new Loading document.querySelector('canvas'), -> alert 'complete'
  counter = 0
  loading.update counter
  intervalId = setInterval (->
    counter += Math.random()
    counter = 100 if counter >= 100
    loading.update counter
    if counter is 100
      clearInterval intervalId
  ), 50
  return

console.log arguments.callee
