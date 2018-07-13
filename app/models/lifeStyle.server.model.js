'use strict';

var mongoose=require('mongoose'),
Schema = mongoose.Schema;

var lifeStyleSchema=new Schema({
lifStyle:String,
Description:String,
Customers:Number,
Micro_segments:Number,
Avg_value:Number,
one_time_customer:Number

});

mongoose.model('lifeStyle',lifeStyleSchema);
