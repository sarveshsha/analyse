(function(angular) {

	'use strict';

	function ZoneController($http, $scope, $rootScope, $cookieStore, $window,
			$location, $routeParams, $interval, $timeout, ZoneService,
			uiGridConstants, localStorageService) {
		$scope.zoneList = [];
		$scope.deleteZoneId;
		$scope.zoneData;
		$scope.zoneLists;
		var paginationOptions = {
			pageNumber : 1,
			pageSize : 10,
			sort : null
		};
		$scope.isPreviousButtonVisible = true;
		$scope.isNextButtonVisible = true;
		$scope.resetZone = function() {
			$scope.zone = {
				"pentaBaseName" : null,
				"pentaBaseRegion.pentaBaseRegionCode" : 0
			}
		};
		$scope.resetZone();
		$scope.modalClose = function(zoneForm) {
			$scope.resetZone();
			angular.element('#NewAddWizard').modal('hide');
			$scope.zoneForm.$rollbackViewValue();
			$scope.zoneForm.$setValidity();
			$scope.zoneForm.$setUntouched();
		};

		$scope.modalOpen = function() {
			$scope.zoneForm.$invalid = true;
			angular.element('#NewAddWizard').modal('show');
			;
		};
		$.get("v1.0/zones", function(data, status) {
			if (data.body != undefined && data.body !== null) {
				loadTable(data.body);

			}

		});

		$scope.findAllZones = function() {

			ZoneService.getAllZones(0, paginationOptions.pageSize).then(
					function(response) {
						paginationOptions.pageNumber = response.number;
						paginationOptions.pageSize = response.totalPages;
						console.log("page Object");
						console.log(paginationOptions);
						if (paginationOptions.pageNumber > 1) {
							$scope.isPreviousButtonVisible = false;
						}
						if (paginationOptions.pageSize > 1) {
							$scope.isNextButtonVisible = false;
						}

						$scope.gridOptions.totalItems = response.totalElements;
						// paginationOptions.sort=sort[0].direction;
						$scope.gridOptions.data = response.content;
						/*
						 * $scope.zoneLists=response;
						 * console.log("$scope.zoneLists");
						 * console.log($scope.zoneLists);
						 */

					});

		};
		$scope.myAppScopeProvider = {
			showInfo : function(row, colRenderIndex) {
				console.log(colRenderIndex);
				$scope.zoneData = angular.copy(row.entity);
				console.log("Update Zone Object");
				console.log($scope.zoneData);
				angular.element('#edit').modal('show');
			}
		}
		$scope.addZone = function(zoneForm) {
			zoneForm.$invalid = true;
			ZoneService.addZone(angular.copy($scope.zone)).then(
					function(response) {
						$scope.message = response.data.responseMessage;
						if (response.data.Status == false) {
							console.log(response.data.message);
							$scope.resetZone();
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
						} else {
							/*
							 * swal({ title : $scope.message, timer : 3000, type :
							 * "success", })
							 */
							toastr.success($scope.message,
									"Add Zone Successfully", {
										"timeOut" : "3500"
									});
							$scope.resetZone();
							angular.element('#NewAddWizard').modal('hide');
							$scope.zoneForm.$setPristine();
							$scope.zoneForm.$setUntouched();
							getZones();

						}
					});
		};
		ZoneService.getAllRegions().then(function(response) {
			$scope.regions = response;
		});

		function getZones() {
			$.get("v1.0/zones", function(data, status) {
				loadTable(data.body);
				console.log("load table");
				console.log(data.body);
			});
		}
		$scope.findZoneById = function(pentaBaseZoneCode) {
			ZoneService.findZoneById(pentaBaseZoneCode).then(
					function(response) {
						$scope.zoneData = response;
						console.log(" find by zone data");
						console.log($scope.zoneData);
						angular.element('#NewAddWizard').modal('hide');
					});
		};
		$scope.updateZone = function(zoneData) {
			angular.element('#edit').modal('hide');
			ZoneService
					.updateZone(zoneData)
					.then(
							function(response) {
								$scope.message = response.data.responseMessage;
								if (response.data.Status != true) {
									$scope.updateError = true;
									$timeout(function() {
										$scope.updateError = false;
									}, 3000);

								} else {
									/*
									 * swal({ title : $scope.message, timer :
									 * 3000, type : "success", })
									 */
									toastr.success($scope.message,
											"Update Zone Successfully", {
												"timeOut" : "3500"
											});
									$scope.zoneData = response;
									console.log(" update data");
									console.log($scope.zoneData);
									angular.element('#NewAddWizard').hide();
									$window.location.href = "#/zone";
									ZoneService
											.getAllZones(
													paginationOptions.pageNumber,
													10)
											.then(
													function(response) {
														$scope.gridOptions.totalItems = response.totalElements;
														$scope.gridOptions.data = response.content;
														$scope.zoneLists = $scope.gridOptions.data;
													});
									// getZones();
									$scope.zoneForms.$setPristine();
									$scope.zoneForms.$setValidity();
									$scope.zoneForms.$setUntouched();
								}
							});
		};
		$scope.deleteZone = function() {
			angular.element('#delete').modal('hide');
			$window.location.href = "#/zone";
			ZoneService.deleteZone($scope.deleteZoneId).then(
					function(response) {
						getZones();
						$scope.zoneForms.$setPristine();
						$scope.zoneForms.$setValidity();
						$scope.zoneForms.$setUntouched();
					});
		};
		$scope.cancel = function() {
			$window.location.href = "#/zone";
		}
		$scope.editData = function(id) {
			angular.element('#edit').modal('show');
			$scope.editZoneId = id;
			$scope.findZoneById($scope.editZoneId);
		}
		$scope.deleteData = function(id) {
			angular.element('#delete').modal('show');
			$scope.deleteZoneId = id;
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
							"order" : [], // disable default sorting
							oTableTools : {
								sRowSelect : "multi",
								aButtons : [ "select_all", "select_none" ]
							},
							iDisplayLength : 10,
							"aaData" : data,
							// disable sorting from last column
							columnDefs : [ {
								orderable : false,
								targets : -1
							} ],

							"aoColumns" : [
									{
										"mDataProp" : "pentaBaseZoneCode"
									},
									{
										"mDataProp" : "pentaBaseName"
									},
									{
										"mDataProp" : "pentaBaseRegion.pentaBaseRegionName"
									},
									{
										"mDataProp" : null,

										"render" : function(data, type, full,
												meta) {
											return '<button onclick=editData('
													+ data.pentaBaseZoneCode
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
		
		// This section for grid-option
		$scope.gridOptions = {
			enablePaginationControls : true,
			paginationPageSizes : [ 5, 10, 15, 20, 25, 30, 50 ],
			paginationPageSize : paginationOptions.pageSize,
			useExternalPagination : true,
			showFooter : true,
			enableSorting : true,
			multiSelect : false,
			enableFiltering : true,
			enableRowSelection : true,
			enableSelectAll : false,
			enableRowHeaderSelection : false,
			selectionRowHeaderWidth : 35,
			noUnselect : true,
			enableGridMenu : true,
			columnDefs : [ {
				name : 'pentaBaseZoneCode',
				displayName : 'Code',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			}, {
				name : 'pentaBaseName',
				displayName : 'Zone Name'
			} ],
			onRegisterApi : function(gridApi) {
				$scope.gridApi = gridApi;
				// Setup events so we're notified when grid state changes.
				$scope.gridApi.colMovable.on.columnPositionChanged($scope,
						saveState);
				$scope.gridApi.colResizable.on.columnSizeChanged($scope,
						saveState);
				$scope.gridApi.grouping.on
						.aggregationChanged($scope, saveState);
				$scope.gridApi.grouping.on.groupingChanged($scope, saveState);
				$scope.gridApi.core.on.columnVisibilityChanged($scope,
						saveState);
				$scope.gridApi.core.on.filterChanged($scope, saveState);
				$scope.gridApi.core.on.sortChanged($scope, saveState);
				// Restore previously saved state.
				restoreState();
				gridApi.pagination.on
						.paginationChanged(
								$scope,
								function(newPage, pageSize) {
									paginationOptions.pageNumber = newPage;
									paginationOptions.pageSize = pageSize;
									console
											.log($scope.gridOptions.paginationPageSize)
									console.log('newPage: ' + newPage
											+ ' pageSize: ' + pageSize);
									ZoneService
											.getAllZones(newPage - 1, pageSize)
											.then(
													function(response) {
														paginationOptions.pageNumber = response.number;
														paginationOptions.pageSize = response.totalPages;
														console
																.log("page Object");
														console
																.log(paginationOptions);
														if ((paginationOptions.pageNumber + 1) == paginationOptions.pageSize) {
															$scope.isNextButtonVisible = true;
														}
														if ((paginationOptions.pageNumber + 1) > 1) {
															$scope.isPreviousButtonVisible = false;
														}
														if ((paginationOptions.pageNumber + 1) == 1) {
															$scope.isPreviousButtonVisible = true;
														}
														if ((paginationOptions.pageNumber + 1) != paginationOptions.pageSize) {
															$scope.isNextButtonVisible = false;
														}

														// paginationOptions.sort=sort[0].direction;
														$scope.gridOptions.data = response.content;
														$scope.gridOptions.totalItems = response.totalElements;
													});
								});
			},
			appScopeProvider : $scope.myAppScopeProvider,
			rowTemplate : "<div ng-dblclick=\"grid.appScope.showInfo(row,$index)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
		};

		function saveState() {
			var state = $scope.gridApi.saveState.save();
			console.log("Save State Of Grid");
			console.log(state);
			localStorageService.set('gridZoneState', state);
		}

		function restoreState() {
			$timeout(function() {
				var state = localStorageService.get('gridZoneState');
				if (state)
					$scope.gridApi.saveState.restore($scope, state);
			});
		}
		
		// End Section
	}

	ZoneController.$inject = [ '$http', '$scope', '$rootScope', '$cookieStore',
			'$window', '$interval', '$location', '$routeParams', '$timeout',
			'ZoneService', 'uiGridConstants', 'localStorageService' ];

	angular.module(
			'pentaWorkflow.zone',
			[ 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'AxelSoft',
					'autocomplete', 'ui.grid', 'ui.grid.pagination',
					'ui.grid.selection', 'ui.grid.autoResize',
					'ui.grid.saveState', 'ui.grid.selection',
					'ui.grid.cellNav', 'ui.grid.resizeColumns',
					'ui.grid.moveColumns', 'ui.grid.pinning',
					'LocalStorageModule' ]).controller('ZoneController',
			ZoneController).config(
			function($httpProvider, localStorageServiceProvider) {
				localStorageServiceProvider.setPrefix('pentaWorkflow.zone')
						.setStorageType('localStorage').setNotify(true, true); // Not
				// sure
				// what
				// this
				// setting
				// does
			})

})(window.angular);