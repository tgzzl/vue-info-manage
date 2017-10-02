<template>
  <div class="login_page">
    <group gutter="0" label-width="4em" label-margin-right="2em" label-align="right">
      <x-input v-model="user.company_name" placeholder="填写车队或公司名称">
        <img slot="label" src="../../assets/driver.svg">
      </x-input>
      <x-input v-model="user.name" placeholder="填写您的姓名" required>
        <img slot="label" src="../../assets/name.svg">
      </x-input>
      <x-input v-model="user.phone_number" placeholder="填写您的手机号" type="tel" required>
        <img slot="label" src="../../assets/mobile.svg"/>
      </x-input>
      <template v-if="!firstLogin">
        <x-input style="padding-left: 50px;" placeholder="车牌号" v-model="user.plate_no"></x-input>
        <x-hr/>
        <el-autocomplete style="padding-left: 35px;" placeholder="选择或填写车型"
                         v-model="vehicleTypeName" :fetch-suggestions="querySearch">
        </el-autocomplete>
      </template>
    </group>

    <template v-if="firstLogin">
      <checker v-model="checked" style="margin-top: 20px;">
        <checker-item class="checker-item" :value="1">
          <span v-if="checked"><x-icon type="ios-checkmark-outline" size="30"></x-icon></span>
          <span v-else><x-icon class="default" type="ios-circle-outline" size="30"></x-icon></span>
          我是司机
        </checker-item>
      </checker>
      <div class="driver">
        <x-input placeholder="车牌号" v-model="user.plate_no" :disabled="!checked"></x-input>
        <el-autocomplete placeholder="选择或填写车型" v-model="vehicleTypeName"
                         :fetch-suggestions="querySearch" :disabled="!checked">
        </el-autocomplete>
      </div>
    </template>

    <div class="button">
      <x-button @click.native="onsubmit" type="primary">{{firstLogin ? '登记' : '保存'}}</x-button>
    </div>
  </div>
</template>

<script>
  import {Group, XButton, XInput, XHr, Checker, CheckerItem} from 'vux'
  import API from '../../config/api'
  import {isMobileNumber, isPlateNumber} from '../../util/regexp'
  import {showToast, replaceEmoji, VEHICLE_TYPES} from '../../util/utils'
  import {Autocomplete} from 'element-ui'

  export default {
    components: {Group, XButton, XInput, XHr, Checker, CheckerItem, Autocomplete},
    data () {
      return {
        user: this.$route.query.user || {},
        checked: 0,
        firstLogin: false,
        vehicleTypeName: '',
        vehicleTypes: VEHICLE_TYPES
      }
    },
    created(){
      this.firstLogin = !this.user.phone_number;
      this.vehicleTypeName = this.user.vehicle_type_name;
      this.checked = this.vehicleTypeName && this.user.plate_no ? 1 : 0;
      if (this.firstLogin) {
        document.title = '登记信息'
      }
    },
    methods: {
      querySearch(val, cb) {
        let results = val ? this.vehicleTypes.filter(item => item.value.includes(val)) : this.vehicleTypes;
        cb(results);
      },
      onsubmit(){
        if (!this.user.name) {
          showToast.bind(this, '姓名必须填写哦')();
          return;
        }
        if (!isMobileNumber(this.user.phone_number)) {
          showToast.bind(this, '手机号格式不正确')();
          return;
        }

        if (this.checked) {
          if (!this.user.plate_no) {
            showToast.bind(this, '车牌号必须填写哦')();
            return;
          }
          if (!isPlateNumber(this.user.plate_no)) {
            showToast.bind(this, '车牌号格式不正确')();
            return;
          }
          if (!this.vehicleTypeName) {
            showToast.bind(this, '车型必须填写哦')();
            return;
          }
          this.user.vehicle_type_name = this.vehicleTypeName;
        } else {
          this.user.plate_no = '';
          this.user.vehicle_type_name = '';
        }

        replaceEmoji(this.user, ['company_name', 'name', 'vehicle_type_name']);

        API.updateUser(this.user).then(res => {
          if (this.$route.query.collaborative) {
            this.$router.replace({
              path: '/user/agreement',
              query: {user: this.user, collaborative: this.$route.query.collaborative}
            });
          } else {
            this.$router.go(-1);
          }
        }, showToast.bind(this));
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .login_page {

    svg {
      margin-top: 6px;
    }

    svg.default {
      fill: #999999;
    }

    img {
      width: 25px;
      height: 25px;
      margin-right: 10px;
    }

    .el-autocomplete {
      width: 100%;
    }

    .button {
      margin: 10px;
    }

    .checker-item {
      display: flex;
      align-items: center;
      padding: 0 15px;
    }

    .driver {
      margin: 0 15px 15px;
      border: 1px solid rgba(0, 0, 0, 0.1);

      .weui-cells, .vux-no-group-title {
        margin-top: 0;
      }
      .vux-x-input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      .weui-cells:before, .weui-cells:after {
        display: none;
      }
    }
  }
</style>
