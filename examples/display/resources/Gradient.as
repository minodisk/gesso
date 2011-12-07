package {
import flash.display.StageScaleMode;
import flash.display.StageAlign;
import flash.display.GradientType;
import flash.display.Shape;
import flash.display.Sprite;
import flash.events.Event;
import flash.geom.Matrix;
import flash.geom.Point;

/*
mxmlc -static-link-runtime-shared-libraries=true -o gradient.swf -debug -default-size 400 200 -default-frame-rate=60 Gradient.as
 */

public class Gradient extends Sprite {
  
  private var angle:Number;

  public function Gradient() {
    stage.scaleMode = StageScaleMode.NO_SCALE;
    stage.align = StageAlign.TOP_LEFT;
    angle = 0;
    onEnterFrame();
    addEventListener(Event.ENTER_FRAME, onEnterFrame);
  }

  private function onEnterFrame(e:Event = null):void {
    var matrix:Matrix = new Matrix();
    matrix.createGradientBox(400, 400, angle, 0, -100);
    graphics.clear();
    graphics.beginGradientFill(GradientType.LINEAR,
      [0xff0000, 0x0000ff], [1, 1], [0x00, 0xff], matrix, 'pad', 'rgb', 1);
    graphics.drawRect(0, 0, 400, 200);
    graphics.endFill();
    angle += Math.PI / 180;
  }

}
}
