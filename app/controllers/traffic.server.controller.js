

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  Traffic = mongoose.model('Traffic'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('Traffic', 'name');




module.exports = crud;
 module.exports.getByMonth=function (request,response){
   console.log(request.body)
 console.log("Adding new person");
 response.send("ok");
 }
