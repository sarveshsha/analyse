'use strict'

angular.module('taira-multiselect', ['ng'])
	.directive('tairaMultiselect', [ '$sce', '$templateCache', function($sce, $templateCache) {
		return {
      restrict: 'AE',
      scope: {
        model: '=',
        options: '=',
        settings: '='
      },
      templateUrl: 'teh-template',
      link: function ($scope, $element, $attrs) {
        //Default values
        $scope._settings = {
          display: {
            fields: ['id'],                       //fields that will be showed for each option
            prepend: '',                          //html that will be prepended to each option in addition to fields
            append: '',                           //html that will be appended to each option in addition to fields
          },
          btn: {
            text: 'Multiselect',                  //text that will be shown in the button
            class: 'btn-primary',                 //btn class
            count: false                          //show total number of selected items in the button
          },
          list: {
            opened: false,                        //show or not the list opened
            class: '',                             //class to be applied to the list
            selectedClass: ''                     //class to be applied to a selected item
          },
          select: {
            fields: [],                           //fields that will be pushed when an option is selected. [] = all
          },
          extra: {
            selectAll: true,                      //show or not a select all button
            unselectAll: true,                    //show or not an unselect all button
            showCheckbox: true,                    //show checkbox next to each option
            containerClass: ''                    //container class
          }
        };

        _.extend($scope._settings.display, $scope.settings.display);
        _.extend($scope._settings.btn, $scope.settings.btn);
        _.extend($scope._settings.list, $scope.settings.list);
        _.extend($scope._settings.select, $scope.settings.select);
        _.extend($scope._settings.extra, $scope.settings.extra);

        $scope.getDisplayText = function(option) {
          var text = '';
          if($scope._settings.display.prepend) {
            text += $scope._settings.display.prepend;
          }

          angular.forEach($scope._settings.display.fields, function(field) {
            if(typeof field === 'string') {
              text += getDeepProperty(option, field) + ' ';
            } else {
              if(field.raw) {
                text += field.value;
              }else if(field.transform) {
                var value = getDeepProperty(option, field.value) + ' ';
                text += field.transform(value);
              }else {
                text += getDeepProperty(option, field.value) + ' ';
              }
            }
          });

          if($scope._settings.display.append) {
            text += $scope._settings.display.append;
          }

          return $sce.trustAsHtml(text.trim());
        };

        function getDeepProperty(obj, path) {
          obj = angular.copy(obj);
          path = path.split('.');
          for (var i = 0; i < path.length; i++) {
            if(!obj[path[i]]) return '';

            obj = obj[path[i]];
          }
          return obj;
        }

        function getSelectPropertyObj(item) {
          var obj = {};

          if(!$scope._settings.select.fields.length) {
            return angular.copy(item);
          }

          angular.forEach($scope._settings.select.fields, function(property) {
            obj[property] = item[property];
          });

          return obj;
        };

        $scope.checkboxClick = function($event, item) {
          $scope.selectItem(item);
          $event.stopImmediatePropagation();
        };

        $scope.selectItem = function(item) {
          item = getSelectPropertyObj(item);
          if(_.findIndex($scope.model, item) !== -1) {
            $scope.model.splice(_.findIndex($scope.model, item), 1);
          }else {
            $scope.model.push(item);
          }
        };

        $scope.isChecked = function(item) {
          item = getSelectPropertyObj(item);
          return _.findIndex($scope.model, item) !== -1;
        };

        $scope.selectAll = function() {
          $scope.unselectAll();
          angular.forEach($scope.options, function(option) {
            $scope.selectItem(option);
          });
        };

        $scope.unselectAll = function() {
          $scope.model = [];
        };
      }
    }
	}]).run(['$templateCache', function($templateCache) {
    var template =
    	'<div class="btn-group {{_settings.extra.containerClass}}" uib-dropdown auto-close="disabled" is-open="_settings.list.opened">' +
			  '<button type="button" class="btn {{_settings.btn.class}}" uib-dropdown-toggle>' +
			    '{{_settings.btn.count ? (model.length ?  model.length : "none") + " selected" : _settings.btn.text}} <span class="caret"></span>' +
			  '</button>' +
			  '<ul class="dropdown-menu {{_settings.list.class}}" uib-dropdown-menu role="menu" aria-labelledby="single-button">' +
			    '<li ng-if="_settings.extra.selectAll">' +
			      '<a href="" ng-click="selectAll()">Select all</a>' +
			    '</li>' +
			    '<li ng-if="_settings.extra.unselectAll">' +
			      '<a href="" ng-click="unselectAll()">Unselect all</a>' +
			    '</li>' +
			    '<li ng-if="_settings.extra.unselectAll || _settings.extra.selectAll" class="divider"></li>' +
			    '<li ng-repeat="option in options" role="menuitem" ng-class="{\'{{_settings.list.selectedClass}}\': isChecked(option)}">' +
			      '<a href="" ng-click="selectItem(option)">' +
			        '<input type="checkbox" ng-if="_settings.extra.showCheckbox" ng-click="checkboxClick($event, option)" ng-checked="isChecked(option)">' +
			        '&nbsp;' +
			        '<span ng-bind-html="getDisplayText(option)"></span>' +
			      '</a>' +
			    '</li>' +
			  '</ul>' +
			'</div>';

		$templateCache.put('teh-template', template);
  }]);