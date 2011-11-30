stitch = require './node_modules/stitch'
paige = require './node_modules/paige'
fs = require 'fs'
filewatcher = require 'filewatcher'
child_process = require 'child_process'

SRC_DIR = 'src'
DST_DIR = 'lib'
DST_FILENAME = 'graphics.js'

sources = []

package = stitch.createPackage
  paths: [ SRC_DIR ]

watch = ->
  filewatcher.watch 'src', (err, callback) ->
    compile ()->
      generateDocs()
      callback()

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
          console.log "#{ timeStamp() } Complete compile: #{ DST_DIR }/#{ DST_FILENAME }"
          callback() if callback?

generateDocs = ->
  sources = []
  fs.readdir SRC_DIR, (err, files) ->
    findFiles files, SRC_DIR
    config =
      title: 'graphicsJS Documentation'
      content_file: 'README.md'
      include_index: true
      docco_files: sources
      header: 'graphicsJS Documentation'
      subheader: 'The wrapper of API for drawing on the canvas.'
      background: 'diagonal-noise'
      output: 'docs'
    fs.writeFile 'paige.config', JSON.stringify(config), (err) ->
      paige.run()

findFiles = (files, parentDir) ->
  for file in files
    p = "#{ parentDir }/#{ file }"
    stats = fs.statSync p
    if stats.isFile()
      sources.push p
    else if stats.isDirectory()
      results = fs.readdirSync p
      findFiles results, p

timeStamp = ->
  date = new Date();
  "#{ date.getHours() }:#{ date.getMinutes() }:#{ date.getSeconds() }"

compile generateDocs
watch()
