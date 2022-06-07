const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const { loginUser, logoutUser, requireAuth } = require('../auth');
const { userValidators, loginValidators } = require('../validations');

const router = express.Router();

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

router.get('/:userId(\\d+)', requireAuth,
  asyncHandler(async (req, res) => {
    const user = await db.User.findByPk(req.params.userId
      // ,{
      //   include: [{
      //     model: Review
      //   }, {
      //     model: Route
      //   }]  //how to include multiple models??
      // }
    )
    res.render('user-profile', { user })
  }));

//TO DO: test code below
router.patch('/:userId(\\d+)', requireAuth,
 asyncHandler(async (req, res) => {
  const {
    username,
    email,
    biography,
    password,
  } = req.body;

  const user = await db.User.findByPk(req.params.userId);
  await user.update({
    username: username,
    email: email,
    biography: biography,
    password: password
  })

  await user.save();

}));

//TO DO: test code below
router.delete('/:userId(\\d+)',
asyncHandler(async(req, res)=>{
  const user = await db.User.findByPk(req.params.userId)
  await user.destroy()

  res.json({message: 'Your account has been successfully deleted'})
}));

//TO DO: test code below
router.get('/:userId(\\d+)/climb-list', requireAuth,
asyncHandler(async(req, res)=>{
const userId = req.body.userId
const climbListRoutes = await db.ClimbList.findAll({
  where: {userId},
  include:[{
    model: Route,
    attributes: ['name']
  }]
})

res.render('/climb-list', { climbListRoutes})
})
);

module.exports = router;
