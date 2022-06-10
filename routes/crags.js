const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');
const { cragValidators } = require('../validations');

router.get('/', csrfProtection, asyncHandler(async (req, res) => {
    const allCrags = await db.Crag.findAll({ order: ['name'] });
    res.render('all-crags', { allCrags });
}));

router.get('/:cragId(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
    const cragId = parseInt(req.params.cragId, 10);
    const crag = await db.Crag.findByPk(cragId);

    if (!crag) res.redirect('/404');

    const routes = await db.Route.findAll({
      where: {
        cragId
      }
    });
    const routeLength = routes.length;
    const postUser = await db.User.findByPk(crag.userId);

    const seshAuth = req.session.auth;

    res.render('crag', { crag, postUser, seshAuth, routes, routeLength });
}));

router.get('/new', csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const crag = db.Crag.build();
    res.render('new-crag', {
      crag,
      csrfToken: req.csrfToken(),
    });
}));

router.post('/', csrfProtection, requireAuth, cragValidators,
  asyncHandler(async (req, res) => {
    const {
        name,
        location,
        description,
    } = req.body;

    const crag = db.Crag.build({
        name,
        location,
        description,
        userId: res.locals.user.id
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await crag.save();
      res.redirect(`/crags/${crag.id}`);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('/new', {
        crag,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
}));

router.patch('/:cragId(\\d+)', requireAuth, cragValidators,
 asyncHandler(async (req, res) => {
  const crag = await db.Crag.findByPk(req.params.cragId);

  crag.name = req.body.name;
  crag.location = req.body.location;
  crag.description = req.body.description;

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    await crag.save();
    res.status(200);
    res.json({message: 'Success!', crag});
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.status(400);
    res.json({message: 'Fail!', crag, errors});
  }
}));

module.exports = router;
