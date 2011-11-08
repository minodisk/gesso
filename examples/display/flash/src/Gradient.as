package {

  import flash.display.GradientType;
  import flash.display.Sprite;
  import flash.events.Event;
  import flash.geom.Matrix;

  public class Gradient extends Sprite {

    public function Gradient() {
      var rotation:Number = 0;
      addEventListener(Event.ENTER_FRAME, function (e:Event):void {
        var matrix:Matrix = new Matrix();
        matrix.createGradientBox(512, 256, rotation, 0, 0);

        graphics.clear();
        graphics.beginGradientFill(GradientType.LINEAR, [0xff0000, 0x0000ff], [1, 1], [0x00, 0xff], matrix);
        graphics.drawRect(0, 0, 512, 256);
        graphics.endFill();

        /*graphics.context.lineWidth = 5;
        graphics.drawCircle(box.x0, box.y0, 8);
        graphics.stroke('#ffff00');
        graphics.drawCircle(box.x1, box.y1, 8);
        graphics.stroke('#00ffff');*/

        rotation += Math.PI / 180;
      });
    }


  }


}

