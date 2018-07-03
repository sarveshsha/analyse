(function(angular) {

	'use strict';

	angular.module('pentaWorkflow.pod', []).config(Configure);

	Configure.$inject = [ '$routeProvider' ];

	function Configure($routeProvider) {

		// $routeProvider.when('/home', {
		// templateUrl: "Client/home/home.html",
		// controller: 'HomeController'
		// });
	}

})(window.angular);