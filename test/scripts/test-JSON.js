(function(require, exports) {
  var JSON = require('serialization/JSON')
    , DateFormat = require('serialization/DateFormat');

  exports['serialization/JSON'] = {
    stringify: {
      array   : function(test) {
        test.strictEqual(JSON.stringify(['e', {pluribus: 'unum'}]),
          '["e",{"pluribus":"unum"}]');
        test.done();
      },
      date    : function(test) {
        var counter = 0;
        var intervalId = setInterval(function() {
          var date = new Date();
          test.strictEqual(JSON.stringify([date]),
            '["' + DateFormat.stringifyJSON(date) + '"]');
          if (++counter === 10) {
            clearInterval(intervalId);
            test.done();
          }
        }, 100);
      },
      replacer: function(test) {
        var date = new Date();
        var dateStr = DateFormat.stringifyJSON(date);
        test.strictEqual(JSON.stringify([date], function(key, value) {
          return this[key] instanceof Date ?
            'Date(' + DateFormat.stringifyJSON(date) + ')' : value;
        }), '["Date(' + dateStr + ')"]');
        test.done();
      },
      space   : function(test) {
        test.strictEqual(JSON.stringify(['e', {pluribus: 'unum'}], null, '\t'),
          '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]');
        test.done();
      }
    },
    parse    : {
      array   : function(test) {
        test.deepEqual(JSON.parse('["e",{"pluribus":"unum"}]'),
          ['e', {pluribus: 'unum'}]);
        test.done();
      },
      date    : function(test) {
        var date = new Date();
        var dateStr = DateFormat.stringifyJSON(date);
        test.notDeepEqual(JSON.parse('["' + dateStr + '"]'), [date]);
        test.done();
      },
      reviver : function(test) {
        var date = new Date();
        var dateStr = DateFormat.stringifyJSON(date);
        test.deepEqual(JSON.parse('["' + dateStr + '"]', function(key, value) {
          if (typeof value === 'string') {
            return DateFormat.parseJSON(value);
          }
          return value;
        }), [date]);
        test.done();
      },
      reviver2: function(test) {
        var date = new Date(2001, 9 - 1, 9);
        test.deepEqual(JSON.parse('["Date(09/09/2001)"]', function(key, value) {
          var d;
          if (typeof value === 'string' &&
            value.slice(0, 5) === 'Date(' &&
            value.slice(-1) === ')') {
            d = new Date(value.slice(5, -1));
            if (d) {
              return d;
            }
          }
          return value;
        }), [date]);
        test.done();
      }
    }
  };
})(require, exports);