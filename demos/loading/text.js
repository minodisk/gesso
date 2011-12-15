(function() {
  var Loading, NUMBERS, ticker, toColorString, toRGB;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred'];

  toRGB = function(h, s, v) {
    var b, f, g, hi, p, q, r, t;
    if (s === 0) {
      r = v;
      g = v;
      b = v;
    } else {
      h %= 360;
      hi = h / 60 >> 0;
      f = h / 60 - hi;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      switch (hi) {
        case 0:
          r = v;
          g = t;
          b = p;
          break;
        case 1:
          r = q;
          g = v;
          b = p;
          break;
        case 2:
          r = p;
          g = v;
          b = t;
          break;
        case 3:
          r = p;
          g = q;
          b = v;
          break;
        case 4:
          r = t;
          g = p;
          b = v;
          break;
        case 5:
          r = v;
          g = p;
          b = q;
      }
    }
    return r * 0xff << 16 | g * 0xff << 8 | b * 0xff;
  };

  toColorString = function(color, alpha) {
    if (color == null) color = 0;
    if (alpha == null) alpha = 1;
    return "rgba(" + (color >> 16 & 0xff) + "," + (color >> 8 & 0xff) + "," + (color & 0xff) + "," + (alpha < 0 ? 0 : alpha > 1 ? 1 : alpha) + ")";
  };

  ticker = (function() {
    return function(callback) {
      return setTimeout((function() {
        return callback((new Date()).getTime());
      }), 1000 / 30);
    };
  })();

  Loading = (function() {

    function Loading(canvas, onComplete) {
      this.canvas = canvas;
      this.onComplete = onComplete;
      this.onTicker = __bind(this.onTicker, this);
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.x = this.width / 2 >> 0;
      this.y = this.height / 2 >> 0;
      this.context = this.canvas.getContext('2d');
      this.context.translate(this.x, this.y);
      this.context.textBaseline = 'alphabetic';
      this.updated = false;
    }

    Loading.prototype.update = function(ratio) {
      var ones, percent, tenth;
      this.ratio = ratio;
      if (this.ratio === 0) {
        this.updated = true;
        this.currentFrame = 0;
        ticker(this.onTicker);
      }
      if (this.ratio === 1) this.updated = false;
      percent = ratio * 100;
      percent >>= 0;
      if (percent < 20) {
        percent = NUMBERS[percent];
      } else {
        ones = percent % 10;
        tenth = percent / 10;
        percent = NUMBERS[18 + (tenth >> 0)];
        if (ones !== 0) percent += '-' + NUMBERS[ones];
      }
      this.percent = percent;
    };

    Loading.prototype.onTicker = function(time) {
      var alpha, deltaFrame, gradient, hue, maxRotation, rotation;
      this.currentFrame++;
      this.context.fillStyle = '#ffffff';
      this.context.fillRect(-this.x, -this.y, this.canvas.width, this.canvas.height);
      alpha = 1;
      if (!this.updated) {
        if (this.completeFrame == null) this.completeFrame = this.currentFrame;
        deltaFrame = this.currentFrame - this.completeFrame;
        if (deltaFrame > 15) alpha = 1 - (deltaFrame - 15) / 8;
        if (alpha <= 0) {
          if (this.onComplete != null) {
            setTimeout(this.onComplete, 0);
            return;
          }
        }
      }
      hue = 180 + 180 * this.ratio;
      gradient = this.context.createLinearGradient(0, 0, this.width, 0);
      maxRotation = 90;
      for (rotation = 0; 0 <= maxRotation ? rotation < maxRotation : rotation > maxRotation; 0 <= maxRotation ? rotation++ : rotation--) {
        gradient.addColorStop(rotation / maxRotation, toColorString(toRGB(hue + rotation, 1, 1), alpha));
      }
      this.context.fillStyle = gradient;
      this.context.fillRect(-this.x, 0, this.width * this.ratio, 1);
      this.context.font = '900 24px "Helvetica", "Arial"';
      this.context.textAlign = 'right';
      this.context.fillText(this.percent, 0, 0);
      this.context.font = '100 24px "Helvetica", "Arial"';
      this.context.textAlign = 'left';
      this.context.fillText('percent', 0, 0);
      ticker(this.onTicker);
    };

    return Loading;

  })();

  document.addEventListener('DOMContentLoaded', function(e) {
    var counter, intervalId, loading;
    loading = new Loading(document.querySelector('canvas'), function() {
      return alert('complete');
    });
    counter = 0;
    loading.update(counter);
    intervalId = setInterval((function() {
      loading.update(++counter / 100);
      if (counter === 100) return clearInterval(intervalId);
    }), 50);
  });

}).call(this);
