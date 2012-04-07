

_2_DIRECTION = [
  0, 1, 0
  1, -4, 1
  0, 1, 0
]
_4_DIRECTION = [
  1, 1, 1
  1, -8, 1
  1, 1, 1
]

class LaplacianFilter extends KernelFilter
  
  constructor: (is4Direction = false) ->
    super 2, 2, (if is4Direction then _4_DIRECTION else _2_DIRECTION)
