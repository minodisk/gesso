Stage = require 'display/Stage'
Bitmap = require 'display/Bitmap'
Shape = require 'display/Shape'
Event = require 'events/Event'
Easing = require 'tweens/Easing'
Tween = require 'tweens/Tween'

onEnterFrame = (e) ->
  bitmap.draw shape, shape.x, shape.y

stage = new Stage document.querySelector('canvas')
stage.addEventListener Event.ENTER_FRAME, onEnterFrame
bitmap = new Bitmap stage.width, stage.height
stage.addChild bitmap
shape = new Shape
shape.lineStyle 1, 0x0581d2
shape.moveTo 0, -50
shape.lineTo 0, 50
shape.y = 50
stage.addChild shape
t = Tween.to shape, {
  x: 300,
  y: 100,
  scaleY: 0.2,
  rotation: 60
}, 1000, Easing.easeOutQuad
t.play()
