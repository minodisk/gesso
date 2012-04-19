{Stage, Sprite, Loader} = mn.dsk.display
{Vector, Matrix} = mn.dsk.geom
{Event, MouseEvent} = mn.dsk.events

width = 0
height = 0
origin = null
anchorX = null
anchorY = null

onLoadComplete = (e)->
  width = loader.width
  height = loader.height

  origin = new Sprite()
  origin.buttonMode = true
  origin.graphics.beginFill 0x0581d2
  origin.graphics.drawCircle 0, 0, 5
  origin.graphics.endFill()
  origin.x = (stage.width - width) / 2
  origin.y = (stage.height - height) / 2
  stage.addChild origin

  anchorX = new Sprite()
  anchorX.buttonMode = true
  anchorX.graphics.beginFill 0x0581d2
  anchorX.graphics.drawCircle 0, 0, 5
  anchorX.graphics.endFill()
  anchorX.x = origin.x + width
  anchorX.y = origin.y
  stage.addChild anchorX

  anchorY = new Sprite()
  anchorY.buttonMode = true
  anchorY.graphics.beginFill 0x0581d2
  anchorY.graphics.drawCircle 0, 0, 5
  anchorY.graphics.endFill()
  anchorY.x = origin.x
  anchorY.y = origin.y + height
  stage.addChild anchorY

  onMouseMove()
  origin.addEventListener MouseEvent.MOUSE_DOWN, onMouseDown
  anchorX.addEventListener MouseEvent.MOUSE_DOWN, onMouseDown
  anchorY.addEventListener MouseEvent.MOUSE_DOWN, onMouseDown

onMouseDown = (e)->
  anchor = e.currentTarget
  anchor.startDrag()
  stage.addEventListener MouseEvent.MOUSE_MOVE, onMouseMove
  stage.addEventListener MouseEvent.MOUSE_UP, onMouseUp

onMouseMove = (e)->
  ptO = new Vector(origin.x, origin.y)
  ptX = new Vector(anchorX.x, anchorX.y)
  ptY = new Vector(anchorY.x, anchorY.y)
  scaleX = Vector.distance(ptX, ptO) / width
  scaleY = Vector.distance(ptY, ptO) / height
  ptX = ptX.subtract(ptO).normalize(scaleX)
  ptY = ptY.subtract(ptO).normalize(scaleY)
  loader.matrix = new Matrix(ptX.x, ptX.y, ptY.x, ptY.y, ptO.x, ptO.y)

onMouseUp = (e)->
  stage.removeEventListener MouseEvent.MOUSE_MOVE, onMouseMove
  stage.removeEventListener MouseEvent.MOUSE_UP, onMouseUp
  anchor = e.target
  anchor.stopDrag()

stage = new Stage document.getElementsByTagName('canvas')[0]
loader = new Loader()
loader.load "/gesso/images/lena_256.png"
loader.addEventListener Event.COMPLETE, onLoadComplete
stage.addChild loader