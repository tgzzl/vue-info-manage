<template>
  <div class="order_dispatch_info_new_page">
    <step :step="2"></step>
    <div class="share_link" @click="showDialog = true">分享订单给好友接单</div>
    <x-hr/>
    <dispatch-info-form :dispatch-info="dispatchInfo" :order-id="orderId" :order-status="order.status" action="new">
      <x-button slot plain @click.native="updateOrder">+加入我的在途</x-button>
    </dispatch-info-form>
    <group class="order-info-container" gutter="0" v-if="order.id">
      <cell title="订单信息" is-link :arrow-direction="showOrderInfo ? 'up' : 'down'"
            @click.native="toggleOrderInfo"></cell>
      <order-share class="order-body" v-show="showOrderInfo"
                   :order="order" :contacts="contacts" :charge="charge">
      </order-share>
    </group>
    <order-share-dialog v-model="showDialog" :order="order" :contacts="contacts" :charge="charge"></order-share-dialog>
  </div>
</template>

<script>
  import {XHr, XButton, Group, Cell} from 'vux'
  import Step from '../../components/step'
  import DispatchInfoForm from '../../components/dispatch-info-form'
  import OrderShare from '../../components/order-share'
  import OrderShareDialog from '../../components/order-share-dialog'
  import {dateFormat, showToast} from '../../util/utils'
  import {endpoint} from '../../config/env'
  import API from '../../config/api'

  export default {
    components: {XHr, XButton, Group, Cell, Step, DispatchInfoForm, OrderShare, OrderShareDialog},
    data () {
      return {
        orderId: this.$route.query.id.toString(),
        showOrderInfo: true,
        showDialog: false,
        dispatchInfo: {},
        user: {},
        order: {},
        contacts: [],
        charge: {},
        shareLink: '',
        orderDispatchParams: null
      }
    },
    created() {
      API.fetchUser().then(res => this.user = res.user || this.user);

      API.fetchOrderDispatchInfo({order_id: this.orderId}).then(res => {
        this.dispatchInfo = res.dispatch_info || this.dispatchInfo;
      }, showToast.bind(this));

      API.fetchOrder({id: this.orderId}).then(res => {
        this.order = res.order || this.order;
        this.contacts = res.contacts || this.contacts;
        this.charge = res.charges && res.charges.length ? res.charges[0] : this.charge;
        this.buildShareOption();
        this.$wechat.ready(this.onMenuShare);
      });
    },
    methods: {
      updateOrder(){
        API.updateOrderToOnWay({id: this.orderId}).then(res => {
          this.order.status = 'delivering';
          showToast.bind(this, '加入成功！')();
        }, showToast.bind(this));
      },
      buildShareOption(){
        let timestamp = new Date().getTime();
        this.orderDispatchParams = {order_id: this.orderId, timestamp: timestamp};
        this.shareLink = `${endpoint}/#/collaborative/order_detail`
          + `?order_id=${this.orderId}&share_user_id=${this.user.id}&timestamp=${timestamp}&type=receiver`;
      },
      onMenuShare(){
        let desc = `${dateFormat(this.contacts[0].expected_time)} ${this.contacts[0].address} -> ${this.contacts[1].address}`;
        let name = `${this.user.company_name || ''}${this.user.name || ''}`;
        let option = {
          title: `${name || '鲸运物流管家'}给您派单啦`,
          desc: desc,
          link: this.shareLink,
          imgUrl: `${endpoint}/logo.jpg`,
          success: this.shareCallBack
        };

        this.$wechat.onMenuShareAppMessage(option);
        this.$wechat.onMenuShareTimeline(option);
      },
      shareCallBack(){
        console.log('Order share success:', this.shareLink);
        API.orderDispatchCollaboratives(this.orderDispatchParams);
      },
      toggleOrderInfo(){
        this.showOrderInfo = !this.showOrderInfo;
        if (this.showOrderInfo) {
          setTimeout(_ => {
            window.scroll(0, 1000);
          }, 100);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_dispatch_info_new_page {
    background-color: @bg;
    .share_link {
      text-align: right;
      background-color: white;
      padding: 10px;
      color: @blue;
    }

    .order-info-container {
      margin: 10px;
      .weui-cell {
        padding: 10px !important;
        font-size: 14px !important;
        background-color: @grey;
      }
    }

    .order-body {
      padding: 0 10px 10px 10px;
      font-size: 14px !important;
      background-color: @grey;
    }
  }
</style>
