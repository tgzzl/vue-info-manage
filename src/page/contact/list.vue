<template>
  <div class="contact_list_page">
    <search
      @on-submit="onSubmit"
      @on-cancel="onSubmit"
      v-model="searchText"
      :auto-fixed="false"
      placeholder="输入姓名、手机号、地址搜索"
      ref="search"></search>

    <div v-if="contacts.length == 0" class="not_result">
      <img src="../../assets/empty_contact.png" width="120px">
      <div style="margin: 10px 0;">您还没有常用地址，先去添加吧！</div>
      <x-button style="width: 70%;" @click.native="newContact" type="primary">+添加常用地址</x-button>
    </div>
    <scroller v-else lock-x height="-100" :bounce="false" ref="scrollerEvent">
      <div>
        <cell primary="content" v-for="contact in contacts" :key="contact.id">
          <div class="contact" @click="selectContact(contact)">
            {{ contact.address }}
            <x-icon v-if="isSelected(contact)" type="ios-checkmark-empty" size="20"></x-icon>
            <br>
            <label>{{ contact.name }}&nbsp;{{ contact.phone_number }}</label>
          </div>
          <div slot="child" class="operator" @click="editContact(contact)">修改</div>
        </cell>
        <x-hr/>
      </div>
    </scroller>

    <div v-if="contacts.length" class="bottom_btn_wrapper">
      <x-button @click.native="newContact" type="primary">+添加常用地址</x-button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {Search, Group, CellBox, Cell, XButton, Scroller, XHr} from 'vux'
  import {fetchContacts} from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    components: {
      Search,
      Group,
      CellBox,
      Cell,
      XButton,
      Scroller,
      XHr
    },
    data () {
      return {
        searchText: '',
        contacts: [],
        contactType: this.$route.query.contact_type,
        contactTypes: ['sender', 'receiver']
      }
    },
    mounted(){
      this.resetScroller();
      this.getContacts();
    },
    methods: {
      ...mapMutations([
        'SELECT_CONTACT'
      ]),
      onSubmit(){
        this.getContacts();
      },
      selectContact(contact){
        if (!this.contactType || !this.contactTypes.includes(this.contactType)) {
          showToast.bind(this, '路由参数错误')();
          return;
        }
        this.SELECT_CONTACT(this.buildOrderContact(contact, this.contactType));
        this.$router.go(-1);
      },
      newContact(){
        this.$router.push({path: '/contact/edit', query: {contact_type: this.contactType}});
      },
      editContact(contact){
        let data = Object.assign({contact_id: contact.id, contact_type: this.contactType}, contact);
        data.title = true;
        delete data.created_at;
        delete data.updated_at;
        this.$router.push({path: '/contact/edit', query: data});
      },
      getContacts(){
        fetchContacts({
          search_text: this.searchText
        }).then(res => {
          this.contacts = res.contacts || this.contacts;
          this.resetScroller();
        }, showToast.bind(this));
      },
      buildOrderContact(contact, contact_type){
        return {
          contact_id: contact.id,
          contact_type: contact_type,
          address: contact.address,
          name: contact.name,
          phone_number: contact.phone_number,
          priority: this.contactTypes.indexOf(contact_type) + 1
        }
      },
      resetScroller(){
        if (!this.$refs.scrollerEvent || !this.$refs.scrollerEvent.reset) {
          return;
        }
        this.$nextTick(_ => this.$refs.scrollerEvent.reset({top: 0}));
      },
      isSelected(obj){
        return this.$route.query.id == obj.id;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .contact_list_page {
    font-size: 16px;

    .not_result {
      color: gray;
      text-align: center;
      padding: 20px 0;
    }
    .operator {
      color: @blue;
      margin: 10px 0 10px 0;
      padding-left: 10px;
      border-left: 1px solid darkgray;
    }
    .contact {
      text-align: left;
      padding: 10px;

      label {
        font-size: 14px;
        color: gray;
      }
    }
  }
</style>
