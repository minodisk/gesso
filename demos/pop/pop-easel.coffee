randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.querySelector('canvas')
stage = new Stage canvas
#tf = new TextField()
#tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
#stage.addChild tf
circles = []
isRender = true

#canvas.addEventListener 'click', ()=>
#  isRender = !isRender

window.tick = ->
  if isRender
    i = circles.length
    while i-- > 0
      circle = circles[i]
      circle.x += circle.speedX
      circle.speedY -= 0.1
      circle.y -= circle.speedY
      circle.rotation += circle.speedRotation
      circle.alpha -= 0.005
      console.log circle.y, canvas.height
      if circle.y > canvas.height #+ circle.height
        console.log 'delete'
        circles.splice i, 1
        stage.removeChild circle

    if circles.length < 120
      console.log 'new'
      circle = new Shape()
      ran = Math.random()
      inv = 1 - ran
      circle.graphics.beginFill '#FFFFFF'
      circle.graphics.drawRect 0, 0, 10 + 20 * ran, 10 + 20 * ran
#      circle.graphics.endFill()
      circle.speedX = randomBetween -3, 3
      circle.speedY = 5 + 5 * inv
      circle.speedRotation = randomBetween -1, 1
      circle.x = canvas.width / 2
      circle.y = canvas.height
      stage.addChild circle
      circles.push circle

  stage.update()

#  tf.text = "fps: #{ stage.frameRate }\nlength: #{ circles.length }"

Ticker.setInterval(1000 / 60)
Ticker.addListener window

#console.log arguments.callee
