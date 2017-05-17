<template>
<div>
    <el-input placeholder="请输入部件名" icon="search" v-model="partName" :on-icon-click="searchPart"></el-input>
    <el-button @click.stop='getAllPart'>全部组件</el-button>
    <el-button @click.stop='addPart'>增加组件</el-button>
    <ul class="parts-ul">
        <li class="parts clearfix" v-for="(item,key) in resultPart">
            <p @click='showPart(key)'>
                <i class="el-icon-search"></i>
                {{item.name}}
                <el-button class="fr" type="warning" icon="edit" @click.stop='editPart(key)'></el-button>
                <el-button class="fr" type="danger" icon="delete" @click.stop='delPart(key)'></el-button>
                <i v-if='!item.showPart && item.icBuy.length!=0' class="el-icon-plus fr"></i>
                <i v-if='item.showPart && item.icBuy.length!=0' class="el-icon-minus fr"></i>
            </p>
            <div v-if='item.showPart'>
                <ul v-for="(val,index) in item.icBuy">
                    <li>
                        <p>
                            <i class="el-icon-menu"></i>
                            {{val.name}}
                        </p>
                        <el-table :data="val.parts" style="width: 100%">
                            <el-table-column prop="maker" label="生产厂商" width="180"></el-table-column>
                            <el-table-column label="价格" width="180">
                                <template scope="scope">
                                    <p v-for="(v1,i1) in scope.row.prices">{{v1.price}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="价格梯度">
                                <template scope="scope">
                                    <p v-for="(v1,i1) in scope.row.prices">{{v1.amount}}</p>
                                </template>
                            </el-table-column>
                        </el-table>
                    </li>
                </ul>
            </div>
        </li>
    </ul>
    <el-button-group>
        <el-button type="primary" icon="arrow-left" @click='prev'>上一页</el-button>
        <el-button type="primary" @click='next'>下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>

    <el-dialog title="修改信息" size='large' v-show="dialog">
        <el-form slot="title" v-if="dialog" label-position="right" label-width="80px" :model="changeFrom">
            <p>修改信息</p>
            <el-form-item label="部件名">
                <el-input readonly v-if="isEdit" v-model="changeFrom.name"></el-input>
                <el-input v-if="!isEdit" @focus='hasPart=false' @blur='validName' v-model="changeFrom.name"></el-input>
                <span v-if="hasPart" class="error">部件已存在</span>
            </el-form-item>

            <p class="twoName">
                分销商
                <el-button @click='addFXS()' type="success">增加分销商</el-button>
            </p>
            <div class="FXS" v-for="(item,key) in changeFrom.icBuy">
                <p class="shopName">
                    分销商：<el-input v-model="item.name" style="width:20%;display:inline-block;"></el-input>
                    <el-button @click='addMaker(key)' type="success">增加厂商</el-button>
                    <el-button @click='delFXS(key)' type="danger">删除分销商</el-button>
                </p>
                
                <el-table :data='item.parts'>                 
                    <el-table-column label="价格">
                        <template scope="scope">
                            <el-input v-model="i.price" v-for="(i,k) in scope.row.prices"></el-input>
                        </template>
                    </el-table-column>                 
                    <el-table-column label="价格梯度">
                        <template scope="scope">
                            <el-input v-model="i.amount" v-for="(i,k) in scope.row.prices"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120px">
                        <template scope="scope">
                            <el-button v-for="(i,k) in scope.row.prices" @click='delPrice(key,scope.$index,k)' type="danger" :plain="true">删除梯度</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产厂商">
                        <template scope="scope">
                            <el-input class="fl" v-model="scope.row.maker" style="width:100%"></el-input>
                            <el-button class="fl" @click='addPrice(key,scope.$index)' type="success" style="width:45%">增加梯度</el-button>
                            <el-button class="fl" @click='delMaker(key,scope.$index)' type="danger" style="width:45%">删除厂商</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialog = false,hasPart=false">取 消</el-button>
            <el-button type="primary" @click="dealForm()">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
export default{
    data() {
        return {
            partName:'',
            resultPart:'',
            dialog:false,
            changeFrom:{},
            isEdit:true,
            hasPart:false
        }
    },
    mounted () {
        this.getAllPart();
        document.getElementsByClassName('el-input__inner')[0].addEventListener('keypress',(event)=>{
            if(event.keyCode=='13'){
                this.searchPart();
            }
        })
    },
    methods: {
        setParts(data){
            var self=this;
            data.forEach(function(element) {
                element.showPart=false;
            }, this);
            this.resultPart=data;
        },
        getAllPart(){
            this.$http.get(this.$host+'/ds/g/Part').then((obj)=>{
                this.setParts(obj.data);
            })
        },
        searchPart(){
            this.$http.get(this.$host+'/ds/g/Part?condition[name]='+this.partName.toUpperCase()).then((obj)=>{
                this.setParts(obj.data);
            })
        },
        showPart(i){
            this.resultPart[i].showPart=!this.resultPart[i].showPart;
        },
        editPart(i){
            this.dialog=true;
            this.isEdit=true;
            this.changeFrom=JSON.parse(JSON.stringify(this.resultPart[i]));
        },
        delPart(i){
            this.$confirm('此操作将永久删除该组件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.delete(this.$host + '/ds/part',{body:{name:this.resultPart[i].name}}).then((obj)=>{
                    if(obj.data.msg='ok'){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.resultPart.splice(i,1);
                    }
                }) 
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });          
        },
        addPart(){
            this.dialog=true;
            this.changeFrom={
                name:'',
                icBuy:[{
                    name: 'ic购商城',
                    parts:[
                        {
                            "currency":"RMB",
                            "prices":[
                                {"currency":"RMB","price":"","amount":"1"}
                            ],
                            "maker":"",
                        }
                    ]
                }]
            }
            this.isEdit=false;
        },
        addMaker(i){
            this.changeFrom.icBuy[i].parts.push({
                "currency":"RMB",
                "prices":[
                    {"currency":"RMB","price":"","amount":""}
                ],
                "maker":"",
            })
        },
        delMaker(i,j){
            this.changeFrom.icBuy[i].parts.splice(j,1)
        },
        addPrice(i,j){
            this.changeFrom.icBuy[i].parts[j].prices.push({
                "currency":"RMB","price":"","amount":""
            })
        },
        delPrice(i,j,k){
            this.changeFrom.icBuy[i].parts[j].prices.splice(k,1);
        },
        addFXS(){
            this.changeFrom.icBuy.push({
                name: 'ic购商城',
                parts:[
                    {
                        "currency":"RMB",
                        "prices":[
                            {"currency":"RMB","price":"","amount":"1"}
                        ],
                        "maker":"",
                    }
                ]
            })
        },
        delFXS(i){
            this.changeFrom.icBuy.splice(i,1);
        },
        dealForm(){
            this.$http.post(this.$host+'/ds/part',this.changeFrom).then((obj)=>{
                if(obj.data.msg=='ok'){
                    this.$notify({
                        title: '成功',
                        message: '信息修改成功',
                        type: 'success'
                    });
                    this.getAllPart();
                    this.dialog=false;
                }
            })
        },
        prev(){
            var s=parseInt(this.resultPart[0].createdAt.slice(17,19))+1;
            s=this.changeS(s);
            var createdAt = this.resultPart[0].createdAt.slice(0,17) + s + this.resultPart[0].createdAt.slice(19);

            var url = this.$host + '/ds/g/Part?newerThan='+createdAt;
            if(this.partName)   url += this.partName.toUpperCase();
            
            this.$http.get(url).then((obj)=>{
                if(obj.data.length>0){
                    this.setParts(obj.data);
                }else{                    
                    this.$message.error('没有更多内容了'); 
                } 
            })
        },
        next(){
            var s=parseInt(this.resultPart[this.resultPart.length-1].createdAt.slice(17,19))+1;
            s=this.changeS(s);
            var createdAt = this.resultPart[this.resultPart.length-1].createdAt.slice(0,17) + s + this.resultPart[0].createdAt.slice(19);

            var url = this.$host + '/ds/g/Part?olderThan='+createdAt;
            if(this.partName)   url += this.partName.toUpperCase();
            
            this.$http.get(url).then((obj)=>{
                if(obj.data.length>0){
                    this.setParts(obj.data);
                }else{                    
                    this.$message.error('没有更多内容了'); 
                } 
            })
        },
        changeS(s){
            if(s>=0 && s<10){
                s='0'+s;
            }
            return s;
        },
        validName(){
            this.hasPart=false;
            this.$http.get(this.$host+'/ds/g/Part?condition[name]='+this.changeFrom.name.toUpperCase().trim()).then((obj)=>{
                if(obj.data.length!=0){
                    this.hasPart=true;
                    this.changeFrom=obj.data[0];
                }
            })
        }
    }
}
</script>
<style lang='scss' scoped>
.el-input{
    width: 50%;
    display: block;
    margin: 0 auto;
}
.parts-ul{
    margin-top:10px;
}
.parts{
    margin-right: 10px;
    font-size: 16px;
    line-height: 35px;
    padding:5px 10px;
    border-bottom: 1px solid #ccc;
    .el-button--warning{
        margin-left: 5px;
    }
    p{
        cursor:pointer;
    }    
    i{
        line-height: 35px;
    }
    ul{
        padding-left: 10px;
        margin-bottom: 10px;
    }
}
.el-form {
    p{
        font-size: 25px;
        line-height: 60px;
        text-align: center;
    }
    span{
        font-size: 16px;
    }
    .twoName{
        font-size: 18px;
        line-height: 30px;
    }
    .shopName{
        text-align: left;
        font-size: 16px;
        line-height: 30px;
    }
    .el-input{
        width:100%;
        margin:3px 0;
    }
    .el-button{
        margin:3px 3px;
    }
    .error{
        color:#ff4949;
    }
}

.FXS{
    border:1px solid #13ce66;
    border-radius: 5px;
    margin: 30px 5px;
    padding: 10px;
}
.FXS:nth-child(odd){
    border:1px solid #ff4949;
}

.el-button-group{
    position:relative;
    left:50%;
    transform:translateX(-50%);
    margin-top:20px;
}
</style>
