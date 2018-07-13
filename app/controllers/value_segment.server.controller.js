

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  value_segment = mongoose.model('value_segment'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('value_segment', 'name');




module.exports = crud;
 module.exports.getByMonth=function (request,response){
   console.log(request.body)
 console.log("Adding new person");
 response.send("ok");
 }
