(function(angular) {

	'use strict';

	function LanguageController($http, $scope, $rootScope, $window, $location,$routeParams,$timeout,
			LanguageService , uiGridConstants, localStorageService) {
		$scope.languageList = [];
		$scope.deleteLanguageId;
		$scope.getPrerequisite = function() {	
			LanguageService.getDefaultLanguage().then(
					function(response) {
						$scope.defaultLanguageValue= response;			
					});
		
		};
		$scope.resetLanguage = function() {
			$scope.getPrerequisite();
			$scope.language = {
				"pentaBaseLanguageName" : null,	
		
				}
			};
		$scope.modalClose = function(languageForm) {
			$scope.resetLanguage();
		
			$scope.languageForm.$rollbackViewValue();
			$scope.languageForm.$setValidity();
			$scope.languageForm.$setUntouched();
		};
		
		$scope.modalOpen = function() {
			$scope.languageForm.$invalid = true;
		
			angular.element('#NewAddWizard').modal('show');
		};
		$scope.addLanguage = function(languageForm) {
			languageForm.$invalid = true;
			LanguageService.addLanguage($scope.language).then(function(response) {
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
					toastr.success($scope.message, "Add Language Successfully", {
						  "timeOut": "3500"
							  });
				$scope.languageList.push($scope.language);
				$scope.resetLanguage();
				angular.element('#NewAddWizard').modal('hide');
				$scope.resetLanguage();
				//getLanguages();
				$scope.getAllLanguagesForGrid();
				$scope.languageForm.$setPristine();
				$scope.languageForm.$setUntouched();
				}
				});
			
		};
		
		 $.get("v1.0/languages", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTable(data.body);

			 }
			 
		 });
		
		$scope.getAllLanguage = function() {
			LanguageService.getAllLanguage().then(function(response) {
				$scope.languageLists= response;
				console.log("get all language data for grid option");
			    console.log($scope.languageLists);
			   
			    
		});
		
	};
	
	$scope.getAllLanguagesForGrid = function() {
		LanguageService.getAllLanguage().then(function(response) {
			console.log("get all language data for grid option");
			console.log(response);
		    $scope.gridOptions.data = response;
			$scope.gridOptions.totalItems = response.length;
		    
	});
	
};

	
	$scope.findLanguageById = function(pentaBaseLanguageID) {
		LanguageService.findLanguageById(pentaBaseLanguageID).then(
				function(response) {
					$scope.languageData = response;
					console.log(" find by language data");
					console.log($scope.languageData);
					angular.element('#NewAddWizard').modal('hide');
				});
	};
	
	
	function getLanguages() {
		 $.get("v1.0/languages", function(data, status){
			 loadTable(data.body);
			 console.log("load table");
			 console.log(data.body);
		    });
	}
	
	$scope.updateLanguage = function(languageData) {	
		getLanguages();
		angular.element('#edit').modal('hide');	
		
		console.log(languageData);
		console.log($scope.language);
		
		if ($scope.language != undefined) {
			if ($scope.language.pentaBaseDefaultLang == true) {
				$scope.languageData.pentaBaseDefaultLang = true;
			}
			if ($scope.language.pentaBaseDefaultLang == false) {
				$scope.languageData.pentaBaseDefaultLang = false;
			}
		}
		
		console.log($scope.language);
		console.log("eeee");
		console.log($scope.languageData);
		
		
		if(languageData.pentaBaseDefaultLang== true){	
		LanguageService.getDefaultLanguages().then(
					function(response) {
						$scope.defaultLanguageValues= response;			
				
		$scope.defaultLanguageValues.pentaBaseDefaultLang=false;
		
		if($scope.defaultLanguageValues.pentaBaseLanguageID != languageData.pentaBaseLanguageID){
		
			LanguageService.updateLanguage($scope.defaultLanguageValues).then(function(response) {
				$scope.message = response.data.responseMessage;
				if (response.data.Status == false) {
					$scope.error = true;
					$timeout(function() {
						$scope.error = false;
					}, 3000);
				} else {
		
				}
			})
			
			
		}
		
		
					});
	}
				
		LanguageService.updateLanguage($scope.languageData).then(function(response) {
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
				toastr.success($scope.message, "Update Language Successfully", {
					  "timeOut": "3500"
						  });
			$scope.languageData = response;
			console.log(" update  language data");
			console.log($scope.languageData);
			angular.element('#NewAddWizard').hide();
			$scope.resetLanguage();
			//getLanguages();
			$scope.getAllLanguagesForGrid();
			$scope.languageForms.$setPristine();
			$scope.languageForms.$setValidity();
			$scope.languageForms.$setUntouched();
			}
		})
	};
	$scope.deleteLanguage = function(id) {
		angular.element('#delete').modal('hide');
		LanguageService.deleteLanguage($scope.deleteLanguageId).then(
				function(response) {
					getLanguages();
					$scope.getPrerequisite();
				});
	};
	$scope.cancel=function()
	{
	}
	$scope.editData=function(id)
	{
	angular.element('#edit').modal('show');
	$scope.editLanguageId=id;		
		$scope.findLanguageById($scope.editLanguageId);
	}
	$scope.deleteData=function(id)
	{
		angular.element('#delete').modal('show');
	$scope.deleteLanguageId=id;			
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
			        "mDataProp": "pentaBaseLanguageName"
			    }, {
			        "mDataProp": "pentaBaseDefaultLang"
			    },
			    {
			    "mDataProp": null,
			    "render": function ( data, type, full, meta ) {
	                 return '<button onclick=editData('+data.pentaBaseLanguageID+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
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
					var languageOne = angular.copy(row.entity);
					angular.element('#edit').modal('show');
					$scope.editLanguageId=languageOne.pentaBaseLanguageID;		
					$scope.findLanguageById($scope.editLanguageId);
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
					name : 'pentaBaseLanguageName',
					displayName : 'Language Name'
				}, {
					name : 'pentaBaseDefaultLang',
					displayName : 'Default Language'
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
				    localStorageService.set('gridLanguageState', state);
				  }

				  function restoreState() {
				    $timeout(function() {
				      var state = localStorageService.get('gridLanguageState');
				      if (state) $scope.gridApi.saveState.restore($scope, state);
				    });
				  }
			$scope.gridOptions.multiSelect = false;
			$scope.gridOptions.modifierKeysToMultiSelect = false;
			$scope.gridOptions.noUnselect = true;

		// End grid option
	}

	LanguageController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location','$routeParams','$timeout', 'LanguageService' , 'uiGridConstants' , 'localStorageService' ];

	angular.module('pentaWorkflow.language', [ 'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule' ]).controller(
			'LanguageController', LanguageController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.language')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				})

})(window.angular);