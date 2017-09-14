<template>
  <dispatch-info-form :dispatch-info="dispatchInfo" :order-id="orderId">
    <x-button slot plain link="BACK">返回</x-button>
  </dispatch-info-form>
</template>

<script>
  import {XButton} from 'vux'
  import DispatchInfoForm from '../../components/dispatch-info-form'
  import {fetchOrderDispatchInfo} from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    components: {XButton, DispatchInfoForm},
    data () {
      return {
        orderId: this.$route.query.id.toString(),
        dispatchInfo: {}
      }
    },
    created() {
      fetchOrderDispatchInfo(this.orderId).then(res => {
        this.dispatchInfo = res.dispatch_info || this.dispatchInfo;
      }, showToast.bind(this));
    }
  }
</script>

