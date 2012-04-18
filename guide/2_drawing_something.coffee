{Stage, Shape} = mn.dsk.display
canvas = document.getElementsByTagName('canvas')[0]
stage = new Stage canvas
shape = new Shape()
shape.graphics.beginFill 0x3399cc
shape.graphics.drawRect 0, 0, 50, 50
shape.graphics.endFill()
stage.addChild shape