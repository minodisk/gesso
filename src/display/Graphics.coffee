
GradientType = require('display/GradientType')
CapsStyle = require('display/CapsStyle')
JointStyle = require('display/JointStyle')
Point = require('geom/Point')
Rectangle = require('geom/Rectangle')

_PI = Math.PI
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2
_ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3

module.exports = class Graphics

  # ### toColorString():*String*
  # [static] Generates string of color style.
  @toColorString: (color = 0, alpha = 1) ->
    "rgba(#{ color >> 16 & 0xff },#{ color >> 8 & 0xff },#{ color & 0xff },#{ if alpha < 0 then 0 else if alpha > 1 then 1 else alpha })"

  constructor:(@_displayObject)->
    @_context = @_displayObject._context
    @_stacks = @_displayObject._stacks

  _requestRender:->
    @_displayObject._requestRender.apply @_displayObject, arguments
    @

  _execStacks:->
    @_context.fillStyle = @_context.strokeStyle = 'rgba(0,0,0,0)'
    @_context.translate -@_displayObject._bounds.x, -@_displayObject._bounds.y
    drawingCounter = 0
    for stack, i in @_stacks
      method = stack.method

      isDrawing = method.indexOf('draw') is 0
      if method is 'moveTo' or
         method is 'lineTo' or
         method is 'quadraticCurveTo' or
         method is 'cubicCurveTo' or
         isDrawing
        drawingCounter++
      else if drawingCounter isnt 0
        drawingCounter = 0
        if isDrawing
          @_context.closePath()
        @_context.fill()
        @_context.stroke()

      @_clockwise = if drawingCounter is 1 then 1 else -1
      if drawingCounter is 1
        @_context.beginPath()
      @["_#{ stack.method }"].apply @, stack.arguments

    if drawingCounter isnt 0
      drawingCounter = 0
      if isDrawing
        @_context.closePath()
      @_context.fill()
      @_context.stroke()

    @_context.setTransform 1, 0, 0, 1, 0, 0

  # ### clear():*Graphics*
  # Clears the drawn graphics.
  clear: ->
    while @_stacks.length
      @_stacks.pop()
    @_context.canvas.width = @_context.canvas.height = 0
    @_requestRender true

  lineStyle:(thickness = 1, color = 0x000000, alpha = 1, capsStyle = CapsStyle.NONE, jointStyle = JointStyle.BEVEL, miterLimit = 10) ->
    @_stacks.push
      method   : 'lineStyle'
      arguments: [thickness, color, alpha, capsStyle, jointStyle, miterLimit]
      delta    : thickness
    @_requestRender true
  _lineStyle:(thickness, color, alpha, capsStyle, jointStyle, miterLimit) ->
    @_context.lineWidth = thickness
    @_context.strokeStyle = Graphics.toColorString color, alpha
    @_context.lineCaps = capsStyle
    @_context.lineJoin = jointStyle
    @_context.miterLimit = miterLimit
    return

  beginFill:(color = 0x000000, alpha = 1) ->
    @_stacks.push
      method   :'beginFill'
      arguments:[color, alpha]
    @_requestRender true
  _beginFill:(color, alpha) ->
    @_context.fillStyle = Graphics.toColorString color, alpha
    return

  beginGradientFill:(type, colors, alphas, ratios, matrix = null, spreadMethod = 'pad', interpolationMethod = 'rgb', focalPointRatio = 0)->
    @_stacks.push
      method   : 'beginGradientFill'
      arguments: [type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio]
    @_requestRender true
  _beginGradientFill:(type, colors, alphas, ratios, matrix, focalPointRatio)->
    len = ratios.length
    throw new TypeError 'Invalid length of colors, alphas or ratios.' if colors.length isnt len || alphas.length isnt len

    cTL = matrix.transformPoint new Point(-1638.4 / 2, -1638.4 / 2)
    cBR = matrix.transformPoint new Point(1638.4 / 2, 1638.4 / 2)
    cBL = matrix.transformPoint new Point(-1638.4 / 2, 1638.4 / 2)
    v1 = cBR.clone().subtract(cTL).divide(2)
    cCenter = cTL.clone().add(v1)

    switch type
      when 'linear'
        v0 = cBL.clone().subtract(cTL)
        dNormal = v1.distance * Math.abs(Math.sin(v1.angle - v0.angle))
        vNormal = v0.clone().rotate(Math.PI / 2).normalize(dNormal)
        cSrc = cCenter.clone().add(vNormal)
        cDst = cCenter.clone().subtract(vNormal)
        gradient = @_context.createLinearGradient cSrc.x, cSrc.y, cDst.x, cDst.y
      when 'radial'
        cR = matrix.transformPoint new Point(1638.4 / 2, 0)
        vR = cR.clone().subtract(cCenter)
        cL = cTL.clone().add(cBL).divide(2)
        cB = cBR.clone().add(cBL).divide(2)
        vCL = cL.clone().subtract(cCenter)
        vCB = cB.clone().subtract(cCenter)
        x1p = vCL.x * vCL.x
        y1p = vCL.y * vCL.y
        x2p = vCB.x * vCB.x
        y2p = vCB.y * vCB.y
        a = Math.sqrt (y1p * x2p - x1p * y2p) / (y1p - y2p)
        b = Math.sqrt (x1p * y2p - y1p * x2p) / (x1p - x2p)
        long = Math.max a, b
        focalRadius = long * focalPointRatio
        gradient = @_context.createRadialGradient cCenter.x, cCenter.y, long, cCenter.x + focalRadius * Math.cos(vR.angle), cCenter.y + focalRadius * Math.sin(vR.angle), 0
        ratios = ratios.slice()
        ratios.reverse()

    for ratio, i in ratios
      gradient.addColorStop ratio / 0xff, Graphics.toColorString(colors[i], alphas[i])
    @_context.fillStyle = gradient

  endFill:(color = 0x000000, alpha = 1) ->
    @_stacks.push
      method   :'endFill'
      arguments:[color, alpha]
    @_requestRender true
  _endFill:(color, alpha) ->
    return

  moveTo: (x, y) ->
    @_stacks.push
      method   : 'moveTo'
      arguments: [x, y]
      rect     : new Rectangle x, y, 0, 0
    @_requestRender true
  _moveTo: (x, y) ->
    @_context.moveTo x, y
    return

  lineTo: (x, y, thickness) ->
    @_stacks.push
      method   : 'lineTo'
      arguments: [x, y]
      rect     : new Rectangle x, y, 0, 0
    @_requestRender true
  _lineTo: (x, y) ->
    @_context.lineTo x, y
    return

  drawPath:(commands, data, clockwise = 0) ->
    rect = new Rectangle data[0], data[1], 0, 0
    for i in [1...data.length / 2] by 1
      j = i * 2
      rect.contain data[j], data[j + 1]
    @_stacks.push
      method   : 'drawPath'
      arguments: [commands, data, clockwise]
      rect     : rect
    @_requestRender true
  _drawPath:(commands, data, clockwise) ->
    if clockwise is 0
      clockwise = @_clockwise
    if clockwise < 0
      commands = commands.slice()
      c = commands.shift()
      commands.reverse()
      commands.unshift c
      rData = []
      j = 0
      for command in commands
        rData.unshift data[j++], data[j++]
      data = rData
    j = 0
    for command, i in commands
      switch command
        when 0 then @_context.moveTo data[j++], data[j++]
        when 1 then @_context.lineTo data[j++], data[j++]
        when 2 then @_context.quadraticCurveTo data[j++], data[j++], data[j++], data[j++]
        when 3 then @_context.bezierCurveTo data[j++], data[j++], data[j++], data[j++], data[j++], data[j++]
    if data[0] is data[data.length - 2] and data[1] is data[data.length - 1]
      @_context.closePath()

  quadraticCurveTo: (x1, y1, x2, y2) ->
    @_stacks.push
      method   : 'quadraticCurveTo'
      arguments: [x1, y1, x2, y2]
      rect     : new Rectangle(x1, y1).contain(x2, y2)
    @_requestRender true
  curveTo: Graphics::quadraticCurveTo
  _quadraticCurveTo: (x1, y1, x2, y2) ->
    @_context.quadraticCurveTo x1, y1, x2, y2

  cubicCurveTo: (x1, y1, x2, y2, x3, y3) ->
    @_stacks.push
      method   : 'cubicCurveTo'
      arguments: [x1, y1, x2, y2, x3, y3]
      rect     : new Rectangle(x1, y1).contain(x2, y2).contain(x3, y3)
    @_requestRender true
  bezierCurveTo: Graphics::cubicCurveTo
  _cubicCurveTo: (x1, y1, x2, y2, x3, y3) ->
    @_context.bezierCurveTo x1, y1, x2, y2, x3, y3

  drawRectangle:(rect) ->
    @drawRect rect.x, rect.y, rect.width, rect.height
  drawRect:(x, y, width, height = width) ->
    r = x + width
    b = y + height
    @drawPath [0, 1, 1, 1, 1], [x, y, r, y, r, b, x, b, x, y], 0

  drawRoundRectangle:(rect, ellipseW, ellipseH = ellipseW) ->
    @drawRoundRect rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH
  drawRoundRect:(x, y, width, height, ellipseW, ellipseH = ellipseW) ->
    @drawPath [0, 1, 2, 1, 2, 1, 2, 1, 2], [
      x + ellipseW, y
      x + width - ellipseW, y
      x + width, y, x + width, y + ellipseH
      x + width, y + height - ellipseH
      x + width, y + height, x + width - ellipseW, y + height
      x + ellipseW, y + height
      x, y + height, x, y + height - ellipseH
      x, y + ellipseH
      x, y, x + ellipseW, y
      ] , 0

  drawCircle:(x, y, radius) ->
    @_stacks.push
      method   : 'drawCircle'
      arguments: [x, y, radius]
      rect     : new Rectangle x - radius, y - radius, radius * 2, radius * 2
    @_requestRender true
  _drawCircle:(x, y, radius) ->
    @_context.moveTo x + radius, y
    @_context.arc x, y, radius, 0, _PI_2, @_clockwise < 0
    return

  drawEllipse:(x, y, width, height) ->
    width /= 2
    height /= 2
    x += width
    y += height
    handleWidth = width * _ELLIPSE_CUBIC_BEZIER_HANDLE
    handleHeight = height * _ELLIPSE_CUBIC_BEZIER_HANDLE
    @drawPath [0, 3, 3, 3, 3], [
      x + width, y
      x + width, y + handleHeight, x + handleWidth, y + height, x, y + height
      x - handleWidth, y + height, x - width, y + handleHeight, x - width, y
      x - width, y - handleHeight, x - handleWidth, y - height, x, y - height
      x + handleWidth, y - height, x + width, y - handleHeight, x + width, y
      ], 0

  drawRegularPolygon:(x, y, radius, length = 3) ->
    commands = []
    data = []
    unitRotation = _PI_2 / length
    for i in [0..length]
      commands.push if i is 0 then 0 else 1
      rotation = -_PI_1_2 + unitRotation * i
      data.push x + radius * Math.cos(rotation), y + radius * Math.sin(rotation)
    @drawPath commands, data, 0

  drawRegularStar:(x, y, outer, length = 5)->
    cos = Math.cos _PI / length
    @drawStar x, y, outer, outer * (2 * cos - 1 / cos), length
  drawStar:(x, y, outer, inner, length = 5)->
    commands = []
    data = []
    unitRotation = _PI / length
    for i in [0..length * 2] by 1
      commands.push if i is 0 then 0 else 1
      radius = if (i & 1) is 0 then outer else inner
      rotation = -_PI_1_2 + unitRotation * i
      data.push x + radius * Math.cos(rotation), y + radius * Math.sin(rotation)
    @drawPath commands, data, 0
