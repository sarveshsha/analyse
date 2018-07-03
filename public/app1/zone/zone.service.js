(function(angular) {

	'use strict';

	function ZoneService($http, $q, apiVersion,apiDomain) {
		/* This call is used for add zones */
		this.addZone = function(zone) {
			var promise = $http.post('/'+apiVersion.version+'/zones', JSON.stringify(zone)).then(
					function(response) {
                     return response;	
					});

			return promise;
		};

		/* This call is used for get all zones */
		this.getAllZones = function(page, size) {
			var promise = $http.get(
					'/'+apiVersion.version+'/zones/?page=' + page + '&size=' + size
							+ '&sortingQuery=lastModifiedDate&direction=desc').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body[0];
						}
					});

			return promise;
		};

		/* This call is used for get all zones */
		this.findAllZones = function() {
			var promise = $http.get('/'+apiVersion.version+'/zones').then(function(response) {
				if (response.data.body != null) {
					console.log(response.data.body);
					return response.data.body;
				}
			});
			return promise;
		};

		/* This call is used for get all regions */
		this.getAllRegions = function() {
			var promise = $http.get('/'+apiVersion.version+'/regions').then(function(response) {
				console.log(response);
				console.log(apiVersion.version);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};

		/* This call is used find zone by id */
		this.findZoneById = function(zoneId) {
			var promise = $http.get('/'+apiVersion.version+'/zones/' + zoneId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used find zone by name */
		this.findZoneByName = function(zoneName) {
			var promise = $http.get('/'+apiVersion.version+'/zones/zoneName/' + zoneName).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		/* This call is update zone */
		this.updateZone = function(zoneData) {
			var promise = $http.put('/'+apiVersion.version+'/zones', JSON.stringify(zoneData))
					.then(function(response) {
						return response;
						
					});

			return promise;
		};
		/* This call is used delete zone */
		this.deleteZone = function(zoneId) {
			var promise = $http.delete('/'+apiVersion.version+'/zones/'+zoneId, JSON.stringify(zoneId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
	}

	ZoneService.$inject = [ '$http', '$q', 'apiVersion','apiDomain' ];

	angular.module('pentaWorkflow.zone').service('ZoneService', ZoneService);

})(window.angular);