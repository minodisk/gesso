

class Loader extends Sprite

  constructor: ->
    super()

  load: (url) ->
    img = new Image()
    img.src = url
    img.addEventListener 'load', (e) =>
      bitmap = new Bitmap()
      bitmap.draw img
      @content = bitmap
      @addChild @content
      @dispatchEvent new Event(Event.COMPLETE)
