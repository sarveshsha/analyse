(function(angular) {

	'use strict';

function DemoController($http, $scope) {
		

	


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
}
DemoController.$inject = [ '$http', '$scope', '$rootScope', '$window' ];
	
	angular.module('pentaWorkflow.demo', [ 'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule' ]).controller(
			'DemoController', DemoController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.region')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})


})(window.angular);
