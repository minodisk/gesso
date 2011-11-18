DoubleFilter = require 'filters/DoubleFilter'

_KERNEL = [
  [
    -1, 0, 1
    -1, 0, 1
    -1, 0, 1
  ],
  [
    -1, -1, -1
    0, 0, 0
    1, 1, 1
  ]
]

module.exports = class PrewittFilter extends DoubleFilter

  constructor: ->
    super 2, 2, _KERNEL
