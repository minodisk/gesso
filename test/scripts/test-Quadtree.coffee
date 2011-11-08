do (require, exports) ->

  Quadtree = require('geom/Quadtree')

  exports['geom/Quadtree'] =

    coordToZOrder: (test) ->
      test.strictEqual Quadtree.coordToZOrder(0, 0), 0
      test.strictEqual Quadtree.coordToZOrder(1, 0), 1
      test.strictEqual Quadtree.coordToZOrder(0, 1), 2
      test.strictEqual Quadtree.coordToZOrder(1, 1), 3
      test.strictEqual Quadtree.coordToZOrder(3, 2), 13
      test.strictEqual Quadtree.coordToZOrder(5, 3), 27
      test.strictEqual Quadtree.coordToZOrder(3, 6), 45
      test.strictEqual Quadtree.coordToZOrder(4, 4), 48
      test.strictEqual Quadtree.coordToZOrder(5, 6), 57
      test.strictEqual Quadtree.coordToZOrder(7, 7), 63
      test.done()

    coordsToIndex: (test) ->
      tree = new Quadtree(3)
      test.strictEqual tree.coordsToIndex(0, 0, 0, 0), 21
      test.done()

  console.log arguments.callee