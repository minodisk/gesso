# **Experimental Implementation**

class DisplayObject extends Class

  constructor:->
    @position = new Vector 0, 0, 0
    @orientation = new EulerAngles 0, 0, 0
    @vertices = []
    @color = 0

  drawAt:(screen)->
