<template>
  <div class="order_success_page">
    <div class="success_hint">
      <x-icon class="icon" type="ios-checkmark-outline" size="60"></x-icon>
      <div class="message"><b>您已接单成功！</b></div>
    </div>
    <div class="footer_button">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="updateOrder" plain>+加入我的在途</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="onsubmit" type="primary">立即派单</x-button>
        </flexbox-item>
      </flexbox>
      <div style="margin-top: 20px;">点击“立即派单”后，您可以继续如下步骤完成派单</div>
      <img src="../../assets/dispatch_step.png" width="100%"/>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {XButton, Flexbox, FlexboxItem} from 'vux'
  import Toolbar from '../../components/toolbar'
  import {updateOrderToOnWay} from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    components: {XButton, Flexbox, FlexboxItem, Toolbar},
    data () {
      return {
        orderId: this.$route.query.id,
      }
    },
    methods: {
      updateOrder(){
        updateOrderToOnWay(this.orderId).then(showToast.bind(this, '加入成功！'), showToast.bind(this))
      },
      onsubmit(){
        this.$router.replace({path: '/order/transport_requirement', query: {id: this.orderId}});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_success_page {
    padding: 20px 10px;
    background-color: white;

    .success_hint {
      display: flex;
      align-items: center;
      justify-content: center;

      .icon {
        fill: @orange;
      }

      .message {
        b {
          font-size: 20px;
        }
        a {
          color: @blue;
        }
      }
    }

    .footer_button {
      padding-top: 20px;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
