{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text
{MouseEvent} = mn.dsk.events

onMouseEvent = (e) ->
#  console.log e.target
  container = (if (e.target is outer) then dummyOuter else (if (e.target is inner) then dummyInner else null))
  if container
    container.pointer.x = e.localX
    container.pointer.y = e.localY
  textField.text = e.toString()

stage = new Stage document.getElementsByTagName('canvas')[0]
stage.overrideMouseWheel = true
outer = new Sprite()
outer.graphics.beginFill 0xff0000, 0.5
outer.graphics.drawRoundRect 0, 0, 140, 100, 10
outer.graphics.endFill()
outer.x = 120
outer.y = 140
outer.rotation = 30
stage.addChild outer
inner = new Sprite()
inner.graphics.beginFill 0x0000ff, 0.5
inner.graphics.drawRoundRect 0, 0, 100, 60, 10
inner.graphics.endFill()
inner.x = inner.y = 20
outer.addChild inner
dummyOuter = new Sprite()
dummyOuter.mouseChildren = false
dummyOuter.x = 120
dummyOuter.y = 140
dummyOuter.rotation = 30
stage.addChild dummyOuter
dummyOuter.pointer = new Shape()
dummyOuter.pointer.graphics.lineStyle 3, 0xffffff
dummyOuter.pointer.graphics.beginFill 0xff0000
dummyOuter.pointer.graphics.drawCircle 0, 0, 5
dummyOuter.pointer.graphics.endFill()
dummyOuter.addChild dummyOuter.pointer
dummyInner = new Sprite()
dummyInner.x = dummyInner.y = 20
dummyOuter.addChild dummyInner
dummyInner.pointer = new Shape()
dummyInner.pointer.graphics.lineStyle 3, 0xffffff
dummyInner.pointer.graphics.beginFill 0x0000ff
dummyInner.pointer.graphics.drawCircle 0, 0, 5
dummyInner.pointer.graphics.endFill()
dummyInner.addChild dummyInner.pointer
textField = new TextField()
textField.textFormat = new TextFormat("monospace")
stage.addChild textField
texts = []
outer.addEventListener MouseEvent.CLICK, onMouseEvent
outer.addEventListener MouseEvent.CONTEXT_MENU, onMouseEvent
outer.addEventListener MouseEvent.DOUBLE_CLICK, onMouseEvent
outer.addEventListener MouseEvent.MIDDLE_CLICK, onMouseEvent
outer.addEventListener MouseEvent.MIDDLE_MOUSE_DOWN, onMouseEvent
outer.addEventListener MouseEvent.MIDDLE_MOUSE_UP, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_DOWN, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_MOVE, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_OUT, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_OVER, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_UP, onMouseEvent
outer.addEventListener MouseEvent.MOUSE_WHEEL, onMouseEvent
outer.addEventListener MouseEvent.RIGHT_CLICK, onMouseEvent
outer.addEventListener MouseEvent.RIGHT_MOUSE_DOWN, onMouseEvent
outer.addEventListener MouseEvent.RIGHT_MOUSE_UP, onMouseEvent
outer.addEventListener MouseEvent.ROLL_OUT, onMouseEvent
outer.addEventListener MouseEvent.ROLL_OVER, onMouseEvent