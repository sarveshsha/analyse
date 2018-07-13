'use strict';

var mongoose=require('mongoose'),
Schema = mongoose.Schema;

var Media_typeSchema=new Schema({
MediaType:String,
Cost:String,
Transaction_first:String,
Transaction_assist:String,
Sales:String,
ROAS:String
});

mongoose.model('media',Media_typeSchema);
