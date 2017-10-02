<template>
  <div class="contact_detail_page">
    <!--<div class="nav"><label v-if="contact.id" @click="deleteContact">删除地址</label></div>-->
    <group gutter="0" label-width="0">
      <x-input class="input" title="" v-model="contact.address" :required="true" placeholder="填写详细地址"></x-input>
      <x-input class="input" title="" v-model="contact.name" placeholder="联系人"></x-input>
      <x-input class="input" title="" v-model="contact.phone_number" placeholder="联系电话" type="tel"></x-input>
    </group>
    <div class="save_btn">
      <x-button @click.native="saveContact" type="primary">保存</x-button>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {Group, CellBox, XInput, XButton} from 'vux'
  import API from '../../config/api'
  import {pick, showToast, replaceEmoji} from '../../util/utils'

  export default {
    components: {
      Group,
      CellBox,
      XInput,
      XButton
    },
    data () {
      return {
        contact: this.$route.query
      }
    },
    methods: {
      ...mapMutations([
        'SELECT_CONTACT'
      ]),
      deleteContact(){
        console.log('delete contact');
      },
      pushContact(res){
        if (res.id) {
          this.contact.contact_id = res.id;
        }
        // pick keys
        let keys = ['contact_id', 'contact_type', 'name', 'phone_number', 'address'];
        this.SELECT_CONTACT(pick(this.contact, keys));
        this.$router.go(-2);
      },
      checkForm(){
        if (this.contact.address && this.contact.address.length > 0) return true;
        showToast.bind(this, '请填写详细地址')();
        return false;
      },
      saveContact(){
        if (!this.checkForm()) return;
        replaceEmoji(this.contact, ['address', 'name']);
        if (this.contact.id) {
          API.updateContact(this.contact).then(this.pushContact, showToast.bind(this));
        } else {
          API.createContact(this.contact).then(this.pushContact, showToast.bind(this));
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .contact_detail_page {
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
