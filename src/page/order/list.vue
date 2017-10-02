<template>
  <div class="order_list_page">
    <search
      @on-submit="onSubmit"
      v-model="searchText"
      :auto-fixed="false"
      placeholder="输入发货人姓名、地址、发货人单号搜索"
      ref="search"></search>

    <tab :line-width="1" v-model="tabIndex">
      <tab-item class="item" v-for="(item, index) in tabList" :key="index" @on-item-click="tabHandler">
        {{ item }}
      </tab-item>
      <tab-item v-if="!isDispatchOrders" @on-item-click="showCalendarPopup = true">
        <img src="../../assets/calendar.png" width="25" style="margin-top: 10px;">
      </tab-item>
    </tab>

    <div v-if="!isDispatchOrders" v-transfer-dom>
      <popup v-model="showCalendarPopup" position="left" width="87%" class="order_list_page_calendar_popup">
        <div class="form">
          <span @click.self="setSearchDate(0)">{{startDate || '选择开始日期'}}</span>&nbsp;-&nbsp;
          <span @click.self="setSearchDate(1)">{{endDate || '选择结束日期'}}</span>
        </div>
        <x-button @click.native="searchByDate" type="primary" :disabled="!startDate || !endDate">确定</x-button>
        <inline-calendar
          v-show="showCalendar"
          v-model="searchDate"
          :weeks-list="weeksList"
          :replace-text-list="replaceTextList"
          @on-change="onCalendarChange">
        </inline-calendar>
      </popup>
    </div>

    <template v-if="orders && orders.length">
      <div class="head">
        <span class="count">一共{{ orders.length }}单</span>
        <span class="link" @click="goNewOrderPage">+创建新单</span>
      </div>
      <scroller lock-x height="-170" :bounce="false" ref="scrollerEvent" class="order_list">
        <div>
          <order-item v-for="order in orders" :key="order.id" :order="order"
                      :needOperator="isDispatchOrders" @on-item-click="linkTo">
          </order-item>
        </div>
      </scroller>
    </template>
    <div class="not_result" v-else>
      <img src="../../assets/empty_order.png" width="120px">
      <div>您还没有订单哦，先去创建吧！</div>
      <x-button style="width: 60%" @click.native="goNewOrderPage" type="primary">+创建新单</x-button>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {Search, Tab, TabItem, Scroller, XInput, XButton, TransferDom, Popup, InlineCalendar} from 'vux'
  import {Input} from 'element-ui'
  import OrderItem from '../../components/order-item'
  import Toolbar from '../../components/toolbar'
  import API from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    directives: {TransferDom},
    components: {Search, Tab, TabItem, Scroller, Input, XInput, XButton, Popup, InlineCalendar, OrderItem, Toolbar},
    data () {
      return {
        tabList: ['全部', '前一周', '昨天', '今天', '明天', '后一周'],
        weeksList: ['日', '一', '二', '三', '四', '五', '六'],
        replaceTextList: {'TODAY': '今'},
        isDispatchOrders: !!this.$route.query.title,
        showCalendarPopup: false,
        showCalendar: false,
        startDate: '',
        endDate: '',
        searchDate: '',
        searchDateIndex: 0,
        showSync: true,
        searchText: '',
        statuses: [],
        tabIndex: 0,
        orders: []
      }
    },
    created(){
      if (this.isDispatchOrders) {
        this.statuses = ['created'];
        this.tabIndex = this.$store.state.dispatchOrdersTabIndex;
      } else {
        this.tabIndex = this.$store.state.allOrdersTabIndex;
      }
    },
    mounted(){
      this.resetScroller();
      this.fetchOrderList();
    },
    beforeDestroy(){
      if (this.isDispatchOrders) {
        this.SAVE_DISPATCH_ORDERS_TAB_INDEX(this.tabIndex);
      } else {
        this.SAVE_ALL_ORDERS_TAB_INDEX(this.tabIndex);
      }
    },
    methods: {
      ...mapMutations([
        'CLEAR_ORDER_DATA',
        'SAVE_ALL_ORDERS_TAB_INDEX',
        'SAVE_DISPATCH_ORDERS_TAB_INDEX'
      ]),
      onSubmit(){
        this.$refs.search.cancel();
        this.$refs.search.setBlur();
        this.tabIndex = 0;
        this.fetchOrderList({search_text: this.searchText});
        this.searchText = '';
      },
      searchByDate(){
        if (this.startDate && this.endDate) {
          this.showCalendarPopup = false;
          this.fetchOrderList({send_time_start: this.startDate, send_time_end: this.endDate});
          this.startDate = '';
          this.endDate = '';
        }
      },
      tabHandler(){
        this.fetchOrderList();
      },
      setSearchDate(index){
        this.searchDateIndex = index;
        this.showCalendar = true;
      },
      onCalendarChange(val){
        if (this.searchDateIndex == 0) {
          this.startDate = val;
        } else {
          this.endDate = val;
        }
        this.showCalendar = false;
      },
      linkTo(order){
        let linkUrl = '/order/show';
        let query = {id: order.id};
        if (this.isDispatchOrders) {
          linkUrl = '/order/transport_requirement';
//          query.title = true;
        }
        this.$router.push({path: linkUrl, query: query});
      },
      goNewOrderPage(){
        this.CLEAR_ORDER_DATA();
        this.$router.push({path: '/order/edit'});
      },
      resetScroller(){
        if (!this.$refs.scrollerEvent || !this.$refs.scrollerEvent.reset) {
          return;
        }
        this.$nextTick(_ => this.$refs.scrollerEvent.reset({top: 0}));
      },
      fetchOrderList(params = {}){
        API.fetchOrders(Object.assign({statuses: this.statuses, tab_index: this.tabIndex}, params))
        .then(res => {
          this.orders = res.orders || this.orders;
          this.resetScroller();
        }, showToast.bind(this));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_list_page {
    font-size: 16px;

    .item {
      font-size: 14px;
    }
    .head {
      display: flex;
      padding: 5px 15px;
      align-items: center;
      background-color: @bg;

      .count {
        color: @gray;
        font-size: 12px;
        flex: 1;
        text-align: center;
        padding-left: 66px;
      }
      .link {
        color: @blue;
        font-size: 14px;
      }
    }
    .not_result {
      color: gray;
      text-align: center;
      padding: 20px 0;
      background-color: white;
    }
    .order_list {
      background-color: @bg;
      padding-bottom: 10px;
    }
  }

  .order_list_page_calendar_popup {
    div.form {
      display: flex;
      align-items: center;
      padding: 10px;
      span {
        flex: 1;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        background-color: white;
        text-align: center;
      }
    }
    button {
      width: 95%;
      margin-bottom: 20px;
    }
  }
</style>
