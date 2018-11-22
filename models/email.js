/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');
const config = require('../config/mongodb');
const log = require('../utils/log')(module);

mongoose.connect(config.database, { useNewUrlParser: true })
  .then(() => {
    log.info('CONNECTED TO DB');
  })
  .catch((exception) => {
    log.info(`EXCEPTION CAUGHT: FAILED TO CONNECT TO DB WITH EXCEPTION: ${exception}`);
  });

const Schema = mongoose.Schema;

const Email = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const EmailModel = mongoose.model('Email', Email);

module.exports = EmailModel;
