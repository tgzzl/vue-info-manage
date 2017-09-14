<template>
  <div class="order_show_for_share_page">
    <div class="flex-wrapper">
      <img width="25px" height="25px" src="../../assets/sender_address.svg">
      <div class="flex">
        <span>{{ sender.address}}<br/></span>
        <label v-if="sender.name || sender.phone_number">{{ sender.name }}&nbsp;{{ sender.phone_number }}<br/></label>
        <label v-if="sender.expected_time">装货时间:{{ dateFormat(sender.expected_time) }}<br/></label>
        <label v-if="order.cargo_note">{{ order.cargo_note }}</label>
      </div>
    </div>
    <x-hr/>
    <div class="flex-wrapper">
      <img width="25px" height="25px" src="../../assets/receiver_address.svg">
      <div class="flex">
        <span>{{ receiver.address}}<br/></span>
        <label v-if="receiver.name || receiver.phone_number">{{ receiver.name }}&nbsp;{{ receiver.phone_number
          }}<br/></label>
      </div>
    </div>
    <x-hr/>
    <div class="flex-wrapper">
      <img width="30px" height="20px" src="../../assets/car.svg">
      <div class="flex">{{ order.vehicle_type_name }}
        <span v-if="order.vehicle_type_note"><br/>{{order.vehicle_type_note}}</span>
      </div>
    </div>
    <x-hr/>
    <template v-if="isSelfReceived">
      <nav>接单结果</nav>
      <p class="receivers">恭喜您，接单成功！</p>
      <x-hr/>
    </template>
    <template v-if="hasReceivers">
      <nav>接单结果</nav>
      <div class="receivers">
        <div v-for="receiver in receivers" :key="receiver.id">
          <label>{{receiverStatus(receiver)}}</label>
          <span>{{receiverDesc(receiver)}}</span>
        </div>
      </div>
      <x-hr/>
    </template>
    <div v-if="isShowDispatchButton" class="footer_button">
      <flexbox>
        <flexbox-item>
          <x-button @click.native="goBack" plain>返回</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button @click.native="onsubmit" type="primary">我要接单</x-button>
        </flexbox-item>
      </flexbox>
    </div>
    <toolbar/>
  </div>
</template>

<script>
  import {XButton, XHr, Flexbox, FlexboxItem} from 'vux'
  import {dateFormat, showToast, getStore, pick} from '../../util/utils'
  import Toolbar from '../../components/toolbar'
  import {fetchCollaborative, fetchUser, receiveCollaboratives} from '../../config/api'

  export default {
    components: {XButton, XHr, Flexbox, FlexboxItem, Toolbar},
    data() {
      return {
        query: this.$route.query,
        user: getStore('USER_INFO') || {},
        order: {},
        sender: {},
        receiver: {},
        receivers: []
      }
    },
    created() {
      if (!this.query.type || !this.query.order_id || !this.query.share_user_id || !this.query.timestamp) {
        showToast.bind(this, '参数错误！')();
        return;
      }

      if (this.user.user_id == this.query.share_user_id) {
        this.query.type = 'sender';
      }

      this.query.access_url = this.$route.path;
      let pickQuery = pick(this.query, ['order_id', 'share_user_id', 'timestamp']);

      receiveCollaboratives(pickQuery);

      this.$store.commit('UPDATE_LOADING_STATUS', true);
      fetchCollaborative(pickQuery).then(res => {
        this.$store.commit('UPDATE_LOADING_STATUS', false);

        this.order = res.order || this.order;
        this.sender = res.contacts[0] || this.sender;
        this.receiver = res.contacts[1] || this.receiver;
        this.receivers = res.receivers || this.receivers;
      }, error => {
        if (typeof error === 'object' && error.return_code == 150101) {
          this.$router.push({path: '/home', query: this.query});
        } else {
          this.$store.commit('UPDATE_LOADING_STATUS', false);
          showToast.bind(this, error)();
        }
      });
    },
    computed: {
      hasReceivers() {
        return this.query.type == 'sender' && this.receivers && this.receivers.length;
      },
      isShowDispatchButton() {
        return this.query.type == 'receiver'
          && (this.receivers.length == 0 || (this.receivers[0] && this.user.user_id != this.receivers[0].id));
      },
      isSelfReceived() {
        return this.query.type == 'receiver' && this.receivers[0] && this.user.user_id == this.receivers[0].id;
      }
    },
    methods: {
      dateFormat,
      receiverStatus(receiver) {
        switch (receiver.status) {
          case 'user_accept':
            return '接单成功';
          case 'user_accept_fail':
            return '接单失败';
          default:
            return '未接单';
        }
      },
      receiverDesc(receiver) {
        return `${receiver.name || receiver.company_name || receiver.nickname || ''} ${receiver.phone_number || ''} ${receiver.plate_no || ''}${receiver.vehicle_type_name || ''}`;
      },
      onsubmit() {
        if (this.receivers && this.receivers.length) {
          showToast.bind(this, '您来晚了，该订单已被其他人接下！')();
          return;
        }
        fetchUser().then(res => {
          if (res.user && res.user.phone_number) {
            this.$router.push({path: '/user/agreement', query: {user: res.user, collaborative: this.query}});
          } else {
            this.$router.push({path: '/user/login', query: {collaborative: this.query}});
          }
        })
      },
      goBack() {
        if (!this.order || !this.order.id) {
          this.$router.push({path: '/home', query: this.query});
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_show_for_share_page {
    padding-bottom: 50px;
    nav {
      background-color: @bg;
      color: @gray;
      font-size: 14px;
      padding: 0 15px;
    }
    .flex-wrapper {
      display: flex;
      padding: 15px;

      img {
        padding-right: 5px;
      }
      .flex {
        flex: 1;
        span {
          font-size: 16px;
        }
        label {
          color: @gray;
          font-size: 14px;
        }
      }
    }
    .footer_button {
      padding: 10px;
    }
    .receivers {
      padding: 15px;
      font-size: 14px;
      div {
        display: flex;
      }
      label {
        display: inline-block;
        color: @blue;
        min-width: 70px;
      }
      div + div {
        margin-top: 10px;
      }
    }
  }
</style>
