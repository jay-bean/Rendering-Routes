const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Rendering Routes' });
});

router.get('/404', function(req, res, next) {
  res.render('404');
});

module.exports = router;
