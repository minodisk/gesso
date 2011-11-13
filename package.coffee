stitch = require 'stitch'
fs = require 'fs'
filewatcher = require 'filewatcher'

SRC_DIR = 'src'
DST_DIR = 'lib'
DST_FILENAME = 'graphics.js'

package = stitch.createPackage
  paths: [ SRC_DIR ]

watch = ->
  filewatcher.watch 'src', (err, callback) ->
    compile(callback)

compile = (callback) ->
  package.compile (err, source) ->
    console.log "#{ timeStamp() } Starting compile: #{ SRC_DIR }"
    if err?
      console.log "#{ timeStamp() } Compile Error: #{ err }"
    else
      fs.writeFile "#{ DST_DIR }/#{ DST_FILENAME }", source, (err) ->
        if err
          console.log "#{ timeStamp() } File Stream Error: #{ err }"
        else
          console.log "#{ timeStamp() } Compiled compile to: #{ DST_DIR }/#{ DST_FILENAME }"
          callback() if callback?

timeStamp = ->
  date = new Date();
  "#{ date.getHours() }:#{ date.getMinutes() }:#{ date.getSeconds() }"

compile()
watch()
