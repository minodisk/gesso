FontFamily = require('display/styles/FontFamily')
FontWeight = require('display/styles/FontWeight')
FontStyle = require('display/styles/FontStyle')
FontVariant = require('display/styles/FontVariant')
TextAlign = require('display/styles/TextAlign')
TextBaseline = require('display/styles/TextBaseline')

module.exports = class TextFormat

  constructor: (@fontFamily = FontFamily.SANS_SERIF, @fontSize = 16, @color = 0, @fontWeight = FontWeight.NORMAL, @fontStyle = FontStyle.NORMAL, @fontVariant = FontVariant.NORMAL, @textAlign = TextAlign.START, @textBaseline = TextBaseline.ALPHABETIC) ->

  toStyleSheet: () ->
    "#{@fontStyle} #{@fontVariant} #{@fontWeight} #{@fontSize}px #{@fontFamily}"
