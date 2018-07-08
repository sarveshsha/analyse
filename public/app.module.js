﻿(function(angular) {

	'use strict';

	var app = angular.module(
			'tangelo',
			[ 'ngRoute','ngCookies','tangelo.lifecycle','tangelo.company','taira-multiselect','btorfs.multiselect','nvd3'] )
			.constant('apiVersion', {
				version : 'v1.0'
			}).constant('apiDomain', {
				domain : 'http://localhost:8080'
			}).config(Configure).directive('a3pie', function ($log, d3Helpers, svgHelpers, pieHelpers, pieDefaults) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			options: '=options',
			data: '=data'
		},
		template: '<div class="angular-a3pie"></div>',
		controller: function($scope) {
			$log.info('[Angular - D3] Pie scope controller', $scope);
		},
		link: function(scope, element, attrs) {
			if(!jQuery) {
				$log.error('JQuery is not loaded');
				return;
			}
			scope.container = element;
			scope.type = 'pie';
			scope.classPrefix = 'a3pie';
			var options = pieDefaults.setDefaults(scope.options, attrs.id);

			d3Helpers.setSize(element, options, attrs);

			svgHelpers.addSVG(scope, element.get(0), options);
			var w = options.width + options.margin.left + options.margin.right;
			w -= options.legend.show? options.legend.width:0;
			scope.svg.attr('transform', 'translate(' + w / 2 + ',' + options.height / 2 + ')');

			element.width(options.containerWidth);

			pieHelpers.addArc(scope, options);
			//svgHelpers.updateStyles(scope, options);

			//pieHelpers.updateData(scope, options);

			scope.$watch('data', function() {
				pieHelpers.updateData(scope, options);
			});
		}
	};
}).factory('pieHelpers', function ($log, d3Helpers, svgHelpers) {

	function _tweenPie($this, scope, options, b) {
		b.innerRadius = 100;
		var start = null;
		switch(options.pieAnimation) {
			case 'inverse':
				start = {startAngle: 2*Math.PI, endAngle: 2*Math.PI};
				break;
			case 'crossfade':
				start = {startAngle: 2*Math.PI, endAngle: 0};
				break;
			case 'crossfade-inverse':
				start = {startAngle: 0, endAngle: 2*Math.PI};
				break;
			default:
				if(!d3Helpers.isDefined(options.pieAnimation) || options.pieAnimation === '') {
					$log.warn('[Angular - D3] The option "pieAnimation" is undefined or it has a invalid value. Setting to "normal"');
					options.pieAnimation = 'normal';
				}
				start = {startAngle: 0, endAngle: 0};
				break;
		}
		if($this._current) {
			start = $this._current;
		}
		var i = d3.interpolate(start, b);
		$this._current = i(0);
		return function(t) {
			return scope.arc(i(t));
		};
	}

	// Find the element in data0 that joins the highest preceding element in data1.
	function findPreceding(i, data0, data1, key) {
		var m = data0.length;
		while (--i >= 0) {
			var k = key(data1[i]);
			for (var j = 0; j < m; ++j) {
				if (key(data0[j]) === k) {
					return data0[j];
				}
			}
		}
	}

	// Find the element in data0 that joins the lowest following element in data1.
	function findFollowing(i, data0, data1, key) {
		var n = data1.length, m = data0.length;
		while (++i < n) {
			var k = key(data1[i]);
			for (var j = 0; j < m; ++j) {
				if (key(data0[j]) === k) {
					return data0[j];
				}
			}
		}
	}

	function findNeighborArc(i, data0, data1, key) {
    var d;
		var obj;
    if(d = findPreceding(i, data0, data1, key)) {
      obj = angular.copy(d);
      obj.startAngle = d.endAngle;
      return obj;
    } else if(d = findFollowing(i, data0, data1, key)) {
      obj = angular.copy(d);
      obj.endAngle = d.startAngle;
      return obj;
    }
    return null;
  }

	var pathAnim = function(path, dir, options) {
		switch(dir) {
			case 0:
				path
					.style('stroke', null)
					.transition('pie-animation')
					.duration(500)
					.ease(d3.easeBounce)
					.style('stroke-opacity', 0)
					.style('stroke-width', 0)
					.attr('d', d3.arc()
						.outerRadius(options.radius)
					);
				break;
			case 1:
				path
					.style('stroke', function() {
						return d3.color(d3.select(this).attr('fill')).darker();
					})
					.style('stroke-opacity', 0)
					.style('stroke-width', 0)
					.transition('pie-animation')
					.style('stroke-opacity', 1)
					.style('stroke-width', 1)
					.attr('d', d3.arc()
						.outerRadius(options.radius * 1.06)
					);
				break;
		}
	};

	return {
		addArc: function(scope, options) {
			var w = options.width - options.margin.left - options.margin.right;
			if(options.legend.show) {
				w -= options.legend.width;
			}
			var h = options.height - options.margin.top - options.margin.bottom;
			options.radius = Math.min(w, h) / 2;
			scope.arc = d3.arc()
		    .outerRadius(options.radius);

			scope.pie = d3.pie()
				.value(function(d) { return d[options.y.key]; })
		    .sort(null);

			// ===========================================================================================
	    // g elements to keep elements within svg modular
			scope.svg.append('g').attr('class', scope.classPrefix + '-slices');
			scope.svg.append('g').attr('class', scope.classPrefix + '-labelName');
	    scope.svg.append('g').attr('class', scope.classPrefix + '-lines');
	    // ===========================================================================================
		},

		updateData: function(scope, options) {
			$log.debug('Update data');
			// var percentFormat = d3.format(',.2%');
			var colors = d3Helpers.setColors(options.pie.colors);
			var data = d3Helpers.getDataFromScope(scope, options);
			if(d3Helpers.isUndefinedOrEmpty(data)) {
				$log.warn('[Angular - D3] No data for pie');
				return;
			}

			// Key function for get data.
			var key = function(d) {
				if(angular.isUndefined(d)) {
					return d;
				}
				if(angular.isUndefined(d.data)) {
					return d.data;
				}
				return d.data[options.idKey];
			};

			var arcTween = function() {
				return _tweenPie(this, scope, options, d3.select(this).data()[0]);
			};

			//scope.svg.selectAll('.' + scope.classPrefix + '-arc').remove();

			// ===========================================================================================
			// add and colour the pie slices
			scope.slices = scope.svg.selectAll('.' + scope.classPrefix + '-slices');
			var path = scope.slices.selectAll('path');
			var dataSlices = path.data();
			var pieData = scope.pie(data);

			var arcs = path.data(pieData, key);

			arcs
				.on('mouseout', null)
				.on('mouseover', null)
				.transition()
				.duration(options.animations.time)
				.ease(options.animations.ease)
				.on('end', function() {
					d3.select(this).on('mouseover', function() {
						pathAnim(d3.select(this), 1, options);
					})
					.on('mouseout', function() {
						pathAnim(d3.select(this), 0, options);
					});
				})
				.attr('fill', function(d) {
					if(angular.isDefined(options.colorKey) && angular.isDefined(d.data[options.colorKey])) {
						return d.data[options.colorKey];
					}
					return colors(d.data[options.x.key]);
				})
				.attrTween('d', arcTween);

			arcs.enter()
				.append('path')
				.each(function(d, i) {
					var narc = findNeighborArc(i, dataSlices, pieData, key);
					if(narc) {
						this._current = narc;
						this._previous = narc;
					} else {
						this._current = d;
					}
				})
				.attr('fill', function(d) {
					if(angular.isDefined(options.colorKey) && angular.isDefined(d.data[options.colorKey])) {
						return d.data[options.colorKey];
					}
					return colors(d.data[options.x.key]);
				})
				.transition('pie-enter')
				.duration(options.animations.time)
				.ease(options.animations.ease)
				.on('end', function() {
					d3.select(this).on('mouseover', function() {
						pathAnim(d3.select(this), 1, options);
					})
					.on('mouseout', function() {
						pathAnim(d3.select(this), 0, options);
					});
				})
				.attrTween('d', arcTween);

			arcs
				.exit()
				.each(function() {
					d3.select(this)
					.on('mouseout', null)
					.on('mouseover', null);
				})
				.transition()
				.duration(options.animations.time)
				.ease(options.animations.ease)
				.attrTween('d', function(d, idx) {
					var previous = this._previous? this._previous:findNeighborArc(idx, pieData, dataSlices, key);
					var i = d3.interpolateObject(d, previous);
					return function(t) {
						return scope.arc(i(t));
					};
				})
				.remove();

			// ===========================================================================================

			this.setStyles(scope, options);

			if(options.legend.show) {
				this.createLegend(scope, options, colors);
			}
		},

		createLegend: function(scope, options, colors) {
			var percentFormat = d3.format(',.2%');
			var data = d3Helpers.getDataFromScope(scope, options);

			var total = d3.sum(data, function(d) {
				return d[options.y.key];
			});

			// Key function for get data.
			var key = function(d) {
				if(angular.isUndefined(d)) {
					return d;
				}
				return d[options.idKey];
			};


			if(!scope.legend) {
				var left = options.radius*1.1;
				var top = -options.radius*0.9;
				scope.legend = scope.svg
					.append('g')
					.attr('class', 'legend')
					.attr('transform', 'translate(' + left  +', ' + top + ')');
			}

			var items = scope.legend
				.selectAll('.legend-item')
				.data(data, key);

			items
				.selectAll('text')
				.html(function() {
					var d = d3.select(this.parentNode).data()[0];
					return d[options.x.key] + ' (' + percentFormat(d[options.y.key]/total) + ')';
				})
				.each(function() {
					svgHelpers.wrap(this, options.legend.width - 20);
				});

			items
				.selectAll('rect')
				.attr('fill', function() {
					var d = d3.select(this.parentNode).data()[0];
					return colors(d[options.x.key]);
				});

			var item = items.enter()
				.append('g')
				.attr('class', 'legend-item')
				.attr('transform', function(d, i) {
					return 'translate(0, ' + (i*25) + ')';
				});

			item
				.append('rect')
				.attr('width', 18)
				.attr('height', 18)
				.attr('transform', 'translate(0, -13)')
				.attr('fill', function() {
					var d = d3.select(this.parentNode).data()[0];
					return colors(d[options.x.key]);
				});

			item
				.append('text')
				.attr('x', '25px')
				.attr('y', 0)
				.attr('dy', '0')
				.attr('dx', '25px')
				.html(function() {
					var d = d3.select(this.parentNode).data()[0];
					return d[options.x.key] + ' (' + percentFormat(d[options.y.key]/total) + ')';
				})
				.each(function() {
					svgHelpers.wrap(this, options.legend.width - 20);
				});

			items
				.exit()
				.remove();

			var currentY = 0;
			scope.legend
				.selectAll('.legend-item')
				.attr('transform', function(d, i) {
					var oldY = Math.max(currentY, 20*i);
					currentY += d3.select(this).select('text').node().getBoundingClientRect().height + 10;

					return 'translate(0, ' + oldY + ')';
				});
		},

		wrapLabels: function(scope, options) {
			scope.svg.selectAll('.' + scope.classPrefix + '-labelName text')
				.each(function() {
					var rect = this.getBoundingClientRect();
					if(rect.left < 0) {
						svgHelpers.wrap(this, rect.right);
					} else if(rect.right > options.width) {
						svgHelpers.wrap(this, options.width - rect.left);
					}
				});
		},

		setStyles: function(scope, options) {
			scope.svg.selectAll('.' + scope.classPrefix + '-labelName text')
				.style('fill', options.axis.color)
				.style('font-weight', options.axis.fontWeight);

			scope.svg
				.style('font-family', options.fontFamily)
				.style('font-size', options.fontSize);
		}
	};
}).directive('a3bar', function ($log, d3Helpers, svgHelpers, barHelpers, barDefaults) {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			options: '=options',
			data: '=data'
		},
		template: '<div class="angular-a3bar"></div>',
		controller: function($scope) {
			$log.info('[Angular - D3] Bar scope controller', $scope);
		},
		link: function(scope, element, attrs) {
			if(!jQuery) {
				$log.error('JQuery is not loaded');
				return;
			}
			scope.container = element;
			scope.type = 'bar';
			scope.classPrefix = 'a3bar';
			var isDefined = d3Helpers.isDefined,
				options = barDefaults.setDefaults(scope.options, attrs.id);

			d3Helpers.setSize(element, options, attrs);

			barHelpers.setXScale(scope, options);
			barHelpers.setYScale(scope, options);
			if(isDefined(options.zoom) && options.zoom) {
				svgHelpers.addZoomBehaviour(scope, barHelpers.zoomBehaviour);
			}
			svgHelpers.addSVG(scope, element.get(0), options);

			element.width(options.containerWidth);
			element.height(options.containerHeight);

			barHelpers.addAxis(scope, options);
			svgHelpers.updateStyles(scope, options);

			scope.$watch('data', function() {
				barHelpers.updateData(scope, options);
			});
		}
	};
}).factory('d3Helpers', function ($log) {
	function _obtainEffectiveChartId(d, chartId) {
		var id, i;
		if (!angular.isDefined(chartId)) {
			if (Object.keys(d).length === 1) {
				for (i in d) {
					if (d.hasOwnProperty(i)) {
						id = i;
					}
				}
			} else if (Object.keys(d).length === 0) {
				id = 'main';
			} else {
				$log.error('[AngularJS - D3] - You have more than 1 object on the DOM, you must provide the object ID');
			}
		} else {
			id = chartId;
		}

		return id;
	}

	function _getCommonDefaults() {
		return {
			idKey: 'id',
			width: 300,
			heigth: 250,
			zoom: true,
			margin: {
				left: 10,
				right: 10,
				top: 10,
				bottom: 10
			},
			legend: {
				show: true,
				width: 120
			},
			timeFormat: '%d-%m-%Y',
			fontFamily: 'Arial',
			fontSize: '0.75em',
			axis: {
				show: true,
				stroke: '#000',
				color: '#000',
				label: {
					color: '#000',
					fontWeight: 'bold'
				},
				fontWeight: 'normal'
			},
			showDefaultData: true,
			locale: null,
			animations: {
				time: 750,
				ease: d3.easeCubic
			}
		};
	}

	return {
		//Determine if a reference is {}
		isEmpty: function(value) {
			return Object.keys(value).length === 0;
		},

		//Determine if a reference is undefined or {}
		isUndefinedOrEmpty: function (value) {
			return (angular.isUndefined(value) || value === null) || Object.keys(value).length === 0;
		},

		// Determine if a reference is defined
		isDefined: function(value) {
			return angular.isDefined(value) && value !== null;
		},

		// Determine if a reference is a number
		isNumber: function(value) {
			return angular.isNumber(value);
		},

		// Determine if a reference is a string
		isString: function(value) {
			return angular.isString(value);
		},

		// Determine if a reference is an array
		isArray: function(value) {
			return angular.isArray(value);
		},

		// Determine if a reference is an object
		isObject: function(value) {
			return angular.isObject(value);
		},

		// Determine if a reference is a function.
		isFunction: function(value) {
			return angular.isFunction(value);
		},

		// Determine if two objects have the same properties
		equals: function(o1, o2) {
			return angular.equals(o1, o2);
		},

		safeApply: function($scope, fn) {
			var phase = $scope.$root.$$phase;
			if (phase === '$apply' || phase === '$digest') {
				$scope.$eval(fn);
			} else {
				$scope.$apply(fn);
			}
		},

		getCommonDefaults: _getCommonDefaults,

		setDefaults: function(newDefaults, userDefaults) {
			if (this.isDefined(userDefaults)) {
				newDefaults.idKey = this.isDefined(userDefaults.idKey) ?  userDefaults.idKey : newDefaults.idKey;
				newDefaults.colorKey = this.isDefined(userDefaults.colorKey) ?  userDefaults.colorKey : newDefaults.colorKey;
				newDefaults.width = this.isDefined(userDefaults.width) ?  userDefaults.width : newDefaults.width;
				newDefaults.heigth = this.isDefined(userDefaults.heigth) ?  userDefaults.heigth : newDefaults.heigth;
				newDefaults.zoom = this.isDefined(userDefaults.zoom) ?  userDefaults.zoom : newDefaults.zoom;
				newDefaults.timeFormat = this.isDefined(userDefaults.timeFormat) ?  userDefaults.timeFormat : newDefaults.timeFormat;
				newDefaults.fontFamily = this.isDefined(userDefaults.fontFamily) ?  userDefaults.fontFamily : newDefaults.fontFamily;
				newDefaults.fontSize = this.isDefined(userDefaults.fontSize) ?  userDefaults.fontSize : newDefaults.fontSize;
				newDefaults.showDefaultData = this.isDefined(userDefaults.showDefaultData) ?  userDefaults.showDefaultData : newDefaults.showDefaultData;
				newDefaults.locale = this.isDefined(userDefaults.locale) ?  userDefaults.locale : newDefaults.locale;

				if(this.isDefined(userDefaults.margin)) {
					angular.extend(newDefaults.margin, userDefaults.margin);
				}
				if(this.isDefined(userDefaults.legend)) {
					angular.extend(newDefaults.legend, userDefaults.legend);
				}

				if(this.isDefined(userDefaults.axis)) {
					angular.extend(newDefaults.axis, userDefaults.axis);
				}

				if(this.isDefined(userDefaults.animations)) {
					angular.extend(newDefaults.animations, userDefaults.animations);
				}
			}
		},

		setSize: function(element, options, attrs) {
			// Set width and height if they are defined
			var w = this.isDefined(attrs.width)? attrs.width:options.width,
				h = this.isDefined(attrs.height)? attrs.height:options.height;

			if (isNaN(w)) {
				element.css('width', w);
			} else {
				element.css('width', w + 'px');
			}

			if (isNaN(h)) {
				element.css('height', h);
			} else {
				element.css('height', h + 'px');
			}

			options.width = element.width();
			options.height = element.height();
		},

		setColors: function(userColors, defaultColors) {
			var colors = defaultColors || d3.scaleOrdinal(d3.schemeCategory20);
			if(this.isDefined(userColors)) {
				colors = this.isArray(userColors)? d3.scaleOrdinal().range(userColors):colors;
				colors = this.isString(userColors)? d3.scaleOrdinal().range([userColors]):colors;
				colors = this.isFunction(userColors)? userColors:colors;
			}
			return colors;
		},

		getDataFromScope: function(scope, options) {
			var data = null;
			if(this.isUndefinedOrEmpty(scope.data) && options.showDefaultData &&
				!this.isUndefinedOrEmpty(options.defaultData)) {
				data = options.defaultData;
			} else if(this.isString(scope.data)) {

			} else {
				data = scope.data;
			}
			return data;
		},

		getRandomString: function(length) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
			var string_length = length || 8;
			var randomstring = '';
			for (var i = 0; i < string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum, rnum+1);
			}
			return randomstring;
    },

    getRandomColor: function() {
			// random values between 0 and 255, these are the 3 colour values
			var r = Math.floor(Math.random()*256);
			var g = Math.floor(Math.random()*256);
			var b = Math.floor(Math.random()*256);

			// puts the hex value inside this element (e is a jquery object)
			return d3.rgb(r,g,b);
		},

		obtainEffectiveChartId: _obtainEffectiveChartId
	};
}).factory('svgHelpers', function ($log, d3Helpers) {
	return {
		/**
		 * Add SVG element to DOM.
		 */
		addSVG: function(scope, container, options) {
			var w = options.width + options.margin.left + options.margin.right;
			w += options.legend.show? options.legend.width:0;
			var h = options.height + options.margin.top + options.margin.bottom + (options.axis.show? 30:0);

			options.containerWidth = w;
			options.containerHeight = h;
			var svg = d3.select(container)
				.append('svg')
				.attr('width', w)
				.attr('height', h)
				.append('g')
				.attr('transform', 'translate(' + options.margin.left + ',' + options.margin.top + ')')
				.style('cursor', 'pointer');

			// Mask for zoom and pan behavior.
			scope.idClip = 'clip-' + d3Helpers.getRandomString();
			svg.append('clipPath')
				.attr('id', scope.idClip)
				.append('rect')
				.attr('width', options.width)
				.attr('height', options.height);
			scope.svg = svg;
			return svg;
		},

		/**
		 * Add Zoom Behaviour to chart.
		 */
		addZoomBehaviour: function(scope, behavior) {
			if(!d3Helpers.isDefined(scope.x)) {
				$log.warn('[Angular - D3] x scale is not defined, unable set zoom behavior');
				return;
			}
			if(!d3Helpers.isDefined(scope.y)) {
				$log.warn('[Angular - D3] y scale is not defined, unable set zoom behavior');
				return;
			}
			scope.zoom = d3.zoom()
				// .x(scope.x)
				// .y(scope.y)
				.scaleExtent([0.5, 100])
				.on('zoom', behavior);
		},


		/**
		 * Add X Axis to chart.
		 */
		addXAxis: function(scope, options) {
			scope.xl = scope.svg.append('g')
				.attr('class', 'x axis');

			scope.xlLeftOffset = 0;
			if(options.axis.show && options.y.position === 'left') {
				scope.xlLeftOffset = 30;
				if(options.y.orient === 'axisRight') {
					scope.xlLeftOffset += 10;
				}
			}

			if(scope.type === 'oneAxisBar') {
				scope.xlLeftOffset = 0;
			}

			if(!d3Helpers.isDefined(options.x.position) || d3Helpers.isString(options.x.position)) {
				switch(options.x.position) {
					case 'top':
						scope.xl.attr('transform', 'translate(' + scope.xlLeftOffset + ', ' + (options.x.orient === 'axisBottom'? 0:20) + ')');
						break;
					default:
						if(!d3Helpers.isDefined(options.x.position) || !d3Helpers.isString(options.x.position) ||
							options.x.position !== 'bottom') {
							$log.warn('[Angular - D3] X Axis position must be a string. Setting default value "bottom"');
							options.x.position = 'bottom';
						}
						scope.xl.attr('transform', 'translate(' + scope.xlLeftOffset + ', ' +
							(options.height + (options.x.orient === 'axisBottom'? 0:20))+ ')');
						break;
				}
			} else if(d3Helpers.isNumber(options.x.position)) {
				scope.xl.attr('transform', 'translate(' + scope.xlLeftOffset + ', ' +
					(options.x.orient === 'axisBottom'? (options.x.position + 20):options.x.position) + ')');
			}

			scope.xl.call(scope.xAxis);

			if(d3Helpers.isDefined(options.x.label) && options.x.label !== false) {
				scope.xl.append('text')
					.attr('class', 'label')
					.attr('transform', 'translate(' + (options.width) + ')')
					.attr('dx', '0.8em')
					.attr('dy', options.x.orient === 'axisBottom'? '1.35em':0)
					.style('text-anchor', 'start')
					.style('font-size', '1.1em')
					.style('font-weight', 'bold')
					.text(options.x.label);
			}
		},

		/**
		 * Add Y Axis to chart.
		 */
		addYAxis: function(scope, options) {
			scope.yl = scope.svg.append('g')
				.attr('class', 'y axis');

			scope.ylTopOffset = 0;
			if(options.axis.show && options.x.position === 'top') {
				scope.ylTopOffset = 30;
			}

			if(!d3Helpers.isDefined(options.y.position) || d3Helpers.isString(options.y.position)) {
				switch(options.y.position) {
					case 'right':
						scope.yl.attr('transform', 'translate(' + (options.width + (options.y.orient === 'axisLeft'? 20:0)) + ',' +
								(scope.ylTopOffset) + ')');
						break;
					default:
						if(!d3Helpers.isDefined(options.y.position) || !d3Helpers.isString(options.y.position) ||
							options.y.position !== 'left') {
							$log.warn('[Angular - D3] Y Axis position must be a string. Setting default value "left"');
							options.y.position = 'left';
						}
						scope.yl.attr('transform', 'translate(' + (options.y.orient === 'axisLeft'? 20:0) + ',' +
								(scope.ylTopOffset) + ')');
						break;
				}
			} else if(d3Helpers.isNumber(options.y.position)) {
				scope.yl.attr('transform', 'translate(' + (options.y.position - (options.y.orient === 'axisLeft'? 20:0)) + ',' +
						(scope.ylTopOffset) + ')');
			}

			scope.yl.call(scope.yAxis);

			if(d3Helpers.isDefined(options.y.label) && options.y.label !== false) {
				scope.yl.append('text')
					.attr('class', 'label')
					.attr('dy', options.y.position === 'right'? 4:(options.x.position === 'top'? 0:'-1em'))
					.attr('x', options.y.position === 'right'? '1.5em':'1em')
					.attr('y', options.x.position === 'top'? options.height:0)
					.style('text-anchor', 'start')
					.style('font-size', '1.1em')
					.style('font-weight', 'bold')
					.text(options.y.label);
			}
		},

		/**
		 * Add Subdivide Ticks to chart.
		 */
		addSubdivideTicks: function(g, scale, axis, options) {
			g.selectAll('.tick.minor')
				.classed('minor', false)
				.selectAll('text')
				.style('display', null)
				.style('stroke-width', 0);
			if(options.scale !== 'sqrt' && options.scale !== 'linear') {
				return;
			}

			g.selectAll('.tick')
				.data(scale.ticks(options.ticks), function(d) { return d; })
				.exit()
				.classed('minor', true)
				.selectAll('text')
				.style('display', 'none');

			/*
			switch(axis.orient()) {
				case 'left':
					g.selectAll('.tick.minor line')
						.attr('x2', -4);
					break;
				case 'bottom':
					g.selectAll('.tick.minor line')
						.attr('y2', 4);
					break;
				case 'top':
					g.selectAll('.tick.minor line')
						.attr('y2', -4);
					break;
				case 'right':
					g.selectAll('.tick.minor line')
						.attr('x2', 4);
					break;
			}
			*/
		},


		/**
		 * Refresh chart CSS styles.
		 */
		updateStyles: function(scope, options) {
			var stroke = scope.type === 'bar'? options.axis.stroke:null;

			if(options.axis.show === true) {
				scope.svg.selectAll('.axis path')
					.style('stroke', stroke)
					.style('fill', 'none')
					.style('shape-rendering', 'crispEdges');

				scope.svg.selectAll('.axis .tick line')
					.style('stroke', stroke)
					.style('fill', 'none');

				scope.svg.selectAll('.axis .tick.minor')
					.style('stroke', stroke)
					.style('fill', 'none');

				scope.svg.selectAll('.axis text')
					.style('fill', options.axis.color)
					.style('font-weight', options.axis.fontWeight);

				scope.svg.selectAll('.axis .label')
					.style('fill', options.axis.label.color)
					.style('font-weight', options.axis.label.fontWeight);
			} else {
				scope.svg.selectAll('.axis')
					.style('display', 'none');
			}

			scope.svg.style('font-family', options.fontFamily);
			scope.svg.style('font-size', options.fontSize);
		},

		/**
		 * Wrap Text Node on determinate width.
		 *
		 * @param {string} text Text to wrap.
		 * @param {number} width Max width for text element.
		 */
		wrap: function(text, width) {
	    text = d3.select(text);
			var words = text.text().split(/\s+/).reverse(),
	        word,
	        line = [],
	        lineNumber = 0,
	        lineHeight = 1.1, // ems
	        y = text.attr('y'),
	        dy = parseFloat(text.attr('dy')),
	        dx = text.attr('dx');

			var tspan =
				text.text(null)
					.append('tspan')
					.attr('x', 0)
					.attr('y', y)
					.attr('dx', dx)
					.attr('dy', dy + 'em');
	    while(word = words.pop()) {
	      line.push(word);
	      tspan.text(line.join(' '));
	      if(tspan.node().getComputedTextLength() > width) {
	        line.pop();
	        tspan.text(line.join(' '));
	        line = [word];
	        tspan =
						text.append('tspan')
							.attr('x', 0)
							.attr('y', y)
							.attr('dx', dx)
							.attr('dy', ++lineNumber * lineHeight + dy + 'em')
							.text(word);
	      }
	    }
		},

		/**
		 * Get translation from an transform string.
		 *
		 * @param {string} transform Transform string.
		 */
		getTranslation: function(transform) {
			// Create a dummy g for calculation purposes only. This will never
			// be appended to the DOM and will be discarded once this function
			// returns.
			var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

			// Set the transform attribute to the provided string value.
			g.setAttributeNS(null, 'transform', transform);

			// consolidate the SVGTransformList containing all transformations
			// to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
			// its SVGMatrix.
			var matrix = g.transform.baseVal.consolidate().matrix;

			// As per definition values e and f are the ones for the translation.
			return [matrix.e, matrix.f];
		}
	};
}).factory('pieDefaults', function (d3Helpers) {
	function _getDefaults() {
		var commonDefaults = d3Helpers.getCommonDefaults();
		angular.extend(commonDefaults, {
			pie: {
				colors: d3.scaleOrdinal(d3.schemeCategory20)
			},
			radius: 0,
			x: {
				key: 'x',
				label: 'x',
				show: true
			},
			y: {
				key: 'y',
				label: 'y'
			},
			defaultData: [{
				id: 1,
				x: 'Fruits',
				y: 54,
				tooltip: 'Fruits tooltip'
			}, {
				id: 2,
				x: 'Vegetables',
				y: 23,
				tooltip: 'Vegetables tooltip'
			}, {
				id: 3,
				x: 'Meet',
				y: 41,
				tooltip: 'Meet tooltip'
			}],
			showPercent: false,
			borderColor: '#FFF',
			pieAnimation: 'normal'
		});
		return commonDefaults;
	}

	var isDefined = d3Helpers.isDefined,
		obtainEffectiveChartId = d3Helpers.obtainEffectiveChartId,
		defaults = {};

	return {
		getDefaults: function (scopeId) {
			var pieId = obtainEffectiveChartId(defaults, scopeId);
			return defaults[pieId];
		},

		getCreationDefaults: function (scopeId) {
			var d = this.getDefaults(scopeId);

			var pieDefaults = {};
			angular.extend(pieDefaults, d);
			return pieDefaults;
		},

		setDefaults: function(userDefaults, scopeId) {
			var newDefaults = _getDefaults();

			if (isDefined(userDefaults)) {
				d3Helpers.setDefaults(newDefaults, userDefaults);

				newDefaults.radius = d3Helpers.isDefined(userDefaults.radius)?  userDefaults.radius:newDefaults.radius;
				newDefaults.showPercent = d3Helpers.isDefined(userDefaults.showPercent)?  userDefaults.showPercent:newDefaults.showPercent;
				newDefaults.borderColor = d3Helpers.isDefined(userDefaults.borderColor)?  userDefaults.borderColor:newDefaults.borderColor;
				newDefaults.pieAnimation = d3Helpers.isDefined(userDefaults.pieAnimation)?  userDefaults.pieAnimation:newDefaults.pieAnimation;

				if(isDefined(userDefaults.pie)) {
					angular.extend(newDefaults.pie, userDefaults.pie);
				}

				if(isDefined(userDefaults.x)) {
					angular.extend(newDefaults.x, userDefaults.x);
				}

				if(isDefined(userDefaults.y)) {
					angular.extend(newDefaults.y, userDefaults.y);
				}

				if(isDefined(newDefaults.defaultData)) {
					angular.extend(newDefaults.defaultData, newDefaults.defaultData);
				}
			}

			var pieId = obtainEffectiveChartId(defaults, scopeId);
			defaults[pieId] = newDefaults;
			return newDefaults;
		}
	};
}).factory('barHelpers', function ($log, d3Helpers, svgHelpers) {
	/*
	var wrap = function (text, width) {
		text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.1, // ems
				y = text.attr('y'),
				dy = parseFloat(text.attr('dy')),
				tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(' '));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(' '));
					line = [word];
					tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
				}
			}
		});
	};
	*/

	return {
		addAxis: function(scope, options) {
			svgHelpers.addXAxis(scope, options);
			svgHelpers.addYAxis(scope, options);
			svgHelpers.addSubdivideTicks(scope.yl, scope.y, scope.yAxis, options.y);
		},

		addOneAxis: function(scope, options) {
			svgHelpers.addXAxis(scope, options);
			scope.ylTopOffset = options.x.position === 'top'? options.height*0.125:options.height*0.2;

			scope.guide = scope.svg.append('g')
				.attr('class', 'guide');

			var guidePosition =
				options.axis.guidePosition === 'bottom'? options.height*1:(scope.ylTopOffset - options.height*0.03);
			scope.guide
				.append('line')
				.attr('x1', scope.xlLeftOffset)
				.attr('x2', options.width + scope.xlLeftOffset)
				.attr('y1', guidePosition)
				.attr('y2', guidePosition)
				.style('stroke', '#BBB')
				.style('stroke-width', 1)
				.style('shape-rendering', 'crispEdges');
		},

		setXScale: function(scope, options) {
			scope.x = d3.scaleBand();
			scope.x
				.range([0, options.width]);

			if(!d3Helpers.isDefined(scope.xAxis)) {
				if(!d3Helpers.isDefined(options.x.orient) || !d3Helpers.isString(options.x.orient) ||
					(options.x.orient !== 'axisBottom' && options.x.orient !== 'axisTop')) {
					$log.warn('[Angular - D3] Tick orient must be a string. Setting default value "axisBottom"');
					options.x.orient = 'axisBottom';
				}
				scope.xAxis = d3[options.x.orient](scope.x);
			} else {
				scope.xAxis.scale(scope.x);
			}

			if(d3Helpers.isDefined(options.x.tickSize) && d3Helpers.isNumber(options.x.tickSize)) {
				scope.xAxis.tickSize(options.x.tickSize);
			} else {
				$log.warn('[Angular - D3] Ticksize must be a number. Setting default value 6');
				options.x.tickSize = 6;
				scope.xAxis.tickSize(options.x.tickSize);
			}

			var data  = d3Helpers.getDataFromScope(scope, options);
			scope.x
				.domain(data.map(function(d) { return d[options.x.key]; }))
				.rangeRound([0, options.width])
				.paddingInner(options.bar.gap);
			scope.xAxis.tickFormat(options.x.tickFormat);
			if(d3Helpers.isDefined(scope.data)) {
				this.updateData(scope.data, options);
			}
		},

		setYScale: function(scope, options) {
			switch(options.y.scale) {
				case 'log':
					scope.y = d3.scaleLog().clamp(true);
					break;
				case 'sqrt':
					scope.y = d3.scaleSqrt();
					break;
				case 'time':
					scope.y = d3.scaleTime();
					break;
				default:
					if(options.y.scale !== 'linear') {
						$log.warn('[Angular - D3] Ticksize must be a string and ["linear", "log", "time", "sqrt"]. Setting default value "linear"');
						options.y.scale = 'linear';
					}
					scope.y = d3.scaleLinear();
					break;
			}

			var dy = 0;
			if(scope.type === 'oneAxisBar') {
				dy = options.height*0.2;

				if(options.axis.guidePosition === 'bottom') {
					dy += options.height*0.05;
				}
			}
			if(options.y.direction === 'btt') {
				scope.y.range([options.height - dy, 0]);
			} else {
				scope.y.range([0, options.height - dy]);
			}
			if(!d3Helpers.isDefined(scope.yAxis)) {
				if(!d3Helpers.isDefined(options.y.orient) || !d3Helpers.isString(options.y.orient)) {
					$log.warn('[Angular - D3] Tick orient must be a string. Setting default value "left"');
					options.y.orient = 'axisLeft';
				}
				scope.yAxis = d3[options.y.orient](scope.y);
			} else {
				scope.yAxis.scale(scope.y);
			}

			if(d3Helpers.isDefined(options.y.tickSize) && d3Helpers.isNumber(options.y.tickSize)) {
				scope.yAxis.tickSize(options.y.tickSize);
			} else {
				$log.warn('[Angular - D3] Ticksize must be a number. Setting default value 6');
				options.y.tickSize = 6;
				scope.yAxis.tickSize(options.y.tickSize);
			}

			switch(options.y.scale) {
				case 'log':
					if(!d3Helpers.isDefined(options.y.tickFormat)) {
						options.y.tickFormat = function(d) {
							var base = d3.round(Math.log(d)/Math.LN10, 3);
							return base%1 === 0? d:'';
						};
					}
					scope.yAxis.ticks(options.y.ticks);
					scope.y.domain([0.1, 1000]);
					break;
				case 'time':
					if(!d3Helpers.isDefined(options.y.tickFormat)) {
						var locale = d3Helpers.isDefined(options.locale)? options.locale.timeFormat:d3.timeFormat;
						options.y.tickFormat = locale.multi([
							['.%L', function(d) { return d.getMilliseconds(); }],
							[':%S', function(d) { return d.getSeconds(); }],
							['%I:%M', function(d) { return d.getMinutes(); }],
							['%I %p', function(d) { return d.getHours(); }],
							['%a %d', function(d) { return d.getDay() && d.getDate() !== 1; }],
							['%b %d', function(d) { return d.getDate() !== 1; }],
							['%B', function(d) { return d.getMonth(); }],
							['%Y', function() { return true; }]
						]);
					}
					scope.yAxis.ticks(options.y.ticks);
					break;
				default:
					scope.yAxis.ticks(options.y.ticks + options.y.ticks * options.y.tickSubdivide);
					scope.y.domain([0, 100]);
					break;
			}
			scope.yAxis.tickFormat(options.y.tickFormat);
			if(d3Helpers.isDefined(scope.data)) {
				this.updateData(scope.data, options);
			}
		},

		zoomBehaviour: function() {
		},

		updateData: function(scope, options) {
			if(!d3Helpers.isDefined(scope.x) || !d3Helpers.isDefined(scope.y)) {
				return;
			}
			var data = d3Helpers.getDataFromScope(scope, options);
			var _idFunction = function(d) {
				return d[options.idKey];
			};
			if(d3Helpers.isUndefinedOrEmpty(data)) {
				$log.warn('[Angular - D3] No data for bars');
				return;
			}
			$log.debug('[Angular - D3] Data for bars:', data);

			var formatTime = d3.timeFormat(options.timeFormat);
			var colors = d3Helpers.setColors(options.bar.colors);

			var mapFunction = function(d) {
				return d[options.y.key].map(function(e, i) {
					return {
						id: i,
						parentId: d[options.idKey],
						x: d[options.x.key],
						y: e
					};
				});
			};

			var domain = data.map(function(d) { return d[options.x.key]; });
			scope.x.domain(domain);
			scope.xl.call(scope.xAxis);
			$log.debug('[Angular - D3] x domain:', domain);

			var totals = [];
			var max = d3.max(data, function(d) {
				return d3.max(d[options.y.key], function(v, i) {
					if(options.y.scale === 'time' && !(v instanceof Date)) {
						v = formatTime.parse(v);
					}
					if(!d3Helpers.isDefined(totals[i])) {
						totals.push(v);
					} else {
						totals[i] += v;
					}
					return v;
				});
			});

			var min = 0;

			if(!options.y.minFromZero) {
				min = d3.min(data, function(d) {
					return d3.min(d[options.y.key]);
				});
			}

			$log.debug('[Angular - D3] Data max for bars:', max);

			if(min === undefined || max === undefined || (min === 0 && max === 0)) {
				min = 0;
				max = options.y.scale === 'time'? new Date():100;
			} else if((min - max) === 0) {
				min = min instanceof Date? 0:(min - Math.abs(min/2));
				max = max instanceof Date? max:(max + Math.abs(max/2));
			}

			scope.y.domain([min, max]);
			if(min < max) {
				scope.y.nice();
			}

			if(scope.type === 'bar') {
				scope.yl.call(scope.yAxis);
				svgHelpers.addSubdivideTicks(scope.yl, scope.y, scope.yAxis, options.y);
			}

			if(d3Helpers.isDefined(scope.zoom) && d3Helpers.isDefined(options.zoom) && options.zoom) {
				// scope.zoom.x(scope.x).y(scope.y);
			}

			var yMaxPoints = d3.max(data.map(function(d){ return d[options.y.key].length; }));
			var x0 = d3.scaleBand()
				.domain(d3.range(yMaxPoints))
				.rangeRound([0, scope.x.bandwidth()]);

			var barsContainer = scope.svg.select('g.' + scope.classPrefix + '-bars');
			if(barsContainer.empty()) {
				barsContainer = scope.svg.append('g')
					.attr('transform', 'translate(' + scope.xlLeftOffset + ',' + scope.ylTopOffset + ')')
					.attr('class', scope.classPrefix + '-bars')
					.attr('clip-path', 'url(#'+scope.idClip+')');
			}

			var updateBars = function(bars, update) {
				if(d3Helpers.isDefined(options.bar.path)) {
					bars
						.transition()
						.duration(options.animations.time)
						.attrTween('transform', function(d, i, a) {
							var iconHeight = 115;
							var percentH = Math.abs((scope.y(d.y) - scope.y(min))/iconHeight);
							var dy = 0;
							var trans = 'translate(' + (scope.x(d.x) + x0(i) - 102*percentH/2 + x0.bandwidth()/2) + ', ' + dy + ')';
							var inp = d3.interpolateString(a, trans);
							return function(t) {
								return inp(t);
							};
						});

					if(update) {
						bars = bars.selectAll('path');
					} else {
						bars = bars.append('path')
							.attr('d', options.bar.path)
							.attr('class', 'a3bar-bar-path')
							.attr('fill-rule', 'evenodd')
							.attr('transform', 'scale(0)')
							.style('opacity', 0);
					}

					bars
						.style('fill', function(d, i) {
							var color = d3.rgb(colors(i));
							return color;
						})
						.style('stroke', function(d, i) {
							return d3.rgb(colors(i)).darker();
						})
						.style('stroke-width', 1)
						.transition()
						.ease(options.animations.ease)
						.duration(options.animations.time)
						.attrTween('transform', function(d, i, a) {
							d = d3.select(this.parentNode).data()[0];
							var percentW = x0.bandwidth()/102;
							var percentH = Math.abs((scope.y(d.y) - scope.y(min))/115);
							return d3.interpolateString(a, 'scale(' + percentW + ', ' + percentH + ')');
						})
						.style('opacity', 0.8);
				} else {
					bars
						.attr('width', x0.bandwidth())
						.attr('title', function(d) {
							var format = d3.format('.3');
							if(d3Helpers.isDefined(options.y.tickFormat)) {
								format = options.y.tickFormat;
							}
							return format(d.y);
						})
						.attr('x', function(d, i) {
							var x = scope.x(d.x) + x0(i);
							return isNaN(x)? 0:x;
						})
						.attr('y', function() {
							var h = d3.select(this).attr('height');
							var dy = options.y.direction === 'btt'? scope.y(0)-h:0;
							return dy;
						})
						.attr('height', function() {
							var h = d3.select(this).attr('height');
							return h? h:0;
						})
						//.style('opacity', 0)
						.style('fill', function() {
							var fill = d3.select(this).style('fill');
							return fill === 'rgb(0, 0, 0)'?
								d3.rgb(255,255,255):fill;
						})
						.transition()
						.ease(options.animations.ease)
						.duration(options.animations.time)
						.attr('height', function(d) {
							return Math.abs(scope.y(d.y) - scope.y(min));
						})
						.attr('y', function(d) {
							var h = Math.abs(scope.y(d.y) - scope.y(min));
							var dy = options.y.direction === 'btt'? scope.y(0)-h:0;
							return dy;
						})
						/*
						.attrTween('transform', function(d, i, a) {
							var h = Math.abs(scope.y(d.y) - scope.y(min));
							var dy = options.y.direction === 'btt'? (scope.y.range()[1] - h):0;
							var inp = d3.interpolateTransformSvg(a, 'translate(0, ' + dy + ')');
							return inp;
						})
						*/
						.styleTween('fill', function(d, i, a) {
							var color = d3.rgb(colors(i));
							var inp;
							if(d3Helpers.isDefined(options.bar.colorInterpolator) && d3Helpers.isFunction(options.bar.colorInterpolator)) {
								inp = options.bar.colorInterpolator(color.brighter(), color.darker());
								color = inp(d.y/max);
							}

							// TODO Check subcolors.
							var returnColor = d3Helpers.isDefined(options.bar.subcolors)? options.bar.subcolors[d.parentId-1]:color;
							inp = d3.interpolateRgb(a, returnColor);
							return inp;
						});
						//.style('opacity', 1);
				}
				bars.select('title').remove();
				bars.append('title')
					.text(function(d) {
						var format = d3.format('.3g');
						if(d3Helpers.isDefined(options.y.tickFormat)) {
							format = options.y.tickFormat;
						}
						return format(d.y);
					});
			};

			var barGroups = barsContainer
				.selectAll('.' + scope.classPrefix + '-group-bar')
				.data(data, _idFunction);
			// barGroups.interrupt();

			barGroups.each(function(d) {
				var barGroup = d3.select(this);
				var bars = barGroup
					.selectAll('.' + scope.classPrefix + '-bar')
					.data(function() {
						var newData = mapFunction(d);
						return newData;
					}, function(d) {
						return d.id;
					});


				updateBars(bars, true);
				bars
					.enter()
					.append(d3Helpers.isDefined(options.bar.path)? 'g':'rect')
					.attr('class', scope.classPrefix + '-bar');
				updateBars(bars, true);
				bars.exit().remove();
				bars = barGroup
					.selectAll('.' + scope.classPrefix + '-bar');
				updateBars(bars, true);
			});


			var series = barGroups.enter()
				.append('g')
				.attr('class', scope.classPrefix + '-group-bar');

			var bars = series.selectAll('.' + scope.classPrefix + '-bar')
				.data(mapFunction, function(d) {
					return d.id;
				})
				// .interrupt()
				.enter()
				.append(d3Helpers.isDefined(options.bar.path)? 'g':'rect')
				.attr('class', scope.classPrefix + '-bar');
			updateBars(bars);

			//bars.exit().remove();
			barGroups.exit().remove();

			if(scope.type === 'oneAxisBar') {
				scope.svg.select('g.' + scope.classPrefix +'-helptext').remove();

				var helpTextContainer = scope.svg.append('g')
					.attr('transform', 'translate(' + scope.xlLeftOffset + ',' +
						(scope.ylTopOffset - (options.x.position === 'bottom'? options.height*0.15:-options.height*0.85)) + ')')
					.attr('class', scope.classPrefix + '-helptext');

				var textGroups = helpTextContainer.selectAll('.' + scope.classPrefix + '-values')
					.data(data, _idFunction)
					.interrupt();

				series = textGroups.enter()
					.append('g')
					.attr('class', scope.classPrefix + '-values');

				if(options.axis.showValues) {
					series.selectAll('.' + scope.classPrefix + '-val')
						.data(mapFunction, function(d) {
							return d.id;
						})
						.interrupt()
						.enter()
						.append('text')
						.attr('x', function(d, i) {
							return scope.x(d.x) + x0(i) + x0.bandwidth()/2;
						})
						.attr('dy', !options.axis.showPercent? '0.5em':0)
						.attr('class', scope.classPrefix + '-val')
						.style('text-anchor', 'middle')
						.style('fill', options.axis.valuesColor)
						.text(function(d) {
							var format = d3.format('.3g');
							return format(d.y);
						});
				}

				if(options.axis.showPercent) {
					series.selectAll('.' + scope.classPrefix + '-percent')
						.data(mapFunction, function(d) {
							return d.id;
						})
						.interrupt()
						.enter()
						.append('text')
						.attr('x', function(d, i) {
							return scope.x(d.x) + x0(i) + x0.bandwidth()/2;
						})
						.attr('y', options.height*0.065)
						.attr('dy', !options.axis.showValues? '-0.5em':0)
						.attr('class', scope.classPrefix + '-percent')
						.style('text-anchor', 'middle')
						.style('font-size', '0.85em')
						.style('font-weight', 'bold')
						.style('fill', options.axis.percentColor)
						.text(function(d, i) {
							var format = d3.format('.3p');
							return format(d.y/totals[i]);
						});
				}
			}

			svgHelpers.updateStyles(scope, options);
		}
	};
}).factory('barDefaults', function (d3Helpers) {
	function _getDefaults() {
		var commonDefaults = d3Helpers.getCommonDefaults();
		angular.extend(commonDefaults, {
			series: ['A', 'B', 'C', 'D'],
			bar: {
				gap: 0.2,
				path: null,
				colors: d3.scaleOrdinal(d3.schemeCategory20),
				subcolors: null,
				// Possible Values [d3.interpolateRgb, d3.interpolateHsl, d3.interpolateLab, d3.interpolateHcl]
				colorInterpolator: null
			},
			x: {
				tickFormat: null,
				tickSize: 6,
				orient: 'axisBottom',
				position: 'bottom',
				key: 'x',
				label: 'x',
				ticks: 5,
				tickSubdivide: 4
			},
			y: {
				scale: 'linear',
				tickFormat: null,
				tickSize: 6,
				orient: 'axisLeft',
				position: 'left',
				// Possible Values ['ttb', 'btt'] => ['top to bottom', 'bottom to top']
				direction: 'ttb',
				key: 'y',
				label: 'y',
				ticks: 5,
				tickSubdivide: 4,
				minFromZero: true
			},
			axis: {
				// Possible Values ['bottom', 'top']
				guidePosition: 'top',
				showValues: true,
				valuesColor: '#000',
				showPercent: true,
				percentColor: '#000',
				label: {
					color: '#000',
					fontWeight: 'bold'
				},
				show: true
			},
			defaultData: [{
				id: 1,
				x: 'Fruits',
				y: [ 54, 0, 879 ],
				tooltip: 'Fruits tooltip'
			}, {
				id: 2,
				x: 'Vegetables',
				y: [ 12, 34, 15 ],
				tooltip: 'Vegetables tooltip'
			}, {
				id: 3,
				x: 'Meet',
				y: [ 154, 432, 234 ],
				tooltip: 'Meet tooltip'
			}]
		});
		return commonDefaults;
	}

	var isDefined = d3Helpers.isDefined,
		obtainEffectiveChartId = d3Helpers.obtainEffectiveChartId,
		defaults = {};

	return {
		getDefaults: function (scopeId) {
			var barId = obtainEffectiveChartId(defaults, scopeId);
			return defaults[barId];
		},

		getCreationDefaults: function (scopeId) {
			var d = this.getDefaults(scopeId);

			var barDefaults = {};
			angular.extend(barDefaults, d);
			return barDefaults;
		},

		setDefaults: function(userDefaults, scopeId) {
			var newDefaults = _getDefaults();

			if (isDefined(userDefaults)) {
				d3Helpers.setDefaults(newDefaults, userDefaults);

				if(isDefined(userDefaults.bar)) {
					angular.extend(newDefaults.bar, userDefaults.bar);
				}

				if(isDefined(userDefaults.x)) {
					angular.extend(newDefaults.x, userDefaults.x);
				}

				if(isDefined(userDefaults.y)) {
					angular.extend(newDefaults.y, userDefaults.y);
				}

				if(isDefined(newDefaults.defaultData)) {
					angular.extend(newDefaults.defaultData, newDefaults.defaultData);
				}
			}

			var barId = obtainEffectiveChartId(defaults, scopeId);
			defaults[barId] = newDefaults;
			return newDefaults;
		}
	};
});
	
	
	/*app.run(['$rootScope', '$location', function($rootScope, $location) {
		$rootScope.$on("$locationChangeStart", function(event, next, current) {
			// if user is logged in, then only can see other pages by url
		    if (!$rootScope.menuPanel) {
		        $location.path("/login");
		    }
		});
	}]);*/

	Configure.$inject = [ '$routeProvider', '$httpProvider'];

	function Configure($routeProvider, $httpProvider) {

		$routeProvider.when('/', {
			templateUrl : "app/lifecycle/lifecycle.html"
		}).when('/companyOverview', {
			templateUrl : "app/company/company-overview.html"
		}).when('/advertisingDashBoard', {
			templateUrl : "app/company/advertisingDashBoard.html"
		}).when('/campaignDashBoard', {
			templateUrl : "app/company/campaignDashBoard.html"
		});
	}
})(window.angular);
