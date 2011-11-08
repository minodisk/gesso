var stitch = require('stitch')
  , fs = require('fs')
  , filewatcher = require('filewatcher');

var SRC_DIR = 'src'
  , DST_DIR = 'lib'
  , DST_FILENAME = 'graphics.js';

var package = stitch.createPackage({paths: [SRC_DIR]});

function watch() {
  filewatcher.watch('src', function(err, callback) {
    compile(callback);
  });
}

function compile(callback) {
  package.compile(function(err, source) {
    console.log(timeStamp() + ' Starting compile: ' + SRC_DIR);
    if (err) {
      console.log(timeStamp() + ' Compile Error: ' + err);
    } else {
      fs.writeFile(DST_DIR + '/' + DST_FILENAME, source, function(err) {
        if (err) {
          console.log(timeStamp() + ' File Stream Error: ' + err);
        } else {
          console.log(timeStamp() + ' Compiled compile to: ' + DST_DIR + '/' + DST_FILENAME);
          if (callback) {
            callback();
          }
        }
      });
    }
  });
}

function timeStamp() {
  var date = new Date();
  return [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
}

compile();
watch();
