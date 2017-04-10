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