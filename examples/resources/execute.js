(function (window, require) {
  var ArrayUtil = require('utils/ArrayUtil');
  window.Stage = require('display/Stage');
  window.DisplayObject = require('display/DisplayObject');
  window.Bitmap = require('display/Bitmap');
  window.BlendMode = require('display/BlendMode');
  window.GradientType = require('display/GradientType');
  window.Loader = require('display/Loader');
  window.Shape = require('display/Shape');
  window.Sprite = require('display/Sprite');
  window.Event = require('events/Event');
  window.MouseEvent = require('events/MouseEvent');
  window.KeyboardEvent = require('events/KeyboardEvent');
  window.ColorMatrixFilter = require('filters/ColorMatrixFilter');
  window.PrewittFilter = require('filters/PrewittFilter');
  window.SobelFilter = require('filters/SobelFilter');
  window.LaplacianFilter = require('filters/LaplacianFilter');
  window.UnsharpMaskFilter = require('filters/UnsharpMaskFilter');
  window.BlurFilter = require('filters/BlurFilter');
  window.GaussianFilter = require('filters/GaussianFilter');
  window.MedianFilter = require('filters/MedianFilter');
  window.BilateralFilter = require('filters/BilateralFilter');
  window.Point = require('geom/Point');
  window.Rectangle = require('geom/Rectangle');
  window.Matrix = require('geom/Matrix');
  window.ColorMatrix = require('geom/ColorMatrix');
  window.TextField = require('text/TextField');
  window.TextFormat = require('text/TextFormat');
  window.TextFormatAlign = require('text/TextFormatAlign');
  window.TextFormatBaseline = require('text/TextFormatBaseline');
  window.Tween = require('tweens/Tween');
  window.Easing = require('tweens/Easing');

  window.addEventListener('DOMContentLoaded', function (e) {
    var executes, i, len0, execute, j, len1, child, script, canvas;
    executes = Array.prototype.slice.call(document.querySelectorAll('.execute'));
    for (i = 0, len0 = executes.length; i < len0; i++) {
      execute = executes[i];
      for (j = 0, len1 = execute.childNodes.length; j < len1; j++) {
        child = execute.childNodes[j];
        if (child instanceof HTMLPreElement) {
          script = child.textContent;
        } else if (child instanceof HTMLCanvasElement) {
          canvas = child;
        }
      }
      (new Function('canvas', script))(canvas);
    }
  }, false);
})(window, require);