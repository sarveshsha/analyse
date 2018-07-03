(function(angular) {

	'use strict';

	function PodController($http, $scope, $rootScope,$cookieStore, $window, $location,$routeParams,$interval,
			PodService ,$timeout) {
		$scope.podList = [];
		$scope.pod = {};
		$scope.deletePodId;
		var paginationOptions = {
				pageNumber : 1,
				pageSize : 10,
				sort : null
			};
		$scope.isPreviousButtonVisible=true;
		$scope.isNextButtonVisible=true;
		$scope.resetPod = function() {
			$scope.pod = {
				"pentaBasePodName" : null,	
				"pentaBaseZone.pentaBaseZoneCode":0
				}
			};
		$scope.resetPod();
		$scope.modalClose = function(podForm) {
			$scope.resetPod();
			angular.element('#myModal').modal('hide');
			$scope.podForm.$rollbackViewValue();
			$scope.podForm.$setValidity();
			$scope.podForm.$setUntouched();
		};
			$scope.getPrerequisite = function() {
				PodService.getAllPods(0, paginationOptions.pageSize).then(
						function(response) {
							paginationOptions.pageNumber = response.number;
							paginationOptions.pageSize = response.totalPages;
							console.log("page Object");
							console.log(paginationOptions);
							if(paginationOptions.pageNumber > 1){
								$scope.isPreviousButtonVisible=false;
							}
							if(paginationOptions.pageSize > 1){
								$scope.isNextButtonVisible=false;
							}
							
							$scope.gridOptions.totalItems = response.totalElements;
							// paginationOptions.sort=sort[0].direction;
							$scope.gridOptions.data = response.content;
							$scope.podLists=$scope.gridOptions.data;
						});
						

			};
			
			$scope.myAppScopeProvider = {
					showInfo : function(row, colRenderIndex) {
						console.log(colRenderIndex);
						$scope.podData = angular.copy(row.entity);
						console.log("Update POD Object");
						console.log($scope.podData);
						angular.element('#edit').modal('show');						
					}
				}
		$scope.addPod = function(podForm) {
				podForm.$invalid = true;
				PodService.addPod(angular.copy($scope.pod)).then(function(response) {
				$scope.message = response.data.responseMessage;
				if (response.data.Status !=true) {
                     console.log(response.data.message);
					$scope.zone = {};
					$scope.error = true;
					$timeout(function() {
						$scope.error = false;
					}, 3000);
				} else {
					swal({
						title : $scope.message,
						timer : 3000,
						type : "success",
					})
				$scope.gridOptions.data.push(response);
				console.log("response of pod");
				console.log(response);
				$scope.resetPod();
				PodService
				.getAllPods(
						paginationOptions.pageNumber,
						10)
				.then(
						function(response) {
							$scope.gridOptions.totalItems = response.totalElements;
							$scope.gridOptions.data = response.content;

						});
				angular.element('#myModal').modal('hide');	
				$scope.podForm.$setPristine();
				$scope.podForm.$setUntouched();
				}
			});
			
		};
		
	PodService.getAllZones().then(function(response) {
		$scope.zones = response;
	});

	$scope.findPodById = function(pentaBasePodCode) {
		PodService.findPodById(pentaBasePodCode).then(
				function(response) {
					$scope.podData = response;
					console.log(" find by zone data");
					console.log($scope.podData);
					angular.element('#myModal').modal('hide');
				});
	};
	$scope.updatePod = function(podData) {
	
		PodService.updatePod(podData).then(function(response) {
			$scope.message = response.data.responseMessage;
			if(response.data.Status !=true)
				{
				$scope.error = true;
				$timeout(function() {
					$scope.error = false;
				}, 3000);
				}
			else{
				angular.element('#edit').modal('hide');
				swal({
					title : $scope.message,
					timer : 3000,
					type : "success",
				})
			$scope.podData = response;
			console.log(" update data");
			console.log($scope.podData);
			angular.element('#myModal').hide();
			PodService
			.getAllPods(
					paginationOptions.pageNumber,
					10)
			.then(
					function(response) {
						$scope.gridOptions.totalItems = response.totalElements;
						$scope.gridOptions.data = response.content;

					});
			$window.location.href = "#/pod";
			$scope.podForms.$setPristine();
			$scope.podForms.$setValidity();
			$scope.podForms.$setUntouched();}
		
		})
	};
	$scope.deletePod = function(id) {
		angular.element('#edit').modal('hide');
		$window.location.href = "#/pod";
		PodService.findPodById(id).then(
				function(response) {
					$scope.podData = response;
					$scope.podData.isDeleted = "true";
					console.log($scope.podData);
					PodService.updatePod($scope.podData).then(
							function(response) {
								$scope.podData = response;
								console.log(" deleted data");
								console.log($scope.podData);
								PodService
								.getAllPods(
										paginationOptions.pageNumber,
										10)
								.then(
										function(response) {
											$scope.gridOptions.totalItems = response.totalElements;
											$scope.gridOptions.data = response.content;
											$scope.podLists=$scope.gridOptions.data;
										});
							})
				});
		
	};
	
	$scope.cancel=function()
	{
		$window.location.href = "#/pod";
	}
	$scope.editData=function(id)
	{
	$scope.editPodId=id;		
		$scope.findPodById($scope.editPodId);
	}
	$scope.deleteData=function(id)
	{
	$scope.deletePodId=id;			
	}
	$scope.gridOptions = {
			enablePaginationControls : false,
			paginationPageSizes : [ 5, 10, 20 ],
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
				name : 'pentaBasePodCode',
				displayName : 'Code',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			}, {
				name : 'pentaBasePodName',
				displayName : 'POD Name'
			}, {
				name : 'status',
				displayName : 'Status'
			}],
			onRegisterApi : function(gridApi) {
				$scope.gridApi = gridApi;

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
									PodService.getAllPods(newPage - 1, pageSize)
											.then(
													function(response) {
														paginationOptions.pageNumber = response.number;
														paginationOptions.pageSize = response.totalPages;
														console
																.log("page Object");
														console
																.log(paginationOptions);
														if((paginationOptions.pageNumber +1) == paginationOptions.pageSize ){
															$scope.isNextButtonVisible=true;
														}
														if((paginationOptions.pageNumber +1) > 1){
															$scope.isPreviousButtonVisible=false;
														}
														if((paginationOptions.pageNumber +1) == 1){
															$scope.isPreviousButtonVisible=true;
														}
														if((paginationOptions.pageNumber +1) != paginationOptions.pageSize ){
															$scope.isNextButtonVisible=false;
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
	}

	PodController.$inject = [ '$http', '$scope', '$rootScope','$cookieStore', '$window',
			'$location','$routeParams','$interval', 'PodService','$timeout'];

	angular.module('pentaWorkflow.pod', [ 'ngTouch', 'ngAnimate']).controller(
			'PodController', PodController);

})(window.angular);