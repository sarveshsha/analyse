(function(angular) {

	'use strict';

	function LookupController($http, $scope, $rootScope, $window, $location,
			$interval, $routeParams, LookupService, $timeout, uiGridConstants, localStorageService) {
		$scope.levelDatas = [];
		$scope.deleteLookupId;
		var paginationOptions = {
			pageNumber : 1,
			pageSize : 10,
			sort : null
		};
		$scope.isPreviousButtonVisible = true;
		$scope.isNextButtonVisible = true;

		$scope.disableProperty = function() {
			$scope.resetLookup();
			angular.element('#NewAddWizard').modal('show');
			$('#selectLookLevel').show();
			$('#level1').hide();
			$('#level2').hide();
			$('#level3').hide();
			$('#level4').hide();
		}

		// On select level form will display
		$(function() {
			$('#selectLookLevel').change(function() {
				$('.lookupLevelOne').slideUp(500);
				$('#' + $(this).val()).slideDown(500);
			});
		});

		$scope.resetLookup = function() {
			$scope.lookup = {
				"pentaBasePropertyName" : null,
				"pentaBasePropertyValue" : null,
				"pentaBasePropertyDesc" : null,
				"isFreeService" : undefined,
			};
			$scope.lookup2 = {
				"pentaBaseAssetLevelOrder" : 0,
				"pentaBasePropertyName" : null,
				"pentaBasePropertyValue" : null,
				"pentaBasePropertyDesc" : null
			};
			$scope.lookup3 = {
				"pentaBaseAssetLevelOrder" : 0,
				"pentaBasePropertyName" : null,
				"pentaBasePropertyValue" : null,
				"pentaBasePropertyDesc" : null
			};
			$scope.lookup4 = {
				"pentaBaseAssetLevelOrder" : 0,
				"pentaBasePropertyName" : null,
				"pentaBasePropertyValue" : null,
				"pentaBasePropertyDesc" : null
			};
		};

		$scope.resetLookup();
		$scope.modalClose = function(lookupForm) {
			$scope.resetLookup();
			angular.element('#NewAddWizard').modal('hide');
			$scope.lookupForm.$rollbackViewValue();
			$scope.lookupForm.$setUntouched();
			$scope.lookupForm.$rollbackViewValue();
			$scope.lookupForm2.$rollbackViewValue();
			$scope.lookupForm2.$setUntouched();
			$scope.lookupForm3.$rollbackViewValue();
			$scope.lookupForm3.$setUntouched();
			$scope.lookupForm4.$rollbackViewValue();
			$scope.lookupForm4.$setUntouched();
			$('#selectLookLevel').show();
			$('#level1').hide();
			$('#level2').hide();
			$('#level3').hide();
			$('#level4').hide();
		};
		$scope.lookUpList = [];
		 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=1", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTableOne(data.body);

			 }
			 
		 });
		 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=2", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTableTwo(data.body);

			 }
			 
		 });
		 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=3", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTableThree(data.body);

			 }
			 
		 });
		 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=4", function(data, status){
			 if (data.body != undefined && data.body !== null ) {
				 loadTableFour(data.body);

			 }
			 
		 });
			function getLookupOne() {
				 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=1", function(data, status){
					 loadTableOne(data.body);
					 console.log("load table");
					 console.log(data.body);
				    });
			}
			function getLookupTwo() {
				 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=2", function(data, status){
					 loadTableTwo(data.body);
					 console.log("load table");
					 console.log(data.body);
				    });
			}
			function getLookupThree() {
				 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=3", function(data, status){
					 loadTableThree(data.body);
					 console.log("load table");
					 console.log(data.body);
				    });
			}
			function getLookupFour() {
				 $.get("v1.0/lookup/levelByIsDeleted/?levelOrder=4", function(data, status){
					 loadTableFour(data.body);
					 console.log("load table");
					 console.log(data.body);
				    });
			}
		// add for lookup level one start
		$scope.addLookUpLevelOne = function(lookupForm) {
			lookupForm.$invalid = true;
			console.log($scope.lookup);
			if ($scope.lookup.pentaBaseAssetLevelOrder == "level1") {
				$scope.lookup.pentaBaseAssetLevelOrder = 1;
			}
			console.log($scope.lookup);
			LookupService.addLookUpLevel($scope.lookup).then(
					function(response) {
						console.log("response");
						console.log(response);
						$scope.message = response.responseMessage;
						if (response.Status == false) {
							$scope.resetLookup();
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
							toastr.success($scope.message, "Add Lookup Successfully", {
								"timeOut" : "3500"
							});
							console.log("response");
							console.log(response.body);
							angular.element('#NewAddWizard').modal('hide');
							$("#level1").hide();
							//getLookupOne();
							//$scope.getAllLookupLevelOne();
							LookupService
							.getAll(
									paginationOptions.pageNumber,
									10, 1)
							.then(
									function(response) {
										console
												.log("get all response");
										console
												.log(response.content);
										paginationOptions.pageNumber = response.number;
										paginationOptions.pageSize = response.totalPages;
										console
												.log("page Object");
										console
												.log(paginationOptions);
										if (paginationOptions.pageNumber > 1) {
											$scope.isPreviousButtonVisible = false;
										}
										if (paginationOptions.pageSize > 1) {
											$scope.isNextButtonVisible = false;
										}

										$scope.gridOptions.totalItems = response.totalElements;
										// paginationOptions.sort=sort[0].direction;
										$scope.gridOptions.data = response.content;

									});
							$window.location.href = "#/lookup";
							$scope.lookupForm.$setPristine();
							$scope.lookupForm.$setUntouched();

						}
					});

		};
		// add for lookup level one end

		// add for lookup level two start
		$scope.addLookUpLevelTwo = function(lookupForm2) {
			lookupForm2.$invalid = true;
			console.log($scope.lookup);
			if ($scope.lookup.pentaBaseAssetLevelOrder == "level2") {
				$scope.lookup2.pentaBaseAssetLevelOrder = 2;
			}
			$scope.lookup2.parentId = angular.fromJson($scope.lookup2.parentId);
			console.log($scope.lookup2);
			LookupService.addLookUpLevel($scope.lookup2).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status == false) {
							$scope.resetLookup();
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
						} else {
							/*	swal({
									title : $scope.message,
									timer : 3000,
									type : "success",
								})
							 */
							toastr.success($scope.message, "Add Lookup Successfully", {
								"timeOut" : "3500"
							});
							angular.element('#NewAddWizard').modal('hide');
							$("#level2").hide();
							$window.location.href = "#/lookup";
							//getLookupTwo();
							LookupService
							.getAll(
									paginationOptions1.pageNumber,
									10, 2)
							.then(
									function(response) {
										console
												.log("get all response");
										console
												.log(response.content);
										paginationOptions1.pageNumber = response.number;
										paginationOptions1.pageSize = response.totalPages;
										console
												.log("page Object");
										console
												.log(paginationOptions);
										if (paginationOptions1.pageNumber > 1) {
											$scope.isPreviousButtonVisible = false;
										}
										if (paginationOptions1.pageSize > 1) {
											$scope.isNextButtonVisible = false;
										}

										$scope.gridOptions1.totalItems = response.totalElements;
										// paginationOptions.sort=sort[0].direction;
										$scope.gridOptions1.data = response.content;

									});
							$scope.lookupForm2.$setPristine();
							$scope.lookupForm2.$setUntouched();

						}
					});

		};
		// // add for lookup level two end

		// add for lookup level three start
		$scope.addLookUpLevelThree = function(lookupForm3) {
			lookupForm3.$invalid = true;
			console.log($scope.lookup);

			if ($scope.lookup.pentaBaseAssetLevelOrder == "level3") {
				$scope.lookup3.pentaBaseAssetLevelOrder = 3;
			}

			$scope.lookup3.parentId = angular.fromJson($scope.lookup3.parentId);
			console.log($scope.lookup3);
			LookupService.addLookUpLevel($scope.lookup3).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status == false) {
							$scope.resetLookup();
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
							toastr.success($scope.message, "Add Lookup Successfully", {
								  "timeOut": "3500"
									  });
							angular.element('#NewAddWizard').modal('hide');
							$("#level3").hide();
							$window.location.href = "#/lookup";
							LookupService
							.getAll(
									paginationOptions2.pageNumber,
									10, 3)
							.then(
									function(response) {
										console
												.log("get all response");
										console
												.log(response.content);
										paginationOptions2.pageNumber = response.number;
										paginationOptions2.pageSize = response.totalPages;
										console
												.log("page Object");
										console
												.log(paginationOptions2);
										if (paginationOptions2.pageNumber > 1) {
											$scope.isPreviousButtonVisible = false;
										}
										if (paginationOptions2.pageSize > 1) {
											$scope.isNextButtonVisible = false;
										}

										$scope.gridOptions2.totalItems = response.totalElements;
										// paginationOptions.sort=sort[0].direction;
										$scope.gridOptions2.data = response.content;

									});
							//getLookupThree();
							$scope.lookupForm3.$setPristine();
							$scope.lookupForm3.$setUntouched();

						}
					});

		};
		// add for lookup level three end

		// add for lookup level four start
		$scope.addLookUpLevelFour = function(lookupForm4) {
			lookupForm4.$invalid = true;
			console.log($scope.lookup);
			if ($scope.lookup.pentaBaseAssetLevelOrder == "level4") {
				$scope.lookup4.pentaBaseAssetLevelOrder = 4;

			}
			$scope.lookup4.parentId = angular.fromJson($scope.lookup4.parentId);
			console.log($scope.lookup);
			LookupService.addLookUpLevel($scope.lookup4).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status == false) {
							$scope.resetLookup();
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
							toastr.success($scope.message, "Add Lookup Successfully", {
								  "timeOut": "3500"
									  });
							$("#level4").hide();
							angular.element('#NewAddWizard').modal('hide');
							$window.location.href = "#/lookup";
							//getLookupFour();
							LookupService
							.getAll(
									paginationOptions3.pageNumber,
									10, 4)
							.then(
									function(response) {
										console
												.log("get all response");
										console
												.log(response.content);
										paginationOptions3.pageNumber = response.number;
										paginationOptions3.pageSize = response.totalPages;
										console
												.log("page Object");
										console
												.log(paginationOptions);
										if (paginationOptions3.pageNumber > 1) {
											$scope.isPreviousButtonVisible = false;
										}
										if (paginationOptions3.pageSize > 1) {
											$scope.isNextButtonVisible = false;
										}

										$scope.gridOptions3.totalItems = response.totalElements;
										// paginationOptions.sort=sort[0].direction;
										$scope.gridOptions3.data = response.content;

									});
							$scope.lookupForm4.$setPristine();
							$scope.lookupForm4.$setUntouched();

						}
					});

		};
		// add for lookup level four end


		$scope.onServiceTypeSelect = function() {
			var lookUpLevel = $('#selectLookLevel').val();
			if (lookUpLevel == "level1") {

			} else {
				lookUpLevel = 1;
				LookupService.getAllPropertiesByLevelOne(lookUpLevel).then(
						function(response) {
							$scope.levelData = response;
						});
			}
		};
		
		

		// get all for lookup level one start
		$scope.getAllLookupLevelOne = function() {
			/*LookupService.getAllLevels(1).then(function(response) {
				$scope.lookupLevelOne = response;
			});*/
			LookupService
					.getAll(0, paginationOptions.pageSize, 1)
					.then(
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
								$scope.lookupLevelOne = $scope.gridOptions.data;
							});
		};
		
		
		
	
		
		// get all for lookup level one end

		// get all for lookup level two start
		$scope.getAllLookupLevelTwo = function() {
			/*LookupService.getAllLevels(2).then(function(response) {
				$scope.lookupLevelTwo = response;
			});*/
				LookupService
						.getAll(0, paginationOptions1.pageSize, 2)
						.then(
								function(response) {
									paginationOptions1.pageNumber = response.number;
									paginationOptions1.pageSize = response.totalPages;
									console.log("page Object");
									console.log(paginationOptions1);
									if (paginationOptions1.pageNumber > 1) {
										$scope.isPreviousButtonVisible = false;
									}
									if (paginationOptions1.pageSize > 1) {
										$scope.isNextButtonVisible = false;
									}

									$scope.gridOptions1.totalItems = response.totalElements;
									// paginationOptions.sort=sort[0].direction;
									$scope.gridOptions1.data = response.content;
									$scope.lookupLevelTwo = $scope.gridOptions1.data;
								});
		};
		// get all for lookup level two end

		// get all for lookup level three start
		$scope.getAllLookupLevelThree = function() {
			/*LookupService.getAllLevels(3).then(function(response) {
				$scope.lookupLevelThree = response;
			});*/
				LookupService
						.getAll(0, paginationOptions2.pageSize, 3)
						.then(
								function(response) {
									paginationOptions2.pageNumber = response.number;
									paginationOptions2.pageSize = response.totalPages;
									console.log("page Object");
									console.log(paginationOptions);
									if (paginationOptions2.pageNumber > 1) {
										$scope.isPreviousButtonVisible = false;
									}
									if (paginationOptions2.pageSize > 1) {
										$scope.isNextButtonVisible = false;
									}

									$scope.gridOptions2.totalItems = response.totalElements;
									// paginationOptions.sort=sort[0].direction;
									$scope.gridOptions2.data = response.content;
									$scope.lookupLevelThree = $scope.gridOptions2.data;
								});
		};
		// get all for lookup level three end

		// get all for lookup level four start
		$scope.getAllLookupLevelFour = function() {
			/*LookupService.getAllLevels(4).then(function(response) {
				$scope.lookupLevelFour = response;
			});*/
			LookupService
					.getAll(0, paginationOptions.pageSize, 4)
					.then(
							function(response) {
								paginationOptions3.pageNumber = response.number;
								paginationOptions3.pageSize = response.totalPages;
								console.log("page Object");
								console.log(paginationOptions3);
								if (paginationOptions3.pageNumber > 1) {
									$scope.isPreviousButtonVisible = false;
								}
								if (paginationOptions3.pageSize > 1) {
									$scope.isNextButtonVisible = false;
								}

								$scope.gridOptions3.totalItems = response.totalElements;
								// paginationOptions.sort=sort[0].direction;
								$scope.gridOptions3.data = response.content;
								$scope.lookupLevelFour = $scope.gridOptions3.data;
							});
		};
		// get all for lookup level four end

		// delete method start
		$scope.deleteLookUpLevel = function(id) {
			/*
			 * angular.element('#deleteOne').modal('hide');
			 * angular.element('#deleteTwo').modal('hide');
			 * angular.element('#deleteThree').modal('hide');
			 */
			$scope.deleteLookupId = id;
			LookupService.findLookupLevelId(id).then(
					function(response) {
						$scope.lookUpData = response;
						console.log($scope.lookUpData);
						$scope.lookUpData.isDeleted = "true";
						LookupService.updateLookupLevel($scope.lookUpData)
								.then(function(response) {
									$scope.lookUpData = response;
									console.log(" deleted data");
									console.log($scope.lookUpData);
								})
					});
		};
		// delete method end

		// Cancel method start
		$scope.cancel = function() {
			$window.location.href = "#/lookup";
		}
		// Cancel method end

		
		// update lookup level 1 start
		$scope.updateLookupLevelOne = function(lookupData, levelOrder) {
			angular.element('#edit1').modal('hide');
			LookupService.updateLookupLevel(lookupData).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status != true) {
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
							toastr.success($scope.message, "Update Lookup Successfully", {
								  "timeOut": "3500"
									  });
							$scope.lookupData = response;
							console.log(" update data");
							console.log($scope.lookupData);
							angular.element('#NewAddWizard').hide();
							//getLookupOne();
						/*	LookupService.getAllLevels(1).then(
									function(response) {
										$scope.lookupLevelOne = response;
									});*/
							LookupService
									.getAll(
											paginationOptions.pageNumber,
											10, 1)
									.then(
											function(response) {
												console
														.log("get all response");
												console
														.log(response.content);
												paginationOptions.pageNumber = response.number;
												paginationOptions.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions);
												if (paginationOptions.pageNumber > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if (paginationOptions.pageSize > 1) {
													$scope.isNextButtonVisible = false;
												}

												$scope.gridOptions.totalItems = response.totalElements;
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions.data = response.content;

											});
						
							$scope.lookupForm.$setPristine();
							$scope.lookupForm.$setUntouched();
						}
					})
		};
		// update lookup level 1 end

		// update lookup level 2 start
		$scope.updateLookupLevelTwo = function(lookupData, levelOrder) {
			angular.element('#edit2').modal('hide');
			
			console.log(lookupData);
			
			LookupService.updateLookupLevel(lookupData).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status != true) {
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
							toastr.success($scope.message, "Update Lookup Successfully", {
								  "timeOut": "3500"
									  });
							$scope.lookupData = response;
							console.log(" update data");
							console.log($scope.lookupData);
							angular.element('#NewAddWizard').hide();
							LookupService
									.getAll(
											paginationOptions1.pageNumber,
											10, 2)
									.then(
											function(response) {
												console
														.log("get all response");
												console
														.log(response.content);
												paginationOptions1.pageNumber = response.number;
												paginationOptions1.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions);
												if (paginationOptions1.pageNumber > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if (paginationOptions1.pageSize > 1) {
													$scope.isNextButtonVisible = false;
												}

												$scope.gridOptions1.totalItems = response.totalElements;
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions1.data = response.content;

											});
							/*LookupService.getAllLevels(2).then(
									function(response) {
										$scope.lookupLevelTwo = response;
									});*/
							//getLookupTwo();
							$scope.lookupForm2.$setPristine();
							$scope.lookupForm2.$setUntouched();
						}
					})
		};
		// update lookup level 2 end

		// update lookup level 3 start
		$scope.updateLookupLevelThree = function(lookupData, levelOrder) {
			angular.element('#edit3').modal('hide');
			LookupService.updateLookupLevel(lookupData).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status != true) {
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
							toastr.success($scope.message, "Update Lookup Successfully", {
								  "timeOut": "3500"
									  });
							$scope.lookupData = response;
							console.log(" update data");
							console.log($scope.lookupData);
							angular.element('#NewAddWizard').hide();
							LookupService
									.getAll(
											paginationOptions2.pageNumber,
											10, 3)
									.then(
											function(response) {
												console
														.log("get all response");
												console
														.log(response.content);
												paginationOptions2.pageNumber = response.number;
												paginationOptions2.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions2);
												if (paginationOptions2.pageNumber > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if (paginationOptions2.pageSize > 1) {
													$scope.isNextButtonVisible = false;
												}

												$scope.gridOptions2.totalItems = response.totalElements;
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions2.data = response.content;

											});
							/*LookupService.getAllLevels(3).then(
									function(response) {
										$scope.lookupLevelThree = response;
									});*/
							//getLookupThree();
							$scope.lookupForm3.$setPristine();
							$scope.lookupForm3.$setUntouched();
						}
					})
		};
		// update lookup level 3 end

		// update lookup level 4 start
		$scope.updateLookupLevelFour = function(lookupData, levelOrder) {
			angular.element('#edit4').modal('hide');
			LookupService.updateLookupLevel(lookupData).then(
					function(response) {
						$scope.message = response.responseMessage;
						if (response.Status != true) {
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
							toastr.success($scope.message, "Update Lookup Successfully", {
								  "timeOut": "3500"
									  });
							$scope.lookupData = response;
							console.log(" update data");
							console.log($scope.lookupData);
							angular.element('#NewAddWizard').hide();
							LookupService
									.getAll(
											paginationOptions3.pageNumber,
											10, 4)
									.then(
											function(response) {
												console
														.log("get all response");
												console
														.log(response.content);
												paginationOptions3.pageNumber = response.number;
												paginationOptions3.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions);
												if (paginationOptions3.pageNumber > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if (paginationOptions3.pageSize > 1) {
													$scope.isNextButtonVisible = false;
												}

												$scope.gridOptions3.totalItems = response.totalElements;
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions3.data = response.content;

											});
						/*	LookupService.getAllLevels(4).then(
									function(response) {
										$scope.lookupLevelFour = response;
									});*/
							//getLookupFour();
							$scope.lookupForm4.$setPristine();
							$scope.lookupForm4.$setUntouched();
						}
					})
		};
		// update lookup level 4 end

		// Method run on page load start
		$scope.getPrerequisite = function() {
			LookupService.getAllMaintenanceStatuses().then(function(response) {
				$scope.maintenanceStatuses = response;
				console.log("maintenance statuses data");
				console.log($scope.maintenanceStatuses);
			});

			LookupService.getAllMaintenanceResultCode().then(
					function(response) {
						$scope.maintenanceResultCode = response;
						console.log("maintenance result code data");
						console.log($scope.maintenanceResultCode);
					});
			LookupService.getAllAssetTableTypes().then(function(response) {
				$scope.maintenanceTableType = response;
				console.log("maintenance asset table type data");
				console.log($scope.maintenanceTableType);
			});
			
		};
		// Method run on page load end

		// delete lookup one start
		$scope.deleteLookupLevelOne = function() {
			angular.element('#deleteOne').modal('hide');
			LookupService.deleteLookup($scope.deleteLookupId).then(
					function(response) {
						LookupService.getAllLevels(1).then(function(response) {
							$scope.lookupLevelOne = response;
							$scope.lookupForm1.$setPristine();
							$scope.lookupForm1.$setUntouched();
						});
					});
		};
		// delete lookup one end

		// delete lookup level two start
		$scope.deleteLookupLevelTwo = function() {
			angular.element('#deleteTwo').modal('hide');
			LookupService.deleteLookup($scope.deleteLookupId).then(
					function(response) {
						LookupService.getAllLevels(2).then(function(response) {
							$scope.lookupLevelTwo = response;
							$scope.lookupForm2.$setPristine();
							$scope.lookupForm2.$setUntouched();
						});
					});
		};

		// delete lookup level two end

		// delete lookup level three start
		$scope.deleteLookupLevelThree = function() {
			angular.element('#deleteThree').modal('hide');
			LookupService.deleteLookup($scope.deleteLookupId).then(
					function(response) {
						LookupService.getAllLevels(3).then(function(response) {
							$scope.lookupLevelThree = response;
							$scope.lookupForm3.$setPristine();
							$scope.lookupForm3.$setUntouched();
						});

					});
		};

		// delete lookup level three end

		// delete lookup level four start
		$scope.deleteLookupLevelFour = function() {
			angular.element('#deleteFour').modal('hide');
			LookupService.deleteLookup($scope.deleteLookupId).then(
					function(response) {
						LookupService.getAllLevels(4).then(function(response) {
							$scope.lookupLevelFour = response;
							$scope.lookupForm4.$setPristine();
							$scope.lookupForm4.$setUntouched();
						});
					});

		};

		// delete lookup level four end

		//For Level one start
		$scope.editDataOne = function(id) {
			angular.element('#edit1').modal('show');
			$scope.editLookupId = id;
			$scope.findLookupLevelId($scope.editLookupId);

		}
		$scope.deleteDataOne = function(id) {
			angular.element('#deleteOne').modal('show');
			$scope.deleteLookupId = id;
		}
		//For Level one end

		//For Level two start
		$scope.editDataTwo = function(id) {
			angular.element('#edit2').modal('show');
			$scope.editLookupId = id;
			$scope.findLookupLevelId($scope.editLookupId);

		}
		$scope.deleteDataTwo = function(id) {
			angular.element('#deleteTwo').modal('show');
			$scope.deleteLookupId = id;
		}
		//For Level two end

		//For Level three start
		$scope.editDataThree = function(id) {
			angular.element('#edit3').modal('show');
			$scope.editLookupId = id;
			$scope.findLookupLevelId($scope.editLookupId);

		}
		$scope.deleteDataThree = function(id) {
			angular.element('#deleteThree').modal('show');
			$scope.deleteLookupId = id;
		}
		//For Level three end

		//For Level four start
		$scope.editDataFour = function(id) {
			angular.element('#edit4').modal('show');
			$scope.editLookupId = id;
			$scope.findLookupLevelId($scope.editLookupId);

		}
		$scope.deleteDataFour = function(id) {
			angular.element('#deleteFour').modal('show');
			$scope.deleteLookupId = id;
		}
		//For Level four end

		$scope.findLookupLevelId = function(lookupId) {
			LookupService.findLookupLevelId(lookupId).then(function(response) {
				$scope.lookupData = response;
				console.log($scope.lookupData);
			});
		};
		
		
		function loadTableOne(data)
	    {
	        var table = $('#data-table-div1');
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
			        "mDataProp": "pentaBasePropertyName"
			    }, {
			        "mDataProp": "pentaBasePropertyDesc"
			    },
			    {
			        "mDataProp": "pentaBasePropertyValue"
			    },			   
			    {
			    "mDataProp": null,
			    "render": function ( data, type, full, meta ) {
	                 return '<button onclick=editDataOne('+data.pentaBaseLookupLevelID+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
			    }
			    
			    ]
	        } );
	        } else {
	          table.dataTable().fnDestroy();
	          loadTableOne(data);
	        }
	    }
		function loadTableTwo(data)
	    {
	        var table = $('#data-table-div2');
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
			        "mDataProp": "pentaBasePropertyName"
			    }, {
			        "mDataProp": "pentaBasePropertyDesc"
			    },
			    {
			        "mDataProp": "pentaBasePropertyValue"
			    },			   
			    {
			    "mDataProp": null,
			    "render": function ( data, type, full, meta ) {
	                 return '<button onclick=editDataTwo('+data.pentaBaseLookupLevelID+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
			    }
			    
			    ]
	        } );
	        } else {
	          table.dataTable().fnDestroy();
	          loadTableTwo(data);
	        }
	    }
		function loadTableThree(data)
	    {
	        var table = $('#data-table-div3');
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
			        "mDataProp": "pentaBasePropertyName"
			    }, {
			        "mDataProp": "pentaBasePropertyDesc"
			    },
			    {
			        "mDataProp": "pentaBasePropertyValue"
			    },			   
			    {
			    "mDataProp": null,
			    "render": function ( data, type, full, meta ) {
	                 return '<button onclick=editDataThree('+data.pentaBaseLookupLevelID+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
			    }
			    
			    ]
	        } );
	        } else {
	          table.dataTable().fnDestroy();
	          loadTableThree(data);
	        }
	    }
		function loadTableFour(data)
	    {
	        var table = $('#data-table-div4');
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
			        "mDataProp": "pentaBasePropertyName"
			    }, {
			        "mDataProp": "pentaBasePropertyDesc"
			    },
			    {
			        "mDataProp": "pentaBasePropertyValue"
			    },			   
			    {
			    "mDataProp": null,
			    "render": function ( data, type, full, meta ) {
	                 return '<button onclick=editDataFour('+data.pentaBaseLookupLevelID+') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' ;}
			    }
			    
			    ]
	        } );
	        } else {
	          table.dataTable().fnDestroy();
	          loadTableFour(data);
	        }
	    }
		
		// This Section for pre-request
		$scope.getPrerequisiteForGrid = function(){
			$scope.getAllLookupLevelOne();
			$scope.getAllLookupLevelTwo();
			$scope.getAllLookupLevelThree();
			$scope.getAllLookupLevelFour();
		}
		// End 
		
		
		
		
		// This section for grid-option level one
		
		$scope.myAppScopeProvider = {
			showInfo : function(row, colRenderIndex) {
				
				var lookupDataOne = angular.copy(row.entity);
				angular.element('#edit1').modal('show');
				$scope.editLookupId = lookupDataOne.pentaBaseLookupLevelID;
				$scope.findLookupLevelId($scope.editLookupId);
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
			columnDefs : [{
				name : 'pentaBaseLookupLevelID',
				displayName : 'Lookup Level ID',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			},{
				name : 'pentaBasePropertyName',
				displayName : 'Property Name'
			},{
				name : 'pentaBasePropertyDesc',
				displayName : 'Property Description'
			},{
				name : 'pentaBasePropertyValue',
				displayName : 'Property Value'
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
									LookupService
									.getAll(newPage - 1, pageSize, 1)
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
			localStorageService.set('gridLookupLevelOneState', state);
		}

		function restoreState() {
			$timeout(function() {
				var state = localStorageService.get('gridLookupLevelOneState');
				if (state)
					$scope.gridApi.saveState.restore($scope, state);
			});
		}
		
		

		// End grid Option for level one
		
		
       // This section for grid-option for level two
		
		$scope.myAppScopeProvider1 = {
			showInfo : function(row, colRenderIndex) {
				
				var lookupDataTwo = angular.copy(row.entity);
				angular.element('#edit2').modal('show');
				$scope.editLookupId = lookupDataTwo.pentaBaseLookupLevelID;
				$scope.findLookupLevelId($scope.editLookupId);
			}
		}
		
		var paginationOptions1 = {
				pageNumber : 1,
				pageSize : 10,
				sort : null
			};
		
		$scope.gridOptions1 = {
			enablePaginationControls : true,
			paginationPageSizes : [ 5, 10, 15, 20, 25, 30, 50 ],
			paginationPageSize : paginationOptions1.pageSize,
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
			columnDefs : [{
				name : 'pentaBaseLookupLevelID',
				displayName : 'Lookup Level ID',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			},{
				name : 'pentaBasePropertyName',
				displayName : 'Property Name'
			},{
				name : 'pentaBasePropertyDesc',
				displayName : 'Property Description'
			},{
				name : 'pentaBasePropertyValue',
				displayName : 'Property Value'
			} ],
			onRegisterApi : function(gridApi) {
				$scope.gridApi = gridApi;
				// Setup events so we're notified when grid state changes.
				$scope.gridApi.colMovable.on.columnPositionChanged($scope,
						saveState);
				$scope.gridApi.colResizable.on.columnSizeChanged($scope,
						saveState1);
				$scope.gridApi.grouping.on
						.aggregationChanged($scope, saveState);
				$scope.gridApi.grouping.on.groupingChanged($scope, saveState);
				$scope.gridApi.core.on.columnVisibilityChanged($scope,
						saveState1);
				$scope.gridApi.core.on.filterChanged($scope, saveState);
				$scope.gridApi.core.on.sortChanged($scope, saveState);
				// Restore previously saved state.
				restoreState1();
				gridApi.pagination.on
						.paginationChanged(
								$scope,
								function(newPage, pageSize) {
									paginationOptions1.pageNumber = newPage;
									paginationOptions1.pageSize = pageSize;
									console
											.log($scope.gridOptions1.paginationPageSize)
									console.log('newPage: ' + newPage
											+ ' pageSize: ' + pageSize);
									LookupService
									.getAll(newPage - 1, pageSize, 2)
									.then(
											function(response) {
												paginationOptions1.pageNumber = response.number;
												paginationOptions1.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions1);
												if ((paginationOptions1.pageNumber + 1) == paginationOptions.pageSize) {
													$scope.isNextButtonVisible = true;
												}
												if ((paginationOptions1.pageNumber + 1) > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if ((paginationOptions1.pageNumber + 1) == 1) {
													$scope.isPreviousButtonVisible = true;
												}
												if ((paginationOptions1.pageNumber + 1) != paginationOptions.pageSize) {
													$scope.isNextButtonVisible = false;
												}
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions1.data = response.content;
												$scope.gridOptions1.totalItems = response.totalElements;
											});
								});
			},
			appScopeProvider : $scope.myAppScopeProvider1,
			rowTemplate : "<div ng-dblclick=\"grid.appScope.showInfo(row,$index)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
		};

		function saveState1() {
			var state = $scope.gridApi.saveState.save();
			console.log("Save State Of Grid");
			console.log(state);
			localStorageService.set('gridLookupLevelTwoState', state);
		}

		function restoreState1() {
			$timeout(function() {
				var state = localStorageService.get('gridLookupLevelTwoState');
				if (state)
					$scope.gridApi.saveState.restore($scope, state);
			});
		}
		
		

		// End grid Option
		
   // This section for grid-option for level three
		
		$scope.myAppScopeProvider2 = {
			showInfo : function(row, colRenderIndex) {
				
				var lookupDataThree = angular.copy(row.entity);
				angular.element('#edit3').modal('show');
				$scope.editLookupId = lookupDataThree.pentaBaseLookupLevelID;
				$scope.findLookupLevelId($scope.editLookupId);
			}
		}
		
		var paginationOptions2 = {
				pageNumber : 1,
				pageSize : 10,
				sort : null
			};
		
		$scope.gridOptions2 = {
			enablePaginationControls : true,
			paginationPageSizes : [ 5, 10, 15, 20, 25, 30, 50 ],
			paginationPageSize : paginationOptions1.pageSize,
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
			columnDefs : [{
				name : 'pentaBaseLookupLevelID',
				displayName : 'Lookup Level ID',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			},{
				name : 'pentaBasePropertyName',
				displayName : 'Property Name'
			},{
				name : 'pentaBasePropertyDesc',
				displayName : 'Property Description'
			},{
				name : 'pentaBasePropertyValue',
				displayName : 'Property Value'
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
				restoreState2();
				gridApi.pagination.on
						.paginationChanged(
								$scope,
								function(newPage, pageSize) {
									paginationOptions2.pageNumber = newPage;
									paginationOptions2.pageSize = pageSize;
									console
											.log($scope.gridOptions2.paginationPageSize)
									console.log('newPage: ' + newPage
											+ ' pageSize: ' + pageSize);
									LookupService
									.getAll(newPage - 1, pageSize, 3)
									.then(
											function(response) {
												paginationOptions2.pageNumber = response.number;
												paginationOptions2.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions2);
												if ((paginationOptions2.pageNumber + 1) == paginationOptions.pageSize) {
													$scope.isNextButtonVisible = true;
												}
												if ((paginationOptions2.pageNumber + 1) > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if ((paginationOptions2.pageNumber + 1) == 1) {
													$scope.isPreviousButtonVisible = true;
												}
												if ((paginationOptions2.pageNumber + 1) != paginationOptions.pageSize) {
													$scope.isNextButtonVisible = false;
												}
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions2.data = response.content;
												$scope.gridOptions2.totalItems = response.totalElements;
											});
								});
			},
			appScopeProvider : $scope.myAppScopeProvider2,
			rowTemplate : "<div ng-dblclick=\"grid.appScope.showInfo(row,$index)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
		};

		function saveState2() {
			var state = $scope.gridApi.saveState2.save();
			console.log("Save State Of Grid");
			console.log(state);
			localStorageService.set('gridLookupLevelThreeState', state);
		}

		function restoreState2() {
			$timeout(function() {
				var state = localStorageService.get('gridLookupLevelThreeState');
				if (state)
					$scope.gridApi.saveState2.restore($scope, state);
			});
		}
		
		

		// End grid Option
		
 // This section for grid-option for level four
		
		$scope.myAppScopeProvider3 = {
			showInfo : function(row, colRenderIndex) {
				
				var lookupDataFour = angular.copy(row.entity);
				angular.element('#edit4').modal('show');
				$scope.editLookupId = lookupDataFour.pentaBaseLookupLevelID;
				$scope.findLookupLevelId($scope.editLookupId);
			}
		}
		
		var paginationOptions3 = {
				pageNumber : 1,
				pageSize : 10,
				sort : null
			};
		
		$scope.gridOptions3 = {
			enablePaginationControls : true,
			paginationPageSizes : [ 5, 10, 15, 20, 25, 30, 50 ],
			paginationPageSize : paginationOptions3.pageSize,
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
			columnDefs : [{
				name : 'pentaBaseLookupLevelID',
				displayName : 'Lookup Level ID',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			},{
				name : 'pentaBasePropertyName',
				displayName : 'Property Name'
			},{
				name : 'pentaBasePropertyDesc',
				displayName : 'Property Description'
			},{
				name : 'pentaBasePropertyValue',
				displayName : 'Property Value'
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
				restoreState3();
				gridApi.pagination.on
						.paginationChanged(
								$scope,
								function(newPage, pageSize) {
									paginationOptions3.pageNumber = newPage;
									paginationOptions3.pageSize = pageSize;
									console
											.log($scope.gridOptions3.paginationPageSize)
									console.log('newPage: ' + newPage
											+ ' pageSize: ' + pageSize);
									LookupService
									.getAll(newPage - 1, pageSize, 4)
									.then(
											function(response) {
												paginationOptions3.pageNumber = response.number;
												paginationOptions3.pageSize = response.totalPages;
												console
														.log("page Object");
												console
														.log(paginationOptions3);
												if ((paginationOptions3.pageNumber + 1) == paginationOptions.pageSize) {
													$scope.isNextButtonVisible = true;
												}
												if ((paginationOptions3.pageNumber + 1) > 1) {
													$scope.isPreviousButtonVisible = false;
												}
												if ((paginationOptions3.pageNumber + 1) == 1) {
													$scope.isPreviousButtonVisible = true;
												}
												if ((paginationOptions3.pageNumber + 1) != paginationOptions.pageSize) {
													$scope.isNextButtonVisible = false;
												}
												// paginationOptions.sort=sort[0].direction;
												$scope.gridOptions3.data = response.content;
												$scope.gridOptions3.totalItems = response.totalElements;
											});
								});
			},
			appScopeProvider : $scope.myAppScopeProvider3,
			rowTemplate : "<div ng-dblclick=\"grid.appScope.showInfo(row,$index)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
		};

		function saveState3() {
			var state = $scope.gridApi.saveState.save();
			console.log("Save State Of Grid");
			console.log(state);
			localStorageService.set('gridLookupLevelFourState', state);
		}

		function restoreState3() {
			$timeout(function() {
				var state = localStorageService.get('gridLookupLevelFourState');
				if (state)
					$scope.gridApi.saveState.restore($scope, state);
			});
		}
		
		

		// End grid Option

	};

	LookupController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$interval', '$location', '$routeParams', 'LookupService',
			'$timeout', 'uiGridConstants' , 'localStorageService'  ];

	angular.module('pentaWorkflow.lookup', [  'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
		'autocomplete', 'ui.bootstrap' , 'ui.bootstrap.datetimepicker','ui.grid',
		'ui.grid.pagination', 'ui.grid.selection',
		'ui.grid.autoResize',
		'ui.grid.selection', 'ui.grid.cellNav',
		'ui.grid.resizeColumns', 'ui.grid.moveColumns',
		'ui.grid.pinning' , 'ui.grid.grouping',
		  'ui.grid.saveState' , 'LocalStorageModule' ])
			.controller('LookupController', LookupController).config(function ($httpProvider, localStorageServiceProvider) {
				  localStorageServiceProvider
				    .setPrefix('pentaWorkflow.lookup')
				    .setStorageType('localStorage')
				    .setNotify(true, true); // Not sure what this setting does
				});

})(window.angular);