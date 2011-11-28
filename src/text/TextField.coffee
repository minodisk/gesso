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

  # ### new TextField()
  # Creates a new *TextField* object.
  constructor: (text = '', textFormat = new TextFormat) ->
    super()

    # ### text:*String*
    # The text in this *TextField*.
    @defineProperty 'text'
      , ->
        @_texts.join '\n'
      , (text) ->
        @_texts = @_stacks[0].arguments[0] = text.split _R_BREAK
        @_requestRender true

    # ### textFormat:*TextFormat*
    # The *TextFormat* applied to this *TextField*.
    @defineProperty 'textFormat'
      , ->
        @_textFormat
      , (textFormat) ->
        @_textFormat = @_stacks[0].arguments[1] = textFormat
        @_requestRender true

    # ### maxWidth:*Number*
    # The max width of the text, in pixels.
    @defineProperty 'maxWidth'
      , ->
        @_maxWidth
      , (maxWidth) ->
        @_maxWidth = @_stacks[0].arguments[2] = value
        @_requestRender true

    @_stacks.push
      method   : 'drawText'
      arguments: []
    @text = text
    @textFormat = textFormat

  # ### _measureSize():*void*
  # [private] Measures the bounds of this object.
  _measureSize: ->
    if @_texts? and @_textFormat?
      rect = new Rectangle
      @_context.font = @_textFormat.toStyleSheet()
      for text in @_texts
        rect.width = Math.max rect.width, (@_context.measureText text).width
      rect.height = (@_textFormat.size + @_textFormat.leading) * @_texts.length

      @_width = rect.width
      @_height = rect.height
      @_rect = rect

      bounds = rect.clone()
      bounds.y = -bounds.height * 2
      bounds.height *= 4
      @_bounds = bounds
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
