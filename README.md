#  ic购商城微信公众号

1. 该项目主要是完成一个分销商城，完成商城的基本交易功能。
2. 利用ng实现页面商城系统的开发，vue实现后台管理系统开发 
3. 利用gulp，vue-cli实现自动化开发。
4. 实现本地购物车信息的保存。
难点：利用本地存储实现信息保存，每次改变数据都要进行一次保存，包括选择，取消商品等。而且需要对后台获取到价格进行转换。
解决方案：封装保存函数多次复用，实现本地操作与本地信息同步。解读json结构，进行数据转换。
5. 实现微信授权，微信支付，jsapi使用
