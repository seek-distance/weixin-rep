var app=angular.module('app', ['ui.router','ngTouch']);

angular.module("ngTouch", [])
.directive("ngTouchstart", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touchstart");
                $scope.$apply(method);
            }

        }]
    };
})
.directive("ngTouch", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {
        	var startX,startY,endX,endY;
        	$element.bind("touchstart",function(event){
        		startX=event.touches[0].pageX;
        		startY=event.touches[0].pageY;
        	})
        	$element.bind("touchmove",function(event){
        		endX=event.touches[0].pageX;
        		endY=event.touches[0].pageY;
        	})
            $element.bind("touchend", function(event){
            	endX = endX || startX;
            	endY = endY || startY;
        		if (Math.abs(startX-endX)<5 && Math.abs(startY-endY)<5) {
        			var method = $element.attr("ng-touch");
                	$scope.$apply(method);
        		}
            });

        }]
    };
})
.directive("ngTouchmove", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                event.preventDefault();
                $element.bind("touchmove", onTouchMove);
                $element.bind("touchend", onTouchEnd);
            }
            function onTouchMove(event) {
                var method = $element.attr("ng-touchmove");
                $scope.$apply(method);
            }
            function onTouchEnd(event) {
                event.preventDefault();
                $element.unbind("touchmove", onTouchMove);
                $element.unbind("touchend", onTouchEnd);
            }

        }]
    };
})
.directive("ngTouchend", function () {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {

            $element.bind("touchend", onTouchEnd);
            function onTouchEnd(event) {
                var method = $element.attr("ng-touchend");
                $scope.$apply(method);
            }

        }]
    };
});

app.config(['$stateProvider','$urlRouterProvider',function( $stateProvider , $urlRouterProvider ) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'dist/tpls/home.html',
		controller:'home'
	})
	.state('cart',{
		url:'/my-shopping-cart',
		templateUrl:'dist/tpls/cart.html',
		controller:'cart'
	})
	.state('order',{
		url:'/my-orders',
		templateUrl:'dist/tpls/order.html',
		controller:'order'
	})
	.state('orderManage',{
		url:'/orderManage',
		templateUrl:'dist/tpls/orderManage.html',
		controller:'orderManage'
	})
	.state('checkOrder',{
		url:'/checkOrder',
		templateUrl:'dist/tpls/checkOrder.html',
		controller:'checkOrder'
	})
	.state('address',{
		url:'/address',
		templateUrl:'dist/tpls/address.html',
		controller:'address'
	})
	.state('address_add',{
		url:'/address_add',
		templateUrl:'dist/tpls/address_add.html',
		controller:'address_add'
	})
	.state('searchByName',{
		url:'/search-by-name',
		templateUrl:'dist/tpls/searchByName.html',
		controller:'searchByName'
	})
	.state('searchByPdf',{
		url:'/search-pdf',
		templateUrl:'dist/tpls/search-pdf.html',
		controller:'searchByPdf'
	})
	.state('contact',{
		url:'/my-contact',
		templateUrl:'dist/tpls/contact.html',
		controller:'contact'
	})
}]);

