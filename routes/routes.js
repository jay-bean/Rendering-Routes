const express = require('express');

const router = express.Router();

const db = require('../db/models');
const { asyncHandler } = require('./utils');

router.get('/', asyncHandler(async (req, res) => {
  const routes = await db.Route.findAll();
  res.render('routes', {
    title: 'Routes',
    routes
  })
}));


module.exports = router;
