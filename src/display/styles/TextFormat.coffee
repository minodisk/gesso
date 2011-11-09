TextFormatFont = require('display/styles/TextFormatFont')
TextFormatAlign = require('display/styles/TextFormatAlign')
TextFormatBaseline = require('display/styles/TextFormatBaseline')

module.exports = class TextFormat

  constructor:(@font = TextFormatFont.SANS_SERIF, @size = 16, @color = 0, @bold = false, @italic = false, @smallCaps = false, @align = TextFormatAlign.START, @baseline = TextFormatBaseline.ALPHABETIC)->

  toStyleSheet:()->
    "#{ if @italic then 'italic' else 'normal' } #{ if @smallCaps then 'small-caps' else 'normal' } #{ if @bold then 'bold' else 'normal' } #{ @size }px #{ @font }"
