{Relay} = mn.dsk.relay

http =

  get: (url, data, callback)->
    switch typeof data
      when 'function'
        callback = data
      when 'string'
        url = "#{url}?#{data}"
      else
        throw new TypeError "http.get: data is'nt string"
    @request url, 'get', null, callback

  post: (url, data, callback)->
    switch typeof data
      when 'function'
        callback = data
        data = null
      when 'string'
      else
        throw new TypeError "http.post: data isn't string"
    @request url, 'post', data, callback

  request: (url, method, data, callback)->
    method = method.toLowerCase()
    xhr = new (window.ActiveXObject or XMLHttpRequest)('Microsoft.XMLHTTP')
    xhr.open method, url, true
    if 'overrideMimeType' of xhr
      xhr.overrideMimeType 'text/plain'
    if method is 'post'
      xhr.setRequestHeader "content-type", "application/x-www-form-urlencoded;charset=UTF-8"
    if callback?
      xhr.onreadystatechange = ->
        if xhr.readyState is 4
          if xhr.status in [0, 200]
            callback null, xhr.responseText
          else
            callback new Error "Could not load #{url}"
          callback = null
    xhr.send data

setupCodeViewer = (elem, code, extname)->
  pretty = prettyPrintOne code, extname
  switch extname
    when 'js'
      elem.innerHTML = pretty
      code

    when 'coffee'
      codes = [
        pretty
        prettyPrintOne CoffeeScript.compile(code, { bare: true }), 'js'
      ]

      button = document.createElement 'a'
      button.setAttribute 'class', 'toggleButton'
      button.setAttribute 'href', 'javascript:void(0);'
      elem.parentNode.insertBefore button, elem

      index = 0
      button.onclick = ->
        if ++index >= codes.length
          index = 0
        button.innerHTML = "in #{if index is 0 then 'JavaScript' else 'CoffeeScript'}"
        elem.innerHTML = codes[index]
      button.onclick()

      CoffeeScript.compile code

    else
      elem.innerHTML = pretty
      return

do ->
  drippers =
    raw: []
    src: []
    run: []
  for elem in document.getElementsByTagName '*'
    if (filename = elem.getAttribute 'data-dripper')?
      drippers.raw.push
        elem    : elem
        filename: filename

    else if (filename = elem.getAttribute 'data-dripper-src')?
      drippers.src.push
        elem    : elem
        filename: filename

    else if (filename = elem.getAttribute 'data-dripper-run')?
      drippers.run.push
        elem    : elem
        filename: filename

  for {elem, filename} in drippers.raw
    code = elem.innerHTML
    extname = filename.split('.').pop()
    setupCodeViewer elem, code, extname

  for {elem, filename} in drippers.src
    Relay.serial(
      Relay.func(->
        @local.elem = elem
        @local.filename = filename
        http.get filename, @next
      )
      Relay.func((err, code)->
        unless err?
          extname = @local.filename.split('.').pop()
          if extname is 'html'
            code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;')
          setupCodeViewer @local.elem, code, extname
        @next()
      )
    ).start()

  for {elem, filename} in drippers.run
    Relay.serial(
      Relay.func(->
        @local.elem = elem
        @local.filename = filename
        http.get filename, @next
      )
      Relay.func((err, code)->
        unless err?
          extname = @local.filename.split('.').pop()
          js = setupCodeViewer @local.elem, code, extname
          if js?
            script = document.createElement 'script'
            script.setAttribute 'type', 'text/javascript'
            script.innerHTML = js
            @local.elem.parentNode.insertBefore script, @local.elem.nextSibling

        @next()
      )
    ).start()
