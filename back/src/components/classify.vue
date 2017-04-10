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
        <el-dialog title="修改分类" :modal-append-to-body="false" v-model="dialog.changeDialog">
            <div class="dialog-item clearfix">
                <span class="fl">类名：</span>
                <el-input class="fl" style="width:75%;" placeholder='请输入类名' :disabled="dialog.classAble" :value='dialog.class'></el-input>
            </div>
            <div class="dialog-item clearfix">
                <span class="fl">包含类名：</span>
                <div class="innerClass fl">
                    <div v-for="(val,i) in dialog.innerClass">
                        <el-input placeholder='请输入类名' :value='val'></el-input>
                        <i @click="removeClass(i)" class="el-icon-close"></i>
                    </div>   
                </div>                
            </div>
            <span slot="footer"
                class="dialog-footer">
                <el-button type='success' @click="addClass">增加类</el-button>
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
                classAble:true,
                changeDialog : false,
                class:'示例',
                innerClass:['1','2','3']
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
    },
    methods: {
        addClass(){
            this.dialog.innerClass.push('');
        },
        removeClass(i){
            this.dialog.innerClass.splice(i,1);
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
.dialog-item{
    margin-bottom:10px;
    span{
        line-height: 36px;
        padding-right:5px;
        width: 20%;
        text-align: right;
    }
    .innerClass{
        width:75%;
        .el-input{
            margin:0 5px 5px 0;
            width:90%;
        }
        i{
            color:#FF4949;
            cursor:pointer;
        }
    }
}
</style>