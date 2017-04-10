<template>
    <div>
        <el-table :data="tableData"
                  style="width: 100%">
            <el-table-column prop="date"
                             label="id">
            </el-table-column>
            <el-table-column label="图片">
                <template scope="scope">
                    <img :src="scope.row.imgSrc">
                </template>
            </el-table-column>
            <el-table-column prop="address"
                             label="标题">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <span @click='changeItem(scope.$index)'
                          style="color:#FF4949;cursor:pointer">修改</span>
                    <span @click='deleteItem(scope.$index)'
                          style="color:#FF4949;cursor:pointer">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="100"
                           layout="prev, pager, next, jumper"
                           :total="1000">
            </el-pagination>
        </div>
        <el-dialog title="修改商品详情"
                   :modal-append-to-body="false"
                   v-model="dialog.changeDialog" top="5%">
            <v-editor :input-content="inputContent"
                      :upload-url="uploadUrl"
                      v-model="outputContent"></v-editor>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog.changeDialog = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    
    </div>
</template>
<script>
import Editor from '../components/Editor'
export default {
    components: {
        'v-editor': Editor
    },
    data() {
        return {
            dialog: {
                changeDialog: false,
            },
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                imgSrc: '../assets/logo.png'
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
            }],
            currentPage: 5,
            // input content to editor
            inputContent: '请输入你的内容',
            // output content from editor
            outputContent: '',
            // set image upload api url
            uploadUrl: '/api/v1/help/upload/wangEditorH5File'
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            console.log(`当前页: ${val}`);
        },
        changeItem(i) {
            this.dialog.changeDialog = true
        },
        deleteItem(i) {

        },
        submit() {
            dialog.changeDialog = false;
            console.log(this.outputContent)
        }
    }
}
</script>
<style lang='scss' scoped>
.page {
    position: relative;
    height: 50px;
    .el-pagination {
        position: absolute;
        display: inline-block;
        left: 50%;
        transform: translateX(-50%);
        margin: 10px 0 0;
    }
}
</style>

