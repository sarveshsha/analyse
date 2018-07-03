'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	validation = require('./validation.server.model');

/**
 * Category Schema
 */
var RegionSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	pentaBaseRegionName: {
		type: String,
		default: '',
		trim: true, 	
		unique : true,
		required: 'name cannot be blank',
		validate: [validation.len(15), 'name must be 15 chars in length or less']
	}
});

mongoose.model('Region', RegionSchema);
