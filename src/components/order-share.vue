<template>
  <div class="order-share-container">
    <div class="order_flex">
      <span>发货人：</span>
      <div class="flex">
        <div>{{order.customer_name}}</div>
        <div>{{order.customer_contact_name}} {{order.customer_phone_number}}</div>
        <div v-if="order.customer_order_number">发货人单号:{{order.customer_order_number}}</div>
      </div>
    </div>
    <div class="order_flex">
      <span>车型：</span>
      <div class="flex">{{order.vehicle_type_name}} {{order.vehicle_type_note}}</div>
    </div>
    <div class="order_flex">
      <span>装货地：</span>
      <div class="flex">
        <div>{{contacts[0].address}}</div>
        <div>{{contacts[0].name}} {{contacts[0].phone_number}}</div>
        <div v-if="contacts[0].expected_time">装货时间:{{senderExpectedTime}}</div>
        <div v-if="order.cargo_note">货物:{{order.cargo_note}}</div>
      </div>
    </div>
    <div class="order_flex">
      <span>卸货地：</span>
      <div class="flex">
        <div>{{contacts[1].address}}</div>
        <div>{{contacts[1].name}} {{contacts[1].phone_number}}</div>
        <div v-if="contacts[1].expected_time">卸货时间：{{receiverExpectedTime}}</div>
      </div>
    </div>
    <div class="order_flex" v-if="charge.receivable_amount">
      <span>费用：</span>
      <div class="flex">¥{{charge.receivable_amount}}</div>
    </div>
  </div>
</template>

<script>
  import {dateFormat} from '../util/utils'

  export default {
    props: {
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
    computed: {
      senderExpectedTime(){
        return dateFormat(this.contacts[0].expected_time);
      },
      receiverExpectedTime(){
        return dateFormat(this.contacts[1].expected_time);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .order-share-container {
    .order_flex {
      display: flex;
      margin-bottom: 15px;
      .flex {
        flex: 1;
      }
    }
  }
</style>
