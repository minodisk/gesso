exports.core.Class = class Class

  defineProperty: do ->
    if Object.defineProperty?
      (prop, getter, setter) ->
        descriptor = {}
        descriptor.get = if getter? then getter else @_error 'get', prop
        descriptor.set = if setter? then setter else @_error 'set', prop
        descriptor.enumerable = true
        descriptor.configuable = false
        Object.defineProperty @, prop, descriptor
    else if Object.prototype.__defineGetter__? and Object.prototype.__defineSetter__?
      (prop, getter, setter) ->
        @prototype.__defineGetter__ prop, if getter? then getter else @_error 'get', prop
        @prototype.__defineSetter__ prop, if setter? then setter else @_error 'set', prop
    else
      throw new Error "Doesn't support 'getter/setter' properties."

  _error: (method, prop)->
    (value)->
      throw new Error "Cannot #{method} property '#{prop}'."
