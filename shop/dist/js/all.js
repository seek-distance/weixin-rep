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
	$urlRouterProvider.otherwise('/search-by-name');
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
        cache:'false', 
		templateUrl:'dist/tpls/order.html',
		controller:'order'
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
	.state('address_change',{
		url:'/address_change?_id',
		templateUrl:'dist/tpls/address_change.html',
		controller:'address_change'
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


app.controller('index', ['$scope','$location','weixin','dailog','searchByName', function($scope,$location,weixin,dailog,searchByName){
	console.log(weixin.getUserInfo());
	$scope.closeFix=function(){
		dailog.hide();
	}
	$scope.concat=function(){
		var openId=weixin.getUserInfo().openId;
		searchByName.concat({openId:openId}).then(function(obj){
			dailog.hideLoad();
			if (obj.status == '200') {
                weixin.getMessage(weixin.getUserInfo().openId).success(function(data){
                    if(data[0].subscribe=="1"){
                        wx.closeWindow()
                    }else{
                        location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3MTY2NjIwNg==&scene=124#wechat_redirect';
                    }
                })
			}
		});
	}
}]);

app.controller('home', ['$scope', function($scope){
	
}]);

app.controller('cart', ['$scope','cart','weixin','$rootScope','$state','$timeout', function($scope,cart,weixin,$rootScope,$state,$timeout){
	$scope.shops=weixin.getUserInfo().cart;
	$scope.reload=function(){
		$scope.totalPrice = cart.totalPrice($scope.shops);
		$scope.totalNum=cart.totalNum($scope.shops);
		weixin.setUserInfo('cart',$scope.shops);
	}

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
    
    $scope.reload();
    for(var i=0;i<$scope.shops.length;i++){
        $scope.changeNum(i);
    }
}]);

app.controller('order', ['$scope','order','weixin','$state','dailog', function($scope,order,weixin,$state,dailog){
    weixin.config();
	order.getOrdersById(weixin.getUserInfo().openId).then(function(obj){
		dailog.hideLoad();
		$scope.orders=obj.data;		
	})
	$scope.current=false;    
	$scope.showCurrent=function(key){
        $scope.scrollTop=document.body.scrollTop;
		$scope.currentShop = $scope.orders[key];
		$scope.current=true;
	};
	$scope.hideCurrent=function(){
		setTimeout(function(){
			$scope.current=false;
			$scope.$apply();
            document.body.scrollTop=$scope.scrollTop;
		},300)		
	}
	$scope.goback=function(){
		$state.go(-1);
	}
    $scope.pay=function(orderId,e){
        e.stopPropagation();
        weixin.pay(orderId);
    }
}]);

app.controller('checkOrder', ['$scope','$rootScope','weixin','dailog','checkOrder','cart','$state', function($scope,$rootScope,weixin,dailog,checkOrder,cart,$state){
    weixin.config();
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
		    totalPrice:$scope.shopTotalPrice*100,
		    ownerOpenId:weixin.getUserInfo().openId,
            descr:subOrders[0].partName
		}).then(function(obj){
			dailog.hideLoad();
            cart.removeSelected();
            $state.go('order');
		})
	}


	if ($rootScope.currentAddr) {
		$scope.address = $rootScope.currentAddr;
	}else{
		weixin.getMessage(weixin.getUserInfo().openId).then(function(obj){
			dailog.hideLoad();
			$rootScope.AllAddr = obj.data[0].receiveAddrs;
			$scope.address = $rootScope.AllAddr[0];
		})
	}
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

app.controller('address', ['$scope','weixin','$rootScope','$state','dailog', function($scope,weixin,$rootScope,$state,dailog){
	var openId=weixin.getUserInfo().openId;

	weixin.getMessage(openId).then(function(obj){
		dailog.hideLoad();
		$scope.address=obj.data[0].receiveAddrs;
		$rootScope.AllAddr = $scope.address;
	})

	$scope.changeAddress=function(index){
		$rootScope.currentAddr=$scope.address[index];
		$state.go('checkOrder');
		
	}
}]);

app.controller('address_add', ['$scope','address','weixin','dailog', function($scope,addressAdd,weixin,dailog){
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
			dailog.hideLoad();
			var data=obj.data;
			if (data.msg == 'ok') {
				dailog.show('新增成功');
			}
		})
	}
}]);

app.controller('address_change', ['$scope','weixin','dailog','$stateParams','address','$state', function($scope,weixin,dailog,$stateParams,address,$state){
	var openId=weixin.getUserInfo().openId;

	weixin.getMessage(openId).then(function(obj){
		dailog.hideLoad();
		for(var i=0;i<obj.data[0].receiveAddrs.length;i++){
            if(obj.data[0].receiveAddrs[i]._id==$stateParams._id){
                $scope.address=obj.data[0].receiveAddrs[i];
            }
        }
	})

    $scope.submit=function(){
		address.submit({
			openId:weixin.getUserInfo().openId,
			receiveAddr:{
                '_id':$stateParams._id,
				'phone':$scope.address.phone,
				'name':$scope.address.name,
				'addr':$scope.address.addr,
				'zipCode':$scope.address.zipCode
			}
		}).then(function(obj){
			dailog.hideLoad();
			var data=obj.data;
			if (data.msg == 'ok') {
				dailog.show('修改成功');
			}
		})
	}

    $scope.closeFix=function(){
		dailog.hide();
        $state.go('address');
	}

}]);

app.controller('searchByName', ['$scope','searchByName','$rootScope','weixin','dailog', function($scope,searchByName,$rootScope,weixin,dailog){
	$scope.showList=false;
	$scope.noList=false;
    $scope.lists=[];
    weixin.config();

	searchByName.rate().success(function(data){
		dailog.hideLoad();
		$rootScope.rate=data;
		$rootScope.rate.push({name:'RMB',rate:100})
	});

	$scope.submit=function(){
		if (!$scope.searchName) {
			return;
		}
		searchByName.search({part:encodeURIComponent($scope.searchName)}).success(function(data){
            dailog.hideLoad();
            $scope.lists=$scope.getLists(data);
            console.log($scope.lists)
		});
	};

	$scope.addToCart=function(index,firstKey,secondKey){
		var data = $scope.lists[index].list[firstKey].parts[secondKey];
		data.name=$scope.lists[index].list[firstKey].name;
		data.shopName=$scope.lists[index].oldName;
		data.singlePrice=data.prices[0].changePrice;
		data.selected=true;
		var cart=weixin.getUserInfo().cart;

		var hasShop=$scope.hasShop(data.maker,data.name);
		if (hasShop.msg) {
			cart[hasShop.index].num++;		
		}else{
			data.num=1;
			cart.push(data);
		}
		weixin.setUserInfo('cart',cart);
		setTimeout(function(){
			dailog.show();
		},300)		
	}

	$scope.hasShop=function(maker,name){
		for (var i = 0; i < weixin.getUserInfo().cart.length; i++) {
			if(weixin.getUserInfo().cart[i].maker == maker && weixin.getUserInfo().cart[i].name == name){
				return {msg:true,index:i};
			}
		}
		return {msg:false};
	}

    $scope.showItem=function(index){
        $scope.lists[index].show=!$scope.lists[index].show;
    }
    
    $scope.getLists=function(data){
        var lists=[];            
        var flag=false;
        if (data.msg=='not found') {
            $scope.showList = false;
            $scope.noList=true;
            return;
        }
        for(var j=0;j<data.length;j++){
            if (!data[j].distributors || data[j].distributors.length == 0 && data[j].icKeys.length == 0) {
                if(!flag){
                    $scope.showList = false;
                    $scope.noList=true;
                }                    
                continue;
            }else{
                flag=true;
                $scope.noList=false;
                $scope.showList = true;
                for (var i = 0; i < data[j].icKeys.length; i++) {
                    if(data[j].icKeys[i].name=='云汉芯城'){
                        data[j].icKeys[i].name='ic购商城';
                        data[j].distributors.splice(0,0,data[j].icKeys[i]);
                    }
                }
                var key=0;
                while (/*data[j].distributors.length<3*/data[j].icKeys[key]) {
                    if (!data[j].icKeys[key])	break;
                    if (!searchByName.hasItem(data[j].distributors,data[j].icKeys[key])) {
                        data[j].distributors.push(data[j].icKeys[key]);
                    }
                    key++;
                    /*if(key>10)  break;*/					
                }

                var oldName = data[j].name;
                var start = data[j].name.toUpperCase().indexOf($scope.searchName.toUpperCase());
                var end = start + $scope.searchName.length;
                var firstName = oldName.slice(0,start);
                var secondName = oldName.slice(start,end);
                var lastName = oldName.slice(end);

                var item={
                    list:searchByName.changePrice(data[j].distributors),
                    name:[firstName,secondName,lastName],
                    oldName:oldName
                };
                lists.push(item);
            }
        }
        return lists;
    }

}]);

app.controller('searchByPdf', ['$scope','searchPdf','dailog','weixin', function($scope,searchPdf,dailog,weixin){
    $scope.lists=[];
    weixin.config();

	$scope.submit=function(){
		if (!$scope.searchPdf) {
			return;
		}
		searchPdf.search({part:encodeURIComponent($scope.searchPdf)}).success(function(data){
            $scope.lists=[];
			dailog.hideLoad();
            if (data.msg=='not found') {
                $scope.showList = false;
                $scope.noList=true;
                return;
            }
            $scope.noList=false;
            $scope.showList = true;
            for(var i=0;i<data.length;i++){
                var item={
                    name:data[i].name,
                    list:data[i].pdfs2
                }
                $scope.lists.push(item);
            }
			
		});
	};
}]);

app.controller('contact', ['$scope','contact','weixin','dailog', function($scope,contact,weixin,dailog){
	$scope.submit=function(){
		contact.submit({
			openId:weixin.getUserInfo().openId,
			phone:$scope.tel
		}).then(function(obj){
			dailog.hideLoad();
			if (obj.data.msg == 'ok') {
				$scope.success=true;
                $scope.getPhone();
			}else{
				$scope.success=false;
			}
		},function(){
			$scope.success=false;
		})
	}
    $scope.getPhone=function(){
        weixin.getMessage(weixin.getUserInfo().openId).success(function(data){
            dailog.hideLoad();
            if(data[0].phone){
                $scope.phone=data[0].phone;
                $scope.hasPhone=true;
                $scope.placeholder="更新手机号码";
            }else{
                $scope.hasPhone=false;
                $scope.placeholder="请填写手机号码";
            }        
        })
    }
	$scope.success=false;
    $scope.getPhone();
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
app.constant('appId', 'wx72b8722be094d273');
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
        showLoad:function(){
            var load=document.querySelector('.load');
            load.style.display='block';
        },
        hideLoad:function(){
            var load=document.querySelector('.load');
            load.style.display='none';
        }
    }

}])

app.factory('weixin', ['appId', 'host','$http','dailog','$state','$timeout', function(appId, host,$http,dailog,$state,$timeout) {
    return {
        url: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(window.location.href) + '&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect',
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
                    window.location.href = this.url;
                }
            }
        },
        setUserInfo:function(name,value){
            var info=this.getUserInfo();
            info[name]=value;
            localStorage.setItem('MY_USER_INFO', JSON.stringify(info));
        },
        getMessage: function(openId) {
            dailog.showLoad();
            return $http.get(host + "/ds/g/WxUser?condition[openId]="+openId);
        },
        getNonceStr:function(){
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(36);
            });
        },
        getTs:function(){
            return Math.floor((new Date()).getTime()/100).toString();
        },
        config:function(){
            var noncestr=this.getNonceStr();
            var ts=this.getTs();
            //获取签名
            $http.get(host + "/wx/js-api-sign", 
                {
                    params: {
                        noncestr:noncestr,
                        ts:ts,
                        url:encodeURIComponent(location.href)
                    }
                }
            ).success(function(data){
                wx.config({
                    debug: false,
                    appId: appId, 
                    timestamp: ts,
                    nonceStr: noncestr,
                    signature: data.sign,
                    jsApiList: ['closeWindow','chooseWXPay']
                });
            })            
        },
        pay:function(orderId){
            var option={};
            this.getPayOption(orderId).success(function(data){
                option=data;
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                }else{
                    onBridgeReady();
                }
            })
            function onBridgeReady(){
                WeixinJSBridge.invoke('getBrandWCPayRequest', option, function(res){     
                    /*if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                        $state.go('order');
                        location.reload();
                    }else{
                        
                    }*/
                    $state.go('order');
                    $timeout(function(){
                        location.reload();
                    },300)                    
                })
            }
            
        },
        getPayOption:function(orderId){
            return $http.post(host+'/ds/order/wx-pay-order',{orderId:orderId})
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

app.factory('cart', ['weixin',function(weixin) {
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
        },
        removeSelected:function(){
            var shops=weixin.getUserInfo().cart;
            for(var i=shops.length-1;i>=0;i--){
                if(shops[i].selected){
                    shops.splice(i,1);
                }
            }
            weixin.setUserInfo('cart',shops);
        }  
    };
}]);

app.factory('searchByName', ['$http', 'host','$filter','dailog', function($http, host,$filter,dailog) {
    return {
        search: function(option) {
            dailog.showLoad();
            return $http.get(host + "/ds/search-price", { params: option });
        },
        rate: function(option) {
            return $http.get(host + "/ds/g/Exchange", { params: option });
        },
        concat:function(option){
            dailog.showLoad();
            return $http({
                method:'post',
                data:option,
                url:host + '/wx/contact-kf'
            })
        },
        changePrice:function(data){
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data[i].parts.length; j++) {
                    if(data[i].parts[j].stock){
                        data[i].parts[j].stock=parseInt(data[i].parts[j].stock);
                    }
                    if(data[i].parts[j].prices){
                        for (var k = 0; k < data[i].parts[j].prices.length; k++) {
                            data[i].parts[j].prices[k].changePrice=$filter('changRate')(data[i].parts[j].prices[k].price,data[i].parts[j].prices[k].currency); 
                            if (data[i].name=='ic购商城') {
                                data[i].parts[j].prices[k].changePrice = (data[i].parts[j].prices[k].changePrice * 0.95).toFixed(2);

                            }
                            if (k==0) {
                                data[i].parts[j].prices[k].selected=true;
                            }else{
                                data[i].parts[j].prices[k].selected=false;
                            }                 
                        }
                    }
                }
            }
            return data;
        },
        hasItem:function(value,hasValue){
            for (var i = 0; i < value.length; i++) {
                if(value[i].name.trim() == hasValue.name.trim()){
                    return true;
                }
            }
            return false;
        }
    };
}]);

app.factory('searchPdf', ['$http', 'host','dailog', function($http, host,dailog) {
    return {
        search: function(option) {
            dailog.showLoad();
            return $http.get(host + "/ds/search-pdf", { params: option });
        },
        concat:function(option){
            dailog.showLoad();
            return $http({
                method:'post',
                data:option,
                url:host + '/wx/contact-kf'
            })
        }
    };
}]);

app.factory('contact', ['$http', 'host','dailog', function($http, host,dailog) {
    return {
        submit: function(option) {
            dailog.showLoad();
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/wx-user/phone'
            })
        }
    };
}]);

app.factory('address', ['$http', 'host','dailog', function($http, host,dailog) {
    return {
        submit: function(option) {
            dailog.showLoad();
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/wx-user/receive-addr'
            })
        }
    };
}]);

app.factory('checkOrder', ['$http', 'host','dailog', function($http, host,dailog) {
    return {
        addOrder: function(option) {
            dailog.showLoad();
            return $http({
                method:'post',
                data:option,
                url:host + '/ds/order'
            })
        }
    };
}]);

app.factory('order', ['$http', 'host','dailog', function($http, host,dailog) {
    return {
        getOrdersById: function(openId) {
            dailog.showLoad();
            return $http.get(host + "/ds/g/Order?condition[ownerOpenId]="+openId);
        },
        getOrders:function(){
            dailog.showLoad();
            return $http.get(host + "/ds/g/Order");
        },
        expressed:function(option){
            dailog.showLoad();
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
接口: 添加地址
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
更新地址
POST chip.jymao.com/ds/wx-user/receive-addr
如果 receiveAddr里包含了一个 _id 参数, 那么 就会修改该_id对应的地址
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
    ownerOpenId:...,
    descr: 订单描述 (譬如部件名之类的信息)
}
返回一个 orderId:

POST /ds/order
如果里面有参数 orderId, 就用传入的信息 修改该order

*/

/*
POST /ds/order/wx-pay-order
传入 orderId
{
    "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
    "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
    "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
    "package":"prepay_id=u802345jgfjsdfgsdg888",     
    "signType":"MD5",         //微信签名方式：     
    "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
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
加了两个接口:
GET /ws/js-api-ticket
无参数

GET /wx/js-api-sign
参数:
noncestr
ts
url (这个得调用encodeURIComponent()
 */

/*给订单加了个新状态 not-approved
初始not-approved => not-paid => paid => expressed

新接口:
POST /ds/order/approved
{
orderId:***,
ownerOrderId:***
}
将订单状态设置为审核通过*/


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
