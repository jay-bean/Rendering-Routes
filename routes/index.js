const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');

router.get('/', asyncHandler(async (req, res) => {
  const displayRoutes = await db.Routes.findAll({ limit: 5 });
  const cycleRoutes = await db.Routes.findAll({ limit: 3});  
  res.render('index', { title: 'Rendering Routes', cycleRoutes });
}));

router.get('/404', function(req, res, next) {
  res.render('404');
});

module.exports = router;
