DoubleFilter = require 'filters/DoubleFilter'

_KERNEL = [
  [
    -1, 0, 1
    -2, 0, 2
    -1, 0, 1
  ],
  [
    -1, -2, -1
    0, 0, 0
    1, 2, 1
  ]
]

module.exports = class SobelFilter extends DoubleFilter

  constructor: ->
    super 2, 2, _KERNEL
