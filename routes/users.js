const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const { loginUser, logoutUser, requireAuth } = require('../auth');
const { userValidators, loginValidators, userEditValidators, reviewValidators } = require('../validations');

const router = express.Router();
router.use(express.urlencoded())

router.get('/', requireAuth,
  asyncHandler(async (req, res) => {
    const users = await db.User.findAll();

    res.render('all-users', { users })
  }));

router.get('/sign-up', csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render('user-register', {
    title: 'Register',
    user,
    csrfToken: req.csrfToken(),
  });
});

router.post('/sign-up', csrfProtection, userValidators,
  asyncHandler(async (req, res) => {
    const {
      username,
      password,
      email,
      biography
    } = req.body;

    const user = db.User.build({
      username,
      email,
      biography
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('user-register', {
        title: 'Register',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

router.get('/log-in', csrfProtection, (req, res) => {
  res.render('user-login', {
    title: 'Login',
    csrfToken: req.csrfToken(),
  });
});

router.post('/log-in', csrfProtection, loginValidators,
  asyncHandler(async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });
      if (user !== null) {
        const passwordMatch = await bcrypt.compare(password, user.password.toString());

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect('/');
        }
      }
      errors.push('Incorrect email or password');
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('user-login', {
      title: 'Login',
      email,
      errors,
      csrfToken: req.csrfToken(),
    });
  }));

router.post('/log-out', (req, res) => {
  logoutUser(req, res);
  res.redirect('/');
});

router.post('/demo/log-in', asyncHandler(async (req, res) => {
  const user = await db.User.findOne({ where: { email: 'coolGuy48@gmail.com' } });
  loginUser(req, res, user);
  return res.redirect('/');
}));

router.get('/:userId(\\d+)', requireAuth,
  asyncHandler(async (req, res) => {
    const user = await db.User.findByPk(req.params.userId)
    // const reviews = await db.Review.findAll({
    //   where: { userId: req.params.userId}
    // })


    if (!user) res.redirect('/404');

    let loggedInUser
    if (req.session.auth) {
      loggedInUser = req.session.auth.userId
    }

    res.render('user-profile', { user, loggedInUser })
  }));

router.patch('/:userId(\\d+)', requireAuth, userEditValidators,
  asyncHandler(async (req, res) => {
    const user = await db.User.findByPk(req.params.userId);

    user.username = req.body.username;
    user.biography = req.body.biography;
    user.email = req.body.email;
    password = req.body.password
    confirmPassword = req.body.confirmPassword


    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200);
      res.json({ message: 'Success!', user })
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.status(400);
      res.json({ message: 'Unsuccessful!', user, errors });
    }


  }));


router.get('/:userId(\\d+)/climb-list', requireAuth,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10)

    const climbListRoutes = await db.ClimbList.findAll({
      where: { userId },
      include: [{
        model: db.Route,
      }]
    })

    let loggedInUser
    if (req.session.auth) {
      loggedInUser = req.session.auth.userId
    }
    res.render('climb-list', { climbListRoutes, loggedInUser, userId })
  })
);

router.patch('/:userId(\\d+)/climb-list', requireAuth,
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10)
    const routeId = req.body.routeId
    const currentClimbListRoute = await db.ClimbList.findOne({
      where: { userId, routeId },
    })
    if (currentClimbListRoute.haveClimbed === false) {
      await currentClimbListRoute.update({ haveClimbed: true })
      res.json({ message: 'Success!' })
    }

  })
);

router.delete('/:userId(\\d+)/climb-list',
  asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10)
    const routeId = req.body.routeId
    const currentClimbListRoute = await db.ClimbList.findOne({
      where: { userId, routeId },
    })
    await currentClimbListRoute.destroy()

    res.json({ message: 'Success!' })

  })

);

router.get('/:userId(\\d+)/reviews', requireAuth,
  asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const user = await db.User.findByPk(userId)
  const userReviews = await db.Review.findAll({
    where: {userId},
    include: [{
      model: db.Route
    }]
  })

  let loggedInUser;
  if (req.session.auth) {
    loggedInUser = (req.session.auth.userId).toString();
  }
  console.log(userId, loggedInUser)

  res.render('user-all-reviews', { userReviews, userId, user, loggedInUser })
}));


  router.patch('/:userId(\\d+)/reviews', requireAuth, reviewValidators,
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const reviewId = parseInt(req.body.reviewId, 10)

    const review = await db.Review.findByPk(reviewId)

    review.title = req.body.title
    review.description = req.body.description
    review.rating = req.body.rating

    const validateErrors = validationResult(req);
    if(validateErrors.isEmpty()) {
      await review.save()
      res.status(200)
      res.json({ message: 'Success!', review })
    } else {
      const errors = validateErrors.array().map((error) => error.msg);
      res.status(400);
      res.json({ message: 'Unsuccessful!', review, errors });
    }
  }));
module.exports = router;
