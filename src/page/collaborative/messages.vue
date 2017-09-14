<template>
  <div class="messages_page">
    <tab custom-bar-width="80px">
      <tab-item @on-item-click="handleTabItemClick(0)" selected>接收消息</tab-item>
      <tab-item @on-item-click="handleTabItemClick(1)">发送消息</tab-item>
    </tab>

    <scroller v-if="messages && messages.length" lock-x height="-94" :bounce="false" ref="scrollerEvent" class="list">
      <div>
        <order-message v-for="message in messages" :key="message.id"
                       :value="message" :isReceiveMessage="isReceiveMessage" :user="user"
                       :chargeNameMap="chargeNameMap" :exceptionTypeMap="exceptionTypeMap">
        </order-message>
      </div>
    </scroller>
    <div class="not_result" v-else>
      <img src="../../assets/empty_order.png" width="120px">
      <div>没有消息</div>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller} from 'vux'
  import OrderMessage from '../../components/order-message'
  import Toolbar from '../../components/toolbar'
  import {fetchCollaboratives, fetchConstantMap} from '../../config/api'
  import {showToast, setStore, getStore} from '../../util/utils'

  export default {
    components: {Tab, TabItem, Scroller, OrderMessage, Toolbar},
    data () {
      return {
        messages: [],
        isReceiveMessage: true,
        chargeNameMap: {},
        exceptionTypeMap: {},
        user: getStore('USER_INFO') || {}
      }
    },
    mounted(){
      let constantMap = getStore('CONSTANT_MAP');
      if (constantMap && constantMap.order_charge) {
        this.chargeNameMap = constantMap.order_charge.name;
        this.exceptionTypeMap = constantMap.order_exception.exception_type;
      } else {
        fetchConstantMap().then(res => {
          setStore('CONSTANT_MAP', res);
          this.chargeNameMap = res.order_charge.name;
          this.exceptionTypeMap = res.order_exception.exception_type;
        });
      }
      this.resetScroller();
      this.fetchData(0);
    },
    methods: {
      resetScroller(){
        if (!this.$refs.scrollerEvent || !this.$refs.scrollerEvent.reset) {
          return;
        }
        this.$nextTick(_ => this.$refs.scrollerEvent.reset({top: 0}));
      },
      handleTabItemClick (index) {
        this.fetchData(index);
      },
      fetchData (index) {
        fetchCollaboratives(index).then(res => {
          this.messages = res.messages || this.messages;
          this.isReceiveMessage = (index == 0);
          this.resetScroller();
        }, showToast.bind(this));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .messages_page {
    font-size: 16px;

    .list {
      background-color: @bg;
      padding: 10px;
    }
    .not_result {
      color: gray;
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
