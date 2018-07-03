(function(angular) {

	'use strict';

	function RegionService($http, $q, apiVersion,apiDomain) {
		/* This call is used for add region */
		this.addRegion = function(region) {
			var promise = $http.post('/'+apiVersion.version+'/regions', JSON.stringify(region))
					.then(function(response) {
					return response;			
					});

			return promise;
		};
		
		/* This call is used for get all regions */
		this.getAllRegions = function() {		
			var promise = $http.get('/'+apiVersion.version+'/regions').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used find regions  by id */
		this.findRegionById = function(regionId) {		
			var promise = $http.get('/'+apiVersion.version+'/regions/'+regionId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used find regions  by name */
		this.findRegionByName = function(regionName) {		
			var promise = $http.get('/'+apiVersion.version+'/regions/regionName/'+regionName).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used update regions */
		this.updateRegion = function(regionData) {
			var promise = $http.put('/'+apiVersion.version+'/regions', JSON.stringify(regionData))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		/* This call is used delete regions */
		this.deleteRegion = function(regionId) {
			var promise = $http.delete('/'+apiVersion.version+'/regions/'+regionId, JSON.stringify(regionId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		
		
		/* This call is used for get all zone based on region */
		this.getZoneByRegion = function(regionId) {
			var promise = $http.get('/'+apiVersion.version+'/zones/zone/'+regionId).then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response;
				}
			});

			return promise;
		};
		
	}

	RegionService.$inject = [ '$http', '$q', 'apiVersion','apiDomain' ];

	angular.module('pentaWorkflow.region').service('RegionService', RegionService);

})(window.angular);