<template>
    <div>
        <el-table :data="tableData"
                  style="width: 100%">
            <el-table-column prop="warp"
                             label="类名" width='140px'>
            </el-table-column>
            <el-table-column prop="contain"
                             label="包含分类">
            </el-table-column>
            <el-table-column label="操作"
                             width='80px'>
                <template scope="scope">
                    <span @click='dialog.changeDialog = true'>修改</span>
                    <span>删除</span>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="提示" :modal-append-to-body="false" :show-close='dialog.showClose' v-model="dialog.changeDialog">
            <div>
                <span>类名</span>
                <el-input placeholder='请输入类名' :disabled="true" :value='dialog.value'></el-input>
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button @click="dialog.changeDialog = false">取 消</el-button>
                <el-button type="primary" @click="dialog.changeDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialog:{
                changeDialog : false,
                value:'示例'
            },
            
            tableData: [
                {
                    warp: '王小虎',
                    contain: '上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄上海市普陀区金沙江路 1518 弄'
                },
                {
                    warp: '王小虎',
                    contain: '上海市普陀区金沙江路 1518 弄'
                },
                {
                    warp: '王小虎',
                    contain: '上海市普陀区金沙江路 1518 弄'
                }
            ]
        }
    }
}
</script>
<style lang='scss' scope>
.cell {
    span {
        color: #FF4949;
        cursor: pointer;
    }
}
</style>