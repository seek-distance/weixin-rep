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

            $element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                var method = $element.attr("ng-touch");
                $scope.$apply(method);
            }

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
		url:'/cart',
		templateUrl:'dist/tpls/cart.html',
		controller:'cart'
	})
	.state('order',{
		url:'/order',
		templateUrl:'dist/tpls/order.html',
		controller:'order'
	})
	.state('user',{
		url:'/user',
		templateUrl:'dist/tpls/user.html',
		controller:'user'
	})
	.state('order_info',{
		url:'/order_info',
		templateUrl:'dist/tpls/order_info.html',
		controller:'user'
	})
	.state('search',{
		url:'/search',
		templateUrl:'dist/tpls/search.html',
		controller:'search'
	})
	.state('category',{
		url:'/category',
		templateUrl:'dist/tpls/category.html',
		controller:'category'
	})
	.state('good',{
		url:'/good',
		templateUrl:'dist/tpls/good.html',
		controller:'good'
	})
	.state('login',{
		url:'/login',
		templateUrl:'dist/tpls/login.html',
		controller:'login'
	})
	.state('list',{
		url:'/list',
		templateUrl:'dist/tpls/list.html',
		controller:'list'
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
		url:'/search-by-pdf',
		templateUrl:'dist/tpls/search-pdf.html',
		controller:'searchByPdf'
	})
}]);

