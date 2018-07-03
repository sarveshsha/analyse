(function(angular) {

	'use strict';

	function LanguageService($http, $q, apiVersion) {
		/* This call is used for add language */
		this.addLanguage = function(pod) {
			var promise = $http.post('/'+apiVersion.version+'/languages', JSON.stringify(pod))
					.then(function(response) {
                     return response;
                     });

			return promise;
		};

		/* This call is used for get all language */
		this.getAllLanguage = function() {
			var promise = $http.get('/'+apiVersion.version+'/languages').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
	
		
		/* This call is used find language  by id */
		this.findLanguageById = function(languageId) {
			var promise = $http.get('/'+apiVersion.version+'/languages/'+languageId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is update language  */
		this.updateLanguage = function(podData) {
			var promise = $http.put('/'+apiVersion.version+'/languages', JSON.stringify(podData))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		
		/* This call is delete language  */
		this.deleteLanguage = function(id) {
			var promise = $http.delete('/'+apiVersion.version+'/languages/'+id)
			.then(function(response) {
				if (response.data.success == false) {
					console.log(response.data.responseMessage);

				}
			});

	   return promise;
		};
		/* This call is used for get  default language */
		this.getDefaultLanguage = function() {

			var promise = $http.get('/'+apiVersion.version+'/languages/defaultExists').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used for get  default languages */
		this.getDefaultLanguages = function() {
			var promise = $http.get('/'+apiVersion.version+'/languages/default').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/* This call is used delete language */
		this.deleteLanguage = function(languageId) {
			var promise = $http.delete('/'+apiVersion.version+'/languages/'+languageId, JSON.stringify(languageId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
	}

	LanguageService.$inject = [ '$http', '$q', 'apiVersion' ];

	angular.module('pentaWorkflow.language').service('LanguageService', LanguageService);

})(window.angular);