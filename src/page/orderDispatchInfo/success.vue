<template>
  <div>
    <step :step="3" style="padding-bottom: 10px;"></step>
    <div class="qrcode_container">
      <div>承运信息及运输要求信息已登记完成！</div>
      <span v-if="status !='delivering'" @click.self="onsubmit">+加入我的在途</span>
      <img src="../../assets/dispatch_share.png" width="120px"/>
      <x-button style="width: 60%;" @click.native="showDialog=true" type="primary">分享订单给好友接单</x-button>
    </div>
    <toolbar/>
    <order-share-dialog v-model="showDialog" :order="order" :contacts="contacts" :charge="charge"></order-share-dialog>
  </div>
</template>

<script>
  import {XButton} from 'vux'
  import Step from '../../components/step'
  import Toolbar from '../../components/toolbar'
  import OrderShareDialog from '../../components/order-share-dialog'
  import {fetchUser, fetchOrder, updateOrderToOnWay, orderDispatchCollaboratives} from '../../config/api'
  import {dateFormat, showToast} from '../../util/utils'
  import {endpoint} from '../../config/env'

  export default {
    components: {XButton, Step, Toolbar, OrderShareDialog},
    data () {
      return {
        orderId: this.$route.query.id,
        status: this.$route.query.status,
        showDialog: false,
        user: {},
        order: {},
        contacts: [],
        charge: {},
        shareLink: '',
        orderDispatchParams: null
      }
    },
    created(){
      fetchUser().then(res => this.user = res.user || this.user);

      fetchOrder(this.orderId).then(res => {
        this.order = res.order || this.order;
        this.contacts = res.contacts || this.contacts;
        this.charge = res.charges && res.charges.length ? res.charges[0] : this.charge;
        this.buildShareOption();
        this.$wechat.ready(this.onMenuShare);
      });
    },
    methods: {
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
        orderDispatchCollaboratives(this.orderDispatchParams);
      },
      onsubmit(){
        updateOrderToOnWay(this.orderId).then(showToast.bind(this, '加入成功！'), showToast.bind(this))
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .qrcode_container {
    padding: 15px 0;
    text-align: center;
    span {
      color: @blue;
      display: block;
      padding: 10px 0;
    }
  }
</style>
