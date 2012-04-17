{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text

randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.querySelector('canvas')
stage = new Stage canvas
stage.debug = true
render = true

tf = new TextField()
tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
stage.addChild tf

blue = new Sprite
blue.graphics.beginFill 0x22228B
blue.graphics.drawRect -8, -8, 16, 80
blue.graphics.endFill()
blue.graphics.beginFill 0xffffff
blue.graphics.drawCircle 0, 0, 2
blue.graphics.endFill()
blue.x = stage.width / 2
blue.y = stage.height / 2
stage.addChild blue

green = new Sprite
green.graphics.beginFill 0x228B22
green.graphics.drawRect -5, -5, 10, 110
green.graphics.endFill()
green.graphics.beginFill 0xffffff
green.graphics.drawCircle 0, 0, 2
green.graphics.endFill()
green.y = 72
green.rotation = 30
blue.addChild green

red = new Shape
red.graphics.beginFill 0x8B2222
red.graphics.drawRect -3, -3, 6, 130
red.graphics.endFill()
red.graphics.beginFill 0xffffff
red.graphics.drawCircle 0, 0, 2
red.graphics.endFill()
red.y = 105
red.rotation = 0
green.addChild red

stage.addEventListener 'click', ->
  render = !render

stage.addEventListener 'enterFrame', ->
  if render
    blue.rotation += 3.2
    green.rotation += -4.5
    red.rotation += 7.3
    tf.text = "fps: #{stage.frameRate}"
