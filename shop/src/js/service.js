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
