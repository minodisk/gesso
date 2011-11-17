DisplayObject = require('display/DisplayObject')
GradientType = require('display/styles/GradientType')
CapsStyle = require('display/styles/CapsStyle')
JointStyle = require('display/styles/JointStyle')
Rectangle = require('geom/Rectangle')

_PI = Math.PI
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2

module.exports = class Shape extends DisplayObject
  @ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3

  @createGradationBox = (x, y, width, height, rotation)->
    threshold = height / width
    tan = Math.tan rotation
    width1_2 = width / 2
    height1_2 = height / 2
    centerX = x + width1_2
    centerY = y + height1_2
    if tan > -threshold and tan < threshold
      dx = width1_2 * (if Math.cos(rotation) < 0 then -1 else 1)
      dxt = dx * tan
      x0:centerX - dx
      y0:centerY - dxt
      x1:centerX + dx
      y1:centerY + dxt
    else
      dy = height1_2 * (if Math.sin(rotation) < 0 then -1 else 1)
      dyt = dy / tan
      x0:centerX - dyt
      y0:centerY - dy
      x1:centerX + dyt
      y1:centerY + dy

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
    @_input.beginPath()
    @_input.moveTo coords[0], coords[1]
    max = Math.ceil coords.length / 2
    for i in [1...max] by 1
      j = i * 2
      @_input.lineTo coords[j], coords[j + 1]
    #@_input.closePath()
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
    @_input.beginPath()
    @_input.rect x, y, width, height
    @_input.closePath()
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
    @_input.beginPath()
    @_input.moveTo x + ellipseW, y
    @_input.lineTo x + width - ellipseW, y
    @_input.quadraticCurveTo x + width, y, x + width, y + ellipseH
    @_input.lineTo x + width, y + height - ellipseH
    @_input.quadraticCurveTo x + width, y + height, x + width - ellipseW, y + height
    @_input.lineTo x + ellipseW, y + height
    @_input.quadraticCurveTo x, y + height, x, y + height - ellipseH
    @_input.lineTo x, y + ellipseH
    @_input.quadraticCurveTo x, y, x + ellipseW, y
    @_input.closePath()
    return

  drawCircle:(x, y, radius, startAngle, endAngle, anticlockwise) ->
    @_stacks.push
      method   : 'drawCircle'
      arguments: [x, y, radius, startAngle, endAngle, anticlockwise]
      rect     : new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawCircle:(x, y, radius, startAngle = 0, endAngle = _PI_2, anticlockwise = false) ->
    @_input.beginPath()
    @_input.arc x, y, radius, startAngle, endAngle, anticlockwise
    @_input.closePath()
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
    handleWidth = width * Shape.ELLIPSE_CUBIC_BEZIER_HANDLE
    handleHeight = height * Shape.ELLIPSE_CUBIC_BEZIER_HANDLE
    @_input.beginPath()
    @_input.moveTo x + width, y
    @_input.bezierCurveTo x + width, y + handleHeight, x + handleWidth, y + height, x, y + height
    @_input.bezierCurveTo x - handleWidth, y + height, x - width, y + handleHeight, x - width, y
    @_input.bezierCurveTo x - width, y - handleHeight, x - handleWidth, y - height, x, y - height
    @_input.bezierCurveTo x + handleWidth, y - height, x + width, y - handleHeight, x + width, y
    @_input.closePath()
    return

  drawRegularPolygon:(x, y, radius, length = 3) ->
    @_stacks.push
      method:'drawRegularPolygon'
      arguments:[x, y, radius, length]
      rect:new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawRegularPolygon:(x, y, radius, length) ->
    u = _PI_2 / length
    @_input.beginPath()
    @_input.moveTo x, y - radius
    for i in [1..length]
      r = -_PI_1_2 + u * i
      @_input.lineTo x + radius * Math.cos(r), y + radius * Math.sin(r)
    @_input.closePath()
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
    @_input.beginPath()
    @_input.moveTo x, y - outer
    u = _PI / length
    for i in [1..length * 2] by 1
      radius = if (i & 1) is 0 then outer else inner
      r = -_PI_1_2 + u * i
      @_input.lineTo x + radius * Math.cos(r), y + radius * Math.sin(r)
    @_input.closePath()
    return

  clip:() ->
    @_stacks.push
      method   :'clip'
      arguments:ArrayUtil.toArray arguments
    @_requestRender true
  _clip:() ->
    @_input.clip()
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
    @_input.fillStyle = Shape.toColorString color, alpha
    @_input.fill()
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
    @_input.lineWidth = thickness
    @_input.strokeStyle = Shape.toColorString color, alpha
    @_input.lineCaps = capsStyle
    @_input.lineJoin = jointStyle
    @_input.miterLimit = miterLimit
    @_input.stroke()
    return

  _createLinearGradient:(colors, alphas, ratios, gradientBox) ->
    len = colors.length
    throw new TypeError 'Invalid length of colors, alphas or ratios.' if alphas.length isnt len || ratios.length isnt len
    gradient = @_input.createLinearGradient gradientBox.x0, gradientBox.y0, gradientBox.x1, gradientBox.y1
    gradient.addColorStop ratios[i], Shape.toColorString(colors[i], alphas[i]) for color, i in colors
    gradient
