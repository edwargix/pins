const fs = require('fs');
const path = require('path');
var express = require('express');
var router = express.Router();

const qs = require('querystring');

router.get('/*', function(req, res, next) {

  let dir = path.join('./pins', qs.unescape(req.path));
  console.log('path: ' + req.path);

  let files = fs.readdirSync(dir);

  let dirs = new Array();
  let pics = new Array();
  let stat;
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    stat = fs.statSync(path.join('./pins', qs.unescape(req.path), file));
    if (stat.isDirectory()) {
      dirs.push({
        'value': file,
        'href': req.path + file
      });
    } else {
      let file_parts = file.split('.');
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
