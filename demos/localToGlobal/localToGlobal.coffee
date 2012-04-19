{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text
{Vector} = mn.dsk.geom

randomBetween = (a, b)->
  a + Math.random() * (b - a)

canvas = document.getElementsByTagName('canvas')[0]
stage = new Stage canvas
#stage.debug = true
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

point = red.localToGlobal new Vector 0 ,124

redLiner = new Shape
redLiner.graphics.lineStyle 1, 0x8B2222, 0.5
redLiner.graphics.moveTo point.x, point.y
stage.addChildAt redLiner, 0

stage.addEventListener 'click', ->
  render = !render

stage.addEventListener 'enterFrame', ->
  if render
    blue.rotation += 3.2
    green.rotation += -4.5
    red.rotation += 7.3
    tf.text = "fps: #{stage.frameRate}"

    point = red.localToGlobal new Vector 0, 124
    redLiner.graphics.lineTo point.x, point.y
