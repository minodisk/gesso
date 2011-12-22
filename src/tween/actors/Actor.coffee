module.exports = class Actor

  constructor:->
    @running = false

  stop:->
    @running = false

  reset:->
    @running = false
