'use strict';

const config = require('config');
const express = require('express');
const path = require('path');

const router = express.Router();
const site = config.get('site');

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/kyukou.appcache', function (req, res) {
  res.set('Content-Type', 'text/cache-manifest; charset=UTF-8');
  //res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  //res.set('Pragma', 'no-cache');
  res.send('CACHE MANIFEST\n' +
           '# ' + site.version + '\n' +
           '\n' +
           'CACHE:\n' +
           '/lib/angular/angular.min.js\n' +
           '/lib/angular-bootstrap/ui-bootstrap.min.js\n' +
           '/lib/angular-local-storage/dist/angular-local-storage.min.js\n' +
           '/js/app.js\n' +
           '/lib/bootstrap/dist/css/bootstrap.min.css\n' +
           '/icomoon/style.css\n' +
           '/css/main.css\n' +
           '\n' +
           'NETWORK:\n' +
           '*\n');
});

module.exports = router;
