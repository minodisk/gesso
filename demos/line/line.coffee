canvas = document.querySelector 'canvas'
context = canvas.getContext '2d'

i = 1000
t = new Date().getTime()
while i--
  context.fillStyle = '#ff0000'
  context.beginPath()
  context.arc 100 + i, 100, 100, 0, Math.PI * 2, false
  context.fill()
console.log new Date().getTime() - t

i = 1000
t = new Date().getTime()
can = document.createElement 'canvas'
can.width = can.height = 200
con = can.getContext '2d'
con.fillStyle = '#00ff00'
con.beginPath()
con.arc 100, 100, 100, 0, Math.PI * 2, false
con.fill()
#while i--
context.drawImage can, i, 100
console.log new Date().getTime() - t

Stage = require 'display/Stage'
Shape = require 'display/Shape'

i = 1000
t = new Date().getTime()
stage = new Stage canvas
shape = new Shape
shape.graphics.beginFill 0x0000ff
shape.graphics.drawCircle 0, 0, 100
shape.graphics.endFill()
stage.addChild shape
#while i--
shape.x = 100 + i
shape.y = 300
console.log new Date().getTime() - t

