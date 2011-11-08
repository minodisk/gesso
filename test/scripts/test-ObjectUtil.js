(function (require, exports) {
  var ObjectUtil = require('utils/ObjectUtil');

  var obj = {
    a: new Date(),
    b: 'foo',
    c: ['orange', 'apple'],
    d: 4,
    e: true
  };

  exports['utils/ObjectUtil'] = {

    clone: function (test) {
      var cloned = ObjectUtil.clone(obj);
      test.deepEqual(cloned, obj);
      test.strictEqual(typeof cloned.a, 'object');
      test.ok(cloned.a instanceof Date);
      test.done();
    },

    keys: function (test) {
      test.deepEqual(ObjectUtil.keys(obj), ['a', 'b', 'c', 'd', 'e']);
      test.done();
    }

  };

})(require, exports);