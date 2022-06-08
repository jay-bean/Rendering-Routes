const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');

router.get('/', asyncHandler(async (req, res) => {
  /* TODO: need to cycle through 3-5 routes on one card

  List for the card:
    image
    route.name
    route.description

  */
  res.render('index', { title: 'Rendering Routes'});
}));

router.get('/404', function(req, res, next) {
  res.render('404');
});

module.exports = router;
