# **Package:** *display*<br/>
# **Inheritance:** *Object* → *EventDispatcher* → *DisplayObject* → *Shape*<br/>
# **Subclasses:** *Sprite*
#
# The *Shape* can draw a vector shape.
#
# You can access this module by doing:<br/>
# `require('display/Shape')`

DisplayObject = require('display/DisplayObject')
Graphics = require('display/Graphics')

module.exports = class Shape extends DisplayObject

  constructor:->
    super()
    @graphics = new Graphics @

  # ## _execStacks():*void*
  # [private] Executes the stacks to this object.
  _execStacks:->
    @graphics._execStacks()
    return

  clip:->
    @_stacks.push
      method   :'clip'
      arguments:ArrayUtil.toArray arguments
    @_requestRender true
  _clip:->
    @_context.clip()
    return
