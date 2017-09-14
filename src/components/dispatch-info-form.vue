<template>
  <div>
    <div class="dispatch_info_form_container">
      <div class="dispatch_info_form_flex_wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../assets/fleet.svg">
        <el-autocomplete class="flex" placeholder="选择车队或物流公司"
                         v-model="fleetName" :fetch-suggestions="searchFleet"></el-autocomplete>
      </div>
      <x-hr/>
      <div class="dispatch_info_form_flex_wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../assets/driver.svg">
        <el-autocomplete class="flex" placeholder="司机姓名" @select="onSelectDriver"
                         v-model="driverName" :fetch-suggestions="searchDriver">
        </el-autocomplete>
        <el-input class="flex" placeholder="司机电话" type="tel" v-model="driverPhoneNumber"></el-input>
      </div>
      <x-hr/>
      <div class="dispatch_info_form_flex_wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../assets/car.svg">
        <el-autocomplete class="flex" placeholder="车牌号" @select="onSelectVehicle"
                         v-model="plateNo" :fetch-suggestions="searchVehicle">
        </el-autocomplete>
        <el-autocomplete class="flex" placeholder="选择或填写车型" v-model="vehicleTypeName"
                         :fetch-suggestions="searchVehicleType"></el-autocomplete>
      </div>
    </div>
    <group gutter="5px">
      <x-input v-model="dispatchInfo.payable_transportation_fee" placeholder="本单支出金额" type="number">
        <img slot="label" style="margin-right: 10px;" :width="iconWidth" src="../assets/expenditure.svg">
      </x-input>
    </group>
    <flexbox style="padding: 10px 10px 20px 10px;">
      <flexbox-item>
        <slot></slot>
      </flexbox-item>
      <flexbox-item>
        <x-button @click.native="submitForm" type="primary">{{rightButtonText}}</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {XHr, Group, PopupPicker, XInput, XButton, Flexbox, FlexboxItem} from 'vux'
  import {Autocomplete, Input} from 'element-ui'
  import {fetchFleets, fetchDrivers, fetchVehicles, saveOrderDispatchInfo} from '../config/api'
  import {isTelephoneNumber, isPlateNumber} from '../util/regexp'
  import {pick, replaceEmoji, VEHICLE_TYPES} from '../util/utils'

  export default {
    components: {XHr, Group, PopupPicker, XInput, XButton, Flexbox, FlexboxItem, Autocomplete, Input},
    props: {
      action: String,
      orderId: String,
      orderStatus: String,
      dispatchInfo: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    data () {
      return {
        iconWidth: 30,
        vehicleTypeName: '',
        vehicleTypes: VEHICLE_TYPES,
        fleetName: '',
        driverName: '',
        driverPhoneNumber: '',
        plateNo: '',
        fleetList: [],
        driverList: [],
        vehicleList: []
      }
    },
    created() {
      this.watchDispatchInfo(this.dispatchInfo);
      fetchFleets('').then(res => {
        if (res.fleets && res.fleets.length) {
          this.fleetList = res.fleets.map(item => {
            item.value = item.name;
            return item;
          });
        }
      });
      fetchDrivers('').then(res => {
        if (res.drivers && res.drivers.length) {
          this.driverList = res.drivers.map(item => {
            item.value = item.name;
            return item;
          });
        }
      });
      fetchVehicles('').then(res => {
        if (res.vehicles && res.vehicles.length) {
          this.vehicleList = res.vehicles.map(item => {
            item.value = item.plate_no;
            return item;
          });
        }
      });
    },
    computed: {
      rightButtonText(){
        return this.action == 'new' ? '下一步' : '提交';
      }
    },
    watch: {
      dispatchInfo(val){
        this.watchDispatchInfo(val);
      }
    },
    methods: {
      watchDispatchInfo(val){
        this.fleetName = val.fleet_name;
        this.driverName = val.driver_name;
        this.driverPhoneNumber = val.driver_phone_number;
        this.plateNo = val.plate_no;
        this.vehicleTypeName = val.vehicle_type_name;
      },
      onChangeVehicleType(val){
        this.dispatchInfo.vehicle_type_name = val[0];
      },
      searchFleet(val, cb){
        let results = val ? this.fleetList.filter(item => item.value.includes(val)) : this.fleetList;
        cb(results);
      },
      searchDriver(val, cb){
        let results = val ? this.driverList.filter(item => item.value.includes(val)) : this.driverList;
        cb(results);
      },
      searchVehicle(val, cb){
        let results = val ? this.vehicleList.filter(item => item.value.includes(val)) : this.vehicleList;
        cb(results);
      },
      searchVehicleType(val, cb){
        let results = val ? this.vehicleTypes.filter(item => item.value.includes(val)) : this.vehicleTypes;
        cb(results);
      },
      onSelectDriver(val){
        this.driverPhoneNumber = val.phone_number;
      },
      onSelectVehicle(val){
        this.vehicleTypeName = val.vehicle_type_name;
      },
      showToast(msg){
        this.$vux.toast.text(msg);
      },
      validateForm(){
        if (!this.dispatchInfo.fleet_name) {
          this.showToast('车队或公司不能为空');
          return false;
        }
        if (!this.dispatchInfo.driver_name) {
          this.showToast('司机姓名不能为空');
          return false;
        }
        if (!isPlateNumber(this.dispatchInfo.plate_no)) {
          this.showToast('车牌号格式错误');
          return false;
        }
        return true;
      },
      submitForm(){
        this.dispatchInfo.fleet_name = this.fleetName;
        this.dispatchInfo.driver_name = this.driverName;
        this.dispatchInfo.driver_phone_number = this.driverPhoneNumber;
        this.dispatchInfo.plate_no = this.plateNo;
        this.dispatchInfo.vehicle_type_name = this.vehicleTypeName;
        if (!this.validateForm()) {
          return;
        }

        replaceEmoji(this.dispatchInfo, ['fleet_name', 'driver_name', 'vehicle_type_name']);

        let keys = ['id', 'fleet_name', 'driver_name', 'driver_phone_number', 'plate_no',
          'vehicle_type_name', 'vehicle_type_note', 'payable_transportation_fee'];
        let param = {order_id: this.orderId, dispatch_info: pick(this.dispatchInfo, keys)};
        saveOrderDispatchInfo(param).then(res => {
          if (this.action == 'new') {
            this.$router.push({
              path: '/order_dispatch_info/success',
              query: {id: this.orderId, status: this.orderStatus}
            });
          } else {
            this.showToast('更新成功');
            setTimeout(_ => {
              this.$router.go(-1);
            }, 1500)
          }
        }, this.showToast);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .dispatch_info_form_container {
    background-color: white;

    .vux-cell-box:before {
      border: none !important;
    }

    .weui-cell:before {
      display: none;
    }

    .dispatch_info_form_flex_wrapper {
      display: flex;
      align-items: center;
      .flex {
        flex: 1;
      }
      .icon {
        margin-left: 15px;
      }
    }
  }
</style>
