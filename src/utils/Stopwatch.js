(function () {
  var ObjectUtil = require('ObjectUtil');
  var StringUtil = require('StringUtil');

  var Stopwatch = {};
  var _list = {};

  Stopwatch.start = function (name) {
    var data;
    if (!(name in _list)) {
      data = _list[name] = {};
      data.counter = 0;
      data.total = 0;
    } else {
      data = _list[name];
    }
    data._startAt = (new Date()).getTime();
  };

  Stopwatch.stop = function (name) {
    var data = _list[name];
    if (data && typeof data._startAt !== 'undefined') {
      data.counter++;
      data.total += (new Date()).getTime() - data._startAt;
      data.average = data.total / data.counter;
      delete data._startAt;
    }
  };

  Stopwatch.getResult = function (name) {
    return ObjectUtil.clone(_list[name]);
  };

  Stopwatch.getResults = function () {
    return ObjectUtil.clone(_list);
  };

  Stopwatch.getResultString = function (name, max) {
    if (typeof max === 'undefined') {
      max = 0;
    }
    var data = _list[name];
    return StringUtil.padRight(name, max, ' ') + ' : ' + data.total + '(ms) / ' +
           data.counter + ' = ' + data.average + '(ms)';
  };

  Stopwatch.getResultsString = function () {
    var name;
    var max = 'name'.length;
    for (name in _list) {
      max = Math.max(max, name.length);
    }
    var rows = [];
    for (name in _list) {
      rows.push(this.getResultString(name, max));
    }
    return rows.join('\n');
  };

  return Stopwatch;
});