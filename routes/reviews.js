const express = require('express');
const { check, validationResult } = require('express-validator');

const db = require('../db/models');
const { requireAuth } = require('../auth');
const { csrfProtection, asyncHandler } = require('./utils');
const { reviewValidators } = require('../validations');


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

router.post('/:routeId(\\d+)', csrfProtection, reviewValidators, asyncHandler(async(req, res) => {
    const {
        title,
        description,
        rating
    } = req.body

    const review = db.Review.build({
        title,
        description,
        rating,
        userId: res.locals.user.id
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await review.save();
        res.redirect(`/routes/${route.id}`);
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render('/reviews', {
            review,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
}));

router.patch('/:routeId(\\d+)', csrfProtection, reviewValidators, asyncHandler(async(req, res) => {
    const review = await db.Review.findByPk(req.params.reviewId);

    review.title = req.body.title;
    review.description = req.body.description;
    review.rating = req.body.rating;

    const  validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await review.save();
        res.status(200);
        res.json({message: 'Success!', review});
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.status(400);
        res.json({message: 'Fail', review, errors});
    }
}));

router.delete('/:routeId(\\d+)', csrfProtection, asyncHandler(async(req, res) => {
    const reviewId = parseInt(req.params.reviewId, 10);
    
}));

module.exports = router;
