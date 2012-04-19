{Stage, Sprite, Shape} = mn.dsk.display
canvas = document.getElementsByTagName('canvas')[3]
stage = new Stage canvas

blue = new Shape()
blue.graphics.beginFill 0xBF1F1F
blue.graphics.drawRect -25, -25, 50, 50
blue.graphics.endFill()
blue.graphics.beginFill 0xF2DC99
blue.graphics.drawCircle 0, 0, 2
blue.graphics.endFill()
stage.addChild blue
blue.x = 120
blue.y = 135

redContainer = new Sprite()
redContainer.x = 360
redContainer.y = 135
stage.addChild redContainer
red = new Shape()
red.graphics.beginFill 0x6AA690
red.graphics.drawRect 0, 0, 50, 50
red.graphics.endFill()
red.graphics.beginFill 0xF2DC99
red.graphics.drawCircle 0, 0, 2
red.graphics.endFill()
red.x = -25
red.y = -25
redContainer.addChild red

stage.addEventListener 'enterFrame', (e)->
  blue.rotation++
  redContainer.rotation++
  return