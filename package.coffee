fs = require 'fs'
path = require 'path'
Flow = require 'nestableflow'
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
      startCompile()
      startWatch()
    ), 1000

timeStamp = ->
  date = new Date();
  "#{ padLeft date.getHours() }:#{ padLeft date.getMinutes() }:#{ padLeft date.getSeconds() }"

padLeft = (num, length = 2, pad = '0')->
  str = num.toString 10
  while str.length < length
    str = pad + str
  str


startCompile = ->
  flow = Flow.serial (flow) ->
    package.compile flow.next
  , (flow, source)->
    console.log "#{ timeStamp() } Start to compile: #{ SRC_DIR }"
    flow.userData.source = source
    flow.userData.filename = "#{ DST_DIR }/#{ DST_FILENAME }"
    fs.writeFile flow.userData.filename, flow.userData.source, flow.next
  , (flow)->
    console.log "#{ timeStamp() } Complete to write file: #{ flow.userData.filename }"
    classNames = []
    for file in targetFiles
      classNames.push path.basename(file, path.extname(file))
    ast = jsp.parse flow.userData.source
    ast = pro.ast_mangle ast,
      except: classNames
    ast = pro.ast_squeeze ast
    uglified = pro.gen_code ast
      #beautify: true
      #indent_start: 0
      #indent_level: 2
    flow.userData.filename = "#{ DST_DIR }/#{DST_FILENAME.split('.js')[0]}.min.js"
    fs.writeFile flow.userData.filename, uglified, flow.next
  , (flow)->
    console.log "#{ timeStamp() } Complete to write file: #{ flow.userData.filename }"
    flow.next()
  flow.onError = (err)->
    console.log "Error: #{ err }"
  flow.onComplete = generatePaigeConfig
  flow.start()


generatePaigeConfig = ->
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
    console.log "#{ timeStamp() } Complete to write file: paige.cofig"


startWatch()
startCompile()
