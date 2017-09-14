<template>
  <div v-transfer-dom>
    <x-dialog v-model="showDialog" :scroll="false">
      <img width="68px" height="86px" src="../assets/share.png" style="float: right">
      <span @click.self="close()" class="vux-close" style="float: left"></span>
      <div style="padding: 25px 0;">预览分享</div>
      <order-share v-if="order.id" :order="order" class="order-share-dialog"
                   :contacts="contacts" :charge="charge">
      </order-share>
    </x-dialog>
  </div>
</template>

<script>
  import {XDialog, TransferDomDirective as TransferDom} from 'vux'
  import OrderShare from '../components/order-share'

  export default {
    directives: {TransferDom},
    components: {XDialog, OrderShare},
    props: {
      value: Boolean,
      order: {
        type: Object,
        default: {}
      },
      contacts: {
        type: Array,
        default: []
      },
      charge: {
        type: Object,
        default: {}
      }
    },
    data(){
      return {
        showDialog: this.value
      }
    },
    methods: {
      close(){
        this.showDialog = false;
        this.$emit('input', this.showDialog);
      }
    },
    watch: {
      value(val){
        this.showDialog = val;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/close';
  @import '../style/theme';

  .order-share-dialog {
    text-align: left;
    padding: 1px 10px;
    background-color: white;
    font-size: 14px !important;
  }
</style>
