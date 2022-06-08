const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const db = require('../db/models');
const { asyncHandler, csrfProtection } = require('./utils');
const { routeValidators, routeEditValidators } = require('../validations');
const { requireAuth } = require('../auth');

router.get('/',
  asyncHandler(async (req, res) => {
    const routes = await db.Route.findAll({ order: [['name', 'ASC']] });
    res.render('routes', {
      title: 'Routes',
      routes
    })
}));

router.get('/:routeId(\\d+)', csrfProtection,
  asyncHandler(async (req, res) => {
    const routeId = parseInt(req.params.routeId, 10);
    const route = await db.Route.findByPk(routeId);
    const user = await db.User.findByPk(route.userId);
    const crags = await db.Crag.findAll();
    const currentCrag = await db.Crag.findByPk(route.cragId);
    const cragName = currentCrag.name;
    const reviews = await db.Review.findAll({
      where: {
        routeId
      }
    });

    if (!route) {
      res.redirect('/404');
    }
    const seshAuth = req.session.auth;
    console.log(seshAuth)
    const currentUser = req.session.auth.userId;
    console.log('user', user);
    console.log('currentU', currentUser);
    res.render('route', { route, user, crags, reviews, cragName, seshAuth, currentUser });
}));

router.get('/add', csrfProtection, requireAuth,
  asyncHandler(async (req, res) => {
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

router.patch('/:routeId(\\d+)', requireAuth, routeEditValidators,
  asyncHandler(async (req, res) => {
    const routeId = parseInt(req.params.routeId, 10);
    const route = await db.Route.findByPk(routeId);
    const crags = await db.Crag.findAll();
    console.log(req.body)
    route.name = req.body.name;
    route.description = req.body.description;
    route.height = req.body.height;
    route.difficulty = req.body.difficulty;
    route.type = req.body.type;
    route.protection = req.body.protection;
    route.cragId = req.body.cragId;
    const currentCrag = await db.Crag.findByPk(route.cragId);
    const cragName = currentCrag.name;

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await route.save();
      res.status(200);
      res.json({ message: 'Success!', route, crags, cragName });
    }
    else {
      const errors = validatorErrors.array().map((error => error.msg));
      res.status(400);
      res.json({ message: 'Unsuccessful!', route, crags, errors});
    }

}));

module.exports = router;
