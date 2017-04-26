import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        username:sessionStorage.getItem('username'),
        showFix:false,
        bread:[{ name: '订单管理', path: '/user'}]
    },
    mutations: {
        setBread(state,value){
            state.bread=value;
        }
    }
})
