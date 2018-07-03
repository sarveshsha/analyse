(function(angular) {

	'use strict';

	function AssetController($http, $scope, $rootScope, $window, $location,
			$cookieStore, $interval, AssetService, LanguageService,
			ZoneService, PodService, CompanyService, LookupService,
			CurrencyService, RegionService, $timeout, uiGridConstants,
			localStorageService) {
		
		
		$rootScope.$emit("CallParentMethod", {});
		$scope.currencyListCompany = [];

		$scope.firstAdd = true;

		// this code for date time picker
		$scope.picker3 = {
			date : new Date()
		};

		$scope.picker2 = {
			date : new Date()
		};

		$scope.openCalendar = function() {
			$scope.picker3.open = true;
		};
		$scope.openCalendarEnd = function() {
			$scope.picker2.open = true;
		};
		// end
		// this code for company change of user
	
		// end
		// this varable is used for validation
		$scope.isAreaClicked = false;
		$scope.isMaintClicked = false;
		$scope.isDescNextClicked = false;
		$scope.isPriceNextClicked = false;
		$scope.isLanguageSame = false;
		$scope.isPropertiesNextClicked = false;
		$scope.isLanguageSameAdd = false;
		$scope.newObject = {};
		$scope.languageWarning = "";
		// for edit language are same

		$scope.resetPropertyWizard = function() {

			console.log("Reset function");
			console.log($scope.selectedCategory);

			if (!$scope.isAreaClicked) {
				$scope.selectedCategory = {};
				$scope.newObject = {};
				console.log("Blank category");
			}

			console.log($scope.selectedCategory);

		}
		$scope.checkPropertiesValidation = function(assetForm,
				currentAddAssetStep) {
			// alert(assetForm.levelTwo.$invalid);
			// alert(assetForm.levelThree.$invalid);
			if (!assetForm.categories.$invalid) {
				if (assetForm.levelTwo == undefined) {

					$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);
				} else if (assetForm.levelTwo.$invalid) {
					$scope.isPropertiesNextClicked = true;
					return false;
				} else if (assetForm.levelThree == undefined) {
					$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);
				} else if (assetForm.levelThree.$invalid) {
					$scope.isPropertiesNextClicked = true;
					return false;
				} else if (assetForm.levelFour == undefined) {
					$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);
				} else if (assetForm.levelFour.$invalid) {
					$scope.isPropertiesNextClicked = true;
					return false;
				}

			} else if (assetForm.levelTwo == undefined
					|| assetForm.levelThree == undefined
					|| assetForm.levelFour == undefined) {
				$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);

			} else {
				$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);
			}
			$scope.gotoAddAssetStepFun(currentAddAssetStep + 1);
		}
		$scope.checkDescValidation = function(assetForm, currentAddAssetStep) {
			// alert(assetForm.defaultDescription.$invalid);
			// alert("inside");
			if (assetForm.glac.$invalid || assetForm.assetType.$invalid
					|| assetForm.code.$invalid || assetForm.base.$invalid
					|| assetForm.defaultDescription1.$invalid
					|| assetForm.usage.$invalid || assetForm.Unit.$invalid) {
				$scope.isDescNextClicked = true;
				return false;
			}
			$scope.gotoAddAssetStep(currentAddAssetStep + 1);
		}

		$scope.checkPriceValidation = function(assetForm, currentAddAssetStep) {
			// alert(assetForm.company.$invalid);
			// alert("inside");
			if (assetForm.company.$invalid || assetForm.cost.$invalid
					|| assetForm.sell.$invalid) {
				$scope.isPriceNextClicked = true;
				return false;
			}
			$scope.gotoAddAssetStep(currentAddAssetStep + 1);
		}

		$scope.checkMaintValidation = function(assetForm) {
			// alert(assetForm.maintType.$invalid);
			// alert("inside");
			if (assetForm.maintType.$invalid || assetForm.user.$invalid
					|| assetForm.resultCode.$invalid
					|| assetForm.resultDescription.$invalid
					|| assetForm.maintStartDate.$invalid
					|| assetForm.maintEndDate.$invalid
					|| assetForm.status.$invalid) {
				$scope.isMaintClicked = true;
				return false;
			}
			$scope.addAsset();
		}

		$scope.gotoAddAssetStepFun = function(newStep) {
			$scope.isAreaClicked = true;
			$scope.currentAddAssetStep = newStep;

		}

		// Add language in edit asset form

		$scope.addNewEditLanguage = function() {
			$scope.isLanguageSameAdd = false;
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
			$scope.isLanguageSameAdd = false;
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
			$scope.isLanguageSameAdd = false;
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
					$scope.languageWarning = "Can not select " + langName
							+ " twice .. please select different one..";
					$scope.isLanguageSameAdd = true;
				}

			}
		};

		// add language on edit

		$scope.addNewEditLanguage1 = function() {
			$scope.isLanguageSame = false;
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
			if ($scope.languageLists != undefined) {
				if ($scope.editLanguageList.length == $scope.languageLists.length - 1) {
					$scope.langEndEditCount = true;
				} else {
					$scope.langEndEditCount = false;
				}
			}

		};

		$scope.removeEditLanguage1 = function() {
			$scope.isLanguageSame = false;
			$scope.langLengthCount = false;
			$scope.languageWarning = "";
			var lastItem = $scope.editLanguageList.length - 1;
			$scope.editLanguageList.splice(lastItem);

			if ($scope.languageLists != undefined) {
				if ($scope.editLanguageList.length == $scope.languageLists.length - 1) {
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
			$scope.isLanguageSame = false;
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
					$scope.isLanguageSame = true;
					$scope.languageWarning = "Can not select " + myLanguage
							+ " twice .. please select different one..";
				}

			}
		};

		// edit language end

		$scope.checkdate = function(start, end) {
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

		ZoneService.getAllRegions().then(function(response) {
			$scope.regionList = response;
		});

		$scope.getAllUnit = function() {
			AssetService.getAllUnits().then(function(response) {
				$scope.UnitLists = response;
			});
		}
		$scope.getAllMaintenanceTypes = function() {
			AssetService.getAllMaintenanceType().then(function(response) {
				$scope.maintenanceTypeList = response;
			});
		}

		PodService.getAllPentaBasePod().then(function(response) {
			$scope.podList = response;
		});
		$scope.selectedId = 0;
		$scope.resetAsset = function() {
			$scope.asset = {
				"pentaBaseAssetProperty" : [],
				"lastModifiedBy" : "default user",
				"pentaBaseSecurityGrp" : "default security",
				"isFreeService" : undefined,
				"pentaBaseDescription" : [],
				"pentaBaseAssetCurrency" : []
			};
		};
		$scope.defaultDescription = {
			"pentaBaseLanguage" : {},
			"pentaBaseLongDesc" : "",
			"pentaBaseAssetRemarks" : ""
		};

		$scope.defaultCurrencyNew = {
			"pentaBaseAssetCurSellPrice" : 0,
			"pentaBaseAssetCurCostPrice" : 0,
			"pentaBaseCurrency" : {},
			"isActive" : true,
			"pentaBaseSecurityGrp" : "default"
		};
		$('.onClickTrans label').click(function() {
			$(".commonTransition").fadeIn(1000);
			$(".onClickTrans").css("display", "none");
		});
		$('.clearBtn').click(function() {
			$(".commonTransition").css("display", "none");
			$(".onClickTrans").fadeIn(1000);
		});

		/*
		 * $('#selectType').change(function() { var selectOption =
		 * $('#selectType').val(); if(selectOption != "0"){
		 * $(".RamCore").fadeIn(1000); } });
		 */
		$('.addNextBtn').click(function() {
			$(".commonTransition2").fadeIn(1000);
		});

		/* Comapny and currency module call start */

		CompanyService.getAllCompany().then(function(response) {
			$scope.companyLists = response;

			console.log("company data");
			console.log($scope.companyLists);
			$scope.asset.pentaBaseCurrency = [];
		});
		$scope.gotoAddAssetStepNew = function(newStep) {
			$scope.isMaintenancePreviousClicked = true;
			$scope.currentAddAssetStep = newStep;

		}
		$scope.getCurrenciesById = function(companyId) {

			// alert(companyId);
			if ($scope.asset.pentaBaseCurrency.length == 0) {
				$scope.addNewCurrency();
			}
			CompanyService
					.getCurrencyByComCode(companyId)
					.then(
							function(response) {
								$scope.pentaBaseAssetCurrency = [];
								$('#currency').hide();
								$scope.currencyListCompany = response;
								$scope.newList = [];
								console.log("currencyLists");
								console.log(response);
								for ( var i in $scope.currencyListCompany) {
									var str = $scope.currencyListCompany[i].pentaBaseCurName;
									console.log(str);
									$scope.pentaBaseAssetCurrency.push(str);
								}
								console.log('Curreny List');
								console.log($scope.pentaBaseAssetCurrency);
							});
		};

		/* Comapny and currency module call end */

		// this call is used for add currency
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
									 * $scope.currencyListCompany !== undefined) {
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

		$scope.resetAsset();
		/*
		 * $scope.modalClose = function(assetForm) { $scope.resetAsset();
		 * angular.element('#myModal').modal('hide'); $(".onClickTrans").show();
		 * $scope.assetForm.$rollbackViewValue();
		 * $scope.assetForm.$setValidity(); $scope.assetForm.$setUntouched();
		 * $scope.selectCategory = undefined; $scope.asyncSelected = undefined;
		 * $scope.subLevels = []; };
		 */
		$scope.modalClose = function(assetForm) {
			$scope.resetAsset();
			$scope.newObject = {};
			angular.element('#NewAddWizard').modal('hide');
			$scope.gotoAddAssetStep(1);
			$scope.isPropertiesNextClicked = false;
			$scope.languageWarning = "";
			/*
			 * $scope.assetForm.$rollbackViewValue();
			 * $scope.assetForm.$setValidity();
			 */
			$scope.assetForm.$setUntouched();
			// $scope.selectCategory = undefined;
			$scope.selectedCategory = {};
			$scope.asyncSelected = undefined;
			$scope.subLevels = [];
			$scope.podName = "";
			$scope.defaultDescription = {
				"pentaBaseLanguage" : {},
				"pentaBaseLongDesc" : "",
				"pentaBaseAssetRemarks" : ""
			};

			$scope.defaultCurrencyNew = {
				"pentaBaseAssetCurSellPrice" : 0,
				"pentaBaseAssetCurCostPrice" : 0,
				"isActive" : true,
				"pentaBaseSecurityGrp" : "a",
				"pentaBaseCurrency" : {}
			};
			$scope.endCount = false;
			$scope.firstAdd = true;
			$scope.langEndCount = false;

			$scope.isAreaClicked = false;
			$scope.isMaintClicked = false;
			$scope.isDescNextClicked = false;
			$scope.isPriceNextClicked = false;
			$scope.isLanguageSameAdd = false;
			$scope.isPropertiesNextClicked = false;

			$scope.asset.pentaBaseCurrency = [];
			$scope.asset.pentaBaseDescription = [];
			$scope.getAllDefault();
		};
		$scope.clearFormLevelOne = function(assetForm) {
			$scope.isAreaClicked = false;
			$scope.isPropertiesNextClicked = false;
			$scope.resetAsset();
			$scope.assetForm.$setPristine();
			$scope.assetForm.$setValidity();
			$scope.assetForm.$setUntouched();

			// $scope.selectCategory = undefined;
			$scope.selectedCategory = {};
			$scope.subLevels = [];
			// add new things
			$scope.asyncSelected = undefined;
			$scope.podDisabled = true;
			$scope.zoneDisabled = true;

		}

		// added by ashish
		$scope.updateAsset = {
			"pentaBaseAssetProperty" : [],
			"lastModifiedBy" : "default user",
			"pentaBaseSecurityGrp" : "default security",
			"isFreeService" : undefined,
			"pentaBaseDescription" : []
		};

		$scope.updateModalClose = function() {
			angular.element('#updateWizard').modal('hide');
			$scope.gotoStep(1);
			$scope.updateAsset = {};
			$scope.asset.pentaBaseDescription = [];
			$scope.firstAdd = true;
			$scope.isLanguageSame = false;
			$scope.languageWarning = "";

		};
		// add for asset
		$scope.disableProperty = function() {
			$scope.podDisabled = true;
			$scope.zoneDisabled = true;
		}
		$scope.modalShow = function() {
			angular.element('#NewAddWizard').modal('show');
			$scope.isAreaClicked = false;
			// alert($scope.isAreaClicked);
			$scope.selectedCategory = {};
			$scope.newObject = {};
		}

		$scope.getAssetById = function(id) {
			AssetService
					.getAllAssetById(id)
					.then(
							function(response) {
								$scope.updateAsset = response;
								console
										.log("$scope.updateAsset.pentaBaseMaintenance");
								console
										.log($scope.updateAsset.pentaBaseMaintenance);
								if ($scope.updateAsset.pentaBaseMaintenance != null) {
									$scope.updateAsset.pentaBaseMaintenance.pentaBaseMaintStartDate = new Date(
											$scope.updateAsset.pentaBaseMaintenance.pentaBaseMaintStartDate);
									$scope.updateAsset.pentaBaseMaintenance.pentaBaseMaintEndDate = new Date(
											$scope.updateAsset.pentaBaseMaintenance.pentaBaseMaintEndDate);
								}
								if ($scope.updateAsset.pentaBaseAssetCompanyCode != null
										&& $scope.updateAsset.pentaBaseAssetCompanyCode != undefined) {

									$scope
											.findCompanyById($scope.updateAsset.pentaBaseAssetCompanyCode);

								}
								console.log($scope.updateAsset);
							});
		}
		$scope.findCompanyById = function(companyID) {
			CompanyService.findCompanyById(companyID).then(function(response) {
				console.log('response.pentaBaseLegalName');
				console.log(response.pentaBaseLegalName);
				$scope.companyName = response.pentaBaseLegalName;
			});
		};

		$scope.myAppScopeProvider = {

			showInfo : function(row, colRenderIndex) {
				console.log(colRenderIndex);
				var asset = angular.copy(row.entity);
				$scope.isLanguageSame = false;
				$scope.getAllUnit();
				$scope.getAllMaintenanceTypes();
				$scope.getAssetById(asset.pentaBaseAssetID);
				var podOld = asset.pentaBasePod;
				ZoneService.findAllZones().then(function(response) {
					$scope.zoneList = response;
				});
				LanguageService.getAllLanguage().then(function(response) {
					$scope.languageLists = response;
				});
				console.log(asset);
				$scope.updateAsset.pentaBaseZone = asset.pentaBaseZone;

				console.log("In Edit Data");
				console.log($scope.updateAsset);
				$scope.editDefaultDescription = [];
				$scope.editLanguageList = [];

				console.log("Date formating");
				console.log($scope.updateAsset);

				if (asset.pentaBaseZone == null) {
					$scope.zoneUpdateDisabled = true;
					$scope.podUpdateDisabled = true;
				} else {
					$scope.zoneUpdateDisabled = false;
					$scope.podUpdateDisabled = false;
					$scope
							.onRegionChange(asset.pentaBaseZone.pentaBaseRegion.pentaBaseRegionName);
				}

				// add code for length check
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
				console.log($scope.languageLists.length);

				if ($scope.languageLists != undefined) {
					if ($scope.editLanguageList.length == $scope.languageLists.length - 1) {
						$scope.langEndCount = true;
					} else {
						$scope.langEndCount = false;
					}
				}

				console.log("edit data");
				console.log($scope.editDefaultDescription);
				$scope.editDefaultDescription = $scope.editDefaultDescription[0];
				console.log($scope.editDefaultDescription);

				if (asset.pentaBaseZone != undefined) {
					AssetService
							.getZoneByRegion(
									asset.pentaBaseZone.pentaBaseRegion.pentaBaseRegionCode)
							.then(function(response) {
								$scope.regionZoneList = response.data.body;
								console.log($scope.regionZoneList);
							});
				}
				$scope.updateAsset.pentaBasePod = podOld;
				angular.element('#updateWizard').modal('show');

			}
		}

		$scope.editData = function(asset) {
			$scope.isLanguageSame = false;
			$scope.getAllUnit();
			$scope.getAllMaintenanceTypes();
			$scope.getAssetById(asset.pentaBaseAssetID);
			var podOld = asset.pentaBasePod;
			ZoneService.findAllZones().then(function(response) {
				$scope.zoneList = response;
			});
			LanguageService.getAllLanguage().then(function(response) {
				$scope.languageLists = response;
			});
			console.log(asset);
			$scope.updateAsset.pentaBaseZone = asset.pentaBaseZone;

			console.log("In Edit Data");
			console.log($scope.updateAsset);
			$scope.editDefaultDescription = [];
			$scope.editLanguageList = [];

			console.log("Date formating");
			console.log($scope.updateAsset);

			if (asset.pentaBaseZone == null) {
				$scope.zoneUpdateDisabled = true;
				$scope.podUpdateDisabled = true;
			} else {
				$scope.zoneUpdateDisabled = false;
				$scope.podUpdateDisabled = false;
				$scope
						.onRegionChange(asset.pentaBaseZone.pentaBaseRegion.pentaBaseRegionName);
			}

			// add code for length check
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
			console.log($scope.languageLists.length);

			if ($scope.languageLists != undefined) {
				if ($scope.editLanguageList.length == $scope.languageLists.length - 1) {
					$scope.langEndCount = true;
				} else {
					$scope.langEndCount = false;
				}
			}

			console.log("edit data");
			console.log($scope.editDefaultDescription);
			$scope.editDefaultDescription = $scope.editDefaultDescription[0];
			console.log($scope.editDefaultDescription);

			if (asset.pentaBaseZone != undefined) {
				AssetService
						.getZoneByRegion(
								asset.pentaBaseZone.pentaBaseRegion.pentaBaseRegionCode)
						.then(function(response) {
							$scope.regionZoneList = response.data.body;
							console.log($scope.regionZoneList);
						});
			}
			$scope.updateAsset.pentaBasePod = podOld;
			angular.element('#updateWizard').modal('show');

		}

		// created by ashish
		$scope.onUpdateSelect = function(item, model, label, level) {
			level.pentaBaseAssetPropertyName = model.pentaBasePropertyName;
			level.pentaBaseAssetPropertyValue = model.pentaBasePropertyValue;
			level.pentaBaseAssetPropertyDescription = model.pentaBasePropertyDesc;
			level.pentaBaseAssetLevel = model.pentaBaseAssetLevelOrder;
			console.log(level);
		};

		$scope.onSelect = function(item, model, label, level) {
			var property = {};
			property.pentaBaseAssetLevel = item.pentaBaseAssetLevelOrder;
			property.pentaBaseAssetPropertyName = item.pentaBasePropertyName;
			property.pentaBaseAssetPropertyValue = item.pentaBasePropertyValue;
			property.pentaBaseAssetPropertyDescription = item.pentaBasePropertyDesc;
			$scope.asset.pentaBaseAssetProperty.push(property);
			$scope.asset.pentaBaseAssetCode = $scope.asset.pentaBaseAssetCode
					+ '-' + property.pentaBaseAssetPropertyValue;
		};
		$scope.onLevel1Select = function(assetCategory) {
			$scope.isPropertiesNextClicked = false;
			$scope.newObject = {};
			var levelSelected = angular.fromJson(assetCategory);
			AssetService.getAllSubLevelProperties(
					levelSelected.pentaBaseLookupLevelID).then(
					function(response) {
						$scope.subLevels = response;
					});
			/*
			 * var property = {}; property.pentaBaseAssetLevel =
			 * levelSelected.pentaBaseAssetLevelOrder;
			 * property.pentaBaseAssetPropertyName =
			 * levelSelected.pentaBasePropertyName;
			 * property.pentaBaseAssetPropertyValue =
			 * levelSelected.pentaBasePropertyValue;
			 * property.pentaBaseAssetPropertyDescription =
			 * levelSelected.pentaBasePropertyDesc;
			 * $scope.asset.pentaBaseAssetProperty.push(property);
			 */
			$scope.asset.pentaBaseAssetLevelOne = levelSelected.pentaBasePropertyName;
			$scope.asset.pentaBaseAssetCode = levelSelected.pentaBasePropertyValue;
			$scope.selectedCategory = angular.fromJson(assetCategory);
		};

		var paginationOptions = {
			pageNumber : 1,
			pageSize : 10,
			sort : null
		};

		$scope.isPreviousButtonVisible = true;
		$scope.isNextButtonVisible = true;
		$scope.assetCategories = {};
		$scope.assetList = [];
		$scope.assetProertiesTags = [];

		$scope.searchProperties = function(query) {
			return AssetService.searchAssetProperties(query);
		};

		$scope.getPrerequisite = function() {
			// $scope.getAllAssets();
			$scope.getAllAssetsForGridOption();
			AssetService.getAllPropertiesByLevelOne(1, undefined).then(
					function(response) {
						$scope.services = response;
					});

			AssetService.getAllUser().then(function(response) {
				console.log('UserList');
				console.log(response.data.body);
				$scope.userList = response.data.body;
			});

			$scope.getAddAllCompany();
			$scope.getAllDefault();
			$scope.getAllUnit();
			$scope.getAllMaintenanceTypes();

		};

		$scope.getAllAssetsForGridOption = function() {
			// this code for grid option
			/*
			 * console.log("$rootScope.LoggedInUserNew.pentaBaseCompany[0].pentaBaseComCode");
			 * console.log($rootScope.LoggedInUserNew.pentaBaseCompany[0].pentaBaseComCode);
			 */
			AssetService.getAllAssets(0, paginationOptions.pageSize, false)
					.then(function(response) {
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

						$scope.gridOptions.totalItems = response.totalElements;
						// paginationOptions.sort=sort[0].direction;
						$scope.gridOptions.data = response.content;

					});
			// end code of grid option
		}
		$scope.getAllAssets = function() {
			AssetService.getAllAssets(0, paginationOptions.pageSize, false)
					.then(
							function(response) {
								console.log("Get All Asset");
								console.log(response.content);
								$scope.assetnewList = response.content;
								console.log($scope.assetnewList);
								if ($scope.assetnewList !== null
										&& $scope.assetnewList !== undefined) {
									loadTable($scope.assetnewList);
								}

							});
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
										"mDataProp" : "pentaBaseAssetLevelOne"
									},
									{
										"mDataProp" : "pentaBaseAssetCode"
									},
									{
										"mDataProp" : "pentaBaseAssetCurrency.0.pentaBaseAssetCurCostPrice"
									},
									{
										"mDataProp" : "pentaBaseAssetUnit"
									},
									{
										"mDataProp" : "pentaBaseDescription.0.pentaBaseLongDesc"
									},

									{
										"mDataProp" : "pentaBaseDescription.0.pentaBaseAssetRemarks"
									},
									{
										"mDataProp" : null,

										"render" : function(data, type, full,
												meta) {
											var id = data.pentaBaseAssetID;
											return '<button onclick=editData('
													+ id
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

		$scope.getAddAllCompany = function() {

			CompanyService.getAllCompany().then(function(response) {
				$scope.companyLists = response;
				console.log($scope.companyLists);
			});

			CurrencyService.getAllCurrency().then(function(response) {
				$scope.currencyLists = response;
			});
		}
		$scope.prerequsiteLevelTwo = function() {
			ZoneService.findAllZones().then(function(response) {
				$scope.zoneList = response;
			});

		};
		$scope.getPrerequisiteLevel2 = function() {
			LanguageService.getAllLanguage().then(function(response) {
				$scope.languageLists = response;
				$scope.asset.pentaBaseLanguage = [];
			});
		};
		// get call for default currency and default language
		$scope.getAllDefault = function() {
			LanguageService
					.getDefaultLanguages()
					.then(
							function(response) {
								if (response !== undefined) {
									$scope.defaultLanguage = response;
									$scope.defaultLangugeList = [];
									$scope.defaultLangugeList
											.push($scope.defaultLanguage);
									if ($scope.defaultLangugeList.length > 0) {
										$scope.isDefaultLanguageAvailable = true;
										$scope.defaultDescription.pentaBaseLanguage = $scope.defaultLanguage;
									}
								}

							});

			CurrencyService.getDefaultPentaBaseCurrency().then(
					function(response) {
						if (response !== undefined) {
							console.log(response);
							$scope.defaultCurrency = response;
							$scope.defaultCurrencyList = [];
							$scope.defaultCurrencyList
									.push($scope.defaultCurrency);
							if ($scope.defaultCurrencyList.length > 0) {
								$scope.isDefaultCurrencyAvailable = true;
								// $scope.defaultCurrency.pentaBaseCurrency=$scope.defaultCurrency;
							}
						}
					});
		}
		// for edit assets property
		$scope.editAsset = function(obj) {
			console.log(obj);
			console.log($scope.asset.pentaBaseZone);

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

			obj.pentaBaseDescription = $scope.editLanguageList;
			/*
			 * var zone = JSON.parse($scope.asset.pentaBaseZone);
			 * obj.pentaBaseZone = zone;
			 */
			console.log(obj);
			if (obj.pentaBaseZone != undefined) {

				if (obj.pentaBasePod != null)
					obj.pentaBasePod.pentaBaseZone = obj.pentaBaseZone;

				ZoneService
						.findZoneByName(obj.pentaBaseZone.pentaBaseName)
						.then(
								function(response) {
									obj.pentaBaseZone = response;
									RegionService
											.findRegionByName(
													obj.pentaBaseZone.pentaBaseRegion.pentaBaseRegionName)
											.then(
													function(response) {
														console.log(response);
														obj.pentaBaseZone.pentaBaseRegion = response;
														AssetService
																.editAsset(obj)
																.then(
																		function(
																				response) {
																			$scope.message = response.data.responseMessage;
																			console
																					.log('response');
																			console
																					.log(response);
																			if (response.data.Status != true) {
																				$scope.error = true;
																				$timeout(
																						function() {
																							$scope.error = false;
																						},
																						3000);
																				console
																						.log("Error is "
																								+ response.message[0]);

																			} else {
																				toastr
																						.success(
																								$scope.message,
																								"Update Asset Successfully",
																								{
																									"timeOut" : "3500"
																								});
																				// this
																				// code
																				// for
																				// grid
																				// option
																				AssetService
																						.getAllAssets(
																								0,
																								10,
																								false)
																						.then(
																								function(
																										response) {
																									console
																											.log("get all for grid option");
																									console
																											.log(response);
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
																				$scope.isLanguageSame = false;
																				console
																						.log("update asset successfully");
																				obj = response;
																				angular
																						.element(
																								'#updateWizard')
																						.modal(
																								'hide');
																				$scope
																						.gotoStep(1);
																				$scope
																						.getAllAssets();
																				$scope.asset.pentaBaseDescription = [];
																				$scope.firstAdd = true;
																				$scope.updateAsset = {};
																			}
																		});
													});
								});

				obj.pentaBasePod.pentaBaseZone = obj.pentabaseZone;
			} else {
				obj.pentaBasePod = null;
				AssetService.editAsset(obj).then(
						function(response) {
							$scope.message = response.data.responseMessage;
							console.log('response');
							console.log(response);
							if (response.data.Status != true) {
								$scope.error = true;
								$timeout(function() {
									$scope.error = false;
								}, 3000);
								console.log("Error is " + response.message[0]);

							} else {
								toastr.success($scope.message,
										"Update Asset Successfully", {
											"timeOut" : "3500"
										});

								console.log("update asset successfully");
								obj = response;
								angular.element('#updateWizard').modal('hide');
								$scope.gotoStep(1);
								$scope.getAllAssets();
								$scope.asset.pentaBaseDescription = [];
								$scope.updateAsset = {};
							}
						});
			}

			console.log("final... ");
			console.log(obj);

		};

		$scope.addAsset = function() {

			// angular.element(document.getElementById('newSubmit'))[0].disabled
			// = true;
			var user = $cookieStore.get('user');
			$scope.asset.pentaBaseDescription.push($scope.defaultDescription);
			// $scope.asset.lastModifiedBy = user.pentaBaseFullName;
			if ($scope.asset.pentaBaseZone != null
					&& $scope.asset.pentaBaseZone != undefined) {
				$scope.asset.pentaBaseZone = angular
						.fromJson($scope.asset.pentaBaseZone);
				delete $scope.asset.pentaBaseZone.createdDate;
				delete $scope.asset.pentaBaseZone.lastModifiedDate;
			}
			if ($scope.asset.pentaBaseMaintenance != null
					&& $scope.asset.pentaBaseMaintenance != undefined) {

				$scope.asset.pentaBaseMaintenance.pentaBaseUser = angular
						.fromJson($scope.asset.pentaBaseMaintenance.pentaBaseUser);
			}
			if ($scope.asset.pentaBaseMaintenance != null
					&& $scope.asset.pentaBaseMaintenance != undefined) {

				$scope.asset.pentaBaseMaintenance.pentaBaseOtherUser = angular
						.fromJson($scope.asset.pentaBaseMaintenance.pentaBaseOtherUser);
			}
			if (typeof $scope.asset.pentaBaseCurrency == 'undefined') {
				$scope.asset.pentaBaseCurrency = [];
			}
			for (var i = 0; i < $scope.asset.pentaBaseCurrency.length; i++) {
				var myCurrencyObject = {
					"pentaBaseAssetCurSellPrice" : $scope.asset.pentaBaseCurrency[i].pentaBaseSellPrice,
					"pentaBaseAssetCurCostPrice" : $scope.asset.pentaBaseCurrency[i].pentaBaseCostPrice,
					"isActive" : true,
					"pentaBaseSecurityGrp" : "default",
					"pentaBaseCurrency" : $scope.asset.pentaBaseCurrency[i].pentaBaseCurrency
				};
				// ,
				// "pentaBaseCurrency" : $scope.asset.pentaBaseCurrency[i]
				console
						.log("Add Currencyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
				console.log(myCurrencyObject);
				$scope.asset.pentaBaseAssetCurrency[i] = myCurrencyObject;

			}
			$scope.defaultCurrencyNew.pentaBaseCurrency = $scope.defaultCurrencyList[0];
			console
					.log("Default Currencyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
			console.log($scope.defaultCurrencyNew);

			if ($scope.defaultCurrencyNew != null
					&& $scope.defaultCurrencyNew != undefined) {
				$scope.asset.pentaBaseAssetCurrency
						.push($scope.defaultCurrencyNew);
			}

			console.log($scope.asset);
			AssetService
					.addAsset(angular.copy($scope.asset))
					.then(
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
									 * swal({ title : $scope.message, timer :
									 * 3000, type : "success", })
									 */
									toastr.success($scope.message,
											"Add Asset Successfully", {
												"timeOut" : "3500"
											});
									// $scope.gridOptions.data.push(response.data.body);
									angular.element(document
											.getElementById('newSubmit'))[0].disabled = false;
									$scope.resetAsset();
									$scope.defaultDescription = {
										"pentaBaseLanguage" : {},
										"pentaBaseLongDesc" : "",
										"pentaBaseAssetRemarks" : ""
									};
									$scope.languageWarning = "";
									$scope.defaultCurrencyNew = {
										"pentaBaseAssetCurSellPrice" : 0,
										"pentaBaseAssetCurCostPrice" : 0,
										"pentaBaseCurrency" : {},
										"isActive" : true,
										"pentaBaseSecurityGrp" : "a"
									};
									angular.element('#NewAddWizard').modal(
											'hide');
									$scope.gridOptions.data
											.push(response.data.body);
									$scope.endCount = false;
									$scope.langEndCount = false;
									$scope.firstAdd = true;
									$scope.gotoAddAssetStep(1);
									// $scope.assetForm.$setPristine();
									// $scope.assetForm.$setValidity();
									$scope.assetForm.$setUntouched();
									// $scope.selectCategory = undefined;
									$scope.selectedCategory = {};
									$scope.asyncSelected = undefined;
									$scope.subLevels = [];
									$scope.asset.pentaBaseCurrency = [];
									$scope.asset.pentaBaseDescription = [];
									$scope.podName = "";
									$scope.getAllDefault();
									$scope.getAllAssets();

									$scope.isAreaClicked = false;
									$scope.isMaintClicked = false;
									$scope.isDescNextClicked = false;
									$scope.isPriceNextClicked = false;
									$scope.isLanguageSameAdd = false;
									$scope.isPropertiesNextClicked = false;
								}
							});
		};

		$scope.searchAsync = function(term) {
			if (!term) {
				return undefined;

			}
			return AssetService.searchAssetByCodeOrDescription(term);

		};

		$scope.onRegionChangeEditString = function(region) {
			var regionCode = JSON.parse(region);
			$scope.onRegionChange(regionCode.pentaBaseRegionCode);
		}

		$scope.onRegionChange = function(regionName) {

			// alert("regionName : " + regionName);
			console.log(regionName);
			$scope.regionZoneList = [];
			// var region= $scope.updateAsset.pentaBaseZone.pentaBaseRegion;
			$scope.podUpdateNotFound = "";
			$scope.zoneUpdateNotFound = "";
			// $('#zone').val(0);
			// $scope.updateAsset.pentaBaseZone = undefined;
			// $scope.updateAsset.pentaBasePod = undefined;
			AssetService
					.getZoneByRegionName(regionName)
					.then(
							function(response) {
								console.log("Region Name");
								console.log(response)
								if (response != undefined) {
									// alert();
									$scope.regionZoneList = response.data.body;
									// $scope.updateAsset.pentaBaseZone.pentaBaseRegion
									// = region;
									if ($scope.regionZoneList.length != 0) {
										$scope.zoneUpdateDisabled = false;
										$scope.podUpdateDisabled = false;

										// $scope.updateAsset.pentaBasePod.pentaBasePodName
										// = "";

									} else {
										// alert();
										$scope.zoneUpdateNotFound = "Zones not found for selected region. please select different region.";

									}
								} else {
									// alert("niche wala");
									$scope.podUpdateDisabled = true;
									$scope.zoneUpdateDisabled = true;
									$scope.updateAsset.pentaBaseZone.pentabaseZoneName = "";
									$scope.updateAsset.pentaBasePod.pentaBasePodName = "";
									$scope.podUpdateDisabled = true;
									$scope.zoneUpdateNotFound = "Zones not found for selected region. please select different region.";

								}

							});

		};

		// for add asset
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

		$scope.onZoneChange = function() {
			$scope.podUpdateDisabled = false;
			$scope.podNotFound = "";

		};
		// for zone
		$scope.onAddZoneChange = function() {
			$scope.regionPodList = [];
			$scope.podDisabled = false;
			$scope.podNotFound = "";
			// $scope.asset.pentaBasePod = undefined;
		};

		// for check pod value
		$scope.podName = "";
		$scope.checkPodValue = function(podName) {
			if (podName != undefined && podName != "" && podName != null) {
				$scope.podName = podName;
				var pod = {
					"pentaBaseZone" : {
						"pentaBaseZoneCode" : $scope.asset.pentaBaseZone.pentaBaseZoneCode
					},
					"pentaBasePodName" : podName,
					"lastModifiedBy" : "Ashish"
				};
				$scope.asset.pentaBasePod = pod;

				console.log("New Pod Object");
				console.log($scope.asset.pentaBasePod);
				console.log(pod);
			} else {
				console.log("Check Pod Value");
				console.log(podName);
			}
		};

		$scope.checkEditPodValue = function(podName) {
			if (podName == undefined) {
				console.log(podName);
			} else {
				$scope.podName = podName;
				var pod = {
					"pentaBaseZone" : {
						"pentaBaseZoneCode" : $scope.updateAsset.pentaBaseZone.pentaBaseZoneCode
					},
					"pentaBasePodName" : podName,
					"lastModifiedBy" : "Ashish"
				};
				$scope.updateAsset.pentaBasePod = pod;

			}
		};

		$scope.searchOptions = {
			'async' : true,
			'displayText' : 'Search Asset..',
			onSelect : function() {
				console.log('sel: ' + $scope.selectedAsset);
			}
		};

		/**
		 * Table operations
		 */
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
				displayName : '	Price'
			}, {
				name : 'pentaBaseDescription[0].pentaBaseAssetRemarks',
				displayName : 'Remarks'
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
													pageSize, false, undefined)
											.then(
													function(response) {

														paginationOptions.pageNumber = response.number;
														paginationOptions.pageSize = response.totalPages;
														/*
														 * console .log("page
														 * Object"); console
														 * .log(paginationOptions);
														 */
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
			$scope.state = {};
			var stateNew = JSON.stringify(state);
			AssetService
					.getTableStateByUserIDAndPageName(
							$rootScope.LoggedInUserNew.pentaBaseUserCode,
							'asset')
					.then(
							function(response) {
								console
										.log("response by getTableStateByUserIDAndPageName");
								console.log(response);
								if (response.data.body) {
									$scope.state = {
										"tableStateId" : response.data.body.tableStateId,
										"pageName" : "asset",
										"pageState" : stateNew,
										"pentaBaseUser" : {
											"pentaBaseUserCode" : $rootScope.LoggedInUserNew.pentaBaseUserCode
										}
									}

									AssetService.saveGridOptionState(
											$scope.state).then(
											function(response) {
												console.log("response");
												console.log(response);
											});
								} else {
									$scope.state = {};
									AssetService.saveGridOptionState(
											$scope.state).then(
											function(response) {
												console.log("response");
												console.log(response);
											});
								}

							});

			/* localStorageService.set('gridState', state); */
		}

		function restoreState() {
			$timeout(function() {
				// var state = localStorageService.get('gridState');

				AssetService
						.getTableStateByUserIDAndPageName(
								$rootScope.LoggedInUserNew.pentaBaseUserCode,
								'asset')
						.then(
								function(response) {
									console
											.log("response by getTableStateByUserIDAndPageName");
									console.log(response);
									var restoreValue = angular
											.fromJson(response.data.body.pageState);
									$scope.gridApi.saveState.restore($scope,
											restoreValue);
								});

			});
		}
		$scope.gridOptions.multiSelect = false;
		$scope.gridOptions.modifierKeysToMultiSelect = false;
		$scope.gridOptions.noUnselect = true;
		$scope.search = function(query, name) {
			if (typeof query == 'undefined') {
				query = '';
			}
			return AssetService.searchAssetProperties(
					$scope.selectedCategory.pentaBaseLookupLevelID, undefined,
					name, query).then(function(response) {
				console.log(response);
				return response;
			});
		};

		$scope.onTableFilterChange = function() {
			console.log('service select');
			AssetService.getAllAssets(0, 10, false, $scope.companyFilter,
					$scope.currencyFilter).then(
					function(response) {
						console.log(response);
						paginationOptions.pageNumber = response.number;
						paginationOptions.pageSize = response.totalPages;
						$scope.gridOptions.data = response.content;
						if (paginationOptions.pageNumber > 1) {
							$scope.isPreviousButtonVisible = false;
						} else {
							$scope.isPreviousButtonVisible = true;
						}
						if (paginationOptions.pageSize > 1) {
							$scope.isNextButtonVisible = false;
						} else {
							$scope.isNextButtonVisible = true;
						}

						$scope.gridOptions.totalItems = response.totalElements;
						// paginationOptions.sort=sort[0].direction;
						$scope.assetnewList = response.content;
						$scope.gridOptions.paginationCurrentPage = 1;
						if ($scope.assetnewList !== null
								&& $scope.assetnewList !== undefined) {
							loadTable($scope.assetnewList);
						}
					});
		};
		/**
		 * Clear filter
		 */
		$scope.clearFilter = function() {
			$scope.companyFilter = undefined;
			$scope.currencyFilter = undefined;
			/*
			 * AssetService.getAllAssets(0, 100, false).then( function(response) {
			 * $scope.assetnewList = response.content; if ($scope.assetnewList
			 * !== null && $scope.assetnewList !== undefined) {
			 * loadTable($scope.assetnewList); } });
			 */
			// this code for grid option
			AssetService.getAllAssets(0, 10, false).then(function(response) {
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

				$scope.gridOptions.totalItems = response.totalElements;
				// paginationOptions.sort=sort[0].direction;
				$scope.gridOptions.data = response.content;

			});
			// end code of grid option
		};

		$scope.searchUpdateAsset = function(query, name) {
			if (typeof query == 'undefined') {
				query = '';
			}
			return AssetService.searchAssetProperties(undefined,
					$scope.updateAssetServiceLevel, name, query).then(
					function(response) {
						console.log(response);
						return response;
					});
		};

		$scope.onServiceTypeSelect = function() {

			AssetService.getAllPropertiesByLevelOne(1,
					$scope.asset.isFreeService).then(function(response) {
				$scope.assetCategories = response;

			});
		};

		/**
		 * Maintenance
		 */
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
		$scope.onMaintenanceCheckClick = function() {
			if ($scope.asset.maintenanceRequired) {
				$scope.asset.pentaBaseMaintenance = {};
			} else {
				delete $scope.asset.pentaBaseMaintenance;
			}
		};
		/**
		 * Update asset
		 */
		// var vm = this;
		// Model
		$scope.currentStep = 1;
		$scope.steps = [ {
			step : 1,
			name : "Properties",
			template : "app1/asset/createAsset.html"
		}, {
			step : 2,
			name : "Area",
			template : "app1/asset/assetArea.html"
		}, {
			step : 3,
			name : "Detail",
			template : "app1/asset/assetDescription.html"
		}, {
			step : 4,
			name : "Price",
			template : "app1/asset/assignPrice.html"
		}, {
			step : 5,
			name : "Maintenance",
			template : "app1/asset/maintenance.html"
		}, ];
		$scope.gotoStep = function(newStep) {
			alert("zone : " + $scope.updateAsset.pentaBaseZone.pentaBaseName);
			$scope.currentStep = newStep;
		}

		$scope.getStepTemplate = function() {
			for (var i = 0; i < $scope.steps.length; i++) {
				if ($scope.currentStep == $scope.steps[i].step) {
					return $scope.steps[i].template;
				}
			}
		}
		// end update

		// add new wizard property for add asset
		$scope.currentAddAssetStep = 1;
		$scope.assetAddsteps = [ {
			step : 1,
			name : "Properties",
			template : "app1/asset/add-asset-properties.html"
		}, {
			step : 2,
			name : "Area",
			template : "app1/asset/asset-area.html"
		}, {
			step : 3,
			name : "Detail",
			template : "app1/asset/asset-description.html"
		}, {
			step : 4,
			name : "Price",
			template : "app1/asset/asset-price.html"
		}, {
			step : 5,
			name : "Maintenance",
			template : "app1/asset/asset-maintenance.html"
		}, ];
		// Functions
		$scope.gotoStep = function(newStep) {
			if ($scope.asset.pentaBaseDescription.length === 0) {
				$scope.addNewLanguage();
			}

			$scope.currentStep = newStep;
		}

		$scope.getStepTemplate = function() {
			for (var i = 0; i < $scope.steps.length; i++) {
				if ($scope.currentStep == $scope.steps[i].step) {
					return $scope.steps[i].template;
				}
			}
		}

		// Functions
		$scope.gotoAddAssetStep = function(newStep) {
			$scope.currentAddAssetStep = newStep;
		}

		$scope.getAddAssetStepTemplate = function() {
			for (var j = 0; j < $scope.assetAddsteps.length; j++) {
				if ($scope.currentAddAssetStep == $scope.assetAddsteps[j].step) {
					return $scope.assetAddsteps[j].template;
				}
			}
		}
		// end add asset wizard

		$scope.user = {};

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

		// Add language in edit asset form
		$scope.langEndCount = false;
		$scope.addNewLanguage = function() {
			$scope.langLengthCount = false;
			$scope.langEndCount = false;
			var newItemNo = $scope.asset.pentaBaseDescription.length + 1;
			$scope.asset.pentaBaseDescription.push({
				"pentaBaseLanguage" : {}
			});
			if ($scope.asset.pentaBaseDescription.length == 1) {
				$scope.langLengthCount = true;
			}
			if ($scope.languageLists !== undefined) {
				if ($scope.asset.pentaBaseDescription.length == $scope.languageLists.length) {
					$scope.langEndCount = true;
				}
			}

			console.log($scope.asset.pentaBaseDescription);

		};

		$scope.removeLanguage = function() {
			$scope.langLengthCount = false;
			var lastItem = $scope.asset.pentaBaseDescription.length - 1;
			$scope.asset.pentaBaseDescription.splice(lastItem);

			if ($scope.asset.pentaBaseDescription.length == 1) {
				$scope.langLengthCount = true;
				$scope.langEndCount = false;
			}
		};

		$scope.onLanguageChange = function(myLanguage) {

			var count = 1;
			$scope.languageWarning = "";
			console.log("Asset language data");
			for (var i = 0; i < $scope.asset.pentaBaseDescription.length; i++) {

				var lId = $scope.asset.pentaBaseDescription[i].pentaBaseDescription.pentaBaseLanguageID;

				for (var j = i + 1; j < $scope.asset.pentaBaseDescription.length; j++) {
					if (lId == $scope.asset.pentaBaseDescription[j].pentaBaseDescription.pentaBaseLanguageID)
						count++;
				}

				if (count > 1) {
					var id = myLanguage.pentaBaseLanguageID;
					$('#' + id).prop("value", "?");

					$scope.languageWarning = "Can not select same language twice .. please select different one..";
				}

			}
		};

		// edit by ashish for update asset
		$scope.addNewUpdateChoice = function() {
			var newItemNo = $scope.updateAsset.pentaBaseDescription.length + 1;
			$scope.updateAsset.pentaBaseDescription.push({
				"pentaBaseLanguage" : {}
			});
		};

		$scope.removeUpdateChoice = function() {
			var lastItem = $scope.updateAsset.pentaBaseDescription.length - 1;
			$scope.updateAsset.pentaBaseDescription.splice(lastItem);
		};

		// get all for maintenanceResultCodeList
		LookupService.getAllMaintenanceResultCode().then(function(response) {
			$scope.maintenanceResultCodeList = response;
			console.log("maintenanceResultCodeList");
			console.log($scope.maintenanceResultCodeList);
		});

		// get all for Asset Table Types
		LookupService.getAllAssetTableTypes().then(function(response) {
			$scope.assetTypeList = response;
			console.log("AssetTypeList");
			console.log($scope.AssetTypeList);
		});

		// get all for Asset Usages
		LookupService.getAllAssetUsages().then(function(response) {
			$scope.AssetUsageList = response;
			console.log("AssetUsagesList");
			console.log($scope.AssetUsageList);
		});
		// get all for Asset Maintenance status
		LookupService.getAllMaintenanceStatuses().then(function(response) {
			$scope.maintenanceStatusesList = response;
			console.log("AssetUsagesList");
			console.log($scope.MaintenanceStatusesList);
		});

		/**
		 * Currency
		 */
		$scope.endCount = false;
		$scope.addNewCurrency = function() {
			$scope.lengthCount = false;
			$scope.endCount = false;
			var newItemNo = $scope.asset.pentaBaseCurrency.length + 1;
			$scope.asset.pentaBaseCurrency.push({
				"pentaBaseCurrency" : {}
			});
			if ($scope.asset.pentaBaseCurrency.length == 1) {
				$scope.lengthCount = true;
			}
			if ($scope.asset.pentaBaseCurrency.length == $scope.currenyLists) {

				$scope.endCount = true;
			}

			// alert("Length : " +$scope.asset.pentaBaseCurrency);
			// $scope.newList = [];

			console.log($scope.asset.pentaBaseCurrency);
			// alert("count : " +$scope.asset.pentaBaseCurrency.length);
			/*
			 * for (var int = 0; int < $scope.asset.pentaBaseCurrency.length;
			 * int++) { console.log("for disable"); alert("first time");
			 * console.log($scope.currencyLists);
			 * console.log($scope.asset.pentaBaseCurrency); $scope.newList = [];
			 * for (var inte = 0; inte < $scope.currencyLists.length; inte++) {
			 * 
			 * if($scope.currencyLists[inte].pentaBaseCurCode ==
			 * $scope.asset.pentaBaseCurrency[int].pentaBaseCurrency.pentaBaseCurCode){
			 * //$scope.newList.push($scope.currencyLists[inte]); } }
			 * 
			 * 
			 * console.log($scope.asset.pentaBaseCurrency[int]); var id1 =
			 * $scope.asset.pentaBaseCurrency[int].pentaBaseCurrency.pentaBaseCurCode;
			 * var id2 =
			 * $scope.asset.pentaBaseCurrency[int].pentaBaseCurrency.pentaBaseCurName;
			 * var id3 =
			 * $scope.asset.pentaBaseCurrency[int].pentaBaseCurrency.pentaBaseCreatedDate;
			 * 
			 * $('#'+id1).prop("disabled", "disabled");
			 * $('#'+id2).prop("disabled", "disabled");
			 * $('#'+id3).prop("disabled", "disabled"); }
			 */

		};

		// for add asset
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

		$scope.removeCurrency = function() {
			$scope.lengthCount = false;
			var lastItem = $scope.asset.pentaBaseCurrency.length - 1;
			$scope.asset.pentaBaseCurrency.splice(lastItem);

			if ($scope.asset.pentaBaseCurrency.length == 1) {
				$scope.lengthCount = true;
			}
			if ($scope.asset.pentaBaseCurrency.length == $scope.currencyListCompany.length) {
				$scope.endCount = false;
			}

		};
		// for add asset
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
		// edit by ashish for update asset
		$scope.addNewUpdateChoice = function() {
			var newItemNo = $scope.updateAsset.pentaBaseCurrency.length + 1;
			$scope.updateAsset.pentaBaseCurrency.push({
				"pentaBaseCurrency" : {}
			});
		};

		$scope.removeUpdateChoice = function() {
			$scope.currencyWarning = "";
			var lastItem = $scope.updateAsset.pentaBaseCurrency.length - 1;
			$scope.updateAsset.pentaBaseCurrency.splice(lastItem);
		};

		$scope.onCurrencyChange = function(myCurrency) {

			// alert("sefsdf" + $scope.currency);
			var count = 1;
			$scope.currencyWarning = "";
			// alert($scope.asset.pentaBaseCurrency.length);
			console.log("Asset currency data");
			console.log($scope.asset.pentaBaseCurrency);
			// alert($(this).prop);
			for (var curr = 0; curr < $scope.asset.pentaBaseCurrency.length; curr++) {
				// alert(myCurrency.pentaBaseCurCode + " " +
				// $scope.asset.pentaBaseCurrency[curr].pentaBaseCurrency.pentaBaseCurCode);

				var cId = $scope.asset.pentaBaseCurrency[curr].pentaBaseCurrency.pentaBaseCurCode;

				for (var currSecond = curr + 1; currSecond < $scope.asset.pentaBaseCurrency.length; currSecond++) {
					if (cId == $scope.asset.pentaBaseCurrency[currSecond].pentaBaseCurrency.pentaBaseCurCode)
						count++;
				}

				if (count > 1) {
					// alert("asdf");
					var id = myCurrency.pentaBaseCurCode;
					// alert("id: " + id);
					$('#' + id).prop("value", "?");

					// var generateHere =
					// document.getElementById(''+myCurrency+'');
					// alert(generateHere);
					// generateHere.innerHTML = '<small style="color: red;">Can
					// not select same currency twice .. please select different
					// one..</small>';
					$scope.currencyWarning = "Can not select same currency twice .. please select different one..";
				}

			}
		};

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

	}

	AssetController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location', '$cookieStore', '$interval', 'AssetService',
			'LanguageService', 'ZoneService', 'PodService', 'CompanyService',
			'LookupService', 'CurrencyService', 'RegionService', '$timeout',
			'uiGridConstants', 'localStorageService' ];

	angular.module(
			'pentaWorkflow.asset',
			[ 'ngTouch', 'ngTagsInput', 'ngAnimate', 'AxelSoft',
					'autocomplete', 'ui.bootstrap',
					'ui.bootstrap.datetimepicker', 'ui.grid',
					'ui.grid.pagination', 'ui.grid.selection',
					'ui.grid.autoResize', 'ui.grid.selection',
					'ui.grid.cellNav', 'ui.grid.resizeColumns',
					'ui.grid.moveColumns', 'ui.grid.pinning',
					'ui.grid.grouping', 'ui.grid.saveState',
					'LocalStorageModule' ]).controller('AssetController',
			AssetController).config(
			function($httpProvider, localStorageServiceProvider) {
				localStorageServiceProvider.setPrefix('pentaWorkflow.asset')
						.setStorageType('localStorage').setNotify(true, true); // Not
																				// sure
																				// what
																				// this
																				// setting
																				// does
			})

})(window.angular);
