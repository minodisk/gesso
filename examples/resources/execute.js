(function (window, require) {
  var ArrayUtil = require('utils/ArrayUtil');
  require('inherit');
  window.Stage = require('display/Stage');
  window.DisplayObject = require('display/DisplayObject');
  window.Bitmap = require('display/Bitmap');
  window.Shape = require('display/Shape');
  window.Sprite = require('display/Sprite');
  window.TextField = require('text/TextField');
  window.TextFormat = require('text/TextFormat');
  window.TextFormatBaseline = require('text/TextFormatBaseline');
  window.Rectangle = require('geom/Rectangle');
  window.addEventListener('DOMContentLoaded', function (e) {
    var executes = document.querySelectorAll('.execute');
    ArrayUtil.forEach(executes, function (elem) {
      var children = ArrayUtil.filter(elem.childNodes, function (elem) {
        return !(elem instanceof Text);
      });
      (new Function('canvas', children[0].textContent))(children[1]);
    });
  }, false);
})(window, require);