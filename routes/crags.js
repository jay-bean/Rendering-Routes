const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

const { csrfProtection, asyncHandler } = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');
const { cragValidators } = require('../validations');

router.get('/', csrfProtection, (req, res) => {
    res.render('all-crags');
});

router.get('/:cragId(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
    const cragId = parseInt(req.params.cragId, 10);
    const crag = await db.Crag.findByPk(cragId);
    const user = await db.User.findByPk(crag.userId);

    if (!crag) res.redirect('/404');

    res.render('crag', { crag, user });
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

module.exports = router;
