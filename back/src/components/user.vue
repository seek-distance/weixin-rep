<template>
    <div>
        <div class="reg">
            <input v-model="name" id="name" type="text" placeholder="用户名">
            <el-button @click="reg()">增加用户</el-button>
        </div>
        
        <el-table :data="userData"
                style="width: 100%">
            <el-table-column prop="name"
                            label="用户名">
            </el-table-column>
            <el-table-column prop="defaultPassword"
                            label="默认密码">
            </el-table-column>
            <el-table-column label="角色">
                <template scope="scope">
                    <span v-if="scope.row.role=='admin'">管理员</span>
                    <span v-if="scope.row.role!='admin'">普通用户</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <p @click="deleteUser(scope.$index)" style="color:#FF4949;cursor:pointer">删除</p>
                </template>
            </el-table-column>
        </el-table>
    </div>  
</template>

<script>
export default {
    data() {
        return {
            userData: [],
            name:'',
            isAdmin:false
        }
    },
    methods: {
        getUser(){
            let self=this;
            this.$http.get(this.$host+'/ds/g/User').then((obj)=>{
                self.userData=obj.data
            })
        },
        deleteUser(index){
            var self=this;
            console.log(self.userData[index].name)
            var isdel=confirm("是否删除该用户");
            if(isdel){
                this.$http.delete(this.$host+'/ds/user',{
                    body:{name:self.userData[index].name}                    
                }).then((obj)=>{
                    self.getUser();
                })
            }
        },
        reg(){
            let self=this;
            let data={name:this.name,role:'admin'};
            if(this.name==''){
                document.getElementById("name").focus();
            }
            this.$http.post(this.$host+'/ds/user',data).then((obj)=>{
                self.getUser();
                self.name='';
                self.isAdmin=false;
            })
        }
    },
    mounted () {
        this.getUser();
    }
}
</script>
<style scoped lang='scss'>
    .reg{
        >input{
            height:35px;
        }
        margin-bottom: 10px;
    }
</style>
