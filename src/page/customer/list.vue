<template>
  <div class="customer_list_page">
    <search
      @on-submit="onSubmit"
      @on-cancel="onSubmit"
      v-model="searchText"
      :auto-fixed="false"
      placeholder="输入发货人姓名、公司名称、手机号"
      ref="search"></search>
    <div v-if="customers.length == 0" class="not_result">
      <img src="../../assets/empty_customer.png" class="icon">
      <div style="margin: 10px 0;">您还没有常用发货人，先去添加吧！</div>
      <x-button style="width: 70%;" @click.native="newCustomer" type="primary">+添加发货人</x-button>
    </div>
    <scroller v-else lock-x height="-100" :bounce="false" ref="scrollerEvent">
      <div class="test">
        <cell v-if="selfUser.id" primary="content">
          <div class="customer" @click="selectCustomer(customer)">
            {{ selfUser.company_name }}
            <x-icon v-if="isSelected(selfUser)" type="ios-checkmark-empty" size="20"></x-icon>
            <br>
            <label>{{ selfUser.name }}&nbsp;{{ selfUser.phone_number }}</label>
          </div>
        </cell>
        <cell primary="content" v-for="customer in customers" :key="customer.id">
          <div class="customer" @click="selectCustomer(customer)">
            {{ customer.name }}
            <x-icon v-if="isSelected(customer)" type="ios-checkmark-empty" size="20"></x-icon>
            <br>
            <label>{{ customer.contact_name }}&nbsp;{{ customer.phone_number }}</label>
          </div>
          <div slot="child" class="operator" @click="editCustomer(customer)">修改</div>
        </cell>
        <x-hr/>
      </div>
    </scroller>

    <div v-if="customers.length" class="bottom_btn_wrapper">
      <x-button @click.native="newCustomer" type="primary">+添加发货人</x-button>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {Search, Group, Cell, XButton, Scroller, XHr} from 'vux'
  import {fetchCustomers, fetchUser} from '../../config/api'
  import {showToast} from '../../util/utils'

  export default {
    components: {
      Search,
      Group,
      Cell,
      XButton,
      Scroller,
      XHr
    },
    data() {
      return {
        searchText: '',
        selfUser: {},
        customers: []
      }
    },
    mounted() {
      this.resetScroller();
//      fetchUser().then(res => {
//        this.selfUser = res.user || this.selfUser;
//      });
      this.getCustomers();
    },
    methods: {
      ...mapMutations([
        'SELECT_CUSTOMER'
      ]),
      onSubmit() {
        this.getCustomers();
      },
      selectCustomer(customer) {
        this.SELECT_CUSTOMER(customer);
        this.$router.go(-1);
      },
      newCustomer() {
        this.$router.push('/customer/edit');
      },
      editCustomer(customer) {
        let data = Object.assign({}, customer);
        data.title = true;
        delete data.created_at;
        delete data.updated_at;
        this.$router.push({path: '/customer/edit', query: data});
      },
      getCustomers() {
        fetchCustomers({
          search_text: this.searchText
        }).then(res => {
          this.customers = res.customers || this.customers;
          this.resetScroller();
        }, showToast.bind(this));
      },
      resetScroller() {
        if (!this.$refs.scrollerEvent || !this.$refs.scrollerEvent.reset) {
          return;
        }
        this.$nextTick(_ => this.$refs.scrollerEvent.reset({top: 0}));
      },
      isSelected(obj) {
        return this.$route.query.id == obj.id;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';
  @import '../../style/mixin';

  .customer_list_page {
    .px2rem(font-size, 16);

    .icon {
      .px2rem(width, 178);
    }

    .not_result {
      color: gray;
      text-align: center;
      padding: 20px 0;
    }
    .operator {
      color: @blue;
      .px2rem(10);
      margin: @size 0;
      padding-left: @size;
      border-left: 1px solid darkgray;
    }
    .customer {
      text-align: left;
      .px2rem(padding, 10);

      label {
        .px2rem(font-size, 14);
        color: gray;
      }
    }
  }
</style>
