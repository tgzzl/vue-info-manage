<template>
  <div class="order_item">
    <div class="flex_between">
      <span class="order_number">订单号：{{ order.order_number }}</span>
      <span @click.self.once="clickOperator" :class="operatorClass">{{ operator }}</span>
    </div>

    <div class="order_body" @click="clickItem">
      <div class="flex_between">
        <span>发货人：{{ order.customer_name || order.customer_contact_name }}</span>
        <span v-if="isExistCompletedTask" class="order_completed_task">{{taskDescription}}</span>
      </div>
      <div><label>发货人单号：</label>{{ order.customer_order_number }}</div>
      <contacts :contacts="order.contacts"></contacts>
    </div>
  </div>
</template>

<script>
  import contacts from './contacts'
  import {dateFormat} from '../util/utils'

  export default {
    components: {contacts},
    props: {
      order: {
        type: Object,
        default(){
          return {}
        }
      },
      needOperator: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        canOperator: false
      }
    },
    computed: {
      operator(){
        switch (this.order.status) {
          case 'created':
            return this.orderVehicleDispatched ? '已登记承运信息' : '未登记承运信息';
          case 'delivering':
            if (this.orderVehicleDispatched) {
              return '在运';
            } else {
              this.canOperator = true;
              return '去登记车辆';
            }
          case 'completed':
            return '已完成';
          default:
            return '';
        }
      },
      orderVehicleDispatched(){
        return this.order.order_dispatch_info
        && this.order.order_dispatch_info.fleet_name
        && this.order.order_dispatch_info.driver_name
        && this.order.order_dispatch_info.plate_no
          ? true : false;
      },
      hasExpectedTime(){
        return this.order.contacts[0].expected_time ? true : false;
      },
      operatorClass(){
        return this.canOperator && this.needOperator ? 'link' : 'text';
      },
      isExistCompletedTask(){
        return this.order.last_completed_task ? true : false;
      },
      taskDescription(){
        let last_completed_task = this.order.last_completed_task;
        return dateFormat(last_completed_task.actual_time, 'HH:mm') + ' ' + last_completed_task.name;
      }
    },
    methods: {
      clickItem(){
        this.$emit('on-item-click', this.order);
      },
      clickOperator(){
        if (this.canOperator && this.needOperator) this.$emit('on-operator-click', this.order);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .order_item {
    margin: 0 10px 10px;
    padding: 10px;
    border-radius: 3px;
    background-color: white;

    .order_number {
      color: @gray;
      font-size: 14px;
    }

    .link {
      color: @blue;
      font-size: 14px;
    }
    .text {
      color: @gray;
      font-size: 14px;
    }

    .order_body {
      padding-top: 10px;
      .order_completed_task {
        color: @gray;
        font-size: 12px;
      }
    }
  }
</style>
