(function (window) {
  window.Stage = mn.dsk.display.Stage;
  window.DisplayObject = mn.dsk.display.DisplayObject;
  window.Bitmap = mn.dsk.display.Bitmap;
  window.GradientType = mn.dsk.display.GradientType;
  window.Loader = mn.dsk.display.Loader;
  window.Shape = mn.dsk.display.Shape;
  window.Sprite = mn.dsk.display.Sprite;
  window.Event = mn.dsk.events.Event;
  window.MouseEvent = mn.dsk.events.MouseEvent;
  window.KeyboardEvent = mn.dsk.events.KeyboardEvent;
  window.Vector = mn.dsk.geom.Vector;
  window.Rectangle = mn.dsk.geom.Rectangle;
  window.Matrix = mn.dsk.geom.Matrix;
  window.TextField = mn.dsk.text.TextField;
  window.TextFormat = mn.dsk.text.TextFormat;
  window.TextFormatAlign = mn.dsk.text.TextFormatAlign;
  window.TextFormatBaseline = mn.dsk.text.TextFormatBaseline;

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
})(this);