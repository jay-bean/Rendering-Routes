const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');
const { routeValidators } = require('../validations');
const { requireAuth } = require('../auth');

router.get('/', asyncHandler(async (req, res) => {
  const routes = await db.Route.findAll({ order: [['name', 'ASC']] });
  res.render('routes', {
    title: 'Routes',
    routes
  })
}));

router.get('/:routeId(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
  const routeId = parseInt(req.params.routeId, 10);
  const route = await db.Route.findByPk(routeId);
  const user = await db.User.findByPk(route.userId);
  if (!route) {
    res.redirect('/404');
  }
  res.render('route', { route, user });
}));

router.get('/add', csrfProtection, requireAuth, asyncHandler(async (req, res) => {
  const route = await db.Route.build();
  const crags = await db.Crag.findAll();

  res.render('route-add', {
    title: 'Add Route',
    route,
    crags,
    csrfToken: req.csrfToken()
  });
}));

router.post('/', csrfProtection, requireAuth, routeValidators,

  asyncHandler(async (req, res) => {
    const crags = await db.Crag.findAll();

    const {
      name,
      description,
      image,
      difficulty,
      height,
      protection,
      type,
      cragId
    } = req.body;
console.log(req.body)
    const route = db.Route.build({
      name,
      description,
      image,
      difficulty,
      height,
      protection,
      type,
      userId: res.locals.user.id,
      cragId: parseInt(cragId, 10)
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await route.save();
      res.redirect(`/routes/${route.id}`);
    }
    else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('route-add', {
        route,
        crags,
        errors,
        csrfToken: req.csrfToken()
      });
    }
}));

module.exports = router;
