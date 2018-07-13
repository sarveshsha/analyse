'use strict';

module.exports = function(app) {
	var categories = require('../controllers/categories.server.controller');
	var users = require('../controllers/users.server.controller');
	var apiAuth = require('../controllers/api.authorization.server.controller');
var lifeStyle = require('../controllers/lifeStyle.server.controller');

	app.route('/v1.0/lifeStyle')
		.get(apiAuth,  lifeStyle.list)
		.post(apiAuth,  lifeStyle.create);



	app.param('lifeStyleId', lifeStyle.getByID);
};
