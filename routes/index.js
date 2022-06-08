const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');

router.get('/', asyncHandler(async (req, res) => {
  const displayRoutes = await db.Routes.findAll({
    include: { image },
    limit: 5
   });
  const cycleRoutes = await db.Routes.findAll({ limit: 3});

  // TODO: do we want to list a few states in the div where we can view some of the states and their routes??
  // const listRoutes = await db.Routes.findAll({
  //   where: {}
  // })
  res.render('index', { title: 'Rendering Routes', displayRoutes});
}));

router.get('/404', function(req, res, next) {
  res.render('404');
});

module.exports = router;
