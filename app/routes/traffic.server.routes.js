'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
var Traffic = require('../controllers/traffic.server.controller');

	app.route('/v1.0/traffic')
		.get(apiAuth,  Traffic.list)
		.post(apiAuth,  Traffic.create);


app.route('/v1.0/traffic/11').get(apiAuth,Traffic.getByMonth);
	// app.route('/v1.0/traffic/:trafficId')
	// 	.get(apiAuth,  traffic.read)
	// 	.put(apiAuth,  traffic.update)
	// 	.delete(apiAuth, traffic.delete);


	// Finish by binding the article middleware
	app.param('trafficId', Traffic.getByID);
};
