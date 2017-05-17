<template>
    <div>
        <div class="home-head clearfix">
            <router-link to='/order' class="home-title">后台管理</router-link>
            <div class="home-user pull-right">
                <span v-text="username"></span>
                <span style="cursor:pointer" @click='logOut' class="home-login">退出系统</span>
                <router-link to="/login/update"
                             class="home-login">修改密码</router-link>
            </div>
        </div>
        <div class="leftnav clearfix">
            <h2 v-for="(n,i) in nav" @click='change(i)'>
                <router-link :to='n.path'>{{n.name}}</router-link>
            </h2>
        </div>
        <div class="content">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item @click.native='change(0)' :to="{ path: '/order' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(val,key) in bread" :to='val.path'>{{val.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div>
                <router-view></router-view>
            </div>
        </div>
        <div class="fix" v-if='showFix'>
            <i class="el-icon-loading"></i>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import router from '../router'
export default {
    name: 'hello',
    data() {
        return {
            nav: [
                { name: '订单管理', path: 'order'},
                { name: '用户管理', path: 'user'},
                { name: '手机号码', path: 'concat'},
                { name: '部件管理', path: 'part'}
            ],
        }
    },
    computed: mapState({
        bread: 'bread',
        username: 'username',
        showFix: 'showFix',
    }),
    methods: {
        //改变面包屑
        change(i) {
            let bread = [this.nav[i]];
            this.$store.commit('setBread', bread);
        },
        logOut(){            
            this.$http.post(this.$host+'/ds/logout').then((obj)=>{
                sessionStorage.removeItem('username');
                router.push('/login/log')
            })            
        }
    },
    mounted () {
        if(this.$route.path == '/'){
            router.replace('order');
        }
        if(!sessionStorage.getItem('username')){
            router.replace('/login/log')
        }
    }
}
</script>

<style lang='scss' scoped>
$fontColor:#fff;
$background:#1c2b36;
.content{
    padding-bottom: 20px;
}
.leftnav {
    background: $background;
    width: 15%;
    position: fixed;
    left:0;
    bottom:0;
    top:60px;
    h2{
        height:50px;

    }
    a {
        width: 100%;
        display: block;
        color: $fontColor;
        float: left;
        font-size: 16px;
        line-height: 50px;
        text-align: center;
        text-decoration: none;
        &:hover,&.router-link-active{
            background: #fff;
            color: #333;
        }
    }
}

.head-r {
    span {
        color: $fontColor;
    }
}
.content{
    padding-left:16%; 
    padding-top: 60px;
    .el-breadcrumb{
        font-size: 17px;
        line-height: 50px;
    }
}

.home-head {
    background: $background;
    font-size: 30px;
    width: 100%;
    line-height: 60px;
    height: 60px;
    color: #fff;
    padding: 0 15px 0 30px;
    position: fixed;
    top:0;
    z-index: 99;
}

.home-head a {
    text-decoration: none;
    color: #fff;
}

.home-head .home-title {
    font-weight: bold;
}

.home-user {
    font-size: 16px;
}

.home-login {
    float: right;
    margin-left: 20px;
}

.home-navContent {
    padding-top: 60px;
}

.home-nav {
    background: #1c2b36;
    position: fixed;
    top: 60px;
    left: 0;
    height: 100%;
    color: #fff;
}
.fix{
    position: fixed;
    left:0;
    right:0;
    top:0;
    bottom:0;
    background: rgba(30, 30, 30, 0.3);
    z-index: 100;
    i{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        color:#fff;
        font-size:30px;
    }
}
</style>
