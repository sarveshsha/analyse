(function(angular) {

	'use strict';

	function ClientController($http, $scope, $rootScope, $window, $location,$routeParams, ClientService) {			
		$('.formCheck').change(function() {
			$(".RfpRfqNone").fadeIn(2000);
			$("#clientListing").css("display","none");
		});		
		$('#requireYes').click(function() {
		   $("#prepareRFP").fadeIn(2000);
		   $("#clientListing").css("display","none");
		   $(".RfpRfqNone").css("display","none");
		});
		$('#requireNo').click(function() {
		   $("#FinanceOffer").fadeIn(2000);
		   $("#clientListing").css("display","none");
		   $(".RfpRfqNone").css("display","none");
		});
		$('#gotoListY').click(function() {
		   $("#clientListing").fadeIn(2000);
		   $("#prepareRFP").css("display","none");	
		   $(".RfpRfqNone").css("display","none");
		});
		$('#gotoListN').click(function() {			
		   $("#clientListing").fadeIn(2000);
		   $("#FinanceOffer").css("display","none");
		   $(".RfpRfqNone").css("display","none");
		});
		
		$("#input-iconic").fileinput({
		    uploadUrl: "/file-upload-batch/1",
		    uploadAsync: false,
		    minFileCount: 1,
		    maxFileCount: 10,
		    overwriteInitial: false,
		    initialPreview: [
		                     
		    ],
		    initialPreviewAsData: true, // defaults markup
		    initialPreviewFileType: 'image', // image is the default and can be overridden in config below
		    initialPreviewConfig: [
		          
		    ],
		    uploadExtraData: {
		        img_key: "1000",
		        img_keywords: "happy, nature",
		    },
		    preferIconicPreview: true, // this will force thumbnails to display icons for following file extensions
		    previewFileIconSettings: { // configure your icon file extensions
		        'doc': '<i class="fa fa-file-word-o text-primary"></i>',
		        'xls': '<i class="fa fa-file-excel-o text-success"></i>',
		        'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
		        'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
		        'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
		        'htm': '<i class="fa fa-file-code-o text-info"></i>',
		        'txt': '<i class="fa fa-file-text-o text-info"></i>',
		        'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
		        'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
		        // note for these file types below no extension determination logic 
		        // has been configured (the keys itself will be used as extensions)
		        'jpg': '<i class="fa fa-file-photo-o text-danger"></i>', 
		        'gif': '<i class="fa fa-file-photo-o text-muted"></i>', 
		        'png': '<i class="fa fa-file-photo-o text-primary"></i>'    
		    },
		    previewFileExtSettings: { // configure the logic for determining icon file extensions
		        'doc': function(ext) {
		            return ext.match(/(doc|docx)$/i);
		        },
		        'xls': function(ext) {
		            return ext.match(/(xls|xlsx)$/i);
		        },
		        'ppt': function(ext) {
		            return ext.match(/(ppt|pptx)$/i);
		        },
		        'zip': function(ext) {
		            return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
		        },
		        'htm': function(ext) {
		            return ext.match(/(htm|html)$/i);
		        },
		        'txt': function(ext) {
		            return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
		        },
		        'mov': function(ext) {
		            return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
		        },
		        'mp3': function(ext) {
		            return ext.match(/(mp3|wav)$/i);
		        },
		    }
		}).on('filesorted', function(e, params) {
		    console.log('File sorted params', params);
		}).on('fileuploaded', function(e, params) {
		    console.log('File uploaded params', params);
		});
	};

	ClientController.$inject = [ '$http', '$scope', '$rootScope', '$window',
			'$location','$routeParams', 'ClientService' ];

	angular.module('pentaWorkflow.client', [ 'ngTagsInput' ]).controller(
			'ClientController', ClientController);

})(window.angular);