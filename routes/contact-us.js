const express = require('express');

const router = express.Router();

const {csrfProtection, asyncHandler} = require('./utils');
const { requireAuth } = require('../auth');

router.get('/', function(req, res, next) {
    res.render('contact-us', { title: 'Meet the Development Team'});
});

module.exports = router;