

__R_ESCAPABLE = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
__META =
  '\b': '\\b'
  '\t': '\\t'
  '\n': '\\n'
  '\f': '\\f'
  '\r': '\\r'
  '"' : '\\"'
  '\\': '\\\\'
__R_CX = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g
__R_CHARS = /^[\],:{}\s]*$/
__R_SPACES = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
__R_TOKENS = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
__R_RACES = /(?:^|:|,)(?:\s*\[)+/g

__quote = (string) ->
  __R_ESCAPABLE.lastIndex = 0
  if __R_ESCAPABLE.test(string)
    '"' + string.replace(__R_ESCAPABLE, (a) ->
      c = __META[a]
      if typeof c is 'string' then c else "\\u#{"0000#{a.charCodeAt(0).toString(16)}".slice(-4)}"
    ) + '"'
  else
    "\"#{string}\""

__str = (key, holder, replacer, gap, indent) ->
  mind = gap
  value = holder[key]
  value = DateFormat.stringifyJSON(value) if value instanceof Date
  value = replacer.call(holder, key, value) if typeof replacer is 'function'
  switch typeof value
    when 'string'
      __quote(value)
    when 'number'
      if isFinite(value) then String(value) else 'null'
    when 'boolean', 'null'
      String(value)
    when 'object'
      return 'null' unless value
      gap += indent
      partial = []
      if Object::toString.apply(value) is '[object Array]'
        for i in [0...value.length] by 1
          partial[i] = __str(i, value, replacer, gap, indent) or 'null'
        v = if partial.length is 0
          '[]'
        else if gap
          "[\n#{gap}#{partial.join(',\n' + gap)}\n#{mind}]"
        else
          "[#{partial.join(',')}]"
        gap = mind
        return v
      if replacer and typeof replacer is 'object'
        for i in [0...replacer.length] by 1
          if typeof replacer[i] is 'string'
            k = replacer[i]
            v = __str(k, value, replacer, gap, indent)
            partial.push(__quote(k) + (if gap then ': ' else ':') + v) if v
      else
        for own k of value
          v = __str(k, value, replacer, gap, indent)
          partial.push(__quote(k) + (if gap then ': ' else ':') + v) if v
      v = if partial.length is 0
        '{}'
      else if gap
        "{\n#{gap}#{partial.join(',\n' + gap)}\n#{mind}}"
      else
        "{#{partial.join(',')}}"
      gap = mind
      v

__walk = (holder, key, reviver) ->
  value = holder[key]
  if value and typeof value is 'object'
    for k of value
      v = __walk(value, k, reviver)
      if v isnt undefined
        value[k] = v
      else
        delete value[k]
  reviver.call(holder, key, value)

JSON =
  if window.JSON.stringify?([new Date()]).charAt(21) is '.'
    window.JSON

  else
    stringify: (value, replacer, space) ->
      indent = ''
      tspace = typeof space
      if tspace is 'number'
        indent += ' ' for i in [0...space] by 1
      else if tspace is 'string'
        indent = space
      throw new Error('JSON.stringify') if replacer and (treplacer = typeof replacer) isnt 'function' and (treplacer isnt 'object' or typeof replacer.length isnt 'number')
      __str('', '': value, replacer, '', indent)

    parse: (text, reviver) ->
      text = String(text)
      __R_CX.lastIndex = 0
      if __R_CX.test(text)
        text = text.replace(__R_CX, (a) ->
          "\\u#{"0000#{a.charCodeAt(0).toString(16)}".slice(-4)}"
        )
      if __R_CHARS.test(text.replace(__R_SPACES, '@').replace(__R_TOKENS, ']').replace(__R_RACES, ''))
        text = eval("(#{text})")
      __walk('': text, '', reviver) if typeof reviver is 'function'
      text