<template>
    <div>
        <el-table :data="orders"
                  style="width: 100%">
            <el-table-column prop="orderId" label="订单编号">
            </el-table-column>
            <el-table-column label="下单时间" width='150px'>
                <template scope="scope">
                    <span v-text="scope.row.createdAt.slice(0,10)"></span>
                </template>
            </el-table-column>
            <el-table-column label="下单商品">
                <template scope="scope">
                    <div class="order-item" v-for="val in scope.row.subOrders">
                        <p v-text="val.partName"></p>
                        <span>X{{val.qty}}&nbsp;&nbsp;</span>
                        <span v-text="val.price"></span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="收货信息">
                <template scope="scope">
                    <span v-text="scope.row.buyer.addr"></span><br>
	                <span>{{scope.row.buyer.name}}&nbsp;&nbsp;&nbsp;</span>
                    <span v-text="scope.row.buyer.phone"></span>
                </template>
            </el-table-column>
            <el-table-column width='100px'
                             label="订单总价">
                <template scope="scope">
                    ￥<span>{{(scope.row.totalPrice/100).toFixed(2)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align='center'>
                <template scope="scope">
                    <div v-if="scope.row.status == 'not-approved'">
                        <p>待审核</p>
                        <el-button @click="passApprove(scope.$index)" class="btn btn-info">通过审核</el-button>
                    </div>
                    <span v-if="scope.row.status == 'cancelled'">已取消</span>
                    <span v-if="scope.row.status == 'not-paid'">未付款</span>
	                <span v-if="scope.row.status == 'paid'">已付款</span>
	                <span v-if="scope.row.status == 'expressed'">已发货</span>
                </template>
            </el-table-column>
            <el-table-column label="取消理由">
                <template scope="scope">
                    <div v-if="scope.row.status == 'cancelled'">
                        <p>{{scope.row.reason}}</p>
                    </div>
                    <div v-if="scope.row.status == 'not-paid' || scope.row.status == 'not-approved'">
                        <el-input placeholder='取消理由' v-model='scope.row.reason'></el-input>
                        <el-button @click="cancelOrder(scope.$index)" type='danger'>取消订单</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="物流信息">
                <template scope="scope">
                    <div v-if="scope.row.status == 'paid'">
                        <input class="express" v-model="scope.row.express.name" type="text" placeholder="物流公司">
                        <input class="express" v-model="scope.row.express.id" type="text" placeholder="物流单号">
                        <button class="submit" @click='write(scope.$index)'>提交</button>
                    </div>
                    <div v-if="scope.row.status == 'expressed'">
                        <p v-text="scope.row.express.name"></p>
                        <p v-text="scope.row.express.id"></p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button @click='changeOrder(scope.$index)' type='warning'>修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <div @click='getMore' class="more">更多....</div>

        <el-dialog title="修改信息" v-show="dialog">
            <el-form slot="title" v-if="dialog" :label-position="labelPosition" label-width="80px" :model="changeFrom">
                <p>修改信息</p>
                <el-form-item label="收货地址">
                    <el-input v-model="changeFrom.buyer.addr"></el-input>
                </el-form-item>
                <el-form-item label="收货人">
                    <el-input v-model="changeFrom.buyer.name"></el-input>
                </el-form-item>
                <el-form-item label="收货号码">
                    <el-input v-model="changeFrom.buyer.phone"></el-input>
                </el-form-item>
                <el-form-item label="订单总价">
                    <el-input v-model="changeFrom.totalPrice"></el-input>
                </el-form-item>
                <div v-for='(item,key) in changeFrom.subOrders'>
                    <span>{{item.partName}}</span>
                    <el-form-item label="数量">
                        <el-input v-model="item.qty"></el-input>
                    </el-form-item>
                    <el-form-item label="单价">
                        <el-input v-model="item.price"></el-input>
                    </el-form-item>
                </div>
                <div v-if="changeFrom.express">
                    <el-form-item label="快递公司">
                        <el-input v-model="changeFrom.express.name"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="changeFrom.express.id"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary" @click="change()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default{
    data(){
        return{
            orders:[],
            dialog:false,
            labelPosition: 'right',
            changeFrom: {}
        }
    },
    methods: {
        write(index){
            if(!this.orders[index].express.name || !this.orders[index].express.id ) return;
            let self=this;
            this.$http.post(this.$host+'/ds/order/expressed',{
                ownerOpenId:self.orders[index].ownerOpenId,
                orderId:self.orders[index]._id,
                express:{
                    name:self.orders[index].express.name,
                    id:self.orders[index].express.id
                }
            }).then((obj)=>{
                let data=obj.data;
                if(obj.data.msg=='ok'){
                    this.$notify({
                        title: '成功',
                        message: '物流填写成功',
                        type: 'success'
                    });
                    this.reloadOrder();
                }
            })
        },
        getOrder(olderThan){
            let self=this;
            let url = this.$host+'/ds/g/Order';
            if(olderThan)   url += '?olderThan='+olderThan;
            this.$http.get(url).then( (obj) => {
                for(let i=0;i<obj.data.length;i++){
                    if(obj.data[i].status == 'paid'){
                        obj.data[i].express={name:'',id:''};
                    }
                    if(obj.data[i].reason){
                        obj.data[i].reason='';
                    }
                }
                let order=[];
                if(self.orders.length!=0 && olderThan){
                    order=obj.data.slice(1);
                }else{
                    order=obj.data;
                } 
                if(order.length==0){
                    self.$notify({
                        title: '警告',
                        message: '没有更多订单了',
                        type: 'warning'
                    });
                }
                self.orders = self.orders.concat(order);
            })
        },
        reloadOrder(){
            var self=this;
            self.$http.get(this.$host+'/ds/g/Order').then( (obj) => {
                for(let i=0;i<obj.data.length;i++){
                    if(obj.data[i].status == 'paid'){
                        obj.data[i].express={name:'',id:''};
                    }
                    if(!obj.data[i].reason){
                        obj.data[i].reason='';
                    }
                }
                self.orders = obj.data;
            })
        },
        passApprove(index){
            let self=this;
            this.$http.post(this.$host+'/ds/order/approved',{
                ownerOpenId:self.orders[index].ownerOpenId,
                orderId:self.orders[index].orderId,
            }).then((obj)=>{
                self.reloadOrder();
            })
        },
        getMore(){
            let olderThan=this.orders[this.orders.length-1].createdAt;
            this.getOrder(olderThan);
        },
        changeOrder(i){
            this.changeFrom=JSON.parse(JSON.stringify(this.orders[i]));
            this.changeFrom.totalPrice=(this.changeFrom.totalPrice/100).toFixed(2);
            this.dialog=true;
        },
        change(){
            var self=this;
            this.changeFrom.totalPrice *= 100;
            this.$http.post(this.$host+'/ds/order',this.changeFrom).then((obj)=>{
                console.log(obj);
                this.dialog=false;
                self.reloadOrder();
            })            
        },
        cancelOrder(i){
            if(!this.orders[i].reason)  return;
            this.$http.post(this.$host + '/ds/order/cancel',{
                orderId:this.orders[i].orderId,
                ownerOpenId:this.orders[i].ownerOpenId,
                reason:this.orders[i].reason
            }).then((obj)=>{
                if(obj.data.msg='ok'){
                    this.$notify({
                        title: '取消成功',
                        message: '取消理由:'+this.orders[i].reason,
                        type: 'success'
                    });
                    this.reloadOrder();
                }
            })
            
        }
    },
    mounted () {
        let self=this;
        //改为已付款
        // this.$http.post(this.$host+'/ds/order/paid',{
        //     ownerOpenId:'oHqoBw4UjbflLS0G3S_IceUPznwU',
        //     orderId:'58ef99afa5d0092e76e6d054'
        // }).then((obj)=>{
        //     console.log(obj);
        // })
        this.reloadOrder();
    }
}
</script>
<style lang='scss' scoped>
    .order-item{
        border-bottom: 1px dashed #ccc;
    }
    .order-item:last-child{
        border-bottom: 0px dashed #ccc;
    }
    input.express{
        width: 100%;
        height: 25px;
        border: 1px solid #333;
        border-radius: 2px;
        margin-bottom: 3px;
    }
    button.submit{
        width: 100%;
        height: 25px;
        border: 0px solid #333;
        background:#333;
        border-radius: 3px;
        color:#fff;
        cursor: pointer;
    }
    .more{
        text-align: center;
        cursor:pointer;
        padding-top: 15px;
        line-height: 30px;
        font-size: 18px;
        color:#97a8be;
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
    }
    .cell{
        .el-button{
            margin: 5px 0
        }
    }
</style>

