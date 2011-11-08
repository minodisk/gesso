(function (require, exports) {
  var Timer = require('utils/Timer');

  exports.Timer = {
    'start -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getRunning(), true);
        test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 3000);

        test.done();
      });
      timer.start();
    },

    'start -> start -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 3000);

        test.done();
      });
      timer.start();

      setTimeout(function () {
        timer.start();
      }, 2500);
    },

    'start -> complete -> start': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 3000);

        timer.start();
      });
      timer.start();

      setTimeout(function () {
        test.done();
      }, 7000);
    },

    'start -> stop -> start -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        if (timer.getCurrentCount() !== timer.getRepeatCount()) {
          test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
        } else {
          test.strictEqual(_getTime(from), 3500);
        }
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 3500);

        test.done();
      });
      timer.start();
      setTimeout(function () {
        timer.stop();
        timer.start();
      }, 2500);
    },

    'start -> reset -> start -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        if (counter <= 2) {
          test.strictEqual(timer.getCurrentCount(), counter);
          test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
        } else {
          test.strictEqual(timer.getCurrentCount(), counter - 2);
          test.strictEqual(_getTime(from), 2500 + 1000 * timer.getCurrentCount());
        }
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 5500);

        test.done();
      });
      timer.start();
      setTimeout(function () {
        timer.reset();
        timer.start();
      }, 2500);
    },

    'start -> complete -> set delay -> reset -> start -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getRunning(), false);
        if (counter === 1) {
          test.strictEqual(timer.getDelay(), 1000);
          test.strictEqual(_getTime(from), 3000);

          timer.setDelay(900);
          timer.reset();
          timer.start();
        } else {
          test.strictEqual(timer.getDelay(), 900);
          test.strictEqual(_getTime(from), 3000 + 2700);

          test.done();
        }
      });
      timer.start();
    },

    'start -> set delay -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getRunning(), true);
        if (counter <= 2) {
          test.strictEqual(timer.getDelay(), 1000);
          test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
        } else {
          test.strictEqual(timer.getDelay(), 900);
          test.strictEqual(_getTime(from), 3400);
        }
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 900);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 3400);

        test.done();
      });
      timer.start();

      setTimeout(function () {
        timer.setDelay(900);
      }, 2500);
    },

    'start -> set repeatCount(>getCurrentCount()) -> complete': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
        if (counter <= 2) {
          test.strictEqual(timer.getRepeatCount(), 3);
        } else {
          test.strictEqual(timer.getRepeatCount(), 5);
        }
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRepeatCount(), 5);
        test.strictEqual(timer.getRunning(), false);
        test.strictEqual(_getTime(from), 5000);

        test.done();
      });
      timer.start();
      setTimeout(function () {
        timer.setRepeatCount(5);
      }, 2500);
    },

    'start -> set repeatCount(<=getCurrentCount())': function (test) {
      var counter = 0;
      var from = new Date();
      var timer = new Timer(1000, 3);
      timer.addListener(Timer.TIMER, function () {
        counter++;

        test.strictEqual(timer.getCurrentCount(), counter);
        test.strictEqual(timer.getCurrentCount() <= timer.getRepeatCount(), true);
        test.strictEqual(timer.getRepeatCount(), 3);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), true);
        test.strictEqual(_getTime(from), 1000 * timer.getCurrentCount());
      });
      timer.addListener(Timer.TIMER_COMPLETE, function () {
        test.strictEqual('failure: complete', '');
      });
      timer.start();
      setTimeout(function () {
        timer.setRepeatCount(2);
      }, 2500);
      setTimeout(function () {
        test.strictEqual(timer.getCurrentCount(), timer.getRepeatCount());
        test.strictEqual(timer.getRepeatCount(), 2);
        test.strictEqual(timer.getDelay(), 1000);
        test.strictEqual(timer.getRunning(), false);
        test.done();
      }, 5000);
    }

  };

  function _getTime(from) {
    return Math.floor(((new Date()).getTime() - from.getTime()) / 100) * 100;
  }

})(require, exports);