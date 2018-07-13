(function(angular) {

	'use strict';

	function LifeCycleController($http, $scope, $rootScope, $cookieStore,
			$window, $location, $routeParams) {
		$scope.data = [
            {
                key: "Visitors",
                y: 5
            },
            {
                key: "News Letters Only",
                y: 2
            },
            {
                key: "New",
                y: 9
            },
            {
                key: "Active",
                y: 7
            },
            {
                key: "One Timer",
                y: 4
            },
            {
                key: "ReActivated",
                y: 3
            },
            {
                key: "Churn",
                y: .5
            }
        ];
		$scope.optionsPie = {
        chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function(d){return d.key;},
            y: function(d){return d.y;},
            showLabels: true,


           
            transitionDuration: 500,
            legend: {
                margin: {
                    top: 5,
                    right: 70,
                    bottom: 5,
                    left: 0
                }
            },
            title: ""
        },
        title: {
          text: "Hello"
        }
    };
		
		
	$scope.datan = [{
    key: "Avg. Future Value",
    values: [
        { "label" : "Visitors" , "value" : 29.765957771107 },
        { "label" :"News Letters Only", "value" : 0 },
        { "label" : "New" , "value" : 32.807804682612 },
        { "label" : "Active" , "value" : 196.45946739256 },
        { "label" : "One Timer" , "value" : 0.19434030906893 },
        { "label" : "ReActivate" , "value" : 98.079782601442 },
        { "label" : "Churn" , "value" : 13.925743130903 },
        { "label" : "Dump" , "value" : 5.1387322875705 }
    ]
}];
		$scope.options = {
    chart: {
        type: 'discreteBarChart',
        height: 450,
		scale :100,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.2f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis'
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 30
        }
    }
};
	$scope.optionsHor = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 350,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                 showControls: false,
                showValues: false,
				showXAxis: false ,	
				showYAxis: false,
               
                duration: 500,
                xAxis: {
                    showMaxMin: false,
					
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',:00')(d+6);
                    }
                }
            }
        };

        $scope.dataHor =[
  {
    "key": "Customers",
    "color": "#04e2e8",
    "values": [
      { 
        "label" : "Group A" ,
        "value" : 1.8746444827653
      } , 
      { 
        "label" : "Group B" ,
        "value" : 8.0961543492239
      } , 
      { 
        "label" : "Group C" ,
        "value" : 0.57072943117674
      } , 
      { 
        "label" : "Group D" ,
        "value" : 2.4174010336624
      } , 
      {
        "label" : "Group E" ,
        "value" : 0.72009071426284
      } , 
      { 
        "label" : "Group F" ,
        "value" : 0.77154485523777
      } , 
      { 
        "label" : "Group G" ,
        "value" : 0.90152097798131
      } , 
      {
        "label" : "Group H" ,
        "value" : 0.91445417330854
      } , 
      { 
        "label" : "Group I" ,
        "value" : 0.055746319141851
      }
    ]
  },
  {
			 "key": "Avg. Future Value",
    "color": "#a4b4b4",
    "values": [
      { 
        "label" : "Group A" ,
        "value" : 8.8746444827653
      } , 
      { 
        "label" : "Group B" ,
        "value" : 18.0961543492239
      } , 
      { 
        "label" : "Group C" ,
        "value" : 2.57072943117674
      } , 
      { 
        "label" : "Group D" ,
        "value" : 6.4174010336624
      } , 
      {
        "label" : "Group E" ,
        "value" : 5.72009071426284
      } , 
      { 
        "label" : "Group F" ,
        "value" : 8.77154485523777
      } , 
      { 
        "label" : "Group G" ,
        "value" : 2.90152097798131
      } , 
      {
        "label" : "Group H" ,
        "value" : 6.91445417330854
      } , 
      { 
        "label" : "Group I" ,
        "value" : 4.055746319141851
      }
					]
			
		}
  
]
	};
	LifeCycleController.$inject = [ '$http', '$scope', '$rootScope',
			'$cookieStore', '$window', '$location', '$routeParams'
			 ];

	angular.module('tangelo.lifecycle').controller(
			'LifeCycleController', LifeCycleController);

	})(window.angular);