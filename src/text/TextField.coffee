# **Package:** *text*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* →
# *TextField*<br/>
# **Subclasses:** -
#
# The *TextField* class is used to create display objects for text display and
# input.<br/>
# You can access this module by doing:<br/>
# `require('text/TextField')`

DisplayObject = require('display/DisplayObject')
TextFormat = require('text/TextFormat')
Rectangle = require('geom/Rectangle')

_R_BREAK = /\r?\n/

module.exports = class TextField extends DisplayObject

  # ### text:*String*
  # The text in this *TextField*.
  TextField::__defineGetter__ 'text', () -> @_texts.join '\n'
  TextField::__defineSetter__ 'text', (text) ->
    @_texts = @_stacks[0].arguments[0] = text.split _R_BREAK
    @_measure()
    @_requestRender true

  # ### textFormat:*TextFormat*
  # The *TextFormat* applied to this *TextField*.
  TextField::__defineGetter__ 'textFormat', () -> @_textFormat
  TextField::__defineSetter__ 'textFormat', (textFormat) ->
    @_textFormat = @_stacks[0].arguments[1] = textFormat
    @_measure()
    @_requestRender true

  # ### maxWidth:*Number*
  # The max width of the text, in pixels.
  TextField::__defineGetter__ 'maxWidth', () -> @_maxWidth
  TextField::__defineSetter__ 'maxWidth', (maxWidth) ->
    @_maxWidth = @_stacks[0].arguments[2] = value
    @_requestRender true

  # ### new TextField()
  # Creates a new *TextField* object.
  constructor: (text = '', textFormat = new TextFormat) ->
    super 'TextField'
    @rect = new Rectangle()
    @_stacks.push
      method   : 'drawText'
      arguments: []
      rect     : @rect
    @text = text
    @textFormat = textFormat

  # ### _measure():*void*
  # [private] Computes the size of this object.
  _measure: ->
    if @_texts? and @_textFormat?
      @_context.font = @_textFormat.toStyleSheet()
      width = 0
      for text in @_texts
        width = Math.max width, (@_context.measureText text).width
      height = (@_textFormat.size + @_textFormat.leading) * @_texts.length
      @rect.y = -height * 2
      @rect.width = width
      @rect.height = height * 4
    return

  # ### _drawText(texts:*Array*, textFormat:*TextFormat*):*void*
  # [private] Draws text onto this object.
  _drawText: (texts, textFormat) ->
    @_context.font = textFormat.toStyleSheet()
    @_context.textAlign = textFormat.align
    @_context.textBaseline = textFormat.baseline
    @_context.fillStyle = TextField.toColorString textFormat.color
    lineHeight = textFormat.size + textFormat.leading
    for text, i in @_texts
      @_context.fillText text, 0, lineHeight * i
    return
