(function(angular) {

	'use strict';

	function CurrencyController($http, $scope, $rootScope, $cookieStore,
			$window, $location, $routeParams, CurrencyService, $timeout  , uiGridConstants, localStorageService) {
		$scope.currencyList = [];
		$scope.deleteCurrencyId;

		$scope.resetCurrency = function() {
			$scope.currency = {
				"pentaBaseCurName" : null,
				"pentaBaseExchngRateFrom" : null,
				"pentaBaseExchngRateTo" : null,
				"pentaBaseLastAvgRate" : null
			}

		};
		$scope.resetCurrency();
		$scope.modalClose = function(currencyForm) {
			$scope.resetCurrency();
			angular.element('#NewAddWizard').modal('hide');
			$scope.currencyForm.$rollbackViewValue();
			$scope.currencyForm.$setValidity();
			$scope.currencyForm.$setUntouched();
		};

		$scope.getPrerequisite = function() {
			$scope.currencyForm.$invalid = true;
			CurrencyService.getDefaultCurrency().then(function(response) {
				$scope.defaultCurrencyValue = response;

			});

		};
		 $.get("v1.0/currency", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTable(data.body);

			 }
			 
		 });
		
		 
		$scope.addCurrency = function(currencyForm) {
/*			currencyForm.$invalid = true;*/
			console.log($scope.currency);
			CurrencyService.addCurrency($scope.currency).then(
					function(response) {
						$scope.message = response.data.responseMessage;
						if (response.data.Status == false) {
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
						} else {
							/*swal({
								title : $scope.message,
								timer : 3000,
								type : "success",
							})*/
					
						  toastr.success($scope.message, "Add Currency Successfully", {
							  "timeOut": "3500"
								  });
							$scope.currencyList.push($scope.currency);
							console.log($scope.currencyList);
							$scope.resetCurrency();
							angular.element('#NewAddWizard').modal('hide');
							//getCurrency();
							$scope.getAllCurrenciesForGrid();
							$scope.currencyForm.$setPristine();
							$scope.currencyForm.$setUntouched();
						}
					});

		};
		$scope.getAllCurrency = function() {
			CurrencyService.getAllCurrency().then(function(response) {
				$scope.currencyLists = response;
				console.log("currency data");
				console.log($scope.currencyLists);
			});
		};
		
		$scope.getAllCurrenciesForGrid = function() {
			CurrencyService.getAllCurrency().then(function(response) {
				console.log("currency data for grid option");
				console.log(response);
				$scope.gridOptions.data = response;
				$scope.gridOptions.totalItems = response.length;
			});
		};

		function getCurrency() {
			 $.get("v1.0/currency", function(data, status){
				 loadTable(data.body);
				 console.log("load table");
				 console.log(data.body);
			    });
		}
		
		$scope.findCurrencyById = function(pentaBaseCurCode) {
			CurrencyService.findCurrencyById(pentaBaseCurCode).then(
					function(response) {
						$scope.currencyData = response;
						console.log(" find by currency data");
						console.log($scope.currencyData);
						angular.element('#NewAddWizard').modal('hide');
					});
		};
		$scope.updateCurrency = function(currencyData) {
			angular.element('#edit').modal('hide');
			
			if ($scope.currency.pentaBaseDefaultCur == undefined) {
				if ($scope.currencyData.pentaBaseDefaultCur == false) {
					$scope.currency.pentaBaseDefaultCur = false;
				}
			} else {
				if ($scope.currency.pentaBaseDefaultCur == true) {
					$scope.currencyData.pentaBaseDefaultCur = true;
				} else {
					$scope.currencyData.pentaBaseDefaultCur = false;
				}
			}
			if ($scope.currency.pentaBaseDefaultCur == true) {
				CurrencyService
						.getDefaultPentaBaseCurrency()
						.then(
								function(response) {
									$scope.defaultPentaBaseCurrencyValue = response;
									$scope.defaultPentaBaseCurrencyValue.pentaBaseDefaultCur = "false";
									CurrencyService
											.updateCurrency(
													$scope.defaultPentaBaseCurrencyValue)
											.then(
													function(response) {
														$scope.message = response.data.responseMessage;
														if (response.data.Status != true) {
															$scope.error = true;
															$timeout(
																	function() {
																		$scope.error = false;
																	}, 3000);
														} else {
															console
																	.log("Penta Base Default Currency Updated successfully");
														}

													})
								});
			}
			
			
			CurrencyService.updateCurrency(currencyData).then(
					function(response) {
						$scope.message = response.data.responseMessage;
						if (response.data.Status == false) {
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
						} else {
							/*swal({
								title : $scope.message,
								timer : 3000,
								type : "success",
							})*/
							  toastr.success($scope.message, "Update Currency Successfully", {
								  "timeOut": "3500"
									  });
							$scope.currencyData = response;
							console.log(" update data");
							console.log($scope.currencyData);
							angular.element('#NewAddWizard').hide();
							$scope.resetCurrency();
							//getCurrency();
							$scope.getAllCurrenciesForGrid();
							$window.location.href = "#/currency";
							$scope.currencyForms.$setPristine();
							$scope.currencyForms.$setValidity();
							$scope.currencyForms.$setUntouched();
						}
					})
		};
		$scope.deleteCurrency = function(id) {
			angular.element('#delete').modal('hide');
			CurrencyService.deleteCurrency($scope.deleteCurrencyId).then(
					function(response) {
						getCurrency();
					});
		};
		$scope.cancel = function() {
			$window.location.href = "#/currency";
		}
		$scope.editData = function(id) {
			angular.element('#edit').modal('show');
			$scope.editCurrencyId = id;
			$scope.findCurrencyById($scope.editCurrencyId);
		}
		$scope.deleteData = function(id) {
			angular.element('#delete').modal('show');
			$scope.deleteCurrencyId = id;
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
		            columnDefs: [
		                         { orderable: false, targets: -1 }
		                      ],
		            "aoColumns": [{
				        "mDataProp": "pentaBaseCurName"
				    }, {
				        "mDataProp": "pentaBaseExchngRateFrom"
				    }, {
				        "mDataProp": "pentaBaseExchngRateTo"
				    }, {
				        "mDataProp": "pentaBaseLastAvgRate"
				    }, {
				        "mDataProp": "pentaBaseDefaultCur"
				    },
				    {
				    "mDataProp": null,
				    "render": function ( data, type, full, meta ) {
		                 return '<button onclick=editData('+data.pentaBaseCurCode+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
				    }
				    
				    ]
		        } );
		        } else {
		          table.dataTable().fnDestroy();
		          loadTable(data);
		        }
		    }
		 
		// This code for grid-option
			$scope.myAppScopeProvider = {

					showInfo : function(row, colRenderIndex) {
						var currencyOne = angular.copy(row.entity);
						angular.element('#edit').modal('show');
						$scope.editCurrencyId = currencyOne.pentaBaseCurCode;
						$scope.findCurrencyById($scope.editCurrencyId);
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
						name : 'pentaBaseCurName',
						displayName : 'Currency Name'
					},{
						name : 'pentaBaseExchngRateFrom',
						displayName : 'Exchange Rate From'
					},{
						name : 'pentaBaseExchngRateTo',
						displayName : 'Exchange Rate To'
					},{
						name : 'pentaBaseLastAvgRate',
						displayName : 'Last Average Rate'
					}, {
						name : 'pentaBaseDefaultCur',
						displayName : 'Default'
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
					    localStorageService.set('gridCurrencyState', state);
					  }

					  function restoreState() {
					    $timeout(function() {
					      var state = localStorageService.get('gridCurrencyState');
					      if (state) $scope.gridApi.saveState.restore($scope, state);
					    });
					  }
				$scope.gridOptions.multiSelect = false;
				$scope.gridOptions.modifierKeysToMultiSelect = false;
				$scope.gridOptions.noUnselect = true;

			// End grid option

	}

	CurrencyController.$inject = [ '$http', '$scope', '$rootScope',
			'$cookieStore', '$window', '$location', '$routeParams',
			'CurrencyService', '$timeout', 'uiGridConstants' , 'localStorageService'  ];

	angular.module('pentaWorkflow.currency', [ 'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule' ]).controller(
			'CurrencyController', CurrencyController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.region')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})

})(window.angular);