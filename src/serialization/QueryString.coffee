module.exports = QueryString =

  stringify: (object, separate = '&', equal = '=') ->
    queries = []
    for key, value of object
      key = encodeURIComponent(key)
      if Object::toString.call(value) is '[object Array]'
        for v in value
          queries.push(if v? then key + equal + encodeURIComponent(v) else key)
      else
        queries.push(if value? then key + equal + encodeURIComponent(value) else key)
    queries.join(separate)

  parse: (string, separator = '&', equal = '=') ->
    query = {}
    queries = string.split(separator)
    for q in queries
      keyValue = q.split(equal)
      key = keyValue[0]
      value = keyValue[1]
      if key of query
        key = decodeURIComponent(key)
        if typeof query[key] is 'string'
          query[key] = [query[key]]
        query[key].push(decodeURIComponent(value))
      else
        query[key] = decodeURIComponent(value)
