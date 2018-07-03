(function(angular) {

	'use strict';

	function AssetService($http, $q, apiVersion) {
		this.getAllSubLevelProperties = function(levelId) {
			/* This call is used for get all categories */
			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/lookup/sublevels?parentLevelId=' + levelId)
					.then(function(response) {
						console.log(response);
						// console.log(apiVersion.version);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		this.getAllPropertiesByLevelOne = function(levelId, isFree) {
			/* This call is used for get all categories */
			var url = "";
			if (typeof isFree != 'undefined') {
				var url = '&isFree=' + isFree;
			}

			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/lookup/levelByIsFree?levelOrder=' + levelId
							+ url).then(function(response) {
				console.log(response);
				// console.log(apiVersion.version);
				if (response.data.body != null) {
					return response.data.body;
				}
			});

			return promise;
		};

		this.getAllUnits = function() {
			/* This call is used for get all categories */
			var promise = $http.get(
					 '/' + apiVersion.version + '/units')
					.then(function(response) {
						console.log("Units Get All");
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
					 '/' + apiVersion.version + '/maintenanceTypes')
					.then(function(response) {
						console.log("Get all asset maintenance type ");
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		this.searchAssetProperties = function(parentId, parentName,
				propertyName, query) {
			console.log("parend id");
			console.log(parentId);
			console.log(parentName);
			if (typeof parentId == 'undefined') {
				console.log("parend id undefined");
				var promise = $http.get(
						 '/' + apiVersion.version
								+ '/lookup/subLevelSearch?parentName='
								+ parentName + '&propertyName=' + propertyName
								+ '&query=' + query).then(function(response) {
					if (response.data.body != null) {
						return response.data.body;
					}
				});
				return promise;
			} else {
				console.log("parend id not undefined");
				var promise = $http.get(
						 '/' + apiVersion.version
								+ '/lookup/subLevelSearch?parentId=' + parentId
								+ '&propertyName=' + propertyName + '&query='
								+ query).then(function(response) {
					if (response.data.body != null) {
						return response.data.body;
					}
				});

				return promise;
			}

		};

		/* This call is used for get all assets */
		this.getAllAssets = function(page, size, isCombo, companyId, currencyId) {
			console.log("Get All Asset For Combo Asset");
			console.log("page "+page+" size "+size+" isCombo "+isCombo);
			var url = "";
			if (typeof companyId != 'undefined') {
				var url = '&companyId=' + companyId.pentaBaseComCode;
				console.log(url);
			}
			if (typeof currencyId != 'undefined') {
				var url = url + '&currencyId=' + currencyId.pentaBaseCurCode;
				console.log(url);
			}
			// $http.get(apiDomain.domain+'/'+apiVersion.version+'/assets/?page='+page+'&size='+size+'&sortingQuery=pentaBaseCreatedDate&direction=desc'+url).then(function(response)
			// {
			var promise = $http
					.get(
							 '/'
									+ apiVersion.version
									+ '/assets?page='
									+ page
									+ '&size='
									+ size
									+ '&isCombo='
									+ isCombo
									+ '&property=pentaBaseAssetLevelOne,pentaBaseAssetCode,pentaBaseAssetUnit'
									+ url).then(function(response) {
						console.log("Response for combo asset");
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

		/* This call is used for get all assets */
		this.getAllAssetsByLastUpdated = function(page, size, isCombo,
				companyId, currencyId) {
			
			var url = "";
			if (typeof companyId != 'undefined') {
				var url = '&companyId=' + companyId.pentaBaseComCode;
				console.log(url);
			}
			if (typeof currencyId != 'undefined') {
				var url = url + '&currencyId=' + currencyId.pentaBaseCurCode;
				console.log(url);
			}
			// $http.get(apiDomain.domain+'/'+apiVersion.version+'/assets/?page='+page+'&size='+size+'&sortingQuery=pentaBaseCreatedDate&direction=desc'+url).then(function(response)
			// {
			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/assets?page=' + page + '&size=' + size
							+ '&isCombo=' + isCombo
							+ '&property=pentaBaseLastModifiedDate' + url)
					.then(function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};
		/* This call is used for add asset */
		this.addAsset = function(asset) {
			var promise = $http.post(
					 '/' + apiVersion.version + '/assets',
					JSON.stringify(asset)).then(function(response) {
				console.log(response);
				return response;
			});

			return promise;
		};
		
		/* This call is used for grid-option */
		this.saveGridOptionState = function(state) {
			var promise = $http.put(
					 '/' + apiVersion.version + '/tableStates',
					JSON.stringify(state)).then(function(response) {
				console.log(response);
				return response;
			});

			return promise;
		};
		
		/* This call is used for grid-option get by user id and page name */
		this.getTableStateByUserIDAndPageName = function(userID,pageName) {
			var promise = $http.get(
					 '/' + apiVersion.version + '/tableStates/'+userID+'/'+pageName).then(function(response) {
				console.log(response);
				return response;
			});

			return promise;
		};

		/* This call is used for edit asset */
		this.editAsset = function(asset) {

			var promise = $http.put(
					 '/' + apiVersion.version + '/assets',
					JSON.stringify(asset)).then(function(response) {
				return response;
			});

			return promise;
		};

		/* This call is used for search asset by code or description */
		this.searchAssetByCodeOrBase = function(query) {

			var promise = $http.get(
					 '/' + apiVersion.version + '/assets/'
							+ query).then(function(response) {

				if (response.data != null) {
					return response.data.body;
				}
			});

			return promise;
		};

		/* This call is used for get all zone based on region */
		this.getZoneByRegion = function(regionId) {
			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/zones/zone/' + regionId).then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response;
						}
					});

			return promise;
		};

		this.getZoneByRegionName = function(regionName) {
			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/zones/region/' + regionName).then(
					function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response;
						}
					});

			return promise;
		};

		/* This call is used for get all zone based on region */
		this.getPodByZone = function(zoneId) {
			var promise = $http.get(
					 '/' + apiVersion.version + '/pods/pod/'
							+ zoneId).then(function(response) {
				console.log(response);
				if (response.data.body != null) {
					return response;
				}
			});

			return promise;
		};

		/* This call is used for get all user */
		this.getAllUser = function() {
			var promise = $http.get(
					 '/' + apiVersion.version + '/user')
					.then(function(response) {
						console.log(response);
						if (response.data.body != null) {
							return response;
						}
					});

			return promise;
		};

		// get asset by asset id
		this.getAllAssetById = function(assetID) {
			var promise = $http.get(
					 '/' + apiVersion.version
							+ '/assets/assetById/' + assetID).then(
					function(response) {
						if (response.data.body != null) {
							return response.data.body;
						}
					});

			return promise;
		};

	}

	AssetService.$inject = [ '$http', '$q', 'apiVersion' ];

	angular.module('pentaWorkflow.asset').service('AssetService', AssetService);

})(window.angular);