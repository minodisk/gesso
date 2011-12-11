Stage = require 'display/Stage'
Screen = require '3d/core/Screen'
Camera = require '3d/core/Camera'
Scene = require '3d/core/Scene'
Dot = require '3d/display/Dot'

stage = new Stage document.querySelector('canvas')

scene = new Scene
camera = new Camera
scene.addCamera camera
screen = new Screen
camera.addScreen screen
stage.addChild screen

dot = new Dot
scene.addChild dot

scene.render()
