(function (require, exports) {
  var StringUtil = require('utils/StringUtil');

  exports['utils/StringUtil'] = {

    split: function (test) {
      test.deepEqual(StringUtil.split('abcdecf'), ['abcdecf']);
      test.deepEqual(StringUtil.split('abcdecf', 'c'), ['ab', 'de', 'f']);
      test.deepEqual(StringUtil.split('abcdecf', /c/), ['ab', 'de', 'f']);
      test.deepEqual(StringUtil.split('abcdecf', /c/g), ['ab', 'de', 'f']);
      test.deepEqual(StringUtil.split('abcdecf', /(c)/), ['ab', 'c', 'de', 'c', 'f']);
      test.deepEqual(StringUtil.split('abcdecf', /(.)/), ["", "a", "", "b", "", "c", "", "d", "", "e", "", "c", "", "f", ""]);
      test.deepEqual(StringUtil.split('abcdecf', /(.{2})/), ["", "ab", "", "cd", "", "ec", "f"]);
      test.deepEqual(StringUtil.split('abcdecf', /(c)(.)/), ["ab", "c", "d", "e", "c", "f", ""]);
      test.deepEqual(StringUtil.split('abcdecf', 'c', 2), ['ab', 'de']);
      test.deepEqual(StringUtil.split('abcdecf', /c/, 2), ['ab', 'de']);
      test.deepEqual(StringUtil.split('abcdecf', /c/g, 2), ['ab', 'de']);
      test.deepEqual(StringUtil.split('abcdecf', /(c)/, 2), ['ab', 'c']);
      test.deepEqual(StringUtil.split('abcdecf', ''), ['a', 'b', 'c', 'd', 'e', 'c', 'f']);
      test.done();
    },

    trim: function (test) {
      test.strictEqual(StringUtil.trim('   foo  '), 'foo');
      test.done();
    },

    trimLeft: function (test) {
      test.strictEqual(StringUtil.trimLeft('   foo  '), 'foo  ');
      test.done();
    },

    trimRight: function (test) {
      test.strictEqual(StringUtil.trimRight('   foo  '), '   foo');
      test.done();
    },

    pad: function (test) {
      test.strictEqual(StringUtil.pad(7, 3), ' 7 ');
      test.strictEqual(StringUtil.pad(7, 3, '0'), '070');
      test.strictEqual(StringUtil.pad(1234, 3, '0'), '1234');
      test.strictEqual(StringUtil.pad('foo', 10), '   foo    ');
      test.done();
    },

    padLeft: function (test) {
      test.strictEqual(StringUtil.padLeft(7, 3), '  7');
      test.strictEqual(StringUtil.padLeft(7, 3, '0'), '007');
      test.strictEqual(StringUtil.padLeft(1234, 3, '0'), '1234');
      test.strictEqual(StringUtil.padLeft('P', 3, 'O'), 'OOP');
      test.done();
    },

    padRight: function (test) {
      test.strictEqual(StringUtil.padRight(7, 3), '7  ');
      test.strictEqual(StringUtil.padRight(7, 3, '0'), '700');
      test.strictEqual(StringUtil.padRight(1234, 3, '0'), '1234');
      test.strictEqual(StringUtil.padRight('T', 3, 'D'), 'TDD');
      test.done();
    },

    repeat: function (test) {
      test.strictEqual(StringUtil.repeat(7, 3), '777');
      test.strictEqual(StringUtil.repeat('foo', 2), 'foofoo');
      test.done();
    },

    insert: function (test) {
      test.strictEqual(StringUtil.insert('foobaz', 3, 'bar'), 'foobarbaz');
      test.done();
    },
    
    reverse: function (test) {
      test.strictEqual(StringUtil.reverse('foobar'), 'raboof');
      test.strictEqual(StringUtil.reverse('borroworrob'), 'borroworrob');
      test.strictEqual(StringUtil.reverse('しんぶんし'), 'しんぶんし');
      test.done();
    }
  }

})(require, exports);