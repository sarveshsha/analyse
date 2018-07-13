

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors.server.controller'),
  media = mongoose.model('media'),
    _ = require('lodash');

var crud = require('./crud.server.controller')('media', 'name');




module.exports = crud;

 module.exports.getByMonth=function (request,response){
   console.log(request.body)
 console.log("get the month by media");
 response.send("ok");
 }
