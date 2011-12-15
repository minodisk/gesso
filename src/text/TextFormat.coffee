TextFormatAlign = require('text/TextFormatAlign')
TextFormatBaseline = require('text/TextFormatBaseline')
TextFormatFont = require('text/TextFormatFont')

module.exports = class TextFormat

  constructor:(@font = TextFormatFont.SANS_SERIF, @size = 16, @color = 0, @alpha = 1, @bold = false, @italic = false, @smallCaps = false, @align = TextFormatAlign.START, @baseline = TextFormatBaseline.TOP, @leading = 0)->
    if @font instanceof TextFormat
      textFormat = @font
      @font = textFormat.font
      @size = textFormat.size
      @color = textFormat.color
      @alpha = textFormat.alpha
      @bold = textFormat.bold
      @italic = textFormat.italic
      @smallCaps = textFormat.smallCaps
      @align = textFormat.align
      @baseline = textFormat.baseline
      @leading = textFormat.leading

  toStyleSheet:()->
    premitive = false
    for key, value of TextFormatFont when value is @font
      premitive = true
      break
    font = if premitive then @font else "'#{ @font }'"
    "#{ if @italic then 'italic' else 'normal' } #{ if @smallCaps then 'small-caps' else 'normal' } #{ if @bold then 'bold' else 'normal' } #{ @size }px #{ font }"
