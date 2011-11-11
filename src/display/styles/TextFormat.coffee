TextFormatAlign = require('display/styles/TextFormatAlign')
TextFormatBaseline = require('display/styles/TextFormatBaseline')
TextFormatFont = require('display/styles/TextFormatFont')

module.exports = class TextFormat

  constructor:(@font = TextFormatFont.SANS_SERIF, @size = 16, @color = 0, @bold = false, @italic = false, @smallCaps = false, @align = TextFormatAlign.START, @baseline = TextFormatBaseline.TOP, @leading = 0)->

  toStyleSheet:()->
    premitive = false
    for key, value of TextFormatFont when value is @font
      premitive = true
      break
    font = if premitive then @font else "'#{ @font }'"
    "#{ if @italic then 'italic' else 'normal' } #{ if @smallCaps then 'small-caps' else 'normal' } #{ if @bold then 'bold' else 'normal' } #{ @size }px #{ font }"
