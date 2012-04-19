{Stage, Shape} = mn.dsk.display
canvas = document.getElementsByTagName('canvas')[1]
stage = new Stage canvas
shape = new Shape()
shape.graphics.beginFill 0xBF1F1F
shape.graphics.drawRect 0, 0, 50, 50
shape.graphics.endFill()
stage.addChild shape
shape.x = 240
shape.y = 135
shape.alpha = 0.5
shape.rotation = 30