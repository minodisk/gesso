fs = require 'fs'
path = require 'path'
{Relay} = require 'relay'
coffee = require 'coffee-script'

SRC_DIR = 'src'
DST_DIR = 'lib'
BASENAME = 'graphics'
PACKAGE_NAME = 'mn.dsk.graphics'

getFiles = (dirname, callback)->
  Relay.serial(
    Relay.func(->
      @global.filenames = []
      fs.readdir dirname, @next
    )
    Relay.func((err, filenames)->
      if err?
        callback err
        @skip()
      else
        for filename, i in filenames
          filenames[i] = path.join dirname, filename
        @next filenames
    )
    Relay.each(
      Relay.serial(
        Relay.func((filename)->
          @local.filename = filename
          fs.stat filename, @next
        )
        Relay.func((err, stats)->
          if err?
            callback err
            @skip()
          else
            if stats.isDirectory()
              getFiles @local.filename, @next
            else
              @next null, [@local.filename]
        )
        Relay.func((err, filenames)->
          if err?
            callback err
            @skip()
          else
            @global.filenames = @global.filenames.concat filenames
            @next()
        )
      )
    )
  ).complete(->
    callback null, @global.filenames
  ).start()
  return

concat = (filenames, callback)->
  sortOnDepends = (a, b)->
    if a.depends? and b.depends?
      if a.depends is b.classname
        1
      else if b.depends is a.classname
        -1
      else
        0
    else if a.depends?
      1
    else if b.depends?
      -1
    else
      0

  Relay.serial(
    Relay.func(->
      @global.codes = []
      @next filenames
    )
    Relay.each(
      Relay.serial(
        Relay.func((filename)->
          @local.filename = filename
          fs.readFile filename, 'utf8', @next
        )
        Relay.func((err, cs)->
          if err?
            callback err
            @skip()
          else
            @global.codes.push cs
            @next()

#            $ = cs.match /^class\s+(\w+)(?:\s+extends\s+(\w+))?/
#            unless $? then console.log cs
#            classname = $[1]
#            depends = $[2]
#            if classname is 'is'
#              console.log cs
#            @global.codes.push {
#              classname: classname
#              depends  : depends
#              cs       : cs
#            }
#            @next()
        )
      )
    )
    Relay.func(->
      fs.writeFile 'lib/graphics.coffee', @global.codes.join('\n\n'), 'utf8'
    )
    Relay.func(->
      @global.codes.sort sortOnDepends
      cs = ''
      for code in @global.codes
        console.log code.depends, '->', code.classname
        cs += "#{code.cs}\n"
      @next cs
    )
  ).complete((cs)->
    callback null, cs
  ).start()

compile = (cs, dirname, filenames, packagename, callback)->
  namespaces = {}
  for filename in filenames
    packageNames = path.dirname(filename).replace(new RegExp("^#{dirname}/"), '').split('/')
    namespace = ''
    for packageName in packageNames
      namespace += packageName
      unless namespaces[namespace]?
        namespaces[namespace] = true
        package = "#{packagename}.#{namespace}"
        cs += "unless @#{package}? then @#{package} = {}\n"
      namespace += '.'
  for filename in filenames
    packageName = path.dirname(filename).replace(new RegExp("^#{dirname}/"), '').split('/').join('.')
    className = path.basename(filename, path.extname(filename))
    name = "#{packageName}.#{className}"
    cs += "unless @#{name}? then @#{name} = #{className}\n"
  callback coffee.compile(cs)

makefile = (srcDir, dstDir, basename, packagename)->
  Relay.serial(
    Relay.func(->
      getFiles srcDir, @next
    )
    Relay.func((err, filenames)->
      if err?
        throw err
      else
        @local.filenames = filenames
        concat filenames, @next
    )
    Relay.func((err, cs)->
      compile cs, srcDir, @local.filenames, packagename, @next
    )
    Relay.func((js)->
      if err?
        throw err
      else
        fs.writeFile path.join(dstDir, "#{basename}.js"), js, 'utf8', @next
    )
    Relay.func((err)->
      if err?
        throw err
      else
        console.log 'complete'
    )
  ).start()

makefile SRC_DIR, DST_DIR, BASENAME, PACKAGE_NAME
