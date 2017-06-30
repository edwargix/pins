const express = require('express');
const router = express.Router();
const upload = require('multer')();
const qs = require('querystring');
const fs = require('fs-extra');
const path = require('path');


function loggedIn(purpose) {
  return function(req, res, next) {
    if (req.user) next();
    else res.end(purpose ? 'You are not authorized to ' + purpose : 'You are not authorized');
  };
}

const supported_images = ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml', 'image/tiff'];
function validImagetype(param) {
  return function(req, res, next) {
    for(var i = 0; i < supported_images.length; i++) {
      if (supported_images[i] == req.file.mimetype) {
        next();
        return;
      }
    }

    res.end('That filetype is not supported');
  };
}


function validFilename(param, remove_suffix) {
  return function(req, res, next) {
    var params = param.split('.');
    var filename = req[params[0]];
    for (var i = 1; i < params.length; i++) filename = filename[params[i]];

    if (remove_suffix) filename = filename.substring(0, filename.length - filename.split('.').slice(-1)[0].length - 1);
    if (filename.search(new RegExp('[^a-zA-Z0-9 _!@$^&*.]')) != -1)
      res.end('The filename may only include letters (upper- or lowercase), numbers, spaces, or the following special characters: . _ ! @ $ ^ & *');
    else next();
  };
}


router.post('/upload', loggedIn('upload'), upload.single('file'), validImagetype('file.mimetype'), validFilename('body.name', false), function(req, res) {

  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var split = req.file.originalname.split('.');
  var append = '';
  if (split.length > 1) {
    append = split.slice(-1)[0].trim(); // gets last text via delimiter '.' and remove whitespace
    if (append != '') append = '.' + append;
  }

  var file = path.join('./pins', location, req.body.name + append);

  fs.writeFile(file, req.file.buffer, function(err) {
    if (err) res.end(err);
    else {
      console.log('Wrote file ' + file);
      res.redirect(location);
    }
  });
});


router.post('/mkdir', loggedIn('make a directory'), validFilename('body.name', false), function(req, res) {
  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var dir = path.join('./pins', location, qs.unescape(req.body.name));

  fs.mkdir(dir, function(err) {
    if (err) res.end(err);
    else {
      res.redirect(location);
    }
  });
});


router.post('/rm', loggedIn('delete'), function(req, res) {
  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var file = path.join('./pins', location, req.body.name);

  var is_dir = fs.lstatSync(file).isDirectory();

  fs.remove(file, function(err) {
    if (err) res.end(err);
    else if (is_dir) res.redirect(path.normalize(path.join(location, '..')));
    else res.redirect(location);
  });
});


router.post('/mv', loggedIn('rename'), validFilename('body.new_name', false), function(req, res) {
  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var current_file = path.join('./pins', location, req.body.name);
  var suffix = current_file.split('.').slice(-1)[0];

  var new_file = path.join('./pins', location, req.body.new_name + '.' + suffix);

  fs.move(current_file, new_file, function(err) {
    if (err) res.end(err);
    else res.redirect(location);
  });
});


module.exports = router;
