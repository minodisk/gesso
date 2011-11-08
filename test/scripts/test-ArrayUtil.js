(function (require, exports) {
  var ArrayUtil = require('utils/ArrayUtil');

  exports['utils/ArrayUtil'] = {
    indexOf : function (test) {
      var array = [2, 5, 9, 2];
      test.strictEqual(ArrayUtil.indexOf(array, 2), 0);
      test.strictEqual(ArrayUtil.indexOf(array, 7), -1);
      test.strictEqual(ArrayUtil.indexOf(array, 2, 3), 3);
      test.strictEqual(ArrayUtil.indexOf(array, 2, 0), 0);
      test.strictEqual(ArrayUtil.indexOf(array, 2, -4), 0);
      test.strictEqual(ArrayUtil.indexOf(array, 2, -1), 3);
      test.done();
    },

    lastIndexOf: function (test) {
      var array = [2, 5, 9, 2];
      test.strictEqual(ArrayUtil.lastIndexOf(array, 2), 3);
      test.strictEqual(ArrayUtil.lastIndexOf(array, 7), -1);
      test.strictEqual(ArrayUtil.lastIndexOf(array, 2, 3), 3);
      test.strictEqual(ArrayUtil.lastIndexOf(array, 2, 2), 0);
      test.strictEqual(ArrayUtil.lastIndexOf(array, 2, -2), 0);
      test.strictEqual(ArrayUtil.lastIndexOf(array, 2, -1), 3);
      test.done();
    },

    filter: function (test) {
      var arr = [12, 5, 8, 130, 44];
      var i = 0;
      test.deepEqual(
        ArrayUtil.filter(arr, function (element, index, array) {
          test.strictEqual(index, i++);
          test.deepEqual(array, arr);
          return element >= 10;
        }),
        [12, 130, 44]
      );
      test.done();
    },

    forEach: function (test) {
      var arr = [2, 5, 9];
      var i = 0;
      ArrayUtil.forEach(arr, function (element, index, array) {
        switch (i) {
          case 0:
            test.strictEqual(element, 2);
            break;
          case 1:
            test.strictEqual(element, 5);
            break;
          case 2:
            test.strictEqual(element, 9);
            break;
        }
        test.strictEqual(index, i++);
        test.deepEqual(array, arr);
      });

      var Buffer = {
        buffer: '',
        write: function (str) {
          this.buffer += String(str);
        }
      };
      ArrayUtil.forEach(['foo', 'bar', 'baz'], Buffer.write, Buffer);
      test.strictEqual(Buffer.buffer, 'foobarbaz');

      test.done();
    },

    every: function (test) {
      test.strictEqual(
        ArrayUtil.every([12, 5, 8, 130, 44], function (element, index, array) {
          return element >= 10;
        }),
        false
      );

      test.strictEqual(
        ArrayUtil.every([12, 54, 18, 130, 44],
          function (element, index, array) {
            return element >= 10;
          }),
        true
      );

      test.done();
    },

    map: function (test) {
      test.deepEqual(
        ArrayUtil.map(['foot', 'goose', 'moose'],
          function makePseudoPlural(single) {
            return single.replace(/o/g, 'e');
          }
        ),
        ['feet', 'geese', 'meese']
      );

      test.deepEqual(
        ArrayUtil.map([1, 4, 9], Math.sqrt),
        [1, 2, 3]
      );

      test.deepEqual(
        ArrayUtil.map.call(null, 'Hello World', function (x) {
          return x.charCodeAt(0);
        }),
        [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
      );

      test.done();
    },

    some: function (test) {
      test.strictEqual(
        ArrayUtil.some([2, 5, 8, 1, 4], function (element, index, array) {
          return element >= 10;
        }),
        false
      );

      test.strictEqual(
        ArrayUtil.some([12, 5, 8, 1, 4], function (element, index, array) {
          return element >= 10;
        }),
        true
      );

      test.done();
    },

    reduce: function (test) {
      var array, copy;

      array = [0, 1, 2, 3];
      copy = array.concat();
      test.strictEqual(ArrayUtil.reduce(copy, function (a, b) {
        return a + b;
      }), 6);
      test.deepEqual(copy, array);

      array = [
        [0, 1],
        [2, 3],
        [4, 5]
      ];
      copy = array.concat();
      test.deepEqual(ArrayUtil.reduce(copy, function (a, b) {
        return a.concat(b);
      }, []), [0, 1, 2, 3, 4, 5]);
      test.deepEqual(copy, array);
      test.done();
    },

    reduceRight: function (test) {
      var array, copy;

      array = [0, 1, 2, 3];
      copy = array.concat();
      test.strictEqual(ArrayUtil.reduceRight(copy, function (a, b) {
        return a + b;
      }), 6);
      test.deepEqual(copy, array);

      array = [
        [0, 1],
        [2, 3],
        [4, 5]
      ];
      copy = array.concat();
      test.deepEqual(ArrayUtil.reduceRight(copy, function (a, b) {
        return a.concat(b);
      }, []), [4, 5, 2, 3, 0, 1]);
      test.deepEqual(copy, array);
      test.done();
    },

    toArray: function (test) {
      test.deepEqual(ArrayUtil.toArray({
        '0': 'foo',
        '1': 'bar',
        '2': 'baz',
        length: 3
      }), ['foo', 'bar', 'baz']);
      test.done();
    },

    shuffle: function (test) {
      var src = 'abcdefghijklmnopqrstuvwxyz';
      var array = src.split('');
      var i = 100;
      while (i--) {
        test.notStrictEqual(ArrayUtil.shuffle(array).join(''), src);
      }
      test.done();
    },

    unique: function (test) {
      test.deepEqual(ArrayUtil.unique(['foo', 'bar', 'baz', 'foo', 'foo']),
        ['foo', 'bar', 'baz']);
      test.deepEqual(ArrayUtil.unique([1, 1, 1]), [1]);
      test.deepEqual(ArrayUtil.unique([1, 4, 1]), [1, 4]);
      test.deepEqual(ArrayUtil.unique([1, 3, 2, 2, 3]), [1, 3, 2]);
      test.done();
    },

    rotate: function (test) {
      test.deepEqual(ArrayUtil.rotate(['a', 'b', 'c', 'd']),
        ['b', 'c', 'd', 'a']);
      test.deepEqual(ArrayUtil.rotate(['a', 'b', 'c', 'd'], 2),
        ['c', 'd', 'a', 'b']);
      test.deepEqual(ArrayUtil.rotate(['a', 'b', 'c', 'd'], -1),
        ['d', 'a', 'b', 'c']);
      test.deepEqual(ArrayUtil.rotate(['a', 'b', 'c', 'd'], -3),
        ['b', 'c', 'd', 'a']);
      test.done();
    },

    transpose: function (test) {
      test.deepEqual(ArrayUtil.transpose([
        [1, 2],
        [3, 4],
        [5, 6]
      ]), [
        [1, 3, 5],
        [2, 4, 6]
      ]);
      test.deepEqual(ArrayUtil.transpose([]), []);
      /*test.throws(ArrayUtil.transpose([1, 2, 3]));
      test.throws(ArrayUtil.transpose([
        [1, 2],
        [3, 4, 5],
        [6, 7]
      ]));*/
      test.done();
    }
  };

  /*
   exports.ArrayUtil.dictionarySort = {

   'single-byte': {

   'number(basic)': function (test) {
   var src = [
   '123', '132', '213', '231', '312', '321'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'number': function (test) {
   var src = [
   '0', '00', '000', '001', '01', '010', '011',
   '1', '10', '100', '101', '11', '110', '111'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'alphabet': function (test) {
   var src = [
   'A', 'a',
   'AA', 'Aa', 'aA', 'aa',
   'AAA', 'AAa', 'AaA', 'Aaa', 'aAA', 'aAa', 'aaA', 'aaa',
   'ab', 'abc', 'b'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'mixed': function (test) {
   var src = [
   'A10B1', 'A10B10', 'A10B2', 'A1B1', 'A1B10', 'A1B2',
   'A2B1', 'A2B10', 'A2B2'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'filename': function (test) {
   var src = [
   '1.txt', '10.txt', '100.txt',
   '2.txt', '20.txt'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   }

   },

   'multibyte': {

   'number': function (test) {
   var src = [
   '000', '00０', '0０0', '0００',
   '０00', '０0０', '００0', '０００'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'alphabet': function (test) {
   var src = [
   'AＡaａ', 'AＡａa', 'AaＡａ', 'AaａＡ', 'AａＡa', 'AａaＡ',
   'ＡAaａ', 'ＡAａa', 'ＡaAａ', 'ＡaａA', 'ＡａAa', 'ＡａaA',
   'aAＡａ', 'aAａＡ', 'aＡAａ', 'aＡａA', 'aａAＡ', 'aａＡA',
   'ａAＡa', 'ａAaＡ', 'ａＡAa', 'ａＡaA', 'ａaAＡ', 'ａaＡA'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'japanese aiueo': function (test) {
   var src = [
   'ぁ', 'ァ', 'ｧ', 'あ', 'ア', 'ｱ',
   'ぃ', 'ィ', 'ｨ', 'い', 'イ', 'ｲ',
   'ぅ', 'ゥ', 'ｩ', 'う', 'ウ', 'ｳ', 'ゔ', 'ヴ',
   'ぇ', 'ェ', 'ｪ', 'え', 'エ', 'ｴ',
   'ぉ', 'ォ', 'ｫ', 'お', 'オ', 'ｵ',
   'ゎ', 'ヮ', 'わ', 'ワ', 'ﾜ',
   'ゐ', 'ヰ',
   'ゑ', 'ヱ',
   'を', 'ヲ', 'ｦ',
   'ん', 'ン', 'ﾝ'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'japanese a': function (test) {
   var src = [
   'ぁぁぁ', 'ぁぁァ', 'ぁぁｧ',
   'ぁァぁ', 'ぁァァ', 'ぁァｧ',
   'ぁｧぁ', 'ぁｧァ', 'ぁｧｧ',
   'ァぁぁ', 'ァぁァ', 'ァぁｧ',
   'ァァぁ', 'ァァァ', 'ァァｧ',
   'ァｧぁ', 'ァｧァ', 'ァｧｧ',
   'ｧぁぁ', 'ｧぁァ', 'ｧぁｧ',
   'ｧァぁ', 'ｧァァ', 'ｧァｧ',
   'ｧｧぁ', 'ｧｧァ', 'ｧｧｧ'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'complex': function (test) {
   var src = [
   'ァ１',
   'あ1',
   'ぁ2',
   'ｧ２',
   'ぁァｧ０0アaａAＡ',
   'ぁァｧ０0アaａAＡｱ',
   'ぁァｧ０0アaａAＡｱあ',
   'ァｧぁ０0ｱＡａAあaア',
   'ｧァぁ0０あaｱAアＡａ',
   'ｧァぁAaＡ０ａあ0ｱア',
   'ｧぁァＡａAア0aあｱ０',
   'ぁｧァあａ0０aアＡAｱ',
   'ｧぁァあＡ０アa0ａｱA',
   'ァｧぁアaAａあ0ｱ０Ａ',
   'ぁァｧあAａアＡ0ｱ０a',
   'い234',
   'い２３４',
   'イ234',
   'ぃ５',
   'い５',
   'う22',
   'う2２'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   }

   },

   'web': {

   //http://www.atmarkit.co.jp/bbs/phpBB/viewtopic.php?topic=27978&forum=26
   'atmarkit.co.jp': function (test) {
   var src = [
   'こじま',
   'ごとう',
   'こばやし'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   //http://www.softvision.co.jp/dbpro/help/guide/jishoord.htm
   'softvision.co.jp': function (test) {
   var src = [
   'かっこ',
   'かつご',
   'がっこ',
   'かっこう',
   'かつごう',
   'がっこう',
   'かっこうあざみ',
   'がっこうちゅう',
   'カッコー',
   'かっこく'
   ];
   test.deepEqual(ArrayUtil.dictionarySort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   }

   }

   };

   exports.ArrayUtil.naturalSort = {

   'single-byte': {

   'number(basic)': function (test) {
   var src = ['123', '132', '213', '231', '312', '321'];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'number': function (test) {
   var src = ['0', '00', '000', '1', '01', '001', '10', '010', '11', '011', '100', '101', '110', '111'];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'number(decimal)': function (test) {
   var src = [
   '.0', '.00', '0', '00', '000', '0.', '00.', '0.0',
   '1', '01', '001', '0001', '1.', '001.', '1.0', '1.00', '01.0',
   '10', '010', '00010', '10.', '0010.', '10.0', '10.00', '010.0',
   '11', '011', '000000000000000000000000000000000000011', '11.0',
   '100', '101', '109.99999', '110', '0000000110', '110.00001', '111'
   ];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'alphabet': function (test) {
   var src = [
   'A', 'a',
   'AA', 'Aa', 'aA', 'aa',
   'AAA', 'AAa', 'AaA', 'Aaa', 'aAA', 'aAa', 'aaA', 'aaa',
   'ab', 'abc', 'b'
   ];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'mixed': function (test) {
   var src = [
   '0', '1', '1.1',
   'a0', 'a00', 'a000',
   'a1', 'a01', 'a001',
   'a1.1', 'a01.1', 'a001.1'
   ];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'filename': function (test) {
   var src = ['1.txt', '2.txt', '10.txt', '20.txt', '100.txt'];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   },

   'version': function (test) {
   var src = [
   '0.0.1', '0.0.2', '0.0.14',
   '0.3.0', '0.3.00',
   '0.3.1', '0.3.2', '0.3.02', '0.3.3', '0.3.12', '0.3.020', '0.3.21',
   '1.0.0', '1.0.1', '1.0.10', '1.0.100', '1.1.0', '1.001.1', '1.2.0'
   ];
   test.deepEqual(ArrayUtil.naturalSort(ArrayUtil.shuffle(src.concat())),
   src);
   test.done();
   }/*

   },

   'web': {

   'http://sourcefrog.net/projects/natsort/': {

   'raw': function (test) {
   var src;
   src = ['rfc1.txt', 'rfc822.txt', 'rfc2086.txt'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['a', 'a0', 'a1', 'a1a', 'a1b', 'a2', 'a10', 'a20'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['x2-g8', 'x2-y7', 'x2-y08', 'x8-y8'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['1.001', '1.002', '1.010', '1.02', '1.1', '1.3'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   test.done();
   },

   'multibyte': function (test) {
   var src;
   src = [
   'あーるえふしー1.txt', 'アぁルエフシぃ１.txt',
   'ああるえふしぃ82２.txt', 'ああるえふしぃ8２2.txt', 'ああるえふしぃ８22.txt', 'ああるえふしー822.txt',
   'あーるえふしー2086.txt', 'あーるえふしー208６.txt', 'あーるえふしー20８6.txt', 'あーるえふしー2０86.txt',
   'あーるえふしー２086.txt', 'ぁぃ'
   ];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['あ', 'ぁ0', 'ァ1', 'ぁ1ア', 'ァ1い', 'ァ2', 'ぁ10', 'あ20'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['x2-g8', 'x2-y7', 'x2-y08', 'x8-y8'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['1.001', '1.002', '1.010', '1.02', '1.1', '1.3'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   test.done();
   },

   'complex': function (test) {
   var src;
   src = [
   '1.001', '1.002', '1.010', '1.02', '1.1', '1.3',
   'a', 'a0', 'a1', 'a1a', 'a1b', 'a2', 'a10', 'a20',
   'rfc1.txt', 'rfc822.txt', 'rfc2086.txt',
   'x2-g8', 'x2-y7', 'x2-y08', 'x8-y8'
   ];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   test.done();
   }

   },

   'http://rubygems.org/gems/naturalsort': function (test) {
   var src;
   src = ['a1', 'a2', 'a11', 'a12','a21'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['A', 'a', 'B', 'b', 'C', 'c'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['x_1', 'x__2'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   src = ['x2-g8', 'x2-y7', 'x2-y08', 'x8-y8'];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   test.done();
   },

   'http://sourcefrog.net/projects/natsort/example-out.txt': function (test) {
   var src;
   src = [
   '1-2',
   '1-02',
   '1-20',
   '10-20',
   'fred',
   'jane',
   'pic01',
   'pic2',
   'pic02',
   'pic02a',
   'pic3',
   'pic4',
   'pic 4 else',
   'pic 5',
   'pic05',
   'pic 5 ',
   'pic 5 something',
   'pic 6',
   'pic   7',
   'pic100',
   'pic100a',
   'pic120',
   'pic121',
   'pic02000',
   'tom',
   'x2-g8',
   'x2-y7',
   'x2-y08',
   'x8-y8'
   ];
   test.deepEqual(arrayutil.naturalSort(arrayutil.shuffle(src.concat())),
   src);
   test.done();
   }*/

})(require, exports);