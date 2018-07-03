(function(angular) {

	'use strict';

	function LifeCycleController($http, $scope, $rootScope, $cookieStore,
			$window, $location, $routeParams) {
		
		
		
		
				var file = 'data/bar2.json';
						angular.extend($scope, {
              options: {
                axis: {
                  stroke: 'red',
                },
                bar: {
                  colorInterpolator: d3.interpolateRgb
                },
                x: {
                  label: 'Store'
                },

                y: {
									position: 'left',
					        orient: 'axisLeft',
					        direction: 'btt',
                  label: 'Products'
                }
              },

              values: [{
                id: 1,
                x: 'Fruits',
                y: [ 54, 0, 879 ],
                tooltip: 'Fruits tooltip'
              }, {
                id: 2,
                x: 'Vegetables',
                y: [ 12, 34, 15 ],
                tooltip: 'Vegetables tooltip'
              }, {
                id: 3,
                x: 'Meet',
                y: [ 154, 432, 234 ],
                tooltip: 'Meet tooltip'
              }],

							changeValues: function() {
								$http.get(file = file === 'data/bar2.json'? 'data/bar.json':'data/bar2.json')
									.then(function(res) {
										$scope.values = res.data
									}, function(err) {
										
									});
              }
            });
					$http.get('data/bar2.json')
						.then(function(res) {
							$scope.values = res.data
						}, function(err) {
						
						});
	};
	LifeCycleController.$inject = [ '$http', '$scope', '$rootScope',
			'$cookieStore', '$window', '$location', '$routeParams'
			 ];

	angular.module('tangelo.lifecycle').controller(
			'LifeCycleController', LifeCycleController);

	})(window.angular);