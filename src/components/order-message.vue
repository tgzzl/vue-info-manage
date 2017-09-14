<template>
  <div :class="className" @click="onItemClick(value)">
    <div class="head">
      <span class="tag">{{ messageTag }}</span>
      <span v-if="isReceiveMessage" class="user">{{ userName }}</span>
      <span>{{ messageStatus }}</span>
    </div>
    <div :class="contentClass">
      <contacts v-if="value.business_type === 'order'" :contacts="businessSnapshot.order_contacts"></contacts>
      <template v-else-if="value.business_type === 'order_exception'">
        <span>{{orderExceptionDesc}}</span>
        <img-upload v-if="businessSnapshot.attachment" :is-upload="false"
                    v-model="businessSnapshot.attachment"></img-upload>
      </template>
      <template v-else-if="value.business_type === 'order_charge'">
        <span>{{orderChargeDesc}}</span>
        <img-upload v-if="businessSnapshot.attachment" :is-upload="false"
                    v-model="businessSnapshot.attachment"></img-upload>
      </template>
    </div>
  </div>
</template>

<script>
  import Contacts from '../components/contacts'
  import ImgUpload from '../components/img-upload.vue'
  import {dateFormat} from '../util/utils'

  export default {
    components: {Contacts, ImgUpload},
    props: {
      value: {
        type: Object,
        default(){
          return {}
        }
      },
      isReceiveMessage: Boolean,
      chargeNameMap: Object,
      exceptionTypeMap: Object,
      user: Object
    },
    data(){
      return {
        businessSnapshot: JSON.parse(this.value.business_snapshot)
      }
    },
    computed: {
      className(){
        return this.value.business_type == 'order' ? 'message_item_container right-arrow' : 'message_item_container';
      },
      messageStatus(){
        if (this.value.business_type != 'order') {
          return dateFormat(this.value.created_at, 'MM-DD');
        }
        if (this.isReceiveMessage) {
          return this.value.status == 'accepted' && this.value.accepter_id == this.user.user_id ? '已接单' : '';
        } else {
          return this.value.status == 'accepted' ? `${this.value.accepter_name || this.value.accepter_company_name || ''}已接单` : '未接单';
        }
      },
      messageTag(){
        switch (this.value.business_type) {
          case 'order':
            return '新单';
          case 'order_exception':
            return '异常';
          case 'order_charge':
            return '附加费';
          default:
            return '';
        }
      },
      isRead(){
        return this.value.status != 'created';
      },
      contentClass(){
        return this.isRead ? 'content_read' : ''
      },
      orderExceptionDesc(){
        let obj = this.businessSnapshot;
        return `异常-${this.exceptionTypeMap[obj.exception_type]}-${obj.note}`;
      },
      orderChargeDesc(){
        let obj = this.businessSnapshot;
        let receivableAmountDesc = obj.receivable_amount ? `收取${this.chargeNameMap[obj.name]}¥${obj.receivable_amount}` : '';
        let payableAmountDesc = obj.payable_amount ? `支付${this.chargeNameMap[obj.name]}¥${obj.payable_amount}` : '';
        return `${receivableAmountDesc} ${payableAmountDesc} ${obj.note}`;
      },
      userName(){
        return `来自${this.value.user_company_name || this.value.user_name}的消息${this.isRead ? '（已读）' : ''}`;
      }
    },
    methods: {
      onItemClick(obj){
        if (obj.business_type === 'order') {
          let query = {
            order_id: obj.business_key,
            share_user_id: obj.user_id,
            timestamp: obj.timestamp,
            type: this.isReceiveMessage ? 'receiver' : 'sender'
          };
          this.$router.push({path: '/collaborative/order_detail', query: query});
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../style/theme';

  .message_item_container {
    position: relative;
    margin-bottom: 10px;
    border-radius: 3px;
    padding: 10px;
    background-color: white;

    .head {
      display: flex;
      font-size: 12px;
      align-items: center;
      justify-content: space-between;
      .tag {
        color: white;
        background-color: @blue;
        border-radius: 3px;
        padding: 0 5px;
        margin-right: 10px;
        height: 18px;
      }
      .user {
        flex: 1;
        color: gray;
      }
    }

    .content_read {
      span {
        color: @gray;
      }
      .contacts_show .contact_item .contact_body {
        color: @gray !important;
      }
      .contacts_show .contact_item .contact_body .send_time {
        color: @gray !important;
      }
    }
  }
</style>
