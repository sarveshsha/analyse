(function(angular) {

	'use strict';

	function AppController($window, $http, $scope, $rootScope, apiVersion,
			$cookieStore) {/*
		$scope.menuPanel = false;
		console.log($cookieStore.get('user'));
		if ($cookieStore.get('user') != null) {
			$scope.menuPanel = true;
		} else {
			$window.location.href = "/#/login"
		}
		

	*/}

	AppController.$inject = [ '$window', '$http', '$scope', '$rootScope',
			'apiVersion', '$cookieStore' ];

	angular.module('tangelo').controller('AppController', AppController);

})(window.angular);