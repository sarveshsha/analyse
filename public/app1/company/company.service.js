(function(angular) {

	'use strict';

	function CompanyService($http, $q, apiVersion) {
		/* This call is used for add company */
		this.addCompany = function(company) {
			var promise = $http.post('/'+apiVersion.version+'/company', JSON.stringify(company))
					.then(function(response) {
						console.log(response);
                      return response;
					});

			return promise;
		};

		/* This call is used for get all company */
		this.getAllCompany = function() {
			var promise = $http.get('/'+apiVersion.version+'/company').then(function(response) {
				console.log(response);
				console.log(apiVersion.version);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};

		/* This call is used find company  by id */
		this.findCompanyById = function(companyId) {
			var promise = $http.get('/'+apiVersion.version+'/company/' + companyId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		/* This call is update company  */
		this.updateCompany = function(companyData) {
			
			var promise = $http.put('/'+apiVersion.version+'/company',
					JSON.stringify(companyData)).then(function(response) {
				return response;
			});

			return promise;
		};

		/* This call is used for get whether it there is  default company */
		this.getDefaultCompany = function() {
			var promise = $http.get('/'+apiVersion.version+'/company/defaultExists').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/* This call is used for get  all currency */
		this.getAllCurrency = function() {
			var promise = $http.get('/'+apiVersion.version+'/currency').then(function(response) {
				console.log(response);
				console.log(apiVersion.version);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};
		
		
		/* This call is used find company  by id */
		this.getCurrencyByComCode = function(companyId) {
			var promise = $http.get('/'+apiVersion.version+'/company/currency/' + companyId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

/* This call is used for get  default company */
		this.getDefaultPentaBaseCompany = function() {
			var promise = $http.get('/'+apiVersion.version+'/company/default').then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/*This call is used to delete company*/
		this.deleteCompany = function(id) {
			var promise = $http.delete('/'+apiVersion.version+'/company/'+id, JSON.stringify(id))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		
	}

	CompanyService.$inject = [ '$http', '$q', 'apiVersion' ];

	angular.module('pentaWorkflow.company').service('CompanyService',
			CompanyService);

})(window.angular);