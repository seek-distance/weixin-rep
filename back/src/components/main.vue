<template>
    <div>
        <div class="home-head clearfix">
            <router-link to='/' class="home-title">后台管理</router-link>
            <div class="home-user pull-right">
                <span v-text="username"></span>
                <router-link to='login'
                             class="home-login">退出系统</router-link>
                <router-link to='login'
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
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="val in bread" :to='val.path'>{{val.name}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div>
                <router-view></router-view>
            </div>
        </div>
        
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'hello',
    data() {
        return {
            nav: [
                { name: '用户管理', path: '/' },
                { name: '商品管理', path: 'shop' },
                { name: '分类管理', path: 'classify' }
            ]
        }
    },
    computed: mapState({
        bread: 'bread',
        username: 'username'
    }),
    methods: {
        //改变面包屑
        change(i) {
            let bread = [this.nav[i]];
            this.$store.commit('setBread', bread);
        }
    },
    mounted() {
        var self = this;
        changeBread();

        function changeBread() {
            self.nav.forEach(function (ele, i) {
                if (ele.path == self.$route.path.slice(1)) {
                    self.change(i);
                    return;
                }
            });
            self.change(0);
        }

    }
}
</script>

<style lang='scss' scoped>
$fontColor:#fff;
$background:#1c2b36;
.leftnav {
    background: $background;
    width: 20%;
    position: absolute;
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
        &:hover{
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
    padding-left:21%; 
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
</style>
