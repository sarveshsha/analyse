

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  lifeStyle = mongoose.model('lifeStyle'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('lifeStyle', 'name');




module.exports = crud;
 module.exports.getByMonth=function (request,response){
   console.log(request.body)
 console.log("Adding new person");
 response.send("ok");
 }
