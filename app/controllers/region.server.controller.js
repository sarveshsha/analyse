'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Region = mongoose.model('Region'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('Region', 'name');


module.exports = crud;
