(function(angular) {

	'use strict';

	function MaintenanceService($http, $q, apiVersion,apiDomain) {
	
		/* This call is used for get all maintenance */
		this.getAllMaintenance = function() {
			var promise = $http.get('/'+apiVersion.version+'/maintenances').then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};
		
		// this call is used for get all maintenance type
		this.getAllMaintenanceType = function() {
			/* This call is used for get all categories */
			var promise = $http.get(
					apiDomain.domain + '/' + apiVersion.version + '/maintenanceTypes')
					.then(function(response) {
						console.log("Get all asset maintenance type ");
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		/* This call is used for add maintenance */
		this.addMaintenance = function(assetMaintenanceBean) {
			console.log(assetMaintenanceBean);
			var promise = $http.post('/'+apiVersion.version+'/maintenances', assetMaintenanceBean)
					.then(function(response) {

						return response;
					});

			return promise;
		};
		/* This call is used for get all user */
		this.getAllUser = function() {
			var promise = $http.get('/'+apiVersion.version+'/user').then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response;
				}
			});

			return promise;
		};

		
		
		
		
		/* This call is used find maintenance  by id */
		this.findMaintenanceById = function(maintenanceId) {
			var promise = $http.get('/'+apiVersion.version+'/maintenances/'+maintenanceId).then(
					function(response) {
						console.log(response);
						console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is update maintenance  */
		this.updateMaintenance = function(maintenanceData) {
			var promise = $http.put('/'+apiVersion.version+'/maintenances', JSON.stringify(maintenanceData))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		/* This call is used delete maintenance */
		this.deleteMaintenance = function(maintenanceId) {
			var promise = $http.delete('/'+apiVersion.version+'/maintenances/'+maintenanceId, JSON.stringify(maintenanceId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
		/* This call is used for get all assets */
		this.getAllAssets = function(page,size,companyId,currencyId) {
			var url ="";
			if(typeof companyId !='undefined'){
				var url = '&companyId='+companyId.pentaBaseComCode;
				console.log(url);
			}
			if(typeof currencyId !='undefined'){
				var url = url+'&currencyId='+currencyId.pentaBaseCurCode;
				console.log(url);
			}
			//$http.get('/'+apiVersion.version+'/assets/?page='+page+'&size='+size+'&sortingQuery=pentaBaseCreatedDate&direction=desc'+url).then(function(response) {
			var promise = $http.get('/'+apiVersion.version+'/assets?page='+page+'&size='+size+'&property=pentaBaseAssetLevelOne,pentaBaseAssetCode,pentaBaseAssetUnit'+url).then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};
		/* This call is used for edit asset for added maintainence */
		this.editAsset = function(asset) {
			var promise = $http.put('/'+apiVersion.version+'/assets', JSON.stringify(asset))
					.then(function(response) {
                     return response;
					});
			return promise;
		};
		/* This call is used for edit asset for added maintainence */
		this.getAssetByMaintenance = function(id) {
			var promise = $http.get('/'+apiVersion.version+'/assets/maintainence/'+id, JSON.stringify(id))
					.then(function(response) {
                     return response;
					});
			return promise;
		};
		
		
		
		
	}

	MaintenanceService.$inject = [ '$http', '$q', 'apiVersion','apiDomain' ];

	angular.module('pentaWorkflow.maintenance').service('MaintenanceService', MaintenanceService);

})(window.angular);