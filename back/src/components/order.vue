<template>
    <div>
        <el-table :data="orders"
                  style="width: 100%">
            <el-table-column prop="orderId"
                             label="订单编号">
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
                    <span v-if="scope.row.status == 'not-paid'">未付款</span>
	                <span v-if="scope.row.status == 'paid'">已付款</span>
	                <span v-if="scope.row.status == 'expressed'">已发货</span>
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
        </el-table>
    </div>
</template>
<script>
export default{
    data(){
        return{
            orders:[],
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
                    self.getOrder();
                }
            })
        },
        getOrder(){
            let self=this;
            this.$http.get(this.$host+'/ds/g/Order').then( (obj) => {
                self.orders=obj.data;
                for(let i=0;i<self.orders.length;i++){
                    if(self.orders[i].status == 'paid'){
                        self.orders[i].express={name:'',id:''};
                    }
                }
            })
        },
        passApprove(index){
            let self=this;
            this.$http.post(this.$host+'/ds/order/approved',{
                ownerOpenId:self.orders[index].ownerOpenId,
                orderId:self.orders[index].orderId,
            }).then((obj)=>{
                this.getOrder();
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
        this.getOrder();
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
</style>

