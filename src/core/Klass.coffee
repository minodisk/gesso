module.exports = class Klass

  defineProperty: do ->
    if Object.defineProperty?
      console.log 'use defineProperty'
      (prop, getter, setter) ->
        descriptor = {}
        descriptor.get = getter if getter?
        descriptor.set = setter if setter?
        descriptor.enumerable = true
        descriptor.configuable = false
        Object.defineProperty @, prop, descriptor
    else if Object.prototype.__defineGetter__? and Object.prototype.__defineSetter__?
      console.log 'use __define*__'
      (prop, getter, setter) ->
        @prototype.__defineGetter__ prop, getter if getter?
        @prototype.__defineSetter__ prop, setter if setter?
    else
      throw new Error "Doesn't support 'getter/setter' properties."
