# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Shape*<br/>
# **Subclasses:** *Sprite*
#
# The *Shape* can draw a vector shape.
#
# You can access this module by doing:<br/>
# `require('display/Shape')`

DisplayObject = require('display/DisplayObject')
GradientType = require('display/GradientType')
CapsStyle = require('display/CapsStyle')
JointStyle = require('display/JointStyle')
Rectangle = require('geom/Rectangle')

_PI = Math.PI
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2
_ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3

module.exports = class Shape extends DisplayObject

  constructor:->
    super 'Shape'

  drawLine:(coords...)->
    minX = minY = Number.MAX_VALUE
    maxX = maxY = -Number.MAX_VALUE
    max = Math.ceil coords.length / 2
    for i in [0...max] by 1
      j = i * 2
      x = coords[j]
      y = coords[j + 1]
      minX = Math.min minX, x
      minY = Math.min minY, y
      maxX = Math.max maxX, x
      maxY = Math.max maxY, y
    @_stacks.push
      method   : 'drawLine'
      arguments: coords
      rect     : new Rectangle minX, minY, maxX - minX, maxY - minY
    @_requestRender true
  _drawLine:(coords...)->
    @_context.beginPath()
    @_context.moveTo coords[0], coords[1]
    max = Math.ceil coords.length / 2
    for i in [1...max] by 1
      j = i * 2
      @_context.lineTo coords[j], coords[j + 1]
    #@_context.closePath()
    return

  drawRectangle:(rect) ->
    @drawRect rect.x, rect.y, rect.width, rect.height
  drawRect:(x, y, width, height = width) ->
    @_stacks.push
      method:'drawRect',
      arguments:[x, y, width, height]
      rect:new Rectangle x, y, width, height
    @_requestRender true
  _drawRect:(x, y, width, height) ->
    @_context.beginPath()
    @_context.rect x, y, width, height
    @_context.closePath()
    return

  drawRoundRectangle:(rect, ellipseW, ellipseH = ellipseW) ->
    @drawRoundRect rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH
  drawRoundRect:(x, y, width, height, ellipseW, ellipseH = ellipseW) ->
    @_stacks.push
      method:'drawRoundRect'
      arguments:[x, y, width, height, ellipseW, ellipseH]
      rect:new Rectangle x, y, width, height
    @_requestRender true
  _drawRoundRect:(x, y, width, height, ellipseW, ellipseH = ellipseW) ->
    @_context.beginPath()
    @_context.moveTo x + ellipseW, y
    @_context.lineTo x + width - ellipseW, y
    @_context.quadraticCurveTo x + width, y, x + width, y + ellipseH
    @_context.lineTo x + width, y + height - ellipseH
    @_context.quadraticCurveTo x + width, y + height, x + width - ellipseW, y + height
    @_context.lineTo x + ellipseW, y + height
    @_context.quadraticCurveTo x, y + height, x, y + height - ellipseH
    @_context.lineTo x, y + ellipseH
    @_context.quadraticCurveTo x, y, x + ellipseW, y
    @_context.closePath()
    return

  drawCircle:(x, y, radius, startAngle, endAngle, anticlockwise) ->
    @_stacks.push
      method   : 'drawCircle'
      arguments: [x, y, radius, startAngle, endAngle, anticlockwise]
      rect     : new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawCircle:(x, y, radius, startAngle = 0, endAngle = _PI_2, anticlockwise = false) ->
    @_context.beginPath()
    @_context.arc x, y, radius, startAngle, endAngle, anticlockwise
    @_context.closePath()
    return

  drawEllipse:(x, y, width, height) ->
    @_stacks.push
      method:'drawEllipse'
      arguments:[x, y, width, height]
      rect:new Rectangle x, y, width, height
    @_requestRender true
  _drawEllipse:(x, y, width, height) ->
    width /= 2
    height /= 2
    x += width
    y += height
    handleWidth = width * _ELLIPSE_CUBIC_BEZIER_HANDLE
    handleHeight = height * _ELLIPSE_CUBIC_BEZIER_HANDLE
    @_context.beginPath()
    @_context.moveTo x + width, y
    @_context.bezierCurveTo x + width, y + handleHeight, x + handleWidth, y + height, x, y + height
    @_context.bezierCurveTo x - handleWidth, y + height, x - width, y + handleHeight, x - width, y
    @_context.bezierCurveTo x - width, y - handleHeight, x - handleWidth, y - height, x, y - height
    @_context.bezierCurveTo x + handleWidth, y - height, x + width, y - handleHeight, x + width, y
    @_context.closePath()
    return

  drawRegularPolygon:(x, y, radius, length = 3) ->
    @_stacks.push
      method:'drawRegularPolygon'
      arguments:[x, y, radius, length]
      rect:new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawRegularPolygon:(x, y, radius, length) ->
    u = _PI_2 / length
    @_context.beginPath()
    @_context.moveTo x, y - radius
    for i in [1..length]
      r = -_PI_1_2 + u * i
      @_context.lineTo x + radius * Math.cos(r), y + radius * Math.sin(r)
    @_context.closePath()
    return

  drawRegularStar:(x, y, outer, length = 5)->
    c = Math.cos _PI / length
    @drawStar x, y, outer, outer * (2 * c - 1 / c), length
  drawStar:(x, y, outer, inner, length = 5)->
    @_stacks.push
      method:'drawStar'
      arguments:[x, y, outer, inner, length]
      rect:new Rectangle x - outer, y - outer, outer * 2, outer * 2
    @_requestRender true
  _drawStar:(x, y, outer, inner, length)->
    @_context.beginPath()
    @_context.moveTo x, y - outer
    u = _PI / length
    for i in [1..length * 2] by 1
      radius = if (i & 1) is 0 then outer else inner
      r = -_PI_1_2 + u * i
      @_context.lineTo x + radius * Math.cos(r), y + radius * Math.sin(r)
    @_context.closePath()
    return

  clip:() ->
    @_stacks.push
      method   :'clip'
      arguments:ArrayUtil.toArray arguments
    @_requestRender true
  _clip:() ->
    @_context.clip()
    return

  fillGradient:(type, colors, alphas, ratios, gradientBox) ->
    switch type
      when GradientType.LINEAR
        @fill @_createLinearGradient
  fill:(color = 0x000000, alpha = 1) ->
    @_stacks.push
      method:'fill'
      arguments:[color, alpha]
    @_requestRender true
  _fill:(color, alpha) ->
    @_context.fillStyle = Shape.toColorString color, alpha
    @_context.fill()
    return

  strokeGradient:(type, colors, alphas, ratios, gradientBox) ->
    switch type
      when GradientType.LINEAR
        @stroke @_createLinearGradient(colors, alphas, ratios, gradientBox)
  stroke:(thickness = 1, color = 0x000000, alpha = 1, capsStyle = CapsStyle.NONE, jointStyle = JointStyle.BEVEL, miterLimit = 10) ->
    @_stacks.push
      method:'stroke'
      arguments:[thickness, color, alpha, capsStyle, jointStyle, miterLimit]
      delta:thickness
    @_requestRender true
  _stroke:(thickness, color, alpha, capsStyle, jointStyle, miterLimit) ->
    @_context.lineWidth = thickness
    @_context.strokeStyle = Shape.toColorString color, alpha
    @_context.lineCaps = capsStyle
    @_context.lineJoin = jointStyle
    @_context.miterLimit = miterLimit
    @_context.stroke()
    return

  _createLinearGradient:(colors, alphas, ratios, gradientBox) ->
    len = colors.length
    throw new TypeError 'Invalid length of colors, alphas or ratios.' if alphas.length isnt len || ratios.length isnt len
    gradient = @_context.createLinearGradient gradientBox.x0, gradientBox.y0, gradientBox.x1, gradientBox.y1
    gradient.addColorStop ratios[i], Shape.toColorString(colors[i], alphas[i]) for color, i in colors
    gradient

  hitTest: (x, y) ->
    bounds = @_bounds.clone().offset @x, @y
    if bounds.contains x, y
      @_context.isPointInPath x - bounds.x, y - bounds.y
    else
      false

  _onMouseMoveAt: Shape::hitTest
