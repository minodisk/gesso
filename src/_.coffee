###
graphicsJS

The MIT License (MIT)

Copyright (c) 2011 minodisk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
###

_VERSION = '0.2.3'
_PI = Math.PI
_SQRT2 = Math.SQRT2
_PI_1_2 = _PI / 2
_PI_2 = _PI * 2
_ELLIPSE_CUBIC_BEZIER_HANDLE = (_SQRT2 - 1) * 4 / 3
_RADIAN_PER_DEGREE = _PI / 180
_sin = Math.sin
_cos = Math.cos
_tan = Math.tan
_min = Math.min
_max = Math.max
_sqrt = Math.sqrt
_atan2 = Math.atan2
_requestAnimationFrame = do ->
  window?.requestAnimationFrame or
  window?.webkitRequestAnimationFrame or
  window?.mozRequestAnimationFrame or
  window?.msRequestAnimationFrame or
  window?.oRequestAnimationFrame or
  (callback)->
    setTimeout ->
      callback new Date().getTime()
    , 16.666666666666668

unless window.mn? then window.mn = {}
unless window.mn.dsk? then window.mn.dsk = {}
exports = window.mn.dsk
unless exports.core? then exports.core = {}
unless exports.display? then exports.display = {}
unless exports.events? then exports.events = {}
unless exports.geom? then exports.geom = {}
unless exports.text? then exports.text = {}
unless exports.timers? then exports.timers = {}
