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