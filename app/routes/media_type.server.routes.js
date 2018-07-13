'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
var media_type = require('../controllers/media_type.server.controller');

	app.route('/v1.0/media_type')
		.get(apiAuth,  media_type.list)
		.post(apiAuth,  media_type.create);



	app.param('media_type', media_type.getByID);
};
