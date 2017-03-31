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