'use strict';

var mongoose=require('mongoose'),
Schema = mongoose.Schema;

var trafficSchema=new Schema({
channel:String,
Progress:String,
Users:Number,
gcr:Number,
B_rate:Number,
session:Number,
Week:Number,
Month:Number,
Days:Number,

});

mongoose.model('traffic',trafficSchema);
