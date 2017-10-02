<template>
  <div class="order_list_page">
    <template v-if="orders && orders.length">
      <div class="count">一共{{ orders.length }}单</div>
      <scroller lock-x height="-80" :bounce="false" ref="scrollerEvent" class="order_list">
        <div>
          <order-item v-for="order in orders" :key="order.id" :order="order"
                      @on-item-click="linkTo" @on-operator-click="orderOperator"></order-item>
        </div>
      </scroller>
    </template>
    <div v-else class="not_result">
      <img src="../../assets/empty_order.png" width="120px">
      <div>您还没有在途订单</div>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {Scroller, XButton} from 'vux'
  import OrderItem from '../../components/order-item'
  import Toolbar from '../../components/toolbar'
  import API from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    components: {Scroller, XButton, OrderItem, Toolbar},
    data () {
      return {
        orders: [],
        statuses: ['delivering']
      }
    },
    mounted(){
      this.resetScroller();
      API.fetchOrders({statuses: this.statuses}).then(res => {
        this.orders = res.orders || this.orders;
        this.resetScroller();
      }, showToast.bind(this));
    },
    methods: {
      linkTo(order){
        this.$router.push({
          path: '/order/show_for_on_way',
          query: {id: order.id}
        });
      },
      orderOperator(order){
        this.$router.push({
          path: '/order/transport_requirement',
          query: {id: order.id}
        });
      },
      resetScroller(){
        if (!this.$refs.scrollerEvent || !this.$refs.scrollerEvent.reset) {
          return;
        }
        this.$nextTick(_ => this.$refs.scrollerEvent.reset({top: 0}));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_list_page {
    font-size: 16px;
    .not_result {
      color: gray;
      text-align: center;
      margin-top: 30px;
    }
    .count {
      color: @gray;
      font-size: 12px;
      text-align: center;
      padding: 5px;
      background-color: @bg;
    }
    .order_list {
      background-color: @bg;
      padding-bottom: 10px;
    }
  }

</style>
