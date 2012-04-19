{Stage, Sprite, Shape} = mn.dsk.display
canvas = document.getElementsByTagName('canvas')[4]
stage = new Stage canvas

sun = new Sprite()
sun.graphics.beginFill 0xBF1F1F
sun.graphics.drawCircle 0, 0, 30
sun.graphics.endFill()
sun.x = stage.width / 2
sun.y = stage.height / 2
stage.addChild sun

earth = new Sprite()
earth.graphics.beginFill 0x6AA690
earth.graphics.drawCircle 0, 0, 20
earth.graphics.endFill()
earth.x = 90
sun.addChild earth

moon = new Shape()
moon.graphics.beginFill 0xF2DC99
moon.graphics.drawCircle 0, 0, 10
moon.graphics.endFill()
moon.x = 40
earth.addChild moon

stage.addEventListener 'enterFrame', (e)->
  sun.rotation++
  earth.rotation += 2
  return