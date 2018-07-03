(function(angular) {

	'use strict';

	function CompanyController($http, $scope, $rootScope, $window, $location,
			$routeParams, CompanyService, $cookieStore, $timeout , uiGridConstants, localStorageService) {
		$scope.companyList = [];
		$scope.currencies = [];
		$scope.selected = [];
		$scope.deleteCompanyId;
		
	    $scope.getPrerequisite = function() {
			$('#currencyvalidate').hide();
			$scope.companyForm.$invalid = true;
			$scope.getAllCompaniesForGrid();
			CompanyService.getDefaultCompany().then(function(response) {
				$scope.defaultCompanyValue = response;
			});					
		};
		
		
		$scope.resetCompany = function() {
			$scope.company = {
				"pentaBaseLegalName" : null,
				"pentaBaseAddCode" : null,
				"currencies" : [],
			}
		};

		 $.get("v1.0/company", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTable(data.body);

			 }
			 
		 });
		
		$scope.resetCompany();
		$scope.modalClose = function(companyForm) {
			$scope.resetCompany();
			angular.element('#NewAddWizard').modal('hide');
			$scope.companyForm.$rollbackViewValue();
			$scope.companyForm.$setValidity();
			$scope.companyForm.$setUntouched();
			$scope.selectCategory = undefined;
			$scope.asyncSelected = undefined;
			$scope.subLevels = [];
		};
		$scope.addCompany = function() {
			/*companyForm.$invalid = true;*/
			if ($scope.company.currencies) {
				console.log($scope.company);
				console.log($scope.selected);
				CompanyService.addCompany($scope.company).then(
						function(response) {
							$scope.message = response.data.responseMessage;
							if (response.data.Status != true) {
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
							  toastr.success($scope.message, "Add Company Successfully", {
								  "timeOut": "3500"
									  });
								$scope.companyList.push($scope.company);							
								console.log($scope.companyList);
								$scope.resetCompany();
								angular.element('#NewAddWizard').modal('hide');
								//getCompany();
								$scope.getAllCompaniesForGrid();
								$scope.companyForm.$setPristine();
								$scope.companyForm.$setUntouched();
							}
						});
			} else {
				$('#currencyvalidate').show();
			}

		};
		$scope.getAllCompany = function() {
			$scope.getAllCurrency();
			CompanyService.getAllCompany().then(function(response) {
				$scope.companyLists = response;
				console.log("company data");
				console.log($scope.companyLists);
			});
		};
		
		$scope.getAllCompaniesForGrid = function() {
			$scope.getAllCurrency();
			CompanyService.getAllCompany().then(function(response) {
				console.log("company data for grid Option");
				console.log(response);
				$scope.gridOptions.data = response;
				$scope.gridOptions.totalItems = response.length;
			});
		};
		function getCompany() {
			 $.get("v1.0/company", function(data, status){
				 loadTable(data.body);
				 console.log("load table");
				 console.log(data.body);
			    });
		}
		
		$scope.findCompanyById = function(pentaBaseCurCode) {
			$scope.getAllCurrency();
			CompanyService.findCompanyById(pentaBaseCurCode).then(
					function(response) {
						$scope.companyData = response;
						console.log(" find by company data");
						console.log($scope.companyData);
						angular.element('#NewAddWizard').modal('hide');
					});
			$(".dropdown-toggle").click();
		};
		$scope.updateCompany = function(companyData) {
			$scope.getAllCurrency();
			angular.element('#edit').modal('hide');

			if ($scope.company.pentaBaseDefaultCom == undefined) {
			if($scope.companyData.pentaBaseDefaultCom == false)
				{
				$scope.company.pentaBaseDefaultCom = false;
				}
			
			} else {
				if ($scope.company.pentaBaseDefaultCom == true) {
					$scope.companyData.pentaBaseDefaultCom = true;
				} else {
					$scope.companyData.pentaBaseDefaultCom = false;
				}
			}
			
			if ($scope.company.pentaBaseDefaultCom == true) {
				CompanyService
						.getDefaultPentaBaseCompany()
						.then(
								function(response) {
									$scope.defaultPentaBaseCompanyValue = response;
									$scope.defaultPentaBaseCompanyValue.pentaBaseDefaultCom = "false";
									CompanyService
											.updateCompany(
													$scope.defaultPentaBaseCompanyValue)
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
																	.log("Penta Base Default Company Updated successfully");
														}

													})
								});
			}

			CompanyService.updateCompany(companyData).then(function(response) {
				$scope.message = response.data.responseMessage;
				if (response.data.Status != true) {
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
				  toastr.success($scope.message, "Update Company Successfully", {
					  "timeOut": "3500"
						  });
					$scope.companyData = response;
					console.log(" update data");
					console.log($scope.companyData);
					angular.element('#NewAddWizard').hide();
					$scope.resetCompany();
					//getCompany();
					$scope.getAllCompaniesForGrid();
					$window.location.href = "#/company";
					$scope.companyForms.$setPristine();
					$scope.companyForms.$setValidity();
					$scope.companyForms.$setUntouched();
				}

			})
		};
		$scope.deleteCompany = function() {
			angular.element('#delete').modal('hide');
			CompanyService.deleteCompany($scope.deleteCompanyId).then(
					function(response) {
						getCompany();
					});
		};
		$scope.getAllCurrency = function() {
			CompanyService.getAllCurrency().then(function(response) {
				$scope.currencies = [];

				$scope.currencyLists = response;
				console.log("currencyLists");
				console.log(response);
				for ( var i in $scope.currencyLists) {
					var str = $scope.currencyLists[i].pentaBaseCurName;
					console.log(str);
					$scope.currencies.push(str);
				}
				console.log($scope.currencies);
			});
		};

		$scope.cancel = function() {
			$window.location.href = "#/company";
		}
		$scope.editData = function(id) {
			angular.element('#edit').modal('show');
			$scope.editCompanyId = id;
			$scope.findCompanyById($scope.editCompanyId);
		}
		$scope.deleteData = function(id) {
			CompanyService.getCurrencyByComCode(id).then(function(response) {
				if(response)
					{
					alert("currencies exist");
					}
				else
					{
					angular.element('#delete').modal('show');
					$scope.deleteCompanyId = id;
					}
				
			});
			
			
			
		}
		$scope.validateCurrency = function() {
			$('#currencyvalidate').show();
			if ($scope.company.currencies) {
				$('#currencyvalidate').hide();
			} else {
				$('#currencyvalidate').show();
			}
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
				        "mDataProp": "pentaBaseLegalName"
				    }, {
				        "mDataProp": "pentaBaseAddCode"
				    },
				    {
				        "mDataProp": "pentaBaseDefaultCom"
				    },
				    {
				    "mDataProp": null,
				    "render": function ( data, type, full, meta ) {
		                 return '<button onclick=editData('+data.pentaBaseComCode+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
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
						var companyOne = angular.copy(row.entity);
						angular.element('#edit').modal('show');
						$scope.editCompanyId = companyOne.pentaBaseComCode;
						$scope.findCompanyById($scope.editCompanyId);
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
						name : 'pentaBaseLegalName',
						displayName : 'Company Name'
					}, {
						name : 'pentaBaseAddCode',
						displayName : 'Company Code'
					}, {
						name : 'pentaBaseDefaultCom',
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
					    localStorageService.set('gridCompanyState', state);
					  }

					  function restoreState() {
					    $timeout(function() {
					      var state = localStorageService.get('gridCompanyState');
					      if (state) $scope.gridApi.saveState.restore($scope, state);
					    });
					  }
				$scope.gridOptions.multiSelect = false;
				$scope.gridOptions.modifierKeysToMultiSelect = false;
				$scope.gridOptions.noUnselect = true;

			// End grid option

	}

	CompanyController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location', '$routeParams', 'CompanyService', '$cookieStore',
			'$timeout', 'uiGridConstants' , 'localStorageService' ];

	angular.module('pentaWorkflow.company', ['ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule'  ]).controller(
			'CompanyController', CompanyController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.company')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})

})(window.angular);