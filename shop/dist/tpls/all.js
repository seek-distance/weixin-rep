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
	.state('user',{
		url:'/user',
		templateUrl:'dist/tpls/user.html',
		controller:'user'
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


app.controller('index', ['$scope','$location','appid','weixin', function($scope,$location,appid,weixin){
	/*if(!weixin.isweixin()){
		location.url='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3MTY2NjIwNg==&scene=124#wechat_redirect';
	}*/
	console.log(weixin.getUserInfo());
}]);

app.controller('home', ['$scope', function($scope){
	
}]);

app.controller('cart', ['$scope','cart','weixin','$rootScope','$state', function($scope,cart,weixin,$rootScope,$state){
	$scope.shops=weixin.getUserInfo().cart;
	$scope.reload=function(){
		$scope.totalPrice = cart.totalPrice($scope.shops);
		$scope.totalNum=cart.totalNum($scope.shops);
		weixin.setUserInfo('cart',$scope.shops);
	}
	$scope.reload();


	$scope.addNum=function(i){
		$scope.shops[i].num++;
		$scope.changeNum(i);
	};
	$scope.subNum=function(i){
		$scope.shops[i].num--;
		if ($scope.shops[i].num<1) $scope.shops[i].num = 1;
		$scope.changeNum(i);
	};
	$scope.changeSelect=function(i){
		$scope.shops[i].selected = !$scope.shops[i].selected;
		$scope.reload();
	};
	$scope.deleteShop = function(i){
		$scope.shops.splice(i,1);
		$scope.reload();
	};
	$scope.changeNum=function(index){		
		for (var j = 0; j < $scope.shops[index].prices.length; j++) {
			$scope.shops[index].prices[j].selected=false;
		}
		for (var j = 0; j < $scope.shops[index].prices.length; j++) {
			if(parseInt($scope.shops[index].prices[j].amount)<=parseInt($scope.shops[index].num) 
				&& $scope.shops[index].prices[j+1] 
				&& parseInt($scope.shops[index].prices[j+1].amount)>parseInt($scope.shops[index].num)
			){
				$scope.shops[index].prices[j].selected=true;
				$scope.shops[index].singlePrice=$scope.shops[index].prices[j].changePrice * $scope.shops[index].num;
				$scope.shops[index].singlePrice=$scope.shops[index].singlePrice.toFixed(2);
				$scope.reload();
				return;
			}
			if ($scope.shops[index].prices.length-1 == j && parseInt($scope.shops[index].num)<$scope.shops[index].prices[0].amount) {
				$scope.shops[index].prices[0].selected=true;
				$scope.shops[index].singlePrice=$scope.shops[index].prices[j].changePrice * $scope.shops[index].num;
				$scope.shops[index].singlePrice=$scope.shops[index].singlePrice.toFixed(2);	
				$scope.reload();		
				return;
			}
			if ($scope.shops[index].prices.length-1 == j) {
				$scope.shops[index].prices[j].selected=true;
				$scope.shops[index].singlePrice=$scope.shops[index].prices[j].changePrice * $scope.shops[index].num;
				$scope.shops[index].singlePrice=$scope.shops[index].singlePrice.toFixed(2);
				$scope.reload();
			}			
		}
	}
	$scope.checkOrder = function(){
		$rootScope.selectShop=cart.findSelected($scope.shops);
		$state.go('checkOrder');
	}

}]);

app.controller('order', ['$scope','order','weixin','$state', function($scope,order,weixin,$state){
	order.getOrdersById(weixin.getUserInfo().openId).then(function(obj){
		$scope.orders=obj.data;		
	})
	$scope.current=false;
	$scope.showCurrent=function(key){
		$scope.currentShop = $scope.orders[key];
		$scope.current=true;
	};
	$scope.hideCurrent=function(){
		setTimeout(function(){
			$scope.current=false;
			$scope.$apply();
		},300)		
	}
	$scope.goback=function(){
		$state.go(-1);
	}
}]);

app.controller('orderManage', ['$scope','order','weixin','$state','dailog', function($scope,order,weixin,$state,dailog){
	order.getOrders().then(function(obj){
		$scope.orders=obj.data;	
	})
	$scope.current=false;
	$scope.name='';
	$scope.id='';
	$scope.showCurrent=function(key){
		$scope.currentShop = $scope.orders[key];
		$scope.current=true;
	};
	$scope.hideCurrent=function(){
		setTimeout(function(){
			$scope.current=false;
			$scope.$apply();
		},300)		
	}
	$scope.goback=function(){
		$state.go(-1);
	}
	$scope.write=function(){
		order.expressed({
			ownerOpenId:$scope.current.ownerOpenId,
			orderId:weixin.getUserInfo().openId,
			express:{
			    name:$scope.name,
			    id:$scope.id
			}
		}).then(function(obj){
			var data=obj.data;
			if (data.msg=='ok') {
				dailog.show();
			}
		})
	}
	$scope.closeFix=function(){
		$state.go('orderManage');
	}
}]);

app.controller('user', ['$scope','$rootScope', function($scope,$rootScope){
	$rootScope.isLogin=true;
}]);

app.controller('checkOrder', ['$scope','$rootScope','weixin','dailog','checkOrder', function($scope,$rootScope,weixin,dailog,checkOrder){
	$scope.shopPrice=function(){
		var sum=0;
		for (var i = 0; i < $scope.shops.length; i++) {
			sum += parseFloat($scope.shops[i].singlePrice);
		}
		return sum;
	}
	$scope.num=function(){
		var sum=0;
		for (var i = 0; i < $scope.shops.length; i++) {
			sum += parseInt($scope.shops[i].num);
		}
		return sum;
	}
	$scope.closeFix=function(){
		dailog.hide('order');
	}
	$scope.pay=function(){
		checkOrder.addOrder({
		    buyer:{
		        name:$scope.address.name,
		        phone:$scope.address.phone,
		        addr:$scope.address.addr,
		        zipCode:$scope.address.zipCode
		    },
		    subOrders:subOrders,
		    totalPrice:$scope.shopTotalPrice,
		    ownerOpenId:weixin.getUserInfo().openId
		}).then(function(obj){
			if (obj.data.msg=='ok') {
				dailog.show();
			}
		})
	}


	if ($rootScope.currentAddr) {
		$scope.address = $rootScope.currentAddr;
	}else{
		weixin.getAddr(weixin.getUserInfo().openId).then(function(obj){
			$rootScope.AllAddr = obj.data[0].receiveAddrs;
			$scope.address = $rootScope.AllAddr[0];
		})
	}
	console.log($rootScope.selectShop);
	$scope.shops=$rootScope.selectShop;

	var subOrders = [];
	for (var i = 0; i < $rootScope.selectShop.length; i++) {
		subOrders[i]={};
		subOrders[i].partName=$rootScope.selectShop[i].shopName;
		subOrders[i].qty=$rootScope.selectShop[i].num;
		for (var j = 0; j < $rootScope.selectShop[i].prices.length; j++) {
			if($rootScope.selectShop[i].prices[j].selected){
				subOrders[i].price = $rootScope.selectShop[i].prices[j].changePrice;
				break;
			}
		}	
	}

	$scope.shopTotalPrice=$scope.shopPrice();
	$scope.totalNum=$scope.num();

}]);

app.controller('address', ['$scope','weixin','$rootScope','$state', function($scope,weixin,$rootScope,$state){
	var openId=weixin.getUserInfo().openId;

	weixin.getAddr(openId).then(function(obj){
		$scope.address=obj.data[0].receiveAddrs;
		$rootScope.AllAddr = $scope.address;
	})

	$scope.changeAddress=function(index){
		$rootScope.currentAddr=$scope.address[index];
		setTimeout(function(){
			$state.go('checkOrder');
		},300)
		
	}
}]);

app.controller('address_add', ['$scope','address_add','weixin','dailog', function($scope,addressAdd,weixin,dailog){
	//$scope.provinceList=['请选择省','北京','天津'];
	$scope.tel='';
	$scope.name='';
	$scope.address='';
	$scope.zipCode='';

	$scope.closeFix=function(){
		dailog.hide('address');
	}
	$scope.submit=function(){
		addressAdd.submit({
			openId:weixin.getUserInfo().openId,
			receiveAddr:{
				phone:$scope.tel,
				name:$scope.name,
				addr:$scope.address,
				zipCode:$scope.zipCode
			}
		}).then(function(obj){
			var data=obj.data;
			if (data.msg == 'ok') {
				dailog.show('新增成功');
			}
		})
	}
}]);

app.controller('searchByName', ['$scope','searchByName','$rootScope','weixin', function($scope,searchByName,$rootScope,weixin){
	$scope.showList=false;
	$scope.noList=false;

	searchByName.rate().success(function(data){
		$rootScope.rate=data;
		$rootScope.rate.push({name:'RMB',rate:100})
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
				if (data.distributors.length<3) {
					var num = 3 - data.distributors.length;
					Array.prototype.push.apply(data.distributors,data.icKeys.slice(0,num));
				}
				$scope.list=searchByName.changePrice(data.distributors);
			}
			console.log($scope.list);		
		});
	};

	$scope.concat=function(){
		var openId=weixin.getUserInfo().openId;
		searchByName.concat({openId:openId});
		location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3MTY2NjIwNg==&scene=124#wechat_redirect';
		
	}

	$scope.addToCart=function(firstKey,secondKey){	
		var data = $scope.list[firstKey].parts[secondKey];
		data.name=$scope.list[firstKey].name;
		data.shopName=$scope.searchName;
		data.singlePrice=data.prices[0].changePrice;
		data.selected=false;
		var cart=weixin.getUserInfo().cart;

		var hasShop=$scope.hasShop(data.maker,data.name);
		if (hasShop.msg) {
			cart[hasShop.index].num++;		
		}else{
			data.num=1;
			cart.push(data);
		}
		weixin.setUserInfo('cart',cart);
	}

	$scope.hasShop=function(maker,name){
		for (var i = 0; i < weixin.getUserInfo().cart.length; i++) {
			if(weixin.getUserInfo().cart[i].maker == maker && weixin.getUserInfo().cart[i].name == name){
				return {msg:true,index:i};
			}
		}
		return {msg:false};
	}

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

app.controller('contact', ['$scope','contact','weixin', function($scope,contact,weixin){
	$scope.success=false;
	$scope.submit=function(){
		contact.submit({
			openId:weixin.getUserInfo().openId,
			phone:$scope.tel
		}).then(function(obj){
			if (obj.data.msg == 'ok') {
				$scope.success=true;
			}else{
				$scope.success=false;
			}
		},function(){
			$scope.success=false;
		})
	}
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
app.constant('appid', 'wx72b8722be094d273');
app.constant('host', 'https://chip.jymao.com');

app.factory('dailog', ['$state', function($state) {
    return {
        show:function(msg){
            var log=document.querySelector('.message');
            var p=document.querySelector('.message p');
            log.style.display='block';
            if(msg) p.innerText=msg;
        },
        hide:function(url){
            var log=document.querySelector('.message');
            log.style.display='none';
            url && $state.go(url);
        },
    }

}])

app.factory('weixin', ['appid', 'host','$http', function(appid, host,$http) {
    return {
        config: {
            url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect',
        },
        isweixin: function() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getUser: function(code) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", host + "/wx/code", false);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data=JSON.parse(xhr.responseText);
                        data.cart=[];
                        localStorage.setItem('MY_USER_INFO', JSON.stringify(data));
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.onerror = function(e) {
                console.error(xhr.statusText);
            };
            xhr.send('code='+code);
        },
        getUserInfo: function() {
            if (localStorage.getItem('MY_USER_INFO') != null) {
                return JSON.parse(localStorage.getItem('MY_USER_INFO'));
            } else {
                if (this.getQueryString('code') != null) {
                    this.getUser(this.getQueryString('code'));
                    return JSON.parse(localStorage.getItem('MY_USER_INFO'));
                } else {
                    window.location.href = this.config.url;
                }
            }
        },
        setUserInfo:function(name,value){
            var info=this.getUserInfo();
            info[name]=value;
            localStorage.setItem('MY_USER_INFO', JSON.stringify(info));
        },
        getAddr: function(openId) {
            return $http.get(host + "/ds/g/WxUser?condition[openId]="+openId);
        }
    }
}])

app.factory('swipe', [function() {
    return function() {
        setTimeout(function() {
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                pagination: '.swiper-pagination',
            });
        }, 10);
    };
}]);

app.factory('cart', [function() {
    return {
        totalPrice:function(data){
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].selected) sum += parseFloat(data[i].singlePrice);
            }
            return sum;
        },
        totalNum:function(data){
            var sum = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].selected) sum += data[i].num;
            }
            return sum;
        },
        findSelected:function(data){
            var sum=[];
            for (var i = 0; i < data.length; i++) {
                if(data[i].selected){
                    sum.push(data[i]);
                }
            }
            return sum;
        }      
    };
}]);

app.factory('searchByName', ['$http', 'host','$filter', function($http, host,$filter) {
    return {
        search: function(option) {
            return $http.get(host + "/ds/search-price", { params: option });
        },
        rate: function(option) {
            return $http.get(host + "/ds/g/Exchange", { params: option });
        },
        concat:function(option){
            return $http({
                method:'post',
                data:option,
                url:host + '/wx/contact-kf'
            })
        },
        changePrice:function(data){
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].parts.length; j++) {
                    for (var k = 0; k < data[i].parts[j].prices.length; k++) {
                        data[i].parts[j].prices[k].changePrice=$filter('changRate')(data[i].parts[j].prices[k].price,data[i].parts[j].prices[k].currency); 
                        if (k==0) {
                            data[i].parts[j].prices[k].selected=true;
                        }else{
                            data[i].parts[j].prices[k].selected=false;
                        }                 
                    }
                }
            }
            return data;
        }
    };
}]);

app.factory('searchPdf', ['$http', 'host', function($http, host) {
    return {
        search: function(option) {
            return $http.get(host + "/ds/search-pdf", { params: option });
        },
        concat:function(option){
            return $http({
                method:'post',
                data:option,
                url:host + '/wx/contact-kf'
            })
        }
    };
}]);

app.factory('contact', ['$http', 'host', function($http, host) {
    return {
        submit: function(option) {
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/wx-user/phone'
            })
        }
    };
}]);

app.factory('address_add', ['$http', 'host', function($http, host) {
    return {
        submit: function(option) {
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/wx-user/receive-addr'
            })
        }
    };
}]);

app.factory('checkOrder', ['$http', 'host', function($http, host) {
    return {
        addOrder: function(option) {
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/order'
            })
        }
    };
}]);

app.factory('order', ['$http', 'host', function($http, host) {
    return {
        getOrdersById: function(openId) {
            return $http.get(host + "/ds/g/Order?condition[ownerOpenId]="+openId);
        },
        getOrders:function(){
            return $http.get(host + "/ds/g/Order");
        },
        expressed:function(option){
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/order/expressed'
            })
        }
    };
}]);



/*
https://chip.jymao.com/#/search-by-name
*/

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

localStorage.setItem('MY_USER_INFO', '{"openId":"oHqoBw4UjbflLS0G3S_IceUPznwU","name":"心向远方","sex":1,"city":"","province":"","country":"","cart":[]}');
localStorage.getItem('MY_USER_INFO')

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
接口:
POST /wx/code 
{
code:*******
}

返回:
{"name":****,"sex":*,"city":***,"province":***,"country":***, openId:*****}
*/

/*
接口: 联系客服 
POST /wx/contact-kf
{
    openId:***** (用户的openId, 如果为空, 会自动取该用户最近授权时获得的openId
}

调用此接口后, 需关闭网页; 此接口会在微信聊天框里自动绑定一个在线客服

*/

/*
接口: 添加/更新电话号码
POST /ds/wx-user/phone
{
openId:****,
phone:****
}
*/

/*
接口: 添加/更新地址
POST /ds/wx-user/receive-addr
{
openId:****,
receiveAddr:{
phone:***
name:****,
addr:****,
zipCode:****
}
}
*/

/*
获取微信用户信息:
GET /ds/g/WxUser?condition[openId]=***********
*/

/*
添加订单:
POST /ds/order
{
    buyer:{
        name:{type:"String"},
        phone:{type:"String"},
        addr:{type:"String"},
        zipCode:{type:"String"}
    },
    subOrders:[
        {
            partName:{type:"String"},
            qty:{type:"Number"},
            price:{type:"Number"}
        }
    ],
    totalPrice:{type:"Number"},
    ownerOpenId:...
}

*/
 /*
设置订单的快递信息(已付款订单才可以设置)
Post /ds/order/expressed
{
ownerOpenId:****,
orderId:*****,
express:{
    name:****,
    id:****
}
}
获取订单
GET /ds/g/Order?condition[ownerOpenId]=********
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
