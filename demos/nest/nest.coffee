{Stage, Sprite} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text

randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.querySelector('canvas')
stage = new Stage canvas
#tf = new TextField()
#tf.textFormat = new TextFormat 'monospace', 13, 0xffffff
#stage.addChild tf
#circles = []
#isRender = false

console.log stage.VERSION

blue = new Sprite
blue.graphics.beginFill 0x0000ff
blue.graphics.drawRect -10, -10, 100, 20
blue.graphics.endFill()
blue.x = stage.width / 2
blue.y = stage.height / 2
stage.addChild blue

green = new Sprite
green.graphics.beginFill 0x00ff00
green.graphics.drawRect -10, -10, 100, 20
green.graphics.endFill()
green.x = 100
blue.addChild green

red = new Sprite
red.graphics.beginFill 0xff0000
red.graphics.drawRect -10, -10, 100, 20
red.graphics.endFill()
red.x = 100
green.addChild red

stage.addEventListener 'enterFrame', ->
  blue.rotation += 1
  green.rotation += 1.5
  red.rotation += 2

#  tf.text = "fps: #{ stage.frameRate }\nlength: #{ circles.length }"

#console.log arguments.callee