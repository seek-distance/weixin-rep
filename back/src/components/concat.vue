<template>
    <el-table :data="phoneData"
            style="width: 100%">
        <el-table-column prop="name"
                        label="微信昵称">
        </el-table-column>
        <el-table-column label="城市">
            <template scope="scope">
                <p>
                    <span>{{scope.row.province}}{{scope.row.city}}</span>
                </p>                
            </template>
        </el-table-column>
        <el-table-column label="性别">
            <template scope="scope">
                <span v-if="scope.row.sex==1">男</span>
                <span v-if="scope.row.sex==2">女</span>                
            </template>
        </el-table-column>
        <el-table-column prop="phone"
                        label="手机号码">
        </el-table-column>
    </el-table>
</template>
<script>
export default {
    data(){
        return {
            phoneData:[]
        }        
    },
    methods: {
        getPhone(){
            this.$http.get(this.$host+'/ds/g/WxUser').then(function(obj){
                this.phoneData=obj.data;

            })
        }
    },
    mounted () {
        this.getPhone();
    }
}
</script>
<style>

</style>
