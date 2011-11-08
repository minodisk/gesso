(function () {
  var EventEmitter = require('events.EventEmitter');

  function Timer(delay, repeatCount/* = 0 */) {
    this._constructor.apply(this, arguments);
  }

  Timer.TIMER = 'timer';
  Timer.TIMER_COMPLETE = 'timerComplete';

  Timer.prototype = new EventEmitter();

  Timer.prototype.getDelay = function () {
    return this._delay;
  };

  Timer.prototype.setDelay = function (value) {
    var running = this._running;
    this.stop();
    this._delay = value;
    if (running) {
      this.start();
    }
  };

  Timer.prototype.getRepeatCount = function () {
    return this._repeatCount;
  };

  Timer.prototype.setRepeatCount = function (value) {
    this._repeatCount = value;
    var isEndless = (this._repeatCount === 0);
    var isComplete = (this._currentCount >= this._repeatCount);
    if (!isEndless && isComplete) {
      this.stop();
    }
  };

  Timer.prototype.getCurrentCount = function () {
    return this._currentCount;
  };

  Timer.prototype.getRunning = function () {
    return this._running;
  };

  Timer.prototype._constructor = function (delay, repeatCount/* = 0 */) {
    delay = Number(delay);
    if (isNaN(delay)) {
      throw new Error('Timer constructor requires delay as Number.');
    }
    repeatCount = Number(repeatCount);
    repeatCount = (isNaN(repeatCount)) ? 0 : repeatCount;

    this._delay = delay;
    this._repeatCount = repeatCount;
    this.reset();
  };

  Timer.prototype.reset = function () {
    this.stop();
    this._currentCount = 0;
  };

  Timer.prototype.start = function () {
    var isEndless = (this._repeatCount === 0);
    var isComplete = (this._currentCount >= this._repeatCount);
    if (!this._running && (isEndless || !isComplete)) {
      if (this._intervalId) {
        clearInterval(this._intervalId);
      }
      this._running = true;
      var that = this;
      this._intervalId = setInterval(function () {
        that._onInterval(that);
      }, this._delay);
    }
  };

  Timer.prototype.stop = function () {
    this._running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  };

  Timer.prototype._onInterval = function (that) {
    var isEndless = (that._repeatCount === 0);
    var isComplete = (++that._currentCount >= that._repeatCount);
    that.emit(Timer.TIMER);
    if (!isEndless && isComplete) {
      that.stop();
      that.emit(Timer.TIMER_COMPLETE);
    }
  };

  return Timer;
});