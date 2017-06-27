const express = require('express');
const router = express.Router();
const upload = require('multer')();
const qs = require('querystring');
const fs = require('fs-extra');
const path = require('path');


const supported_images = ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml', 'image/tiff'];


router.post('/upload', upload.single('file'), function(req, res) {
  if (!req.user) {
    res.end('You are not authorized to upload');
    return;
  }

  var found = false;
  for(var i = 0; i < supported_images.length; i++) {
    if (supported_images[i] == req.file.mimetype) {
      found = true;
      break;
    }
  }
  if(!found) {
    res.end('That filetype is not supported');
    return;
  }

  if (req.body.name.search(new RegExp('[^a-zA-Z0-9 _!@$^&*]')) != -1) {
    res.end('The name may only include letters (upper- or lowercase), numbers, or the following special characters: _ ! @ $ ^ & *');
    return;
  }

  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var file_parts = req.file.originalname.split('.');

  var file = path.join('./pins', location, req.body.name + '.' + file_parts[file_parts.length - 1]);

  fs.writeFile(file, req.file.buffer, function(err) {
    if (err) res.end(err);
    else {
      console.log('Wrote file ' + file);
      res.redirect(req.body.path);
    }
  });
});


router.post('/mkdir', function(req, res) {
  if (!req.user) {
    res.end('You are not authorized to upload');
    return;
  }

  if (req.body.name.search(new RegExp('[^a-zA-Z0-9 _!@$^&*]')) != -1) {
    res.end('The name may only include letters (upper- or lowercase), numbers, spaces, or the following special characters: _ ! @ $ ^ & *');
    return;
  }

  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var dir = path.join('./pins', location, qs.unescape(req.body.name));

  fs.mkdir(dir, function(err) {
    if (err) res.end(err);
    else {
      res.redirect(req.body.path);
    }
  });
});


router.post('/rm', function(req, res) {
  if (!req.user) {
    res.end('You are not authorized to delete');
    return;
  }

  var location = '';
  for (var sub of qs.unescape(req.body.path).split('/')) location += sub + '/';
  location = location.substring(0, location.length - 1);

  var file = path.join('./pins', location, req.body.name);

  fs.remove(file, function(err) {
    if (err) res.end(err);
    else res.redirect(req.body.path);
  });
});


module.exports = router;
