// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import store from './store'
import './assets/css/reset.css'
import './assets/css/font-awesome.min.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import { Loading } from 'element-ui';

Vue.config.productionTip = false
Vue.config.debug = true

Vue.use(VueResource);
Vue.use(ElementUI);

Vue.prototype.$host='http://chip.jymao.com';

Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push( function(request, next){
	request.credentials = true;
    let load=this.$loading({
        lock:true
    });
	next( ( response ) => {
        load.close();
		return response;
	});
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
