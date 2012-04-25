{Stage, Sprite, Shape} = mn.dsk.display
{TextField, TextFormat} = mn.dsk.text
{Vector, Polar} = mn.dsk.geom

class Bird extends Shape

  constructor: (@speed, @repulsive, @parallel, @attraction, @debug = false)->
    super()
    @graphics.lineStyle 1, if @debug then 0xff0000 else 0xffffff
    @graphics.moveTo 6, 0
    @graphics.lineTo -6, 4
    @graphics.lineTo -6, -4
    @graphics.lineTo 6, 0
    if @debug
      @graphics.lineStyle 0.5, 0xff0000
      @graphics.drawCircle 0, 0, @repulsive
      @graphics.drawCircle 0, 0, @parallel
      @graphics.drawCircle 0, 0, @attraction

  distanceFrom: (bird)->
    x = bird.x - @x
    y = bird.y - @y
    Math.sqrt x * x, y * y

  init: ->
    @velocity = new Polar @speed, @rotation * RPD

  update: (repulsives, parallels, attractions)->
#    repulsives = []
#    parallels = []
#    attractions = []


    if @x > 0 and @x < @stage.width and @y > 0 and @y < @stage.height
      velocity = new Polar @speed, @rotation * RPD

      if parallels.length
        polar = new Polar
        for bird in parallels
          polar.add bird.velocity
        polar.distance /= parallels.length
        polar.angle /= parallels.length

        velocity.distance += (polar.distance - velocity.distance) / 100
        velocity.angle += (polar.angle - velocity.angle) / 30

      if repulsives.length
        direction = new Vector
        for bird in repulsives
          direction.add new Vector(@x, @y).subtract(new Vector(bird.x, bird.y))

        velocity.distance += (direction.distance - velocity.distance) / 100
        velocity.angle += (direction.angle - velocity.angle) / 30

      if attractions.length
        direction = new Vector
        for bird in attractions
          direction.add new Vector(@x, @y).subtract(new Vector(bird.x, bird.y))
        direction.multiple -1

        velocity.distance += (direction.distance - velocity.distance) / 100
        velocity.angle += (direction.angle - velocity.angle) / 30


    else
      center = new Vector @stage.width / 2, @stage.height / 2
      direction = center.subtract new Vector @x, @y
      velocity = direction.toPolar()
      velocity.distance = 1

    @x += velocity.x
    @y += velocity.y
    @rotation = velocity.angle * DPR
    @velocity = velocity


stage = new Stage document.getElementsByTagName('canvas')[0]
#stage.debug = true

DPR = 180 / Math.PI
RPD = Math.PI / 180

birds = []
i = len = 100
while i--
  birds.push bird = new Bird 1, 30, 60, 90, i is len - 1
  bird.x = stage.width * Math.random()
  bird.y = stage.height * Math.random()
  bird.rotation = 360 * Math.random()
  bird.init()
  stage.addChild bird

debugView = new Shape()
debugView.graphics.lineStyle 1, 0xff0000
stage.addChildAt debugView, 0


render = true
stage.addEventListener 'click', ->
  render = !render
  return
tf = new TextField()
tf.textFormat = new TextFormat 'monospace', 13, 0xFFFFFF
stage.addChild tf
stage.addEventListener 'enterFrame', ->
  if render

    for bird, i in birds #when bird.debug
      repulsives = []
      parallels = []
      attractions = []
      for b in birds when b isnt bird
        distance = bird.distanceFrom b
        if distance < bird.repulsive
          repulsives.push b
        else if distance < bird.parallel
          parallels.push b
        else if distance < bird.attraction
          attractions.push b
      bird.update repulsives, parallels, attractions

    tf.text = "fps: #{stage.frameRate}"
  return
