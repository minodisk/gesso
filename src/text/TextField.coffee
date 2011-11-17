# **Package:** *text*<br/>
# **Inheritance:** *Object* > *EventDispatcher* > *DisplayObject* >
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

  # ## text:*String*
  # The text in this *TextField*.
  TextField::__defineGetter__ 'text', () -> @_texts.join '\n'
  TextField::__defineSetter__ 'text', (text) ->
    @_texts = @_stacks[0].arguments[0] = text.split _R_BREAK
    @_measure()
    @_requestRender true

  # ## format:*TextFormat*
  # The *TextFormat* applied to this *TextField*.
  TextField::__defineGetter__ 'format', () -> @_format
  TextField::__defineSetter__ 'format', (format) ->
    @_format = @_stacks[0].arguments[1] = format
    @_measure()
    @_requestRender true

  # ## maxWidth:*Number*
  # The max width of the text, in pixels.
  TextField::__defineGetter__ 'maxWidth', () -> @_maxWidth
  TextField::__defineSetter__ 'maxWidth', (maxWidth) ->
    @_maxWidth = @_stacks[0].arguments[2] = value
    @_requestRender true

  # ## new TextField()
  # Creates a new *TextField* instance.
  constructor: (text = '', format = new TextFormat) ->
    super 'TextField'
    @rect = new Rectangle()
    @_stacks.push
      method   : 'drawText'
      arguments: []
      rect     : @rect
    @text = text
    @format = format

  # ## _measure():*void*
  # [private] Computes the size of this object.
  _measure: ->
    if @_texts? and @_format?
      @_input.font = @_format.toStyleSheet()
      width = 0
      for text in @_texts
        width = Math.max width, (@_input.measureText text).width
      height = (@_format.size + @_format.leading) * @_texts.length
      @rect.y = -height * 2
      @rect.width = width
      @rect.height = height * 4
    return

  # ## _drawText(texts:*Array*, format:*TextFormat*):*void*
  # [private] Draws text onto this object.
  _drawText: (texts, format) ->
    @_input.font = format.toStyleSheet()
    @_input.textAlign = format.align
    @_input.textBaseline = format.baseline
    @_input.fillStyle = TextField.toColorString format.color
    lineHeight = format.size + format.leading
    for text, i in @_texts
      @_input.fillText text, 0, -@rect.y + lineHeight * i
    return
