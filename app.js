const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const os = require('os');
const fs = require('fs');
const formData = require('express-form-data');
const logger = require('morgan');

const log = require('./utils/log')(module);
const index = require('./routes/index');

const homeDir = os.tmpdir();
const crawlerDir = 'mailservice-temp';

if (!fs.existsSync(`${homeDir}/${crawlerDir}/`)) {
  fs.mkdirSync(`${homeDir}/${crawlerDir}/`);
  log.info(`Created directory: ${homeDir}/${crawlerDir}/`);
}

const options = {
  uploadDir: `${homeDir}/${crawlerDir}`,
  autoClean: process.env.AUTOCLEAN,
};

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// parse data with connect-multiparty.
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());

app.use(index);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
