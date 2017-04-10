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


app.controller('index', ['$scope', function($scope){
	
}]);

app.controller('home', ['$scope', function($scope){
	
}]);

app.controller('cart', ['$scope','autoRem','totalPrice', function($scope,autoRem,totalPrice){
	//autoRem();
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
	};
	$scope.subNum=function(i){
		$scope.shops[i].num--;
		if ($scope.shops[i].num<1) $scope.shops[i].num = 1;
		$scope.totalPrice = totalPrice($scope.shops);
	};
	$scope.changeSelect=function(i){
		$scope.shops[i].selected = !$scope.shops[i].selected;
		$scope.totalPrice = totalPrice($scope.shops);
	};
	$scope.deleteShop = function(i){
		$scope.shops.splice(i,1);
		$scope.totalPrice = totalPrice($scope.shops);
	};
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

app.controller('checkOrder', ['$scope', function($scope){
	
}]);

app.controller('address', ['$scope', function($scope){
	
}]);

app.controller('address_add', ['$scope', function($scope){
	$scope.provinceList=['请选择省','北京','天津'];
	console.log($scope.province);
}]);

app.controller('searchByName', ['$scope','searchByName','$rootScope', function($scope,searchByName,$rootScope){
	$scope.showList=false;
	$scope.noList=false;

	searchByName.rate().success(function(data){
		$rootScope.rate=data;
		$rootScope.rate.push({name:'RMB',rate:100})
		console.log(data);
	});

	$scope.submit=function(){
		if (!$scope.searchName) {
			return;
		}
		searchByName.search({part:$scope.searchName}).success(function(data){
			if (!data.distributors || data.distributors.length == 0 && data.icKeys.length == 0) {
				$scope.showList = false;
				$scope.noList=true;
				return;
			}else{
				$scope.noList=false;
				$scope.showList = true;
				$scope.list=data.distributors;
				if (data.distributors.length<3) {
					var num = 3 - data.distributors.length;
					Array.prototype.push.apply($scope.list,data.icKeys.slice(0,num));
				}
			}			
		});
	};

}]);

app.controller('searchByPdf', ['$scope','searchPdf', function($scope,searchPdf){
	$scope.submit=function(){
		if (!$scope.searchPdf) {
			return;
		}
		searchPdf.search({part:$scope.searchPdf}).success(function(data){
			if (!data || data.pdfs.length == 0) {
				$scope.showList = false;
				$scope.noList=true;
				return;
			}else{
				$scope.noList=false;
				$scope.showList = true;
				$scope.list=data.pdfs;
			}
		});
	};
	
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

app.filter("changRate",['$rootScope',function($rootScope){
	return function(value,currency){
		for (var i = 0; i < $rootScope.rate.length; i++) {
			if($rootScope.rate[i].name == currency){
				value = (value*$rootScope.rate[i].rate)/100;
				return value.toFixed(2);
			}
		}
	};
}]);
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

app.factory('totalPrice', [function(){
	return function(data){
		var sum=0;
		for (var i = 0; i < data.length; i++) {
			if (data[i].selected)	sum += data[i].sellPrice * data[i].num;			
		}
		return sum;
	};
}]);

app.constant('host', 'http://chip.jymao.com');
app.factory('searchByName', ['$http','host', function($http,host){
	return {
		search:function(option){
			return $http.get(host + "/ds/search-price",{params:option});
		},
		rate:function(option){
			return $http.get(host + "/ds/g/Exchange",{params:option});
		}
	};
}]);

app.factory('searchPdf', ['$http','host', function($http,host){
	return {
		search:function(option){
			return $http.get(host + "/ds/search-pdf",{params:option});
		}
	};
}]);
/*
服务器: chip.jymao.com
搜型号:
/ds/search-price?part=型号名
例如:http://chip.jymao.com/ds/search-price?part=0-1393230-9
返回的销售商(内含价格)信息格式:
[
            name:{type:"String"},
            parts:[
                {
                maker:{type:"String"},
                prices:[
                        { 
                            amount:{type:"String"}
                            ,price:{type:"Number"}
                            ,currency:{type:"String"}
                        }
                    ]
                }           
            ]
]

搜pdf:
/ds/search-pdf?part=型号名
例如: http://chip.jymao.com/ds/search-pdf?part=0-1393230-9

*/

/*
汇率接口:
/ds/g/Exchange?condition[name]=外币名
例如:
http://chip.jymao.com/ds/g/Exchange?condition[name]=美元
返回
[{"_id":"58e5f2b6fc584e8059dea22a","name":"美元","rate":691.41,"lastMod":"2017-04-06T07:48:06.789Z","__v":0}]

*/

/*
添加微信用户:
POST /ds/wx-user 
参数:
{
  openId:*****,
  accessToken:*****
}

如果此用户已经被添加过, 后台会自动刷新accessToken, 不会报错.

*/


/*
var menu = {
     "button":[
     {	
          "type":"click",
          "name":"资讯",
          "key":"IC_NEWS"
      },
      {
           "name":"商城",
           "sub_button":[
           {	
               "type":"view",
               "name":"搜型号",
               "url":"http://chip.jymao.com/search-by-name"
            },
            {
               "type":"view",
               "name":"搜PDF",
               "url":"http://chip.jymao.com/search-pdf"
            },
            {
               "type":"click",
               "name":"特价促销",
               "key":"IC_ON_SALE"
            },
            {
               "type":"click",
               "name":"我要配单",
               "key":"IC_UPLOAD_ORDER"
            }
            ]
       },{
           "name":"个人中心",
           "sub_button":[
               {
                   "type":"view",
                   "name":"购物车",
                   "url":"http://chip.jymao.com/my-shopping-cart"
               },{
                   "type":"view",
                   "name":"我的订单",
                   "url":"http://chip.jymao.com/my-orders"
               }, {
                   "type":"view",
                   "name":"联系方式",
                   "url":"http://chip.jymao.com/my-contact"
               },           
               {
                   "type":"click",
                   "name":"联系客服",
                   "key":"IC_CUSTOMER_SERVICE"
                }
               ]
       }]
 }

*/