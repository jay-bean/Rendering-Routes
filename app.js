const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { sequelize } = require('./db/models');
const session = require('express-session');
const { sessionSecret } = require('./config');
const { restoreUser } = require('./auth');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const routesRouter = require('./routes/routes');
const cragsRouter = require('./routes/crags');
// image trial
const multer = require('multer');
// ^^^
const app = express();

// view engine setup
app.set('view engine', 'pug');

// multer middleware
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'images');
  },
  filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
  ) {
      cb(null, true);
  } else {
      cb(null, false);
  }
};
// ^^^^^

// use multer
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
// ^^^^^^

// set up images directory to find path
app.use('/images', express.static(path.join(__dirname, 'images')));
// ^^^^

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(sessionSecret));
app.use(session({
  name: 'rendering-routes.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));
app.use(express.static(path.join(__dirname, 'public')));

// set up session middleware
const store = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: 'superSecret',   //UPDATE THIS
    store,
    saveUninitialized: false,
    resave: false,
  })
);

// create Session table if it doesn't already exist
store.sync();

app.use(restoreUser);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/routes', routesRouter);
app.use('/crags', cragsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
