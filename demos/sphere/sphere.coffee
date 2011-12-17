Stage = require 'display/Stage'
Screen = require '3d/core/Screen'
Camera = require '3d/core/Camera'
Scene = require '3d/core/Scene'
Renderer = require '3d/core/Renderer'
Dot = require '3d/display/Dot'
Line = require '3d/display/Line'
Sphere = require '3d/display/Sphere'
Vector = require '3d/geom/Vector'
TextField = require 'text/TextField'
TextFormat = require 'text/TextFormat'
MathUtil = require 'utils/MathUtil'

stage = new Stage document.querySelector('canvas')

scene = new Scene
camera = new Camera
scene.addCamera camera
screen = new Screen
screen.screenWidth = stage.width
screen.screenHeight = stage.height
camera.addScreen screen
stage.addChild screen
renderer = new Renderer scene

DISTANCE = 150
RADIUS = 400

xAxis = new Line
xAxis.color = 0xff0000
xAxis.setupDirection Vector.ZERO, new Vector(DISTANCE, 0, 0)
scene.addChild xAxis
yAxis = new Line
yAxis.color = 0x00ff00
yAxis.setupDirection Vector.ZERO, new Vector(0, DISTANCE, 0)
scene.addChild yAxis
zAxis = new Line
zAxis.color = 0x0000ff
zAxis.setupDirection Vector.ZERO, new Vector(0, 0, DISTANCE)
scene.addChild zAxis

#axis = new Line
#axis.color = 0x000000
#axis.setupDirection Vector.ZERO, new Vector(DISTANCE, DISTANCE, DISTANCE)
#scene.addChild axis

#dot = new Dot
#dot.position.x = DISTANCE
#dot.position.y = DISTANCE
#dot.position.z = DISTANCE
#scene.addChild dot

sphere = new Sphere DISTANCE, 60, 30
scene.addChild sphere

camera.position.x = RADIUS
camera.position.y = 10
camera.position.z = 0
renderer.render()

tf = new TextField
tf.textFormat = new TextFormat()
tf.textFormat.color = 0xffffff
stage.addChild tf

rotation = 0
isRender = false

stage.addEventListener 'click'
  , (e)->
    isRender = !isRender
stage.addEventListener 'enterFrame'
  , (e)->
    if isRender
      rotation += MathUtil.RPD
      camera.position.x = RADIUS * Math.cos(rotation)
      camera.position.z = RADIUS * Math.sin(rotation)
      renderer.render()
      tf.text = String stage.frameRate
