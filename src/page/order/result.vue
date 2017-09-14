<template>
  <div class="order_result_page">
    <template v-if="isSuccess">
      <div class="success_hint">
        <x-icon class="icon" type="ios-checkmark-outline" size="60"></x-icon>
        <div class="message">
          <b>您的订单{{ orderNumber }}已成功开单，请在我的订单查看！</b>
        </div>
      </div>
      <div class="footer_button">
        <img src="../../assets/dispatch.png" width="120px"/>
        <x-button style="width: 50%;" @click.native="onsubmit" type="primary">立即派单</x-button>
      </div>
    </template>
    <div v-else class="error_hint">
      <img width="100px" height="100px" src="../../assets/error.png" style="margin-bottom: 10px;">
      <b>哦，页面去旅游了！</b>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {XButton} from 'vux'
  import Toolbar from '../../components/toolbar'

  export default {
    components: {XButton, Toolbar},
    data () {
      return {
        orderId: this.$route.query.id,
        orderNumber: this.$route.query.order_number,
        orderLink: `/order/show?id=${this.$route.query.id}`
      }
    },
    computed: {
      isSuccess(){
        return this.$route.query.id > 0;
      }
    },
    methods: {
      onsubmit(){
        this.$router.replace({path: '/order/transport_requirement', query: {id: this.orderId}});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_result_page {
    padding: 30px 15px;
    background-color: white;

    b {
      font-size: 18px;
    }
    a {
      color: @blue;
    }

    .success_hint {
      display: flex;
      align-items: center;

      .icon {
        fill: @orange;
      }

      .message {
        flex: 1;
      }
    }

    .error_hint {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .footer_button {
      padding-top: 20px;
      text-align: center;
    }
  }
</style>
