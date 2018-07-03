(function(angular) {

	'use strict';

	function RegionController($http, $scope, $rootScope, $window, $location,
			$routeParams, $cookieStore, RegionService, $timeout , uiGridConstants, localStorageService) {
		$scope.regionList = [];
		$scope.regionData;
		$scope.deleteRegionId;
		$scope.resetRegion = function() {
			$scope.region = {
				"pentaBaseRegionName" : null
			}

		};
		
		 $.get("v1.0/regions", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTable(data.body);

			 }
			 
		 });
		

		$scope.modalClose = function(regionForm) {
			$scope.resetRegion();
			angular.element('#NewAddWizard').modal('hide');
			$scope.regionForm.$rollbackViewValue();
			$scope.regionForm.$setValidity();
			$scope.regionForm.$setUntouched();
		};
		$scope.modalOpen = function() {
			angular.element('#NewAddWizard').modal('show');
  		$scope.regionForm.$invalid = true;
		};

		$scope.addRegion = function(regionForm) {
			regionForm.$invalid = true;
			console.log($rootScope.sessionUser);
			console.log($scope.region);
			RegionService.addRegion($scope.region).then(function(response) {
				$scope.message = response.data.responseMessage;
				if (response.data.Status == false) {
					$scope.resetRegion();
					$scope.error = true;
					$timeout(function() {
						$scope.error = false
					}, 3000);
				} else {
				/*	swal({
						title : $scope.message,
						timer : 3000,
						type : "success",
					})*/
					 toastr.success($scope.message, "Add Region Successfully", {
						  "timeOut": "3500"
							  });
					$scope.regionList.push($scope.region);
					$scope.resetRegion();
					console.log(response);
					$scope.region = {};
					console.log($scope.regionList);
					$scope.resetRegion();
					angular.element('#NewAddWizard').modal('hide');
					$window.location.href = "#/region";
					$scope.regionForm.$setPristine();
					$scope.regionForm.$setUntouched();
					$scope.getAllRegionsForGrid();

				}
			});

		};
		
		function getRegions() {
			 $.get("v1.0/regions", function(data, status){
				 loadTable(data.body);
				 console.log("load table");
				 console.log(data.body);
			    });
		}
		
		
		
		 function loadTable(data)
		    {
		        var table = $('#data-table-div');
		        if ( ! $.fn.DataTable.fnIsDataTable( table[0] ) ) {
		        table.dataTable( {
		            bProcessing : true,
		            bJQueryUI : false,
		            bLengthChange : true,
		            bDestory : true,
		            bRetrieve : true,
		            bStateSave : true,
		            "searching": false,
		            "order": [], // disable default sorting
		            oTableTools: {
		                sRowSelect: "multi",
		                aButtons: [ "select_all", "select_none" ]
		            },
		            iDisplayLength : 10,
		            "aaData": data,
		            // disable sorting from last column
		            columnDefs: [
		                         { orderable: false, targets: -1 }
		                      ],
		            "aoColumns": [{
				        "mDataProp": "pentaBaseRegionName"
				    }, {
				        "mDataProp": "status"
				    },
				    {
				    "mDataProp": null,
				    "render": function ( data, type, full, meta ) {
		                 return '<button onclick=editData('+data.pentaBaseRegionCode+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
				    }
				    
				    ]
		        } );
		        } else {
		          table.dataTable().fnDestroy();
		          loadTable(data);
		        }
		    }
		
		$scope.getAllRegions = function() {
			RegionService.getAllRegions().then(function(response) {
				$scope.regionLists = response;
				console.log(" get all region data");
				console.log($scope.regionLists);
			});

		};
		$scope.getAllRegionsForGrid = function() {
		RegionService.getAllRegions().then(function(response) {
			$scope.regionLists = response;
			console.log(" get all region data");
			console.log($scope.regionLists);
			$scope.gridOptions.data = response;
			$scope.gridOptions.totalItems = response.length;
		

	     });
		};
		
		$scope.findRegionById = function(pentaBaseRegionCode) {
			RegionService.findRegionById(pentaBaseRegionCode).then(
					function(response) {
						$scope.regionData = response;
						console.log(" find by region data");
						console.log($scope.regionData);
						angular.element('#NewAddWizard').modal('hide');
					});
		};
		$scope.updateRegion = function(regionData) {
			angular.element('#edit').modal('hide');
			
			RegionService.updateRegion(regionData).then(function(response) {
				$scope.message = response.data.responseMessage;
				if (response.data.Status !=true) {
					$scope.error = true;
					$timeout(function() {
						$scope.error = false;
					}, 3000);
				} else {
				/*	swal({
						title : $scope.message,
						timer : 3000,
						type : "success",
					})*/
					 toastr.success($scope.message, "Update Region Successfully", {
						  "timeOut": "3500"
							  });
					//$scope.regionData = response;
					console.log(" update data");
					console.log($scope.regionData);
					angular.element('#NewAddWizard').hide();
					$scope.getAllRegionsForGrid();
					$window.location.href = "#/region";
					$scope.regionForms.$setPristine();
					$scope.regionForms.$setValidity();
					$scope.regionForms.$setUntouched();
				}
			})
			
		};
		$scope.deleteRegion = function() {
			angular.element('#delete').modal('hide');
			$window.location.href = "#/region";
			RegionService.deleteRegion($scope.regionId).then(
					function(response) {
						$scope.getAllRegions();
					});
		};
		$scope.cancel = function() {
			$window.location.href = "#/region";
		}
		$scope.editData = function(id) {
			angular.element('#edit').modal('show');
			$scope.editRegionId = id;
			$scope.findRegionById($scope.editRegionId);
		}
		
		$scope.deleteData = function(id) {
			$scope.regionId = id;	
			$scope.message = "";
			RegionService
			.getZoneByRegion(
					$scope.regionId)
			.then(
					function(response) {
						console.log(response)
						if (response != undefined) {
							$scope.regionZoneList = response.data.body;
							if ($scope.regionZoneList.length != 0) {
								$scope.message ="You can not delete this region";
								angular.element('#error').modal('show');		

							} 
							else
								{
								angular.element('#delete').modal('show');		
								}
						} 

					});
				
		}
		// This code for grid-option
		$scope.myAppScopeProvider = {

				showInfo : function(row, colRenderIndex) {
					var asset = angular.copy(row.entity);
					angular.element('#edit').modal('show');
					$scope.editRegionId = asset.pentaBaseRegionCode;
					$scope.findRegionById($scope.editRegionId);
				}
		}
		var paginationOptions = {
				pageNumber : 1,
				pageSize : 10,
				sort : null
			};
		$scope.gridOptions = {
				enablePaginationControls : true,
				paginationPageSizes : [ 5, 10, 15, 20, 25, 30, 50 ],
				paginationPageSize : paginationOptions.pageSize,
				useExternalPagination : false,
				showFooter : true,
				enableSorting : true,
				multiSelect : false,
				enableFiltering : true,
				enableRowSelection : true,
				enableSelectAll : false,
				enableRowHeaderSelection : false,
				selectionRowHeaderWidth : 40,
				noUnselect : true,
				enableGridMenu : true,
				columnDefs : [  {
					name : 'pentaBaseRegionName',
					displayName : 'Region Name'
				}, {
					name : 'status',
					displayName : 'Status'
				}],
				onRegisterApi : function(gridApi) {
					$scope.gridApi = gridApi;
					 // Setup events so we're notified when grid state changes.
				      $scope.gridApi.colMovable.on.columnPositionChanged($scope, saveState);
				      $scope.gridApi.colResizable.on.columnSizeChanged($scope, saveState);
				      $scope.gridApi.grouping.on.aggregationChanged($scope, saveState);
				      $scope.gridApi.grouping.on.groupingChanged($scope, saveState);
				      $scope.gridApi.core.on.columnVisibilityChanged($scope, saveState);
				      $scope.gridApi.core.on.filterChanged($scope, saveState);
				      $scope.gridApi.core.on.sortChanged($scope, saveState);
					 // Restore previously saved state.
				      restoreState();
				      console.log("saveState of grid Api");
				      console.log(saveState);
				      
				     
				},
				appScopeProvider : $scope.myAppScopeProvider,
				rowTemplate : "<div ng-dblclick=\"grid.appScope.showInfo(row,$index)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
			};
			
			
			  function saveState() {
				    var state = $scope.gridApi.saveState.save();
				    console.log("Save State Of Grid");
				    console.log(state);
				    localStorageService.set('gridRegionState', state);
				  }

				  function restoreState() {
				    $timeout(function() {
				      var state = localStorageService.get('gridRegionState');
				      if (state) $scope.gridApi.saveState.restore($scope, state);
				    });
				  }
			$scope.gridOptions.multiSelect = false;
			$scope.gridOptions.modifierKeysToMultiSelect = false;
			$scope.gridOptions.noUnselect = true;

		// End grid option
		
	}
	RegionController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location', '$routeParams', '$cookieStore', 'RegionService',
			'$timeout', 'uiGridConstants' , 'localStorageService' ];

	angular.module('pentaWorkflow.region', [  'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule' ]).controller(
			'RegionController', RegionController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.region')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})

})(window.angular);