{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text

randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.querySelector('canvas')
stage = new Stage canvas
stage.debug = true

#tf = new TextField()
#tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
#stage.addChild tf
#circles = []
#isRender = false


blue = new Sprite
blue.graphics.beginFill 0x0000ff
blue.graphics.drawRect 0, 0, 100, 100
blue.graphics.endFill()
blue.graphics.beginFill 0xffffff
blue.graphics.drawCircle 0, 0, 2
blue.graphics.endFill()
blue.x = stage.width / 2
blue.y = stage.height / 2
#blue.rotation = 10
stage.addChild blue

green = new Sprite
green.graphics.beginFill 0x00ff00, 0.2
green.graphics.drawRect -50, -20, 100, 40
green.graphics.endFill()
green.graphics.beginFill 0xffffff
green.graphics.drawCircle 0, 0, 2
green.graphics.endFill()
green.x = 10
green.y = 10
green.rotation = 30
blue.addChild green

red = new Sprite
red.graphics.beginFill 0xff0000, 0.5
red.graphics.drawRect -10, -10, 110, 20
red.graphics.endFill()
red.graphics.beginFill 0xffffff
red.graphics.drawCircle 0, 0, 2
red.graphics.endFill()
red.x = 50
red.rotation = 0
green.addChild red

stage.addEventListener 'enterFrame', ->
#  blue.rotation += 1
  green.rotation += 1.5
#  red.rotation += 2

#  tf.text = "fps: #{ stage.frameRate }\nlength: #{ circles.length }"

#console.log arguments.callee