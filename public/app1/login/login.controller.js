(function(angular) {

	'use strict';

	function LoginController($http, $scope, $rootScope, $window, $location,
			$routeParams, apiVersion) {
		
		$rootScope.$on("CallParentMethod", function() {
			
			$scope.checkUserIsLoggedInOrNot();
			
		});
		$rootScope.LoggedInUserNew = {};
		// $rootScope.menuPanel = false;
		$scope.checkUserIsLoggedInOrNot = function() {

			$http.get(
					 '/' + apiVersion.version
							+ '/user/loggedInUser').then(function(response) {

				console.log("new method response*******");
				console.log(response);

				if (response.data.Status == true) {

					if ($window.location.href.includes("#/login")) {
						$window.location.href = "#/";
					}

					$rootScope.menuPanel = true;

					$rootScope.loggedInUser = response.data.body;
					$rootScope.LoggedInUserNew =  response.data.body;
					
				} else {
					$rootScope.menuPanel = false;
					$window.location.href = "#/login";

					delete $rootScope.loggedInUser;
					delete $rootScope.LoggedInUserNew;

				}

			});
		}

		$scope.checkUserIsLoggedInOrNot();
		
		

		/* =============login start================= */

		$scope.login = function() {
			$scope.loginError = false;
			$http(
					{
						method : 'POST',
						url : '/login',
						headers : {
							'Content-Type' : 'application/x-www-form-urlencoded'
						},
						transformRequest : function(obj) {

							var str = [];
							for ( var p in obj)
								str.push(encodeURIComponent(p) + "="
										+ encodeURIComponent(obj[p]));
							return str.join("&");
						},
						data : {
							username : $scope.user.username,
							password : $scope.user.password
						}
					}).success(
					function(data) {
						
						$http.get(
								 '/' + apiVersion.version
										+ '/user/' + $scope.user.username)
								.then(function(response) {
									console.log(response);

									$rootScope.user = response.data.body;
									$rootScope.LoggedInUserNew =  response.data.body;
									$rootScope.menuPanel = true;
									$window.location.href = "#/";
									
									// Set user for client management 
									//localStorage.removeItem('notificationObj');
									localStorage.removeItem('userObj');
									//localStorage.removeItem('notificationList');
									var userObjStr = JSON.stringify($rootScope.user);
									var userObj = JSON.parse(userObjStr);
									console.log($rootScope.user);
									userObj.Role = $rootScope.user.role.userRole;
									console.log("userObj"+userObj);
									localStorage.setItem('userObj', JSON.stringify(userObj));
									// Add notification for client management
									var notification = notificationList;
									var notificationObj = {};
									var notObjectStr = localStorage.getItem('notificationList');
									//setting for the first time from file
							
									if(notObjectStr == null)
									{
										localStorage.setItem('notificationList', JSON.stringify(notificationList));
										notObjectStr =notificationList;
									}
									var notObject = JSON.parse(notObjectStr);
									
									for (var i = 0; i< notObject.length; i++) {
										if(notObject[i].id === $rootScope.user.userName)  {
											
										//	localStorage.setItem('notificationObj', JSON.stringify(notification[i]));
											if (notObject[i].message.length > 0) {
												$(".notification-count").text(notObject[i].message.length);
											}
											
											$(".notification-list").empty();
											for (var j=0; j<notObject[i].message.length; j++ ) {
												 $(".notification-list").append(notObject[i].message[j]);
											}
										}
										
										
									}
								
									

								});
					}).error(function(data, status, headers, config) {

				$scope.loginError = true;

			});

		};

		/* =============login end=========== */

		/* =============log out start=========== */
		$scope.logoutFile = function() {

			$http.post('/logout', {}).success(function() {

				$rootScope.menuPanel = false;
				delete $rootScope.loggedInUser;
				$window.location.href = "#/login";

			}).error(function(data) {
				$rootScope.menuPanel = false;
				delete $rootScope.loggedInUser;
				$window.location.href = "#/login";

			});
			console.log("Exit from logout method");
		}
		/* =============logout end=========== */

	}
	LoginController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location', '$routeParams', 'apiVersion'];

	angular.module('pentaWorkflow.login', []).controller('LoginController',
			LoginController);

})(window.angular);