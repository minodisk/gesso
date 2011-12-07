fs = require 'fs'
path = require 'path'
stitch = require './node_modules/stitch'
uglifyjs = require 'uglify-js'
jsp = uglifyjs.parser
pro = uglifyjs.uglify

SRC_DIR = 'src'
DST_DIR = 'lib'
DST_FILENAME = 'graphics.js'

package = stitch.createPackage
  paths: [ SRC_DIR ]

targets = [ SRC_DIR ]
watchers = []
targetFiles = []
callback = compile
requested = false


startWatch = ()->
  targetFiles = []
  while watchers.length
    watcher = watchers.pop()
    watcher.removeAllListeners()
  for target in targets
    try
      stats = fs.statSync target
      watch target
      if stats.isFile()
        targetFiles.push target
      if stats.isDirectory()
        walkThroughDirectory target, (directory)->
          watch directory
    catch err
      console.log "file stat error"
      console.log err

walkThroughDirectory = (directory, callback)->
  files = fs.readdirSync directory
  for file in files
    file = "#{directory}/#{file}"
    stats = fs.statSync file
    if stats.isFile()
      targetFiles.push file
    if stats.isDirectory()
      callback file
      walkThroughDirectory file, callback

watch = (file)->
  watcher = fs.watch file , persistent: true, ->
  watcher.on 'change', onChange
  watcher.on 'error', onChange
  watchers.push watcher

onChange = ->
  unless requested
    requested = true
    setTimeout (->
      requested = false
      callback()
      startWatch()
    ), 1000

timeStamp = ->
  date = new Date();
  "#{ date.getHours() }:#{ date.getMinutes() }:#{ date.getSeconds() }"


compile = (callback) ->
  package.compile (err, source) ->
    console.log "#{ timeStamp() } Starting compile: #{ SRC_DIR }"
    if err?
      console.log "#{ timeStamp() } Compile Error: #{ err }"
    else
      filename = "#{ DST_DIR }/#{ DST_FILENAME }"

      fs.writeFile filename, source, (err) ->
        if err
          console.log "#{ timeStamp() } Fail to write file: #{ err }"
        else
          console.log "#{ timeStamp() } Complete to write file: #{ DST_DIR }/#{ DST_FILENAME }"

          classNames = []
          for file in targetFiles
            classNames.push path.basename(file, path.extname(file))

          ast = jsp.parse source
          ast = pro.ast_mangle ast,
            except: classNames
          ast = pro.ast_squeeze ast
          uglified = pro.gen_code ast
            #beautify: true
            #indent_start: 0
            #indent_level: 2

          filename = "#{ DST_DIR }/#{DST_FILENAME.split('.js')[0]}.min.js"
          fs.writeFile filename, uglified, (err) ->
            if err
              console.log "#{ timeStamp() } Fail to write file: #{ err }"
            else
              callback() if callback?
              console.log "#{ timeStamp() } Complete to write file: #{filename}"


generateDocs = ->
  config =
    title: 'graphicsJS Documentation'
    content_file: 'README.md'
    include_index: true
    docco_files: targetFiles
    header: 'graphicsJS Documentation'
    subheader: 'The wrapper of API for drawing on the canvas.'
    background: 'diagonal-noise'
    output: 'docs'
  fs.writeFile 'paige.config', JSON.stringify(config), (err) ->
    #paige.generate()


startWatch()
compile generateDocs
