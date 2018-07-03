(function(angular) {

	'use strict';

	function PodService($http, $q, apiVersion,apiDomain) {
		/* This call is used for add pod */
		this.addPod = function(pod) {
			var promise = $http.post('/'+apiVersion.version+'/pods', JSON.stringify(pod))
					.then(function(response) {
                     return response;
                     });

			return promise;
		};

		/* This call is used for get all pod */
/*		this.getAllPods = function() {
			var promise = $http.get('/'+apiVersion.version+'/pods').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};*/
		this.getAllPods = function(page,size) {
			var promise = $http.get('/'+apiVersion.version+'/pods/?page='+page+'&size='+size+'&sortingQuery=createdDate&direction=desc').then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response.data.body[0];
				}
			});

			return promise;
		};
		
		this.getAllPentaBasePod = function() {
			var promise = $http.get('/v1.0/pods').then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};
		
		/* This call is used for get all zones */
		this.getAllZones = function() {			
			var promise = $http.get('/'+apiVersion.version+'/zones').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
	
		
		/* This call is used find pod  by id */
		this.findPodById = function(podId) {
			var promise = $http.get('/'+apiVersion.version+'/pods/'+podId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is update pod  */
		this.updatePod = function(podData) {
			var promise = $http.put('/'+apiVersion.version+'/pods', JSON.stringify(podData))
			.then(function(response) {
			return response;
			});

	   return promise;
		};
		
	}

	PodService.$inject = [ '$http', '$q', 'apiVersion','apiDomain' ];

	angular.module('pentaWorkflow.pod').service('PodService', PodService);

})(window.angular);