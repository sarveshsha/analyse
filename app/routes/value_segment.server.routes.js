'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
	var value_segment = require('../controllers/value_segment.server.controller');

	app.route('/v1.0/value_segment')
		.get(apiAuth,  value_segment.list)
		.post(apiAuth,  value_segment.create);


//app.route('/v1.0/segment/month').get(apiAuth,value_segment.getByMonth);
	// app.route('/v1.0/traffic/:trafficId')
	// 	.get(apiAuth,  traffic.read)
	// 	.put(apiAuth,  traffic.update)
	// 	.delete(apiAuth, traffic.delete);


	// Finish by binding the article middleware
	app.param('segmentId', value_segment.getByID);
};
