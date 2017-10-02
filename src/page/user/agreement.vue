<template>
  <div class="user_agreement_page">
    <p style="margin-bottom: 15px;">您的身份已经通过验证，您将通过以下身份来接单</p>
    <p>车队或公司名称：{{user.company_name}}</p>
    <p>姓名：{{user.name}}</p>
    <p>手机：{{user.phone_number}}</p>
    <div v-if="isDefaultDriver" style="margin-top: 20px;">
      <checker v-model="checked">
        <checker-item class="checker-item" :value="1">
          <span v-if="checked"><x-icon type="ios-checkmark-outline" size="30"></x-icon></span>
          <span v-else><x-icon class="default" type="ios-circle-outline" size="30"></x-icon></span>
          我是本单司机<span class="tips">（为车队或公司接单无需勾选此项）</span>
        </checker-item>
      </checker>
      <div v-show="checked">
        <p>车牌：{{user.plate_no}}</p>
        <p>车型：{{user.vehicle_type_name}}</p>
      </div>
    </div>
    <x-button @click.native="onsubmit" type="primary" style="margin-top: 15px;">确认接单</x-button>
  </div>
</template>

<script>
  import {XButton, Checker, CheckerItem} from 'vux'
  import API from '../../config/api'
  import {pick, showToast} from '../../util/utils'

  export default {
    components: {XButton, Checker, CheckerItem},
    data () {
      return {
        user: this.$route.query.user || {},
        checked: this.$route.query.user && this.$route.query.user.plate_no ? 1 : 0
      }
    },
    computed: {
      isDefaultDriver(){
        return this.user && this.user.plate_no ? true : false;
      }
    },
    methods: {
      onsubmit(){
        let params = pick(this.$route.query.collaborative, ['order_id', 'share_user_id', 'timestamp']);
        params.as_driver = !!this.checked;
        API.acceptCollaboratives(params).then(res => {
          this.$router.replace({path: '/collaborative/success', query: {id: res.order_id}});
        }, showToast.bind(this));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .user_agreement_page {
    padding: 10px;
    svg {
      margin-top: 6px;
    }
    svg.default {
      fill: #999999;
    }
    .checker-item {
      display: flex;
      align-items: center;
      span.tips {
        font-size: 12px;
        color: @gray;
      }
    }
  }
</style>
