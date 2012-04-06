do (window, document)->
  GradientType = require 'display/GradientType'
  Stage = require 'display/Stage'
  Shape = require 'display/Shape'
  Matrix = require 'geom/Matrix'
  TextField = require 'text/TextField'
  TextFormat = require 'text/TextFormat'
  MathUtil = require 'utils/MathUtil'

  wind = 0
  isWind = false
  angle = 0

  init = ->
    canvas = document.querySelector('canvas')
    stage = new Stage canvas
    tf = new TextField()
    tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
    stage.addChild tf
    circles = []
    isRender = false

    setTimeout startWind, 5000 + 5000 * Math.random()

    canvas.addEventListener 'click', (e)=>
      isRender = !isRender

    stage.addEventListener 'enterFrame', (e)=>
      if isRender
        r = Math.random()
        i = circles.length
        if isWind then updateWind()
        while i-- > 0
          circle = circles[i]
          circle.speedX += wind
          circle.x += circle.speedX
          #circle.speedY += 0.1
          circle.y += circle.speedY
          circle.rotation += circle.speedRotation
          circle.alpha -= 0.002
          if circle.y > stage.height + circle.height
            circles.splice i, 1
            stage.removeChild circle

        if circles.length < 200
          circle = new Shape()
          ran = Math.random()
          inv = 1 - ran
          radius = 5 + 5 * ran
          matrix = new Matrix()
          matrix.createGradientBox radius * 2, radius * 2, 0, -radius, -radius
          circle.graphics.beginGradientFill GradientType.RADIAL, [0xffffff, 0xffffff], [1, 0], [0, 0xff], matrix
          circle.graphics.drawCircle 0, 0, radius
          circle.graphics.endFill()
          circle.speedX = MathUtil.randomBetween -1, 1
          circle.speedY = 1 + 2 * inv
          circle.speedRotation = MathUtil.randomBetween -1, 1
          circle.x = stage.width * (-0.5 + 2 * Math.random())
          circle.y = -10
          stage.addChild circle
          circles.push circle

      tf.text = "fps: #{ stage.frameRate }\nlength: #{ circles.length }"

  startWind = ->
    isWind = true
    updateWind()

  updateWind = ->
    wind = 0.05 * Math.sin angle
    if angle > Math.PI * 2
      wind = 0
      isWind = false
      angle = 0
      setTimeout startWind, 5000 + 5000 * Math.random()
    angle += Math.PI / 180


  init()

  return
console.log arguments.callee
