const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const db = require('../db/models');
const { csrfProtection, asyncHandler } = require('./utils');

const { loginUser, logoutUser, requireAuth } = require('../auth');
const { userValidators, loginValidators, userEditValidators } = require('../validations');

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

    if (!user) res.redirect('/404');

    // YOU CAN DO THIS INSTEAD OF having seshAuth
    let loggedInUser
    if(req.session.auth) {
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

  const validatorErrors = validationResult(req);

  if (validatorErrors.isEmpty()) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  await user.save();
    res.status(200);
  res.json({message: 'Success!', user})
  } else {
    const errors = validatorErrors.array().map((error) => error.msg);
    res.status(400);
    res.json({ message: 'Unsuccessful!', user, errors});
  }


}));


router.get('/:userId(\\d+)/climb-list', requireAuth,
asyncHandler(async(req, res)=>{
const userId = parseInt(req.params.userId, 10)

const climbListRoutes = await db.ClimbList.findAll({
  where: {userId},
  include:[{
    model: db.Route,
  }]
})

let loggedInUser
    if(req.session.auth) {
      loggedInUser = req.session.auth.userId
    }
res.render('climb-list', { climbListRoutes, loggedInUser, userId})
})
);

router.post('/:userId(\\d+)/climb-list', requireAuth,
asyncHandler(async(req, res)=>{
  const userId = res.locals.user.id;
  const {climbStatus} = req.body;
  const splitClimbStatus = climbStatus.split('-');
  const status = splitClimbStatus[0];
  const routeId = splitClimbStatus[1];

  const currentClimbList = await db.ClimbList.findOne({
    where: {userId, routeId},
  })

  if(currentClimbList === null) {
    const climbListRoute = db.ClimbList.create({
      haveClimbed: status,
      routeId: parseInt(routeId, 10),
      userId: userId
    })
  } else {
    if(currentClimbList.haveClimbed === false) {
      await currentClimbList.update({haveClimbed: true})
    } else {
      await currentClimbList.update({haveClimbed: false})
    }
  }
})
);

router.patch('/:userId(\\d+)/climb-list', requireAuth,
asyncHandler(async(req, res)=>{
  const userId = parseInt(req.params.userId, 10)

  console.log("REQ BODY!!!!!!", req.body)
  const climbListRoute = await db.ClimbList.findOne({
    where: {userId},
    include:[{
      model: db.Route,
    }]
  })
  res.json({message: 'Success!'})

})
);

// // router.delete('/:userId(\\d+)/climb-list', requireAuth,
// // asyncHandler(async(req, res)=>{

// // })
// // );

module.exports = router;
