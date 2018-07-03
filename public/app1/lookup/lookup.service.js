(function(angular) {

	'use strict';

	function LookupService($http, $q ,$timeout,apiVersion) {
		
		/* This call is used for add lookup for level  */
		this.addLookUpLevel= function(lookup) {
			var promise = $http.post('/'+apiVersion.version+'/lookup', JSON.stringify(lookup))
					.then(function(response) {
						console.log(response);						
						if (response.data.Status == true) {
							return response.data;
						}
						if (response.data.Status == false) {
							return response.data;
						}
					});

			return promise;
		};
		
		/* This call is used for get all levels by level order */
		this.getAllPropertiesByLevelOne = function(levelId) {			
			var promise = $http.get('/'+apiVersion.version+'/lookup/levelByIsDeleted?levelOrder='+levelId).then(
					function(response) {
						console.log(response);
						// console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		
		/* This call is used for get all categories */
		this.getAllSubLevelProperties = function(levelId) {			
			var promise = $http.get('/'+apiVersion.version+'/lookup/sublevels?parentLevelId='+levelId).then(
					function(response) {
						console.log(response);
						// console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		
		/* This call is used for get all levels */
		this.getAll = function(page,size,levelOrder) {					
							var promise = $http.get('/'+apiVersion.version+'/lookup/?page='+page+'&size='+size+'&sortingQuery=pentaBaseAssetLevelOrder&direction=desc'+ '&levelOrder=' + levelOrder).then(function(response) 
									{
							console.log(response);
							if (response.data.body != null) {
								console.log("in service");
								console.log(response.data.body );
								return response.data.body;
							}
					});

			return promise;
		};
		
		
		/* This call is used find lookup level   by id */
		this.findLookupLevelId = function(lookupLevelId) {
			var promise = $http.get('/'+apiVersion.version+'/lookup/lookUpLevel/'+lookupLevelId).then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is update lookup  level  */
		this.updateLookupLevel = function(lookUpData) {
			var promise = $http.put('/'+apiVersion.version+'/lookup', JSON.stringify(lookUpData))
			.then(function(response) {
				if (response.data.body != null) {   
					console.log("response.data.body");     
					console.log(response.data); 
					return response.data;    }
			});

	   return promise;
		};
		
		/* This call is used get All Maintenance Statuses  */
		this.getAllMaintenanceStatuses = function(lookupLevelId) {
			var promise = $http.get('/'+apiVersion.version+'/lookup/maintenanceStatus').then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		//This call is used for get All Asset Usages
		this.getAllAssetUsages = function() {
			var promise = $http.get('/'+apiVersion.version+'/lookup/assetUsages').then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		
		/* This call is used get All MaintenanceResult Code */
		this.getAllMaintenanceResultCode = function(lookupLevelId) {
			var promise = $http.get('/'+apiVersion.version+'/lookup/maintenanceResultCode').then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		
		/* This call is used get All Asset Table Types   */
		this.getAllAssetTableTypes = function(lookupLevelId) {
			var promise = $http.get('/'+apiVersion.version+'/lookup/assetTableTypes').then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/* This call is used for get all levels */
		this.getAllLevels = function(levelOrder) {					
							var promise = $http.get('/'+apiVersion.version+'/lookup/levelByIsDeleted/?levelOrder='+levelOrder).then(function(response) 
									{
							console.log(response);
							if (response.data.body != null) {
								console.log("in service");
								console.log(response.data.body );
								return response.data.body;
							}
					});

			return promise;
		};
		/* This call is used delete lookup */
		this.deleteLookup = function(lookupId) {
			var promise = $http.delete('/'+apiVersion.version+'/lookup/'+lookupId, JSON.stringify(lookupId))
			.then(function(response) {
				return response;
			});

	   return promise;
		};
	}

	LookupService.$inject = [ '$http', '$q','$timeout','apiVersion' ];

	angular.module('pentaWorkflow.lookup').service('LookupService', LookupService);

})(window.angular);