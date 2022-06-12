const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');

router.get('/', asyncHandler(async (req, res) => {
  const allCrags = await db.Crag.findAll({
    order: ['name'],
    limit: 25
   });
  const allRoutes = await db.Route.findAll({
    order: ['name'],
    limit: 35
   });
  res.render('index', { allCrags, allRoutes });
}));

router.get('/contact-us', asyncHandler(async (req, res) => {
  res.render('contact-us', {title: 'Contact the Development Team'});
}))

router.get('/404', function(req, res, next) {
  res.render('404');
});

module.exports = router;
