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


