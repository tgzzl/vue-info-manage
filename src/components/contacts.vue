<template>
  <div class="contacts_show">
    <div class="contact_item" v-if="contactsExist()" v-for="contact in contacts">
      <!-- 地址类型 -->
      <div class="icon">
        <img v-if="isSenderContact(contact.contact_type)"
             width="25px" height="25px" src="../assets/sender_address.svg"/>
        <img v-else width="25px" height="25px" src="../assets/receiver_address.svg"/>
      </div>
      <!-- 地址 -->
      <div class="contact_body">
        {{ contact.address }}
        <div class="send_time" v-if="isShowTime(contact)">装货时间：{{ dateFormat(contact.expected_time) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {dateFormat} from '../util/utils'

  export default {
    components: {},
    props: ['contacts'],
    data () {
      return {};
    },
    methods: {
      dateFormat,
      contactsExist(){
        return this.$props.contacts != undefined && this.$props.contacts.length > 0;
      },
      isSenderContact(type){
        return type != undefined && type == 'sender';
      },
      isShowTime(contact){
        return this.isSenderContact(contact.contact_type) && contact.expected_time != undefined;
      }
    }
  }
</script>

<style lang="less" scoped>
  .contacts_show {
    margin-top: 5px;

    .contact_item {
      display: flex;
      margin-bottom: 8px;

      .icon {
        margin-right: 5px;
      }
      .send_time {
        margin-top: -5px;
      }
    }
  }
</style>
