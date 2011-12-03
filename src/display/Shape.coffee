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
Point = require('geom/Point')
Rectangle = require('geom/Rectangle')

_PI = Math.PI
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2
_ELLIPSE_CUBIC_BEZIER_HANDLE = (Math.SQRT2 - 1) * 4 / 3

module.exports = class Shape extends DisplayObject

  constructor:->
    super()

  hitTestPoint: (point) ->
    @hitTest point.x, point.y
  hitTest: (x, y) ->
    local = @globalToLocal x, y
    if @_bounds.containsPoint local
      @_hitTest local.x, local.y
    else
      false
  _hitTest: (localX, localY) ->
    @_context.isPointInPath localX - @_bounds.x, localY - @_bounds.y

  # ### _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks: ->
    @_context.translate -@_bounds.x, -@_bounds.y
    @_context.fillStyle = @_context.strokeStyle = 'rgba(0,0,0,0)'
    
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

  clip:() ->
    @_stacks.push
      method   :'clip'
      arguments:ArrayUtil.toArray arguments
    @_requestRender true
  _clip:() ->
    @_context.clip()
    return

  _createLinearGradient:(colors, alphas, ratios, gradientBox) ->
    len = colors.length
    throw new TypeError 'Invalid length of colors, alphas or ratios.' if alphas.length isnt len || ratios.length isnt len
    gradient = @_context.createLinearGradient gradientBox.x0, gradientBox.y0, gradientBox.x1, gradientBox.y1
    gradient.addColorStop ratios[i], Shape.toColorString(colors[i], alphas[i]) for color, i in colors
    gradient

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
        when 0
          @_context.moveTo data[j++], data[j++]
          #console.log 'moveTo', data[j - 2], data[j - 1]
        when 1
          @_context.lineTo data[j++], data[j++]
          #console.log 'lineTo', data[j - 2], data[j - 1]
        when 2
          @_context.quadraticCurveTo data[j++], data[j++], data[j++], data[j++]
          #console.log 'quadraticCurveTo', data[j - 4], data[j - 3], data[j - 2], data[j - 1]
        when 3
          @_context.bezierCurveTo data[j++], data[j++], data[j++], data[j++], data[j++], data[j++]
          #console.log 'quadraticCurveTo', data[j - 6], data[j - 5], data[j - 4], data[j - 3], data[j - 2], data[j - 1]
    if data[0] is data[data.length - 2] and data[1] is data[data.length - 1]
      @_context.closePath()

  lineStyle:(thickness = 1, color = 0x000000, alpha = 1, capsStyle = CapsStyle.NONE, jointStyle = JointStyle.BEVEL, miterLimit = 10) ->
    @_stacks.push
      method   : 'lineStyle'
      arguments: [thickness, color, alpha, capsStyle, jointStyle, miterLimit]
      delta    : thickness
    @_requestRender true
  _lineStyle:(thickness, color, alpha, capsStyle, jointStyle, miterLimit) ->
    @_context.lineWidth = thickness
    @_context.strokeStyle = Shape.toColorString color, alpha
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
    @_context.fillStyle = Shape.toColorString color, alpha
    @_filling = true
    return

  endFill:(color = 0x000000, alpha = 1) ->
    @_stacks.push
      method   :'endFill'
      arguments:[color, alpha]
    @_requestRender true
  _endFill:(color, alpha) ->
    @_filling = false
    return

  moveTo: (x, y) ->
    @_stacks.push
      method   : 'moveTo'
      arguments: [x, y]
      rect     : new Rectangle x, y, 0, 0
    @_requestRender true
  _moveTo: (x, y) ->
    @_context.beginPath()
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

  quadraticCurveTo: (x1, y1, x2, y2) ->
    @_stacks.push
      method   : 'quadraticCurveTo'
      arguments: [x1, y1, x2, y2]
      rect     : new Rectangle(x1, y1).contain(x2, y2)
    @_requestRender true
  _quadraticCurveTo: (x1, y1, x2, y2) ->
    @_context.quadraticCurveTo x1, y1, x2, y2
  curveTo: Shape::quadraticCurveTo

  cubicCurveTo: (x1, y1, x2, y2, x3, y3) ->
    @_stacks.push
      method   : 'cubicCurveTo'
      arguments: [x1, y1, x2, y2, x3, y3]
      rect     : new Rectangle(x1, y1).contain(x2, y2).contain(x3, y3)
    @_requestRender true
  _cubicCurveTo: (x1, y1, x2, y2, x3, y3) ->
    @_context.bezierCurveTo x1, y1, x2, y2, x3, y3
  bezierCurveTo: Shape::cubicCurveTo

  drawRectangle:(rect) ->
    @drawRect rect.x, rect.y, rect.width, rect.height
  drawRect:(x, y, width, height = width) ->
    r = x + width
    b = y + height
    @drawPath [0, 1, 1, 1, 1], [x, y, r, y, r, b, x, b, x, y], 0

  drawRoundRectangle:(rect, ellipseW, ellipseH = ellipseW) ->
    @drawRoundRect rect.x, rect.y, rect.width, rect.height, ellipseW, ellipseH
  drawRoundRect:(x, y, width, height, ellipseW, ellipseH = ellipseW) ->
    @drawPath [0, 1, 2, 1, 2, 1, 2, 1, 2]
      ,[x + ellipseW, y
      , x + width - ellipseW, y
      , x + width, y, x + width, y + ellipseH
      , x + width, y + height - ellipseH
      , x + width, y + height, x + width - ellipseW, y + height
      , x + ellipseW, y + height
      , x, y + height, x, y + height - ellipseH
      , x, y + ellipseH
      , x, y, x + ellipseW, y]
      , 0

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
    @drawPath [0, 3, 3, 3, 3]
      ,[x + width, y
      , x + width, y + handleHeight, x + handleWidth, y + height, x, y + height
      , x - handleWidth, y + height, x - width, y + handleHeight, x - width, y
      , x - width, y - handleHeight, x - handleWidth, y - height, x, y - height
      , x + handleWidth, y - height, x + width, y - handleHeight, x + width, y]

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
