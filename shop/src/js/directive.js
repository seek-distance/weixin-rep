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
