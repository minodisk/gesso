do (window, document)->
  Stage = require 'display/Stage'
  Shape = require 'display/Shape'
  TextField = require 'text/TextField'
  TextFormat = require 'text/TextFormat'
  BlendMode = require 'display/blends/BlendMode'

  canvas = document.querySelector('canvas')
  stage = new Stage canvas
  tf = new TextField()
  tf.format = new TextFormat('monospace', 13, 0xffffff)
  tf.format.textBaseline = 'top'
  stage.addChild tf
  circles = []
  isRender = false

  canvas.addEventListener 'click', ()=>
    isRender = !isRender

  stage.addEventListener 'enterFrame', ()=>
    if (isRender)
      i = circles.length
      while i-- > 0
        circle = circles[i]
        circle.x += circle.speedX
        circle.speedY -= 0.1
        circle.y -= circle.speedY
        if circle.y > stage.height + circle.height / 2
          circles.splice i, 1
          stage.removeChild circle
      circle = new Shape()
      ran = Math.random()
      inv = 1 - ran
      #circle.drawCircle 0, 0, 10 + 20 * ran
      circle.drawRegularStar 0, 0, 10 + 20 * ran
      circle.fill 0xffffff * Math.random()
      circle.speedX = 3 - 6 * Math.random()
      circle.speedY = 5 + 5 * inv
      circle.x = stage.width / 2
      circle.y = stage.height
      stage.addChild circle
      circles.push circle
    tf.text = "fps #{ stage.frameRate }"

  return
console.log arguments.callee
