

class Renderer

  constructor:(@scene)->

  render:->
    viewMatrix = new Matrix
    worldMatrix = new Matrix
    projectionMatrix = new Matrix
    screenMatrix = new Matrix
    for camera in @scene._cameraList
      viewMatrix.setupView camera
      for screen in camera._screenList
        screen.graphics.clear()
        projectionMatrix.setupProjection camera, screen
        screenMatrix.setupScreen screen
        for display in @scene._displayList
          worldMatrix.setupLocalToParent display.position, display.orientation

          wvMatrix = Matrix.multiply worldMatrix, viewMatrix

          vertices = []
          for vertex, i in display.vertices
            #vertex = Matrix.multiply vertex, worldMatrix
            #vertex = Matrix.multiply vertex, viewMatrix
            vertex = Matrix.multiply vertex, wvMatrix
            w = vertex.z
            vertex = Matrix.multiply vertex, projectionMatrix
            vertex = Vector.divide vertex, w
            vertex = Matrix.multiply vertex, screenMatrix
            vertices[i] = vertex
          display.drawAt screen, vertices
