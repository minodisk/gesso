StringUtil = require 'utils/StringUtil'

_pow = Math.pow

_padLeft = StringUtil.padLeft

_separate = (n)->
    n = (n | (n << 8)) & 0x00ff00ff
    n = (n | (n << 4)) & 0x0f0f0f0f
    n = (n | (n << 2)) & 0x33333333
    return (n | (n << 1)) & 0x55555555

module.exports = class Quadtree

    @coordToZOrder:(x, y)->
        _separate(x) | (_separate(y) << 1)

    constructor:(level = 3)->
        @_level  = level
        @_sides = _pow 2, @_level
        @_spaces = @_sides * @_sides
        @_bits = (@_spaces - 1).toString(2).length

    coordsToIndex:(x0, y0, x1, y1)->
        m0 = Quadtree.coordToZOrder x0, y0
        m1 = Quadtree.coordToZOrder x1, y1
        level = m0 ^ m1
        len = @_bits / 2
        for i in [0...len] when (level & (3 << 2 * (len - i - 1))) isnt 0
            shift = 2 * (len - i)
            break
        m1 >>= shift
        (_pow(4, i) - 1) / 3 + m1

    toBitString:(n)->
        _padLeft n.toString(2), @_bits, '0'
