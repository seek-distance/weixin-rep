<template>
    <el-table :data="tableData"
              style="width: 100%">
        <el-table-column prop="date"
                         label="用户名">
        </el-table-column>
        <el-table-column prop="name"
                         label="默认密码">
        </el-table-column>
        <el-table-column prop="address"
                         label="角色">
        </el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
                <span style="color:#FF4949;cursor:pointer">删除</span>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    data() {
        return {
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    }
}
</script>