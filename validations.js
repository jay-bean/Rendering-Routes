const { check, validationResult } = require('express-validator');
const db = require('./db/models');

const userValidators = [
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Username')
      .isLength({ max: 25 })
      .withMessage('Username must not be more than 25 characters long'),
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Email Address')
      .isLength({ max: 255 })
      .withMessage('Email Address must not be more than 255 characters long')
      .isEmail()
      .withMessage('Email Address is not a valid email')
      .custom((value) => {
        return db.User.findOne({ where: { email: value } })
          .then((user) => {
            if (user) {
              return Promise.reject('The provided Email Address is already in use by another account');
            }
          });
      }),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Password')
      .isLength({ max: 50 })
      .withMessage('Password must not be more than 50 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
      check('confirmPassword')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Confirm Password')
      .isLength({ max: 50 })
      .withMessage('Confirm Password must not be more than 50 characters long')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm Password does not match Password');
        }
        return true;
      }),
];

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

const cragValidators = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Name')
    .isLength({ max: 255 })
    .withMessage('Park Name must not be more than 255 characters long'),
  check('location')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Location')
    .isLength({ max: 255 })
    .withMessage('Location must not be more than 255 characters long'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Description'),
];

const routeValidators = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Name')
    .isLength({ max: 255 })
    .withMessage('Route Name must not be more than 255 characters long')
    .custom((value) => {
      return db.Route.findOne({ where: { name: value } })
        .then((route) => {
          if (route) {
            return Promise.reject('The provided Route already exists.');
          }
        });
    }),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Description'),
  check('difficulty')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Difficulty')
    .isLength({ max: 255 })
    .withMessage('Difficulty must not be more than 255 characters long'),
  check('height')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Height')
    .isInt()
    .withMessage('Please provide a number value for Height'),
  check('protection')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Protection')
    .isLength({ max: 255 })
    .withMessage('Protection must not be more than 255 characters long'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Type')
    .isLength({ max: 50 })
    .withMessage('Type must not be more than 50 characters long')
];

const routeEditValidators = [
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Name')
    .isLength({ max: 255 })
    .withMessage('Route Name must not be more than 255 characters long'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Description'),
  check('difficulty')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Difficulty')
    .isLength({ max: 255 })
    .withMessage('Difficulty must not be more than 255 characters long'),
  check('height')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Height')
    .isInt()
    .withMessage('Please provide a number value for Height'),
  check('protection')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Protection')
    .isLength({ max: 255 })
    .withMessage('Protection must not be more than 255 characters long'),
  check('type')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Type')
    .isLength({ max: 50 })
    .withMessage('Type must not be more than 50 characters long')
];

module.exports = {
    userValidators,
    loginValidators,
    cragValidators,
    routeValidators,
    routeEditValidators
};
