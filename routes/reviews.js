const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('./utils');

const router = express.Router();

router.get('/', csrfProtection, asyncHandler(async(req, res) => {
    const allReviews = await db.Review.findAll();
    res.render('all-reviews', { allReviews });
}));

router.get('/:routeid(\\d+)', csrfProtection, asyncHandler(async(req, res) => {
    const reviewId = parseInt(req.params.reviewId, 10);
    const review = await db.Review.findByPk(reviewId);

    if (!review) res.redirect('/404');

    const user = await db.User.findByPk(review.userId);
    const seshAuth = req.session.auth;

    res.render('reviews', { review, user, seshAuth});
}));

router.post('/:routeid(\\d+)', csrfProtection)
module.exports = router;
