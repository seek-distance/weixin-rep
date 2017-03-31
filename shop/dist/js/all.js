var app=angular.module('app', ['ui.router']);

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
}]);


app.controller('home', ['$scope', function($scope){
	
}]);

app.controller('cart', ['$scope','autoRem','totalPrice', function($scope,autoRem,totalPrice){
	autoRem();
	$scope.shops=[
		{
			selected:true,
			imgSrc:'//i1.mifile.cn/a1/pms_1488358225.13157868!180x180.jpg',
			name:'红米4X 全网通版 2GB内存 香槟金 16GB',
			sellPrice:699,
			num:1,
		},
		{
			selected:false,
			imgSrc:'//i1.mifile.cn/a1/pms_1488358225.13157868!180x180.jpg',
			name:'红米4X 全网通版 2GB内存 香槟金 16GB',
			sellPrice:699,
			num:1,
		},
	];
	$scope.totalPrice = totalPrice($scope.shops);

	$scope.addNum=function(i){
		$scope.shops[i].num++;
		$scope.totalPrice = totalPrice($scope.shops);
	}
	$scope.subNum=function(i){
		$scope.shops[i].num--;
		if ($scope.shops[i].num<1) $scope.shops[i].num = 1;
		$scope.totalPrice = totalPrice($scope.shops);
	}
	$scope.changeSelect=function(i){
		$scope.shops[i].selected = !$scope.shops[i].selected;
		$scope.totalPrice = totalPrice($scope.shops);
	}
	$scope.deleteShop = function(i){
		$scope.shops.splice(i,1);
		$scope.totalPrice = totalPrice($scope.shops);
	}
}]);

app.controller('order', ['$scope', function($scope){
	
}]);

app.controller('user', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.isLogin=true;
}]);

app.controller('order_info', ['$scope', function($scope){
	
}]);

app.controller('search', ['$scope', function($scope){
	
}]);

app.controller('category', ['$scope', function($scope){
	
}]);

app.controller('good', ['$scope','swipe', function($scope,swipe){
	$scope.imgs=['dist/images/order1.jpg','dist/images/order2.jpg'];
	swipe();
	
}]);

app.controller('login', ['$scope', function($scope){
	
}]);

app.controller('list', ['$scope', function($scope){
	
}]);
app.directive('swiper', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div class="swiper-container">'+
					    '<div class="swiper-wrapper" ng-transclude>'+
					    '</div>'+
					    '<div class="swiper-pagination"></div>'+
					'</div>',
		// templateUrl: '',
		// replace: true,
		transclude: true
	};
});

app.factory('swipe', [function(){
	return function(){
		setTimeout(function(){
			var mySwiper = new Swiper ('.swiper-container', {
			    loop: true,
			    pagination : '.swiper-pagination',
			}); 
		},10);
	};
}]);
app.factory('autoRem', [function(){
	return function(){
		var iWidth = document.documentElement.clientWidth;
		var iFontSize = iWidth/7.2;	
		console.log("当前设备1rem大小为:"+iFontSize+"px");
		document.getElementsByTagName("html")[0].style.fontSize=iFontSize+"px";
	};
}]);
app.factory('totalPrice', [function(){
	return function(data){
		var sum=0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].selected)	sum += data[i].sellPrice * data[i].num;			
		}
		return sum;
	};
}]);