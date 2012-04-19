{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text
{Vector} = mn.dsk.geom

randomBetween = (a, b)->
  a + Math.random() * (b - a)

stage = new Stage document.getElementsByTagName('canvas')[0]
render = true

tf = new TextField()
tf.textFormat = new TextFormat 'monospace', 13, 0xFFFFFF
stage.addChild tf

green = new Sprite()
green.graphics.beginFill 0x6AA690
green.graphics.drawRect -8, -8, 16, 60
green.graphics.endFill()
green.graphics.beginFill 0xF2DC99
green.graphics.drawCircle 0, 0, 2
green.graphics.endFill()
green.x = stage.width / 2
green.y = stage.height / 2
stage.addChild green

greenPoint = new Vector 0, 44
gp = green.localToGlobal greenPoint

greenLine = new Shape()
greenLine.graphics.lineStyle 1, 0x6AA690, 0.5
greenLine.graphics.moveTo gp.x, gp.y
stage.addChildAt greenLine, 0

yellow = new Sprite()
yellow.graphics.beginFill 0xF2BC1B
yellow.graphics.drawRect -5, -5, 10, 80
yellow.graphics.endFill()
yellow.graphics.beginFill 0xF2DC99
yellow.graphics.drawCircle 0, 0, 2
yellow.graphics.endFill()
yellow.y = greenPoint.y
yellow.rotation = 30
green.addChild yellow

yellowPoint = new Vector 0, 70
yp = yellow.localToGlobal yellowPoint

yellowLine = new Shape()
yellowLine.graphics.lineStyle 1, 0xF2BC1B, 0.5
yellowLine.graphics.moveTo yp.x, yp.y
stage.addChildAt yellowLine, 0

red = new Shape()
red.graphics.beginFill 0xBF1F1F
red.graphics.drawRect -3, -3, 6, 100
red.graphics.endFill()
red.graphics.beginFill 0xF2DC99
red.graphics.drawCircle 0, 0, 2
red.graphics.endFill()
red.graphics.beginFill 0xF2DC99
red.graphics.drawCircle 0, 94, 2
red.graphics.endFill()
red.y = yellowPoint.y
red.rotation = 0
yellow.addChild red

redPoint = new Vector 0, 94
rp = red.localToGlobal redPoint

redLine = new Shape()
redLine.graphics.lineStyle 1, 0xBF1F1F, 0.5
redLine.graphics.moveTo rp.x, rp.y
stage.addChildAt redLine, 0

stage.addEventListener 'click', ->
  render = !render
  return

stage.addEventListener 'enterFrame', ->
  if render
    # calculate global point twice for drawing smooth line
    i = 2
    while i--
      green.rotation += 3.2
      yellow.rotation += -4.5
      red.rotation += 7.3
      gp = green.localToGlobal greenPoint
      greenLine.graphics.lineTo gp.x, gp.y
      yp = yellow.localToGlobal yellowPoint
      yellowLine.graphics.lineTo yp.x, yp.y
      rp = red.localToGlobal redPoint
      redLine.graphics.lineTo rp.x, rp.y

    while greenLine.graphics._stacks.length > 60
      greenLine.graphics._stacks.splice 1, 1
    while yellowLine.graphics._stacks.length > 80
      yellowLine.graphics._stacks.splice 1, 1
    while redLine.graphics._stacks.length > 100
      redLine.graphics._stacks.splice 1, 1

    tf.text = "fps: #{stage.frameRate}"
  return
