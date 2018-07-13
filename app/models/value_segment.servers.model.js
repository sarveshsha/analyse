'use strict';

var mongoose=require('mongoose'),
Schema = mongoose.Schema;

var valueSegmentSchema=new Schema({
key:String,
micro_segment:Number,
Customers:Number,
avg_value:Number,
Future_value:Number

});

mongoose.model('value_segment',valueSegmentSchema);
