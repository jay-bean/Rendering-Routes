const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');
const db = require('../db/models');

router.get('/', csrfProtection, (req, res) => {
    res.render('all-crags');
});

router.get('/:cragId(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
    const cragId = parseInt(req.params.cragId, 10);
    const crag = await db.Crag.findByPk(cragId);

    if (!crag) res.redirect('/404');

    res.render('crag', { crag });
}));

router.get('/new', csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const crag = db.Crag.build();
    res.render('new-crag', {
      crag,
      csrfToken: req.csrfToken(),
    });
}));

module.exports = router;
