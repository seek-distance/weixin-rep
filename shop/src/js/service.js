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