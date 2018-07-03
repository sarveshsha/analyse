(function(angular) {

	'use strict';

	function ComboAssetController($http, $scope, $rootScope, $window,
			$location, $cookieStore, $interval, AssetService, LookupService,
			RegionService, LanguageService, CompanyService, CurrencyService,
			$timeout, uiGridConstants, localStorageService) {

		// add language code for edit comboasset
		// add language on edit
		$scope.isLanguageEditSame = false;
		$scope.addNewEditLanguage1 = function() {
			$scope.isLanguageEditSame = false;
			$scope.langLengthCount = false;
			$scope.langEndEditCount = false;
			$scope.languageWarning = "";
			var newItemNo = $scope.editLanguageList.length + 1;
			$scope.editLanguageList.push({
				"pentaBaseLanguage" : {}
			});
			console.log($scope.editLanguageList);
			if ($scope.editLanguageList.length == 1) {
				$scope.langLengthCount = true;
				$scope.firstAdd = false;
			}
			if ($scope.languageListEdit != undefined) {
				if ($scope.editLanguageList.length == $scope.languageListEdit.length - 1) {
					$scope.langEndEditCount = true;
				} else {
					$scope.langEndEditCount = false;
				}
			}

		};
		// get all for asset units
		$scope.getAllUnit = function() {
			AssetService.getAllUnits().then(function(response) {
				$scope.UnitLists = response;
			});
		}
		$scope.removeEditLanguage1 = function() {
			$scope.isLanguageEditSame = false;
			$scope.langLengthCount = false;
			$scope.languageWarning = "";
			var lastItem = $scope.editLanguageList.length - 1;
			$scope.editLanguageList.splice(lastItem);

			if ($scope.languageListEdit != undefined) {
				if ($scope.editLanguageList.length == $scope.languageListEdit.length - 1) {
					$scope.langEndEditCount = true;
				} else {
					$scope.langEndEditCount = false;
				}
			}
			if ($scope.editLanguageList.length == 0) {
				$scope.firstAdd = true;
			}
		};

		$scope.onLanguageEditChange1 = function(myLanguage, id) {
			// alert("sadf");
			// myLanguage = JSON.parse(myLanguage);
			$scope.isLanguageEditSame = false;
			var count = 0;
			$scope.languageWarning = "";
			console.log("Asset currency data on edit");
			console.log($scope.editLanguageList);
			for (var lang = 0; lang < $scope.editLanguageList.length; lang++) {

				var langName = $scope.editLanguageList[lang].pentaBaseLanguage.pentaBaseLanguageName;

				if (langName == myLanguage)
					count++;

				if (count > 1) {
					var id = myLanguage;
					$('#' + id).prop("value", "?");
					$scope['' + id + ''] = true;
					$scope.isLanguageEditSame = true;
					$scope.languageWarning = "Can not select " + myLanguage
							+ " twice .. please select different one..";
				}

			}
		};

		// edit language end

		// end code

		// new section for language
		$scope.defaultDescription = {
			"pentaBaseLanguage" : {},
			"pentaBaseLongDesc" : "",
			"pentaBaseAssetRemarks" : ""
		};

		$scope.firstAdd = true;
		// for add language are same
		$scope.isLanguageSame = false;
		// need to manage firstAdd variable
		$scope.getAllDefault = function() {
			LanguageService
					.getDefaultLanguages()
					.then(
							function(response) {
								if (response !== undefined) {
									$scope.defaultLanguage = response;
									console
											.log("Defaultttttttttttttttttttttttttttttttttttttttttttt");
									$scope.defaultLangugeList = [];
									$scope.defaultLangugeList
											.push($scope.defaultLanguage);
									if ($scope.defaultLangugeList.length > 0) {
										$scope.isDefaultLanguageAvailable = true;
										$scope.defaultDescription.pentaBaseLanguage = $scope.defaultLanguage;
									}
								}

							});
		}
		$scope.addNewEditLanguage = function() {
			$scope.isLanguageSame = false;
			$scope.langLengthCount = false;
			$scope.langEndCount = false;
			$scope.languageWarning = "";
			var newItemNo = $scope.asset.pentaBaseDescription.length + 1;
			$scope.asset.pentaBaseDescription.push({
				"pentaBaseLanguage" : {}
			});

			console.log($scope.asset.pentaBaseDescription);
			if ($scope.asset.pentaBaseDescription.length == 1) {
				$scope.langLengthCount = true;
				$scope.firstAdd = false;
			}
			if ($scope.languageLists != undefined) {
				if ($scope.asset.pentaBaseDescription.length == $scope.languageLists.length - 1) {
					$scope.langEndCount = true;
				} else {
					$scope.langEndCount = false;
				}
			}

		};

		$scope.removeEditLanguage = function() {
			$scope.isLanguageSame = false;
			$scope.langLengthCount = false;
			$scope.languageWarning = "";
			var lastItem = $scope.asset.pentaBaseDescription.length - 1;
			$scope.asset.pentaBaseDescription.splice(lastItem);

			if ($scope.languageLists != undefined) {
				if ($scope.asset.pentaBaseDescription.length == $scope.languageLists.length - 1) {
					$scope.langEndCount = true;
				} else {
					$scope.langEndCount = false;
				}
			}
			if ($scope.asset.pentaBaseDescription.length == 0) {
				$scope.firstAdd = true;
			}
		};

		$scope.onLanguageEditChange = function(myLanguage) {
			$scope.isLanguageSame = false;
			var count = 1;
			$scope.languageWarning = "";
			console.log("Asset currency data");
			console.log($scope.asset.pentaBaseLanguage);
			for (var lang = 0; lang < $scope.asset.pentaBaseDescription.length; lang++) {

				var langName = $scope.asset.pentaBaseDescription[lang].pentaBaseLanguage.pentaBaseLanguageName;

				for (var langSecond = lang + 1; langSecond < $scope.asset.pentaBaseDescription.length; langSecond++) {
					if (langName == $scope.asset.pentaBaseDescription[langSecond].pentaBaseLanguage.pentaBaseLanguageName)
						count++;
				}

				if (count > 1) {
					var id = myLanguage.pentaBaseLanguageName;
					$('#' + id).prop("value", "?");
					$scope.isLanguageSame = true;
					$scope.languageWarning = "Can not select " + langName
							+ " twice .. please select different one..";
				}

			}
		};

		// end language section

		// Variable maintain
		$scope.isAssetSeleted = false;

		$scope.asset = {
			"isFreeService" : undefined,
			"pentaBaseDescription" : [],
			"pentaBaseAssetCurrency" : [],
			"comboAssets" : [],
			"pentaBaseCurrency" : [],
			"pentaBaseDescription" : []
		};

		$scope.assetList = [];
		$scope.selectedAssetList = [];
		$scope.filterBy = [];

		// Wizard
		$scope.assetAddsteps = [ {
			step : 1,
			name : "Asset Properties",
			template : "app1/asset/comboWizard/combo-asset-properties.html"
		}, {
			step : 2,
			name : "Asset Area",
			template : "app1/asset/comboWizard/combo-asset-area.html"
		}, {
			step : 3,
			name : "Assign Detail",
			template : "app1/asset/comboWizard/combo-asset-description.html"
		}, {
			step : 4,
			name : "Asset Price",
			template : "app1/asset/comboWizard/combo-asset-price.html"
		} ];
		// combo-asset-properties
		$scope.getAddAssetStepTemplate = function() {
			for (var j = 0; j < $scope.assetAddsteps.length; j++) {
				if ($scope.currentAddAssetStep == $scope.assetAddsteps[j].step) {
					return $scope.assetAddsteps[j].template;
				}
			}
		};
		$scope.gotoAddAssetStep = function(newStep) {
			$scope.currentAddAssetStep = newStep;
		}
		//
		// for add currency for asset
		$scope.onAddCurrencyChange = function(myCurrency) {
			var count = 1;
			$scope.currencyWarning = "";

			console.log("Asset currency data");
			console.log($scope.asset.pentaBaseCurrency);

			for (var curr = 0; curr < $scope.asset.pentaBaseCurrency.length; curr++) {

				var cId = $scope.asset.pentaBaseCurrency[curr].pentaBaseCurrency.pentaBaseCurCode;

				for (var currSecond = curr + 1; currSecond < $scope.asset.pentaBaseCurrency.length; currSecond++) {
					if (cId == $scope.asset.pentaBaseCurrency[currSecond].pentaBaseCurrency.pentaBaseCurCode)
						count++;
				}
				if (count > 1) {
					var id = myCurrency.pentaBaseCurCode;
					$('#' + id).prop("value", "?");
					$scope.currencyWarning = "Can not select same currency twice .. please select different one..";
				}
			}
		};
		// for add currency call for combo asset
		$scope.addNewAddCurrency = function() {
			$scope.lengthCount = false;
			$scope.endCount = false;
			var newItemNo = $scope.asset.pentaBaseCurrency.length + 1;
			$scope.asset.pentaBaseCurrency.push({
				"pentaBaseCurrency" : {}
			});
			if ($scope.asset.pentaBaseCurrency.length == 1) {
				$scope.lengthCount = true;
			}
			if ($scope.asset.pentaBaseCurrency.length == $scope.currencyListCompany.length) {
				$scope.endCount = true;
			}
		};

		$scope.removeAddCurrency = function() {
			$scope.lengthCount = false;
			var lastItem = $scope.asset.pentaBaseCurrency.length - 1;
			$scope.asset.pentaBaseCurrency.splice(lastItem);

			if ($scope.asset.pentaBaseCurrency.length == 1) {
				$scope.lengthCount = true;
			}
			if ($scope.asset.pentaBaseCurrency.length < $scope.currencyListCompany.length) {
				$scope.endCount = false;
			}

		};
		$scope.totalAmount = 0;
		$scope.totalAmountWithDis = 0;
		$scope.moveToListB = function(item) {
			$scope.totalAmount = $scope.totalAmount
					+ item.pentaBaseAssetCurrency[0].pentaBaseAssetCurCostPrice;
			$scope.changeDiscount($scope.discountValue);
			$scope.selectedAssetList.push(item);
			$scope.filterBy.push(item.pentaBaseAssetID);
			$scope.assetList.splice($scope.assetList.indexOf(item), 1);

		};

		$scope.discountValue = 0;
		$scope.changeDiscount = function(discountValue) {
			if ($scope.totalAmount > 0) {
				$scope.totalAmountWithDis = $scope.totalAmount - discountValue;
			} else {
				$scope.totalAmountWithDis = 0;
			}
		}

		$scope.moveToListA = function(item) {
			$scope.totalAmount = $scope.totalAmount
					- item.pentaBaseAssetCurrency[0].pentaBaseAssetCurCostPrice;
			$scope.changeDiscount($scope.discountValue);
			$scope.assetList.push(item);
			$scope.selectedAssetList.splice($scope.selectedAssetList
					.indexOf(item), 1);
			$scope.filterBy.splice($scope.filterBy
					.indexOf(item.pentaBaseAssetID), 1);
			console.log("Asset List ");
			console.log($scope.assetList);
		};
		//

		// Function
		$scope.getPrerequisite = function() {
			$scope.podDisabled = true;
			$scope.zoneDisabled = true;
			$scope.getAllUnit();
			AssetService.getAllAssets(0, 100, true).then(function(response) {
				/*
				 * console.log("Get All Asset"); console.log(response.content);
				 */
				$scope.assetListTable = response.content;
				/* console.log($scope.assetnewList); */
			});
			// $scope.getAllDefault();
			$scope.getAllAssetsForGridOption();
		};

		$scope.getAllAssetsForGridOption = function() {
			// this code for grid option
			AssetService.getAllAssets(0, 10, true).then(function(response) {
				console.log("get all for grid option");
				console.log(response);
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
				for (var i = 0; i < response.content.length; i++) {
					response.content[i].subGridOptions = {
						columnDefs : [ {
							name : "Asset Code",
							field : "pentaBaseAssetCode"
						}, {
							name : "Asset Base",
							field : "pentaBaseAssetBase"
						}, {
							name : "Asset Unit",
							field : "pentaBaseAssetUnit"
						} ],
						data : response.content[i].comboAssets
					}
				}
				$scope.gridOptions.totalItems = response.totalElements;
				// paginationOptions.sort=sort[0].direction;
				$scope.gridOptions.data = response.content;

			});
			// end code of grid option
		}
		$scope.onSearchAvailableAsset = function() {
			$scope.assetList = [];
			if ($scope.searchAvailableAsset == '') {
				AssetService
						.getAllAssets(0, 10, false)
						.then(
								function(response) {
									for (var j = 0; j < response.content.length; j++) {
										if ($scope.filterBy
												.indexOf(response.content[j].pentaBaseAssetID) == -1) {
											$scope.assetList
													.push(response.content[j]);
										}
									}
									// $scope.assetList = response.content;
								});
			} else {
				AssetService
						.searchAssetByCodeOrBase($scope.searchAvailableAsset)
						.then(
								function(response) {
									for (var j = 0; j < response.length; j++) {
										if ($scope.filterBy
												.indexOf(response[j].pentaBaseAssetID) == -1) {
											$scope.assetList.push(response[j]);
										}
									}
								});
			}
		};

		$scope.onAssetSelect = function() {
			$scope.isAssetSeleted = true;
		};

		$scope.onAssetSelectPrevious = function() {
			$scope.isAssetSeleted = false;
		};
		$scope.onAddModalClose = function() {
			$scope.totalAmount = 0;
			$scope.totalAmountWithDis = 0;
			$scope.discountValue = 0;
			$scope.firstAdd = true;
			$scope.isLanguageSame = false;
			$scope.isAssetSeleted = false;
			$scope.searchAvailableAsset = '';
			$scope.selectedAssetList = [];
			$scope.filterBy = [];
			$scope.asset = {
				"isFreeService" : undefined,
				"pentaBaseDescription" : [],
				"pentaBaseAssetCurrency" : [],
				"pentaBaseCurrency" : [],
				"pentaBaseDescription" : []
			};
			$scope.defaultDescription = {
				"pentaBaseLanguage" : {},
				"pentaBaseLongDesc" : "",
				"pentaBaseAssetRemarks" : ""
			};
			$scope.podName = '';
			$scope.podDisabled = true;
			$scope.zoneDisabled = true;
			$scope.defaultCurrencyNew = {
				"pentaBaseAssetCurSellPrice" : 0,
				"pentaBaseAssetCurCostPrice" : 0,
				"isActive" : true,
				"pentaBaseSecurityGrp" : "a",
				"pentaBaseCurrency" : {}
			};
			$scope.asset.pentaBaseCurrency = [];
			// $scope.getAllDefault();
		};

		$scope.onAddModalOpen = function() {
			angular.element('#NewAddWizard').modal({
				backdrop : 'static',
				keyboard : 'false'
			});
			$scope.gotoAddAssetStep(1);
			AssetService.getAllAssets(0, 10, false).then(function(response) {
				$scope.assetList = response.content;
			});
			$scope.firstAdd = true;
			$scope.zoneDisabled = true;
			$scope.podDisabled = true;
			$scope.getAllDefault();
			LanguageService.getAllLanguage().then(function(response) {
				$scope.languageLists = response;
				for (var j = 0; j < $scope.languageLists.length; j++) {
					if ($scope.languageLists[j].pentaBaseDefaultLang) {
						$scope.defaultDescription = {
							"pentaBaseLanguage" : $scope.languageLists[j]
						};
						$scope.isDefaultLanguageAvailable = true;
					}
				}
				;
			});
		};

		$scope.formClose = function() {
			$scope.isAssetSeleted = false;
			$scope.searchAvailableAsset = '';
			$scope.selectedAssetList = [];
			$scope.filterBy = [];
		};
		$scope.search = function(row) {
			if (!$scope.query
					|| (row.pentaBaseAssetCode.toLowerCase().indexOf(
							$scope.query.toLowerCase()) != -1)
					|| (row.pentaBaseAssetBase.toLowerCase().indexOf(
							$scope.query.toLowerCase()) != -1)) {
				return true;
			}
			return false;
		};
		$scope.onAddRegionChange = function() {
			$scope.regionZoneList = [];
			$scope.regionPodList = [];
			$scope.zoneDisabled = true;
			$scope.podDisabled = true;
			$scope.podNotFound = "";
			$scope.zoneNotFound = "";
			$scope.asset.pentaBaseZone = undefined;
			AssetService
					.getZoneByRegion(
							$scope.asset.pentaBaseRegion.pentaBaseRegionCode)
					.then(
							function(response) {
								console.log(response)
								if (response != undefined) {
									$scope.regionZoneList = response.data.body;
									if ($scope.regionZoneList.length != 0) {
										$scope.zoneDisabled = false;
									} else {
										$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
									}
								} else {
									$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
								}

							});

		};

		$scope.onAddZoneChange = function() {
			if (!$scope.zoneDisabled)
				$scope.podDisabled = false;
		};

		/**
		 * Description
		 */

		$scope.addNewChoice = function() {
			var newItemNo = $scope.asset.pentaBaseDescription.length + 1;
			$scope.asset.pentaBaseDescription.push({
				"pentaBaseLanguage" : {}
			});
		};

		$scope.removeChoice = function() {
			var lastItem = $scope.asset.pentaBaseDescription.length - 1;
			$scope.asset.pentaBaseDescription.splice(lastItem);
		};
		// Description end

		// this call is used for add currency in combo asset
		$scope.getAddCurrenciesById = function(companyId) {
			if (companyId != undefined) {
				$scope.asset.pentaBaseAssetCompanyCode = companyId;
				CompanyService
						.getCurrencyByComCode(companyId)
						.then(
								function(response) {
									$scope.pentaBaseNewAssetCurrency = [];
									$scope.asset.pentaBaseCurrency = [];
									$scope.endCount = false;
									$('#currency').hide();

									$scope.currencyListCompany = response;
									/*
									 * if ($scope.currencyListCompany !== null &&
									 * $scope.currencyListCompany !== undefined ) {
									 * if ($scope.currencyListCompany.length ==
									 * 0) { $scope.lengthCount = true; } else {
									 * $scope.lengthCount = false; } } if
									 * ($scope.currencyListCompany ===
									 * undefined) { $scope.lengthCount = true; }
									 */
									$scope.newList = [];
									for ( var i in $scope.currencyLists) {
										var str = $scope.currencyListCompany[i].pentaBaseCurName;
										console.log(str);
										$scope.pentaBaseNewAssetCurrency
												.push(str);
									}
								});
			}

		};

		// Price end

		// Prerequisite methods
		$scope.onePrerequsite = function() {
			LookupService.getAllAssetTableTypes().then(function(response) {
				$scope.assetTypeList = response;
			});
			LookupService.getAllAssetUsages().then(function(response) {
				$scope.AssetUsageList = response;
			});
		};
		$scope.twoPrerequsite = function() {
			RegionService.getAllRegions().then(function(response) {
				$scope.regionList = response;
			});
			$scope.asset.comboAssets = $scope.selectedAssetList;
		};
		$scope.podName = '';
		$scope.threePrerequisite = function(podName) {

			if (podName != undefined && podName != '') {
				$scope.podName = podName;
				// $scope.asset.push($scope.asset.pentaBasePod.pentaBasePodName);
				var pod = {
					"pentaBaseZone" : {
						"pentaBaseZoneCode" : $scope.asset.pentaBaseZone.pentaBaseZoneCode
					},
					"pentaBasePodName" : podName,
					"lastModifiedBy" : "Ashish"
				};
				$scope.asset.pentaBasePod = pod;
			}

		};

		$scope.prerequisitePrice = function() {
			CompanyService.getAllCompany().then(function(response) {
				$scope.companyLists = response;
			});

			CurrencyService.getDefaultPentaBaseCurrency().then(
					function(response) {
						$scope.defaultCurrencyNew = response;
					});
		};

		// Table
		$scope.onExpandRow = function(rowAsset) {
			AssetService.getAllAssetById(rowAsset).then(function(response) {
				$scope.rowAsset = response.comboAssets;
				angular.element('#expandRow').modal({
					backdrop : 'static',
					keyboard : 'false'
				});
			});

		};
		//
		// Submit start

		CurrencyService.getDefaultPentaBaseCurrency().then(function(response) {
			if (response !== undefined) {
				console.log(response);
				$scope.defaultCurrency = response;
				$scope.defaultCurrencyList = [];
				$scope.defaultCurrencyList.push($scope.defaultCurrency);
				if ($scope.defaultCurrencyList.length > 0) {
					$scope.isDefaultCurrencyAvailable = true;
					// $scope.defaultCurrency.pentaBaseCurrency=$scope.defaultCurrency;
				}
			}
		});
		$scope.onSubmitComboAsset = function() {
			console.log("Add Combo =============================");
			console.log($scope.asset);
			if ($scope.asset.pentaBaseZone != null
					&& $scope.asset.pentaBaseZone != undefined) {
				$scope.asset.pentaBaseZone = angular
						.fromJson($scope.asset.pentaBaseZone);
				delete $scope.asset.pentaBaseZone.createdDate;
				delete $scope.asset.pentaBaseZone.lastModifiedDate;
			}
			for (var i = 0; i < $scope.asset.pentaBaseCurrency.length; i++) {
				var myCurrencyObject = {
					"pentaBaseAssetCurSellPrice" : $scope.asset.pentaBaseCurrency[i].pentaBaseSellPrice,
					"pentaBaseAssetCurCostPrice" : $scope.asset.pentaBaseCurrency[i].pentaBaseCostPrice,
					"isActive" : true,
					"pentaBaseSecurityGrp" : "a",
					"pentaBaseCurrency" : $scope.asset.pentaBaseCurrency[i].pentaBaseCurrency
				};
				$scope.asset.pentaBaseAssetCurrency[i] = myCurrencyObject;

			}
			if ($scope.defaultCurrencyNew != null
					&& $scope.defaultCurrencyNew != undefined) {
				/*
				 * $scope.pentaBaseSecurityGrp = "sdf"; $scope.isActive = true;
				 */
				$scope.defaultCurrencyNew.pentaBaseCurrency = angular
						.copy($scope.defaultCurrencyNew);
				$scope.asset.pentaBaseAssetCurrency
						.push($scope.defaultCurrencyNew);
			}
			// for default description
			$scope.asset.pentaBaseDescription.push($scope.defaultDescription);

			AssetService.addAsset(angular.copy($scope.asset)).then(
					function(response) {
						console.log('response');
						console.log(response);
						$scope.message = response.data.responseMessage;
						if (response.data.Status != true) {
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
							swal({
								title : response.message[0],
								timer : 3000,
								type : "success",
							})
						} else {
							/*
							 * swal({ title : $scope.message, timer : 3000, type :
							 * "success", })
							 */
							toastr.success($scope.message,
									"Add Combo Asset Successfully", {
										"timeOut" : "3500"
									});
							$scope.assetForm.$setPristine(); //
							$scope.assetForm.$setValidity();
							$scope.assetForm.$setUntouched();
							$scope.defaultCurrencyNew = {
								"pentaBaseAssetCurSellPrice" : 0,
								"pentaBaseAssetCurCostPrice" : 0,
								"isActive" : true,
								"pentaBaseSecurityGrp" : "a",
								"pentaBaseCurrency" : {}
							};
							$scope.asset.pentaBaseCurrency = [];

							angular.element('#NewAddWizard').modal('hide');
							$scope.asset = {
								"isFreeService" : undefined,
								"pentaBaseDescription" : [],
								"pentaBaseAssetCurrency" : [],
								"comboAssets" : [],
								"pentaBaseCurrency" : [],
								"pentaBaseDescription" : []
							};
							$scope.defaultDescription = {
								"pentaBaseLanguage" : {},
								"pentaBaseLongDesc" : "",
								"pentaBaseAssetRemarks" : ""
							};
							$scope.isAssetSeleted = false;
							$scope.searchAvailableAsset = '';
							$scope.selectedAssetList = [];
							$scope.filterBy = [];
							$scope.podName = '';
							$scope.podDisabled = true;
							$scope.zoneDisabled = true;
							$scope.firstAdd = true;
							$scope.isLanguageSame = false;
							$scope.totalAmount = 0;
							$scope.totalAmountWithDis = 0;
							$scope.discountValue = 0;
							// $scope.getAllDefault();
							/*
							 * AssetService .getAllAssets(0, 100, true) .then(
							 * function(response) { $scope.assetListTable =
							 * response.content; });
							 */
							$scope.gridOptions.data.push(response.data.body);
							$scope.getAllAssetsForGridOption();
						}
					});
		};
		// Submit end

		/**
		 * Update wizard
		 */
		$scope.onUpdateModalClose = function() {

		};

		$scope.onUpdateModalOpen = function(updateAsset) {
			$scope.updateAsset = angular.copy(updateAsset);
			// $scope.gotoUpdateAssetStep(1);
			angular.element('#updateWizard').modal({
				backdrop : 'static',
				keyboard : 'false'
			});
			$scope.zoneNotFound = '';
			$scope.podDisabled = false;
			$scope.gotoUpdateAssetStep(1);
			console.log(updateAsset);
			if (updateAsset.pentaBaseZone !== null) {
				$scope.updateAsset.region = updateAsset.pentaBaseZone.pentaBaseRegion;
				AssetService
						.getZoneByRegion(
								updateAsset.pentaBaseZone.pentaBaseRegion.pentaBaseRegionCode)
						.then(
								function(response) {
									console.log(response)
									if (response != undefined) {

										$scope.regionZoneList = response.data.body;
										if ($scope.regionZoneList.length != 0) {
											$scope.zoneDisabled = false;
										} else {
											$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
										}
									} else {
										$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
									}

								});
			}

		};
		$scope.currentUpdateAssetStep = 1;
		$scope.assetUpdatesteps = [
				{
					step : 1,
					name : "Asset Properties",
					template : "app1/asset/comboWizardUpdate/combo-asset-properties.html"
				},
				{
					step : 2,
					name : "Asset Area",
					template : "app1/asset/comboWizardUpdate/combo-asset-area.html"
				},
				{
					step : 3,
					name : "Assign Detail",
					template : "app1/asset/comboWizardUpdate/combo-asset-description.html"
				},
				{
					step : 4,
					name : "Asset Price",
					template : "app1/asset/comboWizardUpdate/combo-asset-price.html"
				} ];

		$scope.getUpdateAssetStepTemplate = function() {
			for (var j = 0; j < $scope.assetUpdatesteps.length; j++) {
				if ($scope.currentUpdateAssetStep == $scope.assetUpdatesteps[j].step) {
					return $scope.assetUpdatesteps[j].template;
				}
			}
		};
		$scope.gotoUpdateAssetStep = function(newStep) {
			$scope.currentUpdateAssetStep = newStep;
		}

		$scope.onUpdateRegionChange = function() {
			$scope.regionZoneList = [];
			// $scope.regionPodList = [];
			$scope.zoneDisabled = true;
			// $scope.podDisabled = true;
			$scope.podNotFound = "";
			$scope.zoneNotFound = "";
			// $scope.updateAsset.pentaBaseZone = undefined;
			// console.log(JSON.stringify($scope.updateAsset));
			AssetService
					.getZoneByRegion(
							$scope.updateAsset.region.pentaBaseRegionCode)
					.then(
							function(response) {
								console.log(response)
								if (response != undefined) {
									$scope.regionZoneList = response.data.body;
									console.log($scope.updateAsset);
									if ($scope.regionZoneList.length != 0) {
										$scope.zoneDisabled = false;
									} else {
										$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
									}
								} else {
									$scope.zoneNotFound = "Zones not found for selected region. please select different region.";
								}

							});

		};
		// Update Description start
		$scope.addUpdateDescription = function() {
			var newItemNo = $scope.updateAsset.pentaBaseDescription.length + 1;
			$scope.updateAsset.pentaBaseDescription.push({
				"pentaBaseLanguage" : {}
			});
		};

		$scope.removeUpdateDescription = function() {
			var lastItem = $scope.updateAsset.pentaBaseDescription.length - 1;
			$scope.updateAsset.pentaBaseDescription.splice(lastItem);
		};

		$scope.prerequisiteUpdatePrice = function() {
			if ($scope.updateAsset.pentaBaseAssetCompanyCode !== null) {
				CompanyService.findCompanyById(
						$scope.updateAsset.pentaBaseAssetCompanyCode).then(
						function(response) {
							$scope.updateAsset.companyObject = response;
						});

				CompanyService.getCurrencyByComCode(
						$scope.updateAsset.pentaBaseAssetCompanyCode).then(
						function(response) {
							$scope.currencyListCompany = response;
						});
			}
		};
		// Update Description end

		$scope.onSubmitUpdateAsset = function() {
			console.log("Update Combo Asset");
			console.log($scope.updateAsset);
			for (var int = 0; int < $scope.editLanguageList.length; int++) {
				if ($scope.editLanguageList[int].pentaBaseLanguage != undefined) {
					if ($scope.editLanguageList[int].pentaBaseLanguage.pentaBaseLanguageName == undefined) {
						var lang = JSON
								.parse($scope.editLanguageList[int].pentaBaseLanguage);
						$scope.editLanguageList[int].pentaBaseLanguage = lang;
					}
				}

			}

			$scope.editLanguageList.push($scope.editDefaultDescription);

			console.log($scope.editLanguageList);

			$scope.updateAsset.pentaBaseDescription = $scope.editLanguageList;
			AssetService.editAsset($scope.updateAsset).then(
					function(response) {
						console.log("Update Combo Asset");
						console.log($scope.updateAsset);
						console.log('response');
						console.log(response);
						$scope.message = response.data.responseMessage;
						if (response.data.Status != true) {
							$scope.error = true;
							$timeout(function() {
								$scope.error = false;
							}, 3000);
							swal({
								title : response.message[0],
								timer : 3000,
								type : "success",
							})
						} else {
							/*
							 * swal({ title : $scope.message, timer : 3000, type :
							 * "success", })
							 */
							toastr.success($scope.message,
									"Update Combo Asset Successfully", {
										"timeOut" : "3500"
									});
							$scope.updateForm.$setPristine(); //
							$scope.updateForm.$setValidity();
							$scope.updateForm.$setUntouched();

							angular.element('#updateWizard').modal('hide');

							$scope.podDisabled = true;
							$scope.zoneDisabled = true;
							// AssetService
							// .getAllAssets(0, 100, true)
							// .then(
							// function(response) {
							// $scope.assetListTable = response.content;
							// });
							$scope.gridOptions.data = response.content;
							$scope.getAllAssetsForGridOption();
						}
					});
		};
		// Submit end

		/**
		 * Update wizard
		 */

		// combo asset table start
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
										"mDataProp" : "pentaBaseAssetBase"
									},
									{
										"mDataProp" : "pentaBaseAssetCode"
									},
									{
										"mDataProp" : "pentaBaseAssetUnit"
									},
									{
										/*
										 * "mDataProp" :
										 * "pentaBaseAssetCurrency.0.pentaBaseAssetCurCostPrice"
										 */
										"mDataProp" : null,
										render : function(data1) {
											var totalCostPrice = 0;

											for (var i = 0; i < data1.comboAssets.length; i++) {

												totalCostPrice = totalCostPrice
														+ data1.comboAssets[i].pentaBaseAssetCurrency[0].pentaBaseAssetCurCostPrice;
											}
											return "<div>" + totalCostPrice
													+ "</div>";
										}
									},
									{
										/*
										 * "mDataProp" :
										 * "pentaBaseAssetCurrency.0.pentaBaseAssetCurCostPrice"
										 */
										"mDataProp" : null,
										render : function(data2) {
											var totalSellPrice = 0;

											for (var i = 0; i < data2.comboAssets.length; i++) {
												totalSellPrice = totalSellPrice
														+ data2.comboAssets[i].pentaBaseAssetCurrency[0].pentaBaseAssetCurSellPrice;
											}
											return "<div>" + totalSellPrice
													+ "</div>";
										}
									},
									{
										"mDataProp" : "pentaBaseDescription.0.pentaBaseAssetRemarks"
									},

									{
										"mDataProp" : "pentaBaseDescription.0.pentaBaseLongDesc"
									},
									{
										"mDataProp" : null,

										"render" : function(data, type, full,
												meta) {
											var id = data.pentaBaseAssetID;
											return '<button onclick=editData('
													+ id
													+ ') class="editBtn default-radius"> <i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>'
													+ "   "
													+ '<button onclick=assetData('
													+ id
													+ ') class="editBtn default-radius"> <i class="fa fa-plus-circle" aria-hidden="true"></i></button>';
										},

									}

							]
						});
			} else {
				table.dataTable().fnDestroy();
				loadTable(data);
			}
		}
		// combo asset table end

		// jquery call for get all combo start
		$
				.get(
						"http://localhost:8080/v1.0/assets?page=0&size=100&isCombo=true&property=pentaBaseAssetLevelOne,pentaBaseAssetCode,pentaBaseAssetUnit",
						function(data, status) {

							if (data.body != undefined && data.body !== null) {
								loadTable(data.body.content);

							}

						});

		// jquery call for get all combo end

		// get all combo asset start
		function getComboAsset() {
			$
					.get(
							"http://localhost:8080/v1.0/assets?page=0&size=100&isCombo=true&property=pentaBaseAssetLevelOne,pentaBaseAssetCode,pentaBaseAssetUnit",
							function(data, status) {
								loadTable(data.body.content);
								console.log("load table");
								console.log(data.body.content);
							});
		}

		// geta all asset combo end

		$scope.editData = function(asset) {
			$scope.getAllUnit();
			$scope.onUpdateModalOpen(asset);
			$scope.editDefaultDescription = [];
			$scope.editLanguageList = [];
			$scope.languageListEdit = [];
			// add code for length check
			$scope.isLanguageEditSame = false;
			LanguageService.getAllLanguage().then(function(response) {
				if (asset.pentaBaseDescription.length == response.length) {
					$scope.langEndEditCount = true;
				} else {
					$scope.langEndEditCount = false;
				}
				if (asset.pentaBaseDescription.length > 1)
					$scope.firstAdd = false;
				else {
					$scope.firstAdd = true;
				}
				$scope.languageWarning = "";

			});
			// End - add code for length check
			LanguageService.getAllLanguage().then(function(response) {
				$scope.languageListEdit = response;
			});

			angular.forEach(asset.pentaBaseDescription, function(value, key) {

				if (value.pentaBaseLanguage.pentaBaseDefaultLang == true) {
					$scope.editDefaultDescription.push(value);
					console.log("Default");
					console.log($scope.editDefaultDescription);
				} else {
					$scope.editLanguageList.push(value);
				}
			});

			console.log($scope.editLanguageList.length);
			console.log($scope.languageListEdit.length);

			if ($scope.languageListEdit != undefined) {
				if ($scope.editLanguageList.length == $scope.editLanguageList.length - 1) {
					$scope.langEndCount = true;
				} else {
					$scope.langEndCount = false;
				}
			}

			console.log("edit data");
			console.log($scope.editDefaultDescription);
			$scope.editDefaultDescription = $scope.editDefaultDescription[0];
			console.log($scope.editDefaultDescription);

		}

		$scope.assetData = function(asset) {
			$scope.onExpandRow(asset);
		}

		// This section for grid option
		$scope.myAppScopeProvider = {

			showInfo : function(row, colRenderIndex) {
				console.log(colRenderIndex);
				var asset = angular.copy(row.entity);
				$scope.getAllUnit();
				$scope.onUpdateModalOpen(asset);
				$scope.editDefaultDescription = [];
				$scope.editLanguageList = [];
				$scope.languageListEdit = [];
				// add code for length check
				$scope.isLanguageEditSame = false;
				LanguageService.getAllLanguage().then(function(response) {
					if (asset.pentaBaseDescription.length == response.length) {
						$scope.langEndEditCount = true;
					} else {
						$scope.langEndEditCount = false;
					}
					if (asset.pentaBaseDescription.length > 1)
						$scope.firstAdd = false;
					else {
						$scope.firstAdd = true;
					}
					$scope.languageWarning = "";

				});
				// End - add code for length check
				LanguageService.getAllLanguage().then(function(response) {
					$scope.languageListEdit = response;
				});

				angular
						.forEach(
								asset.pentaBaseDescription,
								function(value, key) {

									if (value.pentaBaseLanguage.pentaBaseDefaultLang == true) {
										$scope.editDefaultDescription
												.push(value);
										console.log("Default");
										console
												.log($scope.editDefaultDescription);
									} else {
										$scope.editLanguageList.push(value);
									}
								});

				console.log($scope.editLanguageList.length);
				console.log($scope.languageListEdit.length);

				if ($scope.languageListEdit != undefined) {
					if ($scope.editLanguageList.length == $scope.editLanguageList.length - 1) {
						$scope.langEndCount = true;
					} else {
						$scope.langEndCount = false;
					}
				}

				console.log("edit data");
				console.log($scope.editDefaultDescription);
				$scope.editDefaultDescription = $scope.editDefaultDescription[0];
				console.log($scope.editDefaultDescription);

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
			expandableRowTemplate : 'expandableRowTemplate.html',
			expandableRowHeight : 150,
			useExternalPagination : true,
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
			columnDefs : [ {
				name : 'pentaBaseAssetCode',
				displayName : 'Code',
				action : function($event) {
					console.log($event);
					this.context.blargh();
				},
				context : $scope
			}, {
				name : 'pentaBaseAssetBase',
				displayName : 'Base'
			}, {
				name : 'pentaBaseDescription[0].pentaBaseLongDesc',
				displayName : 'Description'
			}, {
				name : 'pentaBaseAssetUnit',
				displayName : 'Unit'
			}, {
				name : 'pentaBaseAssetCurrency[0].pentaBaseAssetCurCostPrice',
				displayName : 'Cost Price'
			}, {
				name : 'pentaBaseAssetCurrency[0].pentaBaseAssetCurSellPrice',
				displayName : 'Sell Price'
			}, {
				name : 'pentaBaseDescription[0].pentaBaseAssetRemarks',
				displayName : 'Remarks'
			} ],
			onRegisterApi : function(gridApi) {
				$scope.gridApi = gridApi;
				// Setup events so we're notified when grid state
				// changes.
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
				console.log("saveState of grid Api");
				console.log(saveState);

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

									AssetService
											.getAllAssets(newPage - 1,
													pageSize, true)
											.then(
													function(response) {

														paginationOptions.pageNumber = response.number;
														paginationOptions.pageSize = response.totalPages;
														for (var i = 0; i < response.content.length; i++) {
															response.content[i].subGridOptions = {
																columnDefs : [
																		{
																			name : "Asset Code",
																			field : "pentaBaseAssetCode"
																		},
																		{
																			name : "Asset Base",
																			field : "pentaBaseAssetBase"
																		},
																		{
																			name : "Asset Unit",
																			field : "pentaBaseAssetUnit"
																		} ],
																data : response.content[i].comboAssets
															}
														}
														$scope.gridOptions.data = response.content;
														$scope.gridOptions.totalItems = response.totalElements;
														console.log(response);
														console
																.log($scope.gridOptions);
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
			localStorageService.set('gridComboAssetState', state);
		}

		function restoreState() {
			$timeout(function() {
				var state = localStorageService.get('gridComboAssetState');
				if (state)
					$scope.gridApi.saveState.restore($scope, state);
			});
		}
		$scope.gridOptions.multiSelect = false;
		$scope.gridOptions.modifierKeysToMultiSelect = false;
		$scope.gridOptions.noUnselect = true;
		// end grid option section
	}
	;

	ComboAssetController.$inject = [ '$http', '$scope', '$rootScope',
			'$window', '$location', '$cookieStore', '$interval',
			'AssetService', 'LookupService', 'RegionService',
			'LanguageService', 'CompanyService', 'CurrencyService', '$timeout',
			'uiGridConstants', 'localStorageService' ];

	angular.module(
			'pentaWorkflow.comboasset',
			[ 'ngTouch', 'ngTagsInput', 'ngAnimate', 'ui.bootstrap',
					'ui.bootstrap.datetimepicker', 'ui.grid',
					'ui.grid.pagination', 'ui.grid.selection',
					'ui.grid.autoResize', 'ui.grid.selection',
					'ui.grid.cellNav', 'ui.grid.resizeColumns',
					'ui.grid.moveColumns', 'ui.grid.pinning',
					'ui.grid.expandable', 'ui.grid.grouping',
					'ui.grid.saveState', 'LocalStorageModule' ]).controller(
			'ComboAssetController', ComboAssetController).config(
			function($httpProvider, localStorageServiceProvider) {
				localStorageServiceProvider.setPrefix(
						'pentaWorkflow.comboasset').setStorageType(
						'localStorage').setNotify(true, true);
			})

})(window.angular);