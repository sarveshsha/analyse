'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
var region = require('../controllers/region.server.controller');

	app.route('/v1.0/regions')
		.get(apiAuth,  region.list)
		.post(apiAuth,  region.create);

		// app.route('/v1.0/regions/getByDate')
		// .post(apiAuth,region.getByDate);


	app.route('/v1.0/region/:regionId')
		.get(apiAuth,  region.read)
		.put(apiAuth,  region.update)
		.delete(apiAuth, users.requiresLogin, region.delete);

	// Finish by binding the article middleware
	app.param('regionId', region.getByID);
};
