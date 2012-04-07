

class Line extends DisplayObject

  constructor:->
    super()

  setupDirection:(v0, v1)->
    @vertices[0] = v0
    @vertices[1] = v1

  drawAt:(screen, vertices)->
    graphics = screen.graphics
    graphics.lineStyle 1, @color
    graphics.moveTo vertices[0].x, vertices[0].y
    graphics.lineTo vertices[1].x, vertices[1].y

