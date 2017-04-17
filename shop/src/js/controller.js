app.controller('index', ['$scope','$location','appid','weixin','dailog','searchByName', function($scope,$location,appid,weixin,dailog,searchByName){
	/*if(!weixin.isweixin()){
		location.url='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3MTY2NjIwNg==&scene=124#wechat_redirect';
	}*/
	console.log(weixin.getUserInfo());
	$scope.closeFix=function(){
		dailog.hide();
	}
	$scope.concat=function(){
		var openId=weixin.getUserInfo().openId;
		searchByName.concat({openId:openId}).then(function(obj){
			dailog.hideLoad();
			if (obj.status == '200') {
				location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3MTY2NjIwNg==&scene=124#wechat_redirect';
			}
		});
	}
	weixin.config();
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

app.controller('order', ['$scope','order','weixin','$state','dailog', function($scope,order,weixin,$state,dailog){
	order.getOrdersById(weixin.getUserInfo().openId).then(function(obj){
		dailog.hideLoad();
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
			dailog.hideLoad();
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
			dailog.hideLoad();
			if (obj.data.msg=='ok') {
				dailog.show();
			}
		})
	}


	if ($rootScope.currentAddr) {
		$scope.address = $rootScope.currentAddr;
	}else{
		weixin.getAddr(weixin.getUserInfo().openId).then(function(obj){
			dailog.hideLoad();
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

app.controller('address', ['$scope','weixin','$rootScope','$state','dailog', function($scope,weixin,$rootScope,$state,dailog){
	var openId=weixin.getUserInfo().openId;

	weixin.getAddr(openId).then(function(obj){
		dailog.hideLoad();
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
			dailog.hideLoad();
			var data=obj.data;
			if (data.msg == 'ok') {
				dailog.show('新增成功');
			}
		})
	}
}]);

app.controller('searchByName', ['$scope','searchByName','$rootScope','weixin','dailog', function($scope,searchByName,$rootScope,weixin,dailog){
	$scope.showList=false;
	$scope.noList=false;

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
			if (!data.distributors || data.distributors.length == 0 && data.icKeys.length == 0) {
				$scope.showList = false;
				$scope.noList=true;
				return;
			}else{
				$scope.noList=false;
				$scope.showList = true;
				for (var i = 0; i < data.icKeys.length; i++) {
					if(data.icKeys[i].name=='云汉芯城'){
						data.icKeys[i].name='ic购商城';
						data.distributors.push(data.icKeys[i]);
					}
				}
				var key=0;
				while (data.distributors.length<3) {
					if (!data.icKeys[key])	break;
					if (!searchByName.hasItem(data.distributors,data.icKeys[key])) {
						data.distributors.push(data.icKeys[key]);
					}
					key++;							
				}
				console.log(data.distributors);
				$scope.list=searchByName.changePrice(data.distributors);
			}		
		});
	};

	$scope.addToCart=function(firstKey,secondKey){	
		var data = $scope.list[firstKey].parts[secondKey];
		data.name=$scope.list[firstKey].name;
		data.shopName=$scope.searchName;
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

}]);

app.controller('searchByPdf', ['$scope','searchPdf','dailog', function($scope,searchPdf,dailog){
	$scope.submit=function(){
		if (!$scope.searchPdf) {
			return;
		}
		searchPdf.search({part:encodeURIComponent($scope.searchPdf)}).success(function(data){
			dailog.hideLoad();
			if (data.msg=='not found') {
				$scope.showList = false;
				$scope.noList=true;
				return;
			}else{
				$scope.noList=false;
				$scope.showList = true;
				$scope.list=data.pdfs2;
			}
		});
	};
}]);

app.controller('contact', ['$scope','contact','weixin','dailog', function($scope,contact,weixin,dailog){
	$scope.success=false;
	$scope.submit=function(){
		contact.submit({
			openId:weixin.getUserInfo().openId,
			phone:$scope.tel
		}).then(function(obj){
			dailog.hideLoad();
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



