DisplayObject = require('display/DisplayObject')
TextFormat = require('display/styles/TextFormat')
Rectangle = require('geom/Rectangle')

module.exports = class TextField extends DisplayObject

  constructor: (text = '', format = new TextFormat()) ->
    super('TextField')
    @rect = new Rectangle()
    @_stack =
      method: 'drawText'
      arguments: [text, format, null]
      rect: @rect
    @_stacks.push @_stack
    metrix = @_measureText()
    @rect.y = -metrix.height * 2
    @rect.width = metrix.width
    @rect.height = metrix.height * 4
    @_requestRender true

  TextField::__defineGetter__ 'text', () -> @_stack.arguments[0]
  TextField::__defineSetter__ 'text', (value) ->
    @_stack.arguments[0] = value
    metrix = @_measureText()
    @rect.y = -metrix.height * 2
    @rect.width = if @_stack.arguments[2]? then @_stack.arguments[2] else metrix.width
    @rect.height = metrix.height * 4
    @_requestRender true

  TextField::__defineGetter__ 'format', () -> @_stack.arguments[1]
  TextField::__defineSetter__ 'format', (value) ->
    @_stack.arguments[1] = value
    metrix = @_measureText()
    @rect.y = -metrix.height * 2
    @rect.width = if @_stack.arguments[2]? then @_stack.arguments[2] else metrix.width
    @rect.height = metrix.height * 4
    @_requestRender true

  TextField::__defineGetter__ 'maxLength', () -> @_stack.arguments[2]
  TextField::__defineSetter__ 'maxLength', (value) ->
    @rect.width = @_stack.arguments[2] = value
    @_requestRender true

  _measureText: ->
    @_context.font = @_stack.arguments[1].toStyleSheet()
    metrix = @_context.measureText @_stack.arguments[0]
    metrix.height = @_stack.arguments[1].fontSize
    metrix

  _drawText: (text, format, maxLength = null) ->
    @_context.font = format.toStyleSheet()
    @_context.textAlign = format.textAlign
    @_context.textBaseline = format.textBaseline
    @_context.fillStyle = TextField.toColorString format.color
    @_context.fillText text, 0, -@rect.y, maxLength
