<template>
    <div class="login-bg">
	<div class="login-box" v-show="!update">
		<form>
			<div class="login-username login-item clearfix">
				<span class="pull-left">用户名</span>
				<input class="pull-left" type="text" v-model="username">
			</div>		
			<div class="login-password login-item clearfix">
				<span class="pull-left">密码</span>
				<input class="pull-left" type="password" v-model="password">
			</div>
			<div class="login-error">
				<span v-show="!success" class="text-error">账号或密码错误</span>
			</div>
			<el-button @click="submit()" class="login-submit btn btn-info">登录</el-button>
		</form>		
	</div>
	<div class="update-box" v-show="update">
		<form>
			<div class="login-item clearfix">
				<span class="pull-left">原密码</span>
				<input class="pull-left" type="password" v-model="oldPwd">
			</div>
			<div class="login-item clearfix">
				<span class="pull-left">新密码</span>
				<input class="pull-left" type="password" v-model="newPwd">
			</div>
			<el-button style="display: block;margin:0 auto;width: 100px;height: 40px;" @click="updatePwd()" class="btn btn-info">修改</el-button>
		</form>		
	</div>
</div>
</template>
<script>
export default{
    data(){
        return{
            update:false,
            success:true,
            username:'',
            password:'',
            oldPwd:'',
            newPwd:'',
        }
    },
    methods: {
        submit(){
            var self=this;
            this.$http.post(this.$host+'/ds/login',{
                name:this.username,
                password:this.password
            }).then((obj)=>{
                var data=obj.data;
                if(data.msg=='login ok'){
                    self.success=true;
                    sessionStorage.setItem('username',self.username);
                    self.$store.state.username=self.username;
                    self.$router.push('/');
                }else{
                    self.success=false;
                }
            },()=>{
                self.success=false;
            })
        },
        updatePwd(){
            var self=this;
            this.$http.post(this.$host+'/ds/user/new-password',{
                newPwd:this.newPwd,
                oldPwd:this.oldPwd
            }).then((obj)=>{
                self.$router.push('/');
            },()=>{
                alert('原密码错误');
            })
        }
    },
    mounted () {
        if(this.$router.currentRoute.params.type=='update'){
            this.update=true;
        }
    }
}
</script>
<style scoped>
.login-bg{
	width: 100%;
	height: 100%;
	background: url('../assets/images/bg.jpg');
	background-size: cover;
	position: absolute;
}
.login-box,.update-box{
	height: 200px;
	width: 400px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	background: #fff;
	border-radius: 10px;
	padding-top: 30px;
}
.login-item{
	height: 45px;
}
.login-item span{
	width: 30%;
	text-align: right;
	padding-right: 20px;
}
.login-item input{
	width: 60%;
}
.login-box .login-submit{
	width: 100px;
	margin:0 auto;
	display: block;
}
.login-error{
	color: #f00;
	height: 30px;
	text-align: center;
}


</style>