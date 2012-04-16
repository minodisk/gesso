{Stage, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text

randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.querySelector('canvas')
stage = new Stage canvas
tf = new TextField()
tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
stage.addChild tf
circles = []
isRender = false

canvas.addEventListener 'click', ()=>
  isRender = !isRender

stage.addEventListener 'enterFrame', ()=>
  if isRender
    i = circles.length
    while i-- > 0
      circle = circles[i]
      circle.x += circle.speedX
      circle.speedY -= 0.2
      circle.y -= circle.speedY
      circle.rotation += circle.speedRotation
      circle.alpha -= 0.01
      if circle.y > stage.height + circle.height
        circles.splice i, 1
        stage.removeChild circle

    if stage.frameRate > 29 && circles.length < 500
      for i in [0...6]
        circle = new Shape()
        ran = Math.random()
        inv = 1 - ran
        circle.graphics.beginFill 0xffffff * Math.random()
        circle.graphics.drawRegularStar 0, 0, 10 + 20 * ran
        circle.graphics.endFill()
        circle.speedX = randomBetween -5, 5
        circle.speedY = 9 + 5 * inv
        circle.speedRotation = randomBetween -2, 2
        circle.x = stage.width / 2
        circle.y = stage.height
        stage.addChild circle
        circles.push circle

  tf.text = """
    fps: #{stage.frameRate}
    length: #{circles.length}
  """

return
console.log arguments.callee
