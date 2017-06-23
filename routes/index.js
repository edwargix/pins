const fs = require('fs');
const path = require('path');
var express = require('express');
var router = express.Router();

const qs = require('querystring');

router.get('/*', function(req, res, next) {

  var dir = path.join('./pins', qs.unescape(req.path));
  console.log('path: ' + req.path);

  var files = fs.readdirSync(dir);

  var dirs = new Array();
  var pics = new Array();
  var stat;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    stat = fs.statSync(path.join('./pins', qs.unescape(req.path), file));
    if (stat.isDirectory()) {
      dirs.push({
        'value': file,
        'href': req.path + file
      });
    } else {
      var file_parts = file.split('.');
      pics.push({
        'src': file,
        'alt': file,
        'value': file.substring(0, file.length - file_parts[file_parts.length - 1].length - 1)
      });
    }
  };


  res.render('index', {
    title: req.path == "/" ? "World" : path.basename(dir),
    user: req.user,
    dirs: dirs,
    pics: pics,
    path: req.path
  });
});

module.exports = router;
