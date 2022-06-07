const express = require('express');
const csrf = require('csurf');
const router = express.Router();

const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');

router.get('/', asyncHandler(async (req, res) => {
  const routes = await db.Route.findAll({ order: [['name', 'ASC']] });
  res.render('routes', {
    title: 'Routes',
    routes
  })
}));

router.get('route/add', csrfProtection, (req, res) => {
  const route = db.Route.build();
  res.render('route-add', {
    title: 'Add Route',
    route,
    csrfToken: req.csrfToken()
  });
});

router.post('route/add', csrfProtection, asyncHandler(async (req, res) => {
  const {
    name,
    description,
    image,
    difficulty,
    height,
    protection,
    type
  } = req.body;

  const route = db.Route.build({
    name,
    description,
    image,
    difficulty,
    height,
    protection,
    type
  });

  try {
    await route.save();
    res.redirect(`/${route.id}`);
  }
  catch (err) {
    res.render('route-add', {
      title: 'Add Route',
      route,
      error: err,
      csrfToken: req.csrfToken()
    });
  }
}));

// router.get('/:id', asyncHandler(async (req, res => {
//   const route = await db.Route.findByP
// }));


module.exports = router;
