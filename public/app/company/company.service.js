(function(angular) {

	'use strict';

	function CurrencyService($http, $q, apiVersion) {
		/* This call is used for add currency */
		this.addCurrency = function(currency) {
			var promise = $http.post('/'+apiVersion.version+'/currency', JSON.stringify(currency))
					.then(function(response) {
                     return response;
					});

			return promise;
		};

		/* This call is used for get all currency */
		this.getAllCurrency = function() {
			var promise = $http.get('/'+apiVersion.version+'/currency').then(company
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
	
		
		/* This call is used find currency  by id */
		this.findCurrencyById = function(currencyId) {
			var promise = $http.get('/'+apiVersion.version+'/currency/'+currencyId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is update currency  */
		this.updateCurrency = function(currencyData) {
			var promise = $http.put('/'+apiVersion.version+'/currency', JSON.stringify(currencyData))
			.then(function(response) {
					return response;
			});

	   return promise;
		};
		
		/* This call is used whether there is a default currency */
		this.getDefaultCurrency = function() {
			var promise = $http.get('/'+apiVersion.version+'/currency/defaultExists').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/* This call is used to get default currency */
		this.getDefaultPentaBaseCurrency = function() {
			var promise = $http.get('/'+apiVersion.version+'/currency/default').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/*This call is used to delete currency*/
		this.deleteCurrency = function(regionId) {
			var promise = $http.delete('/'+apiVersion.version+'/currency/'+regionId, JSON.stringify(regionId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		
	}

	CurrencyService.$inject = [ '$http', '$q', 'apiVersion' ];

	angular.module('pentaWorkflow.currency').service('CurrencyService', CurrencyService);

})(window.angular);