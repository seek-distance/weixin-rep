import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        username:'admin',
        bread:[
            {name:'网站信息',path:'/'},
            {name:'基本设置',path:'/login'},
        ]
    },
    mutations: {
        setBread(state,value){
            state.bread=value;
        }
    }
})
