import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        username:'admin',
        showFix:false,
        bread:[{ name: '用户管理', path: '/user'}]
    },
    mutations: {
        setBread(state,value){
            state.bread=value;
        }
    }
})
