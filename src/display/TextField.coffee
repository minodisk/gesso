DisplayObject = require('display/DisplayObject')
TextFormat = require('display/styles/TextFormat')
Rectangle = require('geom/Rectangle')

_R_BREAK = /\r?\n/

module.exports = class TextField extends DisplayObject

  TextField::__defineGetter__ 'text', () -> @_texts.join '\n'
  TextField::__defineSetter__ 'text', (text) ->
    @_texts = @_stacks[0].arguments[0] = text.split _R_BREAK
    @_measure()
    @_requestRender true

  TextField::__defineGetter__ 'format', () -> @_format
  TextField::__defineSetter__ 'format', (format) ->
    @_format = @_stacks[0].arguments[1] = format
    @_measure()
    @_requestRender true

  TextField::__defineGetter__ 'maxWidth', () -> @_maxWidth
  TextField::__defineSetter__ 'maxWidth', (maxWidth) ->
    @_maxWidth = @_stacks[0].arguments[2] = value
    @_requestRender true

  constructor: (text = '', format = new TextFormat) ->
    super 'TextField'
    @rect = new Rectangle()
    @_stacks.push
      method   : 'drawText'
      arguments: []
      rect     : @rect
    @text = text
    @format = format

  _measure: ->
    if @_texts? and @_format?
      @_drawing.font = @_format.toStyleSheet()
      width = 0
      for text in @_texts
        width = Math.max width, (@_drawing.measureText text).width
      height = (@_format.size + @_format.leading) * @_texts.length
      @rect.y = -height * 2
      @rect.width = width
      @rect.height = height * 4
    return

  _drawText: (texts, format, maxLength = null) ->
    @_drawing.font = format.toStyleSheet()
    @_drawing.textAlign = format.align
    @_drawing.textBaseline = format.baseline
    @_drawing.fillStyle = TextField.toColorString format.color
    lineHeight = format.size + format.leading
    for text, i in @_texts
      @_drawing.fillText text, 0, -@rect.y + lineHeight * i, maxLength
    return
