(function(angular) {

	'use strict';

	function MaintenanceController($http, $scope, $rootScope, $window,
			$location, $routeParams, MaintenanceService, LookupService,
			$timeout, uiGridConstants, localStorageService) {
		//
		// date and time picker
		$scope.picker3 = {
	        date: new Date()
	    };
		
		$scope.picker2 = {
		        date: new Date()
		    };
		
		$scope.openCalendar = function() {
			$scope.picker3.open = true;
	    };
	    $scope.openCalendarEnd = function() {
			$scope.picker2.open = true;
	    };
		//
		$scope.maintenanceList = [];
		$scope.deleteMaintenanceId;
		$scope.error1 = false;
		$scope.assetData;
		$scope.assetId;
		$scope.asset;
		$scope.mainId;
		$scope.maintenanceUser = {

		};
		$scope.resetMaintenance = function() {
			$scope.maintenance = {
				"pentaBaseAssetId" : null,
				"pentaBaseMaintenance" : null,	

			};
			$scope.asset ={
					
			};

		};
		$scope.resetMaintenance();
		$scope.modalClose = function(maintenanceForm) {
			$scope.resetMaintenance();
			$scope.error1 = false;
			$scope.error2 = false;
			angular.element('#NewAddWizard').modal('hide');
			$scope.maintenanceForm.$rollbackViewValue();
			$scope.maintenanceForm.$setValidity();
			$scope.maintenanceForm.$setUntouched();
		};
		$scope.modalOpen = function() {
			angular.element('#NewAddWizard').modal('show');
			$scope.getAllMaintenanceTypes();

		};
		$.get("v1.0/maintenances", function(data, status) {
			if (data.body != undefined && data.body !== null) {
				loadTable(data.body);

			}

		});
		$scope.getAllMaintenanceTypes = function(){
			MaintenanceService.getAllMaintenanceType().then(function(response) {
				$scope.maintenanceTypeList = response;
			});
		}
		$scope.addMaintenance = function() {
			
			$scope.maintenance.pentaBaseMaintenance.pentaBaseUser=JSON.parse($scope.maintenance.pentaBaseMaintenance.pentaBaseUser);
			$scope.maintenance.pentaBaseMaintenance.pentaBaseOtherUser=JSON.parse($scope.maintenance.pentaBaseMaintenance.pentaBaseOtherUser);
			$scope.mainId = JSON.parse($scope.asset);
			$scope.maintenance.pentaBaseAssetId =$scope.mainId.pentaBaseAssetID;
			MaintenanceService.addMaintenance($scope.maintenance).then(
					function(response) {
						$scope.message = response.data.responseMessage;
						if (response.data.Status == false) {
							$scope.resetMaintenance();
							$scope.error = true;
							$timeout(function() {
								$scope.error = false
							}, 3000);
						} else {

							toastr.success($scope.message, "Add Maintenance Successfully", {
								"timeOut" : "3500"
							});
							$scope.maintenanceList.push($scope.maintenance);
							console.log(response);
							$scope.error2 = false;
							$scope.maintenance = {};
							console.log($scope.maintenanceList);
							angular.element('#NewAddWizard').modal('hide');
							//getMaintenances();
							$scope.getAllMaintenancesForGrid();
							$scope.maintenanceForm.$setPristine();
							$scope.maintenanceForm.$setValidity();
							$scope.maintenanceForm.$setUntouched();
						}
					});

		};
		$scope.getAllMaintenance = function() {
			MaintenanceService.getAllMaintenance().then(function(response) {
				$scope.maintenanceLists = response;
				console.log("maintenanceLists data");
				console.log($scope.maintenanceLists);

			});

		};
		
		$scope.getAllMaintenancesForGrid = function() {
			MaintenanceService.getAllMaintenance().then(function(response) {
				console.log(" get all region data");
				console.log(response);
				$scope.gridOptions.data = response;
				$scope.gridOptions.totalItems = response.length;
				
			});

		};
		function getMaintenances() {
			$.get("v1.0/maintenances", function(data, status) {
				loadTable(data.body);
				console.log("load table");
				console.log(data.body);
			});
		}

		// get all for Maintenance status
		LookupService.getAllMaintenanceStatuses().then(function(response) {
			$scope.maintenanceStatusesList = response;
			console.log("AssetUsagesList");
			console.log($scope.MaintenanceStatusesList);
		});

		// get all for maintenanceResultCodeList
		LookupService.getAllMaintenanceResultCode().then(function(response) {
			$scope.maintenanceResultCodeList = response;
			console.log("maintenanceResultCodeList");
			console.log($scope.maintenanceResultCodeList);
		});

		MaintenanceService.getAllUser().then(function(response) {
			console.log('UserList');
			console.log(response.data.body);
			$scope.userList = response.data.body;
		});
		
		$scope.checkUpdatedate = function(start, end) {
			console.log("Inside");
			console.log('start date ' + start + 'End Date ' + end);
			if (start != null && end != null) {
				if (start > end) {

					$scope.ErrMessage = 'End Date must be greater than start date';
					$scope.error1 = true;
					return false;
				} else {
					$scope.ErrMessage = '';
					$scope.error1 = false;
					return true;
				}
			}

		}

		$scope.findMaintenanceById = function(pentaBaseMaintenanceCode) {

			MaintenanceService
					.findMaintenanceById(pentaBaseMaintenanceCode)
					.then(
							function(response) {

								$scope.maintenanceData = response;
								$scope.maintenanceData.pentaBaseMaintenance.pentaBaseMaintStartDate = new Date(
										$scope.maintenanceData.pentaBaseMaintenance.pentaBaseMaintStartDate);
								$scope.maintenanceData.pentaBaseMaintenance.pentaBaseMaintEndDate = new Date(
										$scope.maintenanceData.pentaBaseMaintenance.pentaBaseMaintEndDate);
								$scope.maintenanceData.pentaBaseMaintenance.pentaBaseResultCode = JSON
										.parse($scope.maintenanceData.pentaBaseMaintenance.pentaBaseResultCode);

							});
			$(".dropdown-toggle").click();
			console.log(" find by maintenance data");
			console.log($scope.maintenanceData);
			// $scope.maintenanceUser=$scope.maintenanceData.pentaBaseUser;

			angular.element('#NewAddWizard').modal('hide');

		};
		$scope.updateMaintenance = function(maintenanceData) {
			
		   if(maintenanceData.pentaBaseAsset.pentaBaseAssetID == undefined){
			   $scope.maintenanceData.pentaBaseAsset = JSON.parse($scope.maintenanceData.pentaBaseAsset);
		   }
			
		   	console.log("harish****************");
			console.log(maintenanceData);
			if(maintenanceData.pentaBaseUser != null || maintenanceData.pentaBaseUser != undefined ){
			maintenanceData.pentaBaseMaintenance.pentaBaseUser = JSON.parse(maintenanceData.pentaBaseUser);
			}
			if(maintenanceData.pentaBaseOtherUser != null || maintenanceData.pentaBaseOtherUser != undefined ){
				maintenanceData.pentaBaseMaintenance.pentaBaseOtherUser = JSON.parse(maintenanceData.pentaBaseOtherUser);
				}
			angular.element('#edit').modal('hide');
			MaintenanceService.updateMaintenance(maintenanceData).then(
					function(response) {
						$scope.message = response.data.responseMessage;
						if (response.data.Status == false) {
							$scope.resetMaintenance();
							$scope.error = true;
							$timeout(function() {
								$scope.error = false
							}, 3000);
						} else {

							$scope.maintenanceData = response;
							console.log(" update data");
							toastr.success($scope.message, "Update Maintenance Successfully", {
								"timeOut" : "3500"
							});
							$scope.error1 = false;
							console.log($scope.maintenanceData);
							angular.element('#NewAddWizard').hide();
							//getMaintenances();
							$scope.getAllMaintenancesForGrid();
							$window.location.href = "#/maintenance";
							$scope.maintenanceForms.$setPristine();
							$scope.maintenanceForms.$setUntouched();
						}
					})
		};
		$scope.maintenance1 = false;
		$scope.checkdate = function(start, end) {
			console.log("Inside");
			if (start != null && end != null) {
				if (start > end) {
					$scope.maintenance1 = true;
					$scope.ErrMessageAdd = 'End Date must be greater than start date';
					$scope.error2 = true;
					return false;
				} else {
					$scope.maintenance1 = false;
					$scope.ErrMessageAdd = '';
					$scope.error2 = false;
					return true;
				}
			}

		}

		$scope.deleteMaintenance = function() {
			angular.element('#delete').modal('hide');
			$window.location.href = "#/maintenance";
			MaintenanceService.deleteMaintenance($scope.deleteMaintenanceId)
					.then(function(response) {
						getMaintenances();
					});
		};
		$scope.getAllAssets = function() {
			MaintenanceService.getAllAssets(0, 100).then(function(response) {
				console.log("Get All Asset");
				console.log(response.content);
				$scope.assetnewList = response.content;
				console.log($scope.assetnewList);
			});
		}
		$scope.getAssetByMaintenance = function(pentaBaseMaintenanceCode) {
			MaintenanceService.getAssetByMaintenance(pentaBaseMaintenanceCode)
					.then(function(response) {
						console.log(">>>>response");
						console.log(response);
						if (response.data.body != null)
							$scope.assetData = response.data.body;

					});
		}
		$scope.openStart = function() {
			$scope.popup1.opened = true;
		};
		$scope.openEnd = function() {
			$scope.popup2.opened = true;
		};
		$scope.popup1 = {
			opened : false

		};
		$scope.popup2 = {
			opened : false
		};

		$scope.cancel = function() {
			$window.location.href = "#/maintenance";
		}
		$scope.editData = function(id) {
			angular.element('#edit').modal('show');
			$scope.editMaintenanceId = id;
			$scope.findMaintenanceById($scope.editMaintenanceId);
			$scope.getAllMaintenanceTypes();
		}
		$scope.deleteData = function(id) {
			angular.element('#delete').modal('show');
			$scope.deleteMaintenanceId = id;
		}
		function loadTable(data) {
			var table = $('#data-table-div');
			if (!$.fn.DataTable.fnIsDataTable(table[0])) {
				table
						.dataTable({
							bProcessing : true,
							bJQueryUI : false,
							bLengthChange : true,
							bDestory : true,
							bRetrieve : true,
							bStateSave : true,
							"searching" : false,
							 "order": [], // disable default sorting
							oTableTools : {
								sRowSelect : "multi",
								aButtons : [ "select_all", "select_none" ]
							},
							iDisplayLength : 10,
							"aaData" : data,
							// disable sorting from last column
				            columnDefs: [
				                         { orderable: false, targets: -1 }
				                      ],
				          
							"aoColumns" : [
									{
										"mDataProp" : "pentaBaseMaintType"
									},
									{
										"mDataProp" : "pentaBaseMainDesc"
									},
									{
										"mDataProp" : "pentaBaseResultCode"
									},
									{
										"mDataProp" : "pentaBaseResultDesc"
									},
									{
										/*"mDataProp" : "pentaBaseMaintStartDate"*/
										"mDataProp" : null,
										render : function(data1) {
											var startDate = new Date(data1.pentaBaseMaintStartDate).toISOString().slice(0, 19);
											return "<div>"+startDate
													+"</div>";
										}
									},
									{
										/*"mDataProp" : "pentaBaseMaintEndDate"*/
										"mDataProp" : null,
										render : function(data1) {
											var endDate = new Date(data1.pentaBaseMaintEndDate).toISOString().slice(0, 19);
											return "<div>"+endDate
													+"</div>";
										}
									},
									{
										"mDataProp" : null,
										"render" : function(data, type, full,
												meta) {
											return '<button onclick=editData('
													+ data.pentaBaseMaintenanceCode
													+ ') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';
										}
									}

							]
						});
			} else {
				table.dataTable().fnDestroy();
				loadTable(data);
			}
		}
		// This code for grid-option
		$scope.myAppScopeProvider = {

				showInfo : function(row, colRenderIndex) {
					var mainOne = angular.copy(row.entity);
					angular.element('#edit').modal('show');
					$scope.editMaintenanceId = mainOne.pentaBaseMaintenanceCode;
					$scope.findMaintenanceById($scope.editMaintenanceId);
					$scope.getAllMaintenanceTypes();
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
					name : 'pentaBaseMaintType',
					displayName : 'Maintenance Type'
				}, {
					name : 'pentaBaseMainDesc',
					displayName : 'Maintenance Description'
				}, {
					name : 'pentaBaseResultCode',
					displayName : 'Result Code'
				}, {
					name : 'pentaBaseResultDesc',
					displayName : 'Result Description'
				}, {
					name : 'pentaBaseMaintStartDate',
					displayName : 'Start Date' ,
					type: 'date',
					cellFilter: 'date:\'yyyy-MM-dd HH:MM\''
				}, {
					name : 'pentaBaseMaintEndDate',
					displayName : 'End Date' ,
					type: 'date', 
					cellFilter: 'date:\'yyyy-MM-dd HH:MM\''
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
				    localStorageService.set('gridMaintenanceState', state);
				  }

				  function restoreState() {
				    $timeout(function() {
				      var state = localStorageService.get('gridMaintenanceState');
				      if (state) $scope.gridApi.saveState.restore($scope, state);
				    });
				  }
			$scope.gridOptions.multiSelect = false;
			$scope.gridOptions.modifierKeysToMultiSelect = false;
			$scope.gridOptions.noUnselect = true;

		// End grid option
	}
	MaintenanceController.$inject = [ '$http', '$scope', '$rootScope',
			'$window', '$location', '$routeParams', 'MaintenanceService',
			'LookupService', '$timeout', 'uiGridConstants' , 'localStorageService'  ];

	angular.module('pentaWorkflow.maintenance', [  'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule']).controller(
			'MaintenanceController', MaintenanceController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.maintenance')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})
})(window.angular);