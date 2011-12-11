do (require, exports) ->
  MathUtil = require('utils/MathUtil')

  exports['utils/MathUtil'] =

    constance: (test) ->
      test.strictEqual(MathUtil.DPR, 180 / Math.PI, 'DPR')
      test.strictEqual(MathUtil.RPD, Math.PI / 180, 'RPD')
      test.done()

    randomBetween: (test) ->
      test.ok(0 < MathUtil.randomBetween(0, 10) < 10) for i in [0...100]
      test.ok(-100 < MathUtil.randomBetween(-2, -100) < -2) for i in [0...100]
      test.strictEqual(MathUtil.randomBetween(4, 5) >> 0, 4) for i in [0...100]
      test.done()

    nearestIn: (test) ->
      test.strictEqual(MathUtil.nearestIn(3, [1, 6, 8]), 1);
      test.strictEqual(MathUtil.nearestIn(-9, [-8, -10, -8.5]), -8.5);
      test.strictEqual(MathUtil.nearestIn(-1.3, [-1.2, -1.5, -1.8]), -1.2);
      test.done()

    convergeBetween: (test) ->
      test.strictEqual(MathUtil.convergeBetween(3, 5, 10), 5)
      test.strictEqual(MathUtil.convergeBetween(7, 5, 10), 7)
      test.strictEqual(MathUtil.convergeBetween(12, 5, 10), 10)
      test.strictEqual(MathUtil.convergeBetween(-8, -5, 10), -5)
      test.strictEqual(MathUtil.convergeBetween(1, -5, 10), 1)
      test.strictEqual(MathUtil.convergeBetween(12, -5, 10), 10)
      test.strictEqual(MathUtil.convergeBetween(-12, -5, -10), -10)
      test.strictEqual(MathUtil.convergeBetween(-8, -5, -10), -8)
      test.strictEqual(MathUtil.convergeBetween(-1, -5, -10), -5)
      test.done()

  console.log arguments.callee