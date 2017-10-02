<template>
  <div class="customer_detail_page">
    <!--<div class="nav"><label v-if="customer.id" @click="deleteCustomer">删除发货人</label></div>-->
    <group gutter="0" label-width="0">
      <x-input class="input" title="" v-model="customer.name" :required="true" placeholder="填写发货人公司名称"></x-input>
      <x-input class="input" title="" v-model="customer.contact_name" placeholder="联系人"></x-input>
      <x-input class="input" title="" v-model="customer.phone_number" placeholder="联系电话" type="tel"></x-input>
    </group>
    <div class="save_btn">
      <x-button @click.native="saveCustomer" type="primary">保存</x-button>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {Group, CellBox, XInput, XButton} from 'vux'
  import API from '../../config/api'
  import {showToast, replaceEmoji} from '../../util/utils'

  export default {
    components: {
      Group,
      CellBox,
      XInput,
      XButton
    },
    data () {
      return {
        customer: this.$route.query
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_CUSTOMER'
      ]),
      deleteCustomer(){
        console.log('delete customer');
      },
      pushCustomer(res){
        if (res.id) {
          this.customer.id = res.id;
        }
        this.SELECT_CUSTOMER(this.customer);
        this.$router.go(-2);
      },
      checkForm(){
        if (this.customer.name && this.customer.name.length > 0) return true;
        showToast.bind(this, '请填写发货人公司名称')();
        return false;
      },
      saveCustomer(){
        if (!this.checkForm()) return;
        replaceEmoji(this.customer, ['contact_name', 'name']);
        if (this.customer.id) {
          API.updateCustomer(this.customer).then(this.pushCustomer, showToast.bind(this));
        } else {
          API.createCustomer(this.customer).then(this.pushCustomer, showToast.bind(this));
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .customer_detail_page {
    .input {
      height: 60px;
    }

    .nav {
      height: 25px;
      font-size: 14px;
      text-align: right;
      line-height: 25px;

      label {
        color: @blue;
        padding: 0 10px 0 10px;
      }
    }
    .save_btn {
      padding: 10px;
    }
  }
</style>
