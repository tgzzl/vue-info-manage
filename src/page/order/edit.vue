<template>
  <div>
    <div class="order-form">
      <group gutter="0" label-width="4em" label-margin-right="2em" label-align="right">
        <cell is-link value-align="left" :link="`/customer?id=${order.customer_id}`">
          <img slot="icon" class="icon" src="../../assets/customer.svg" width="30"/>
          <span slot="default" :class="{'cell-tips': !this.order.customer_name}">{{showCustomerName}}</span>
        </cell>
        <x-input class="input-padding" v-model="order.customer_order_number" placeholder="发货人单号"></x-input>
      </group>

      <group gutter="5px" label-width="4em" label-margin-right="2em" label-align="right">
        <input-picker placeholder="从哪装货(必填)" value-align="left" :value="this.contacts[0]" ref="senderAddressEvent">
          <img slot="icon"  class="icon" src="../../assets/sender_address.svg"/>
          <img slot="child" class="icon-child" src="../../assets/slot_address.svg"
               @click="goContactPage(0)"/>
        </input-picker>
        <x-datetime-range class="datetime-padding" title="装货时间" v-model="contacts[0].expected_time"></x-datetime-range>

        <x-textarea class="input-padding" placeholder="货物名称、数量、重量、体积" v-model="order.cargo_note"
                    :autosize="true" :show-counter="false" :rows="1">
        </x-textarea>
      </group>

      <group gutter="5px" label-width="4em" label-margin-right="2em" label-align="right">
        <input-picker placeholder="到哪卸货(必填)" value-align="left" :value="this.contacts[1]" ref="receiverAddressEvent">
          <img slot="icon" class="icon" src="../../assets/receiver_address.svg"/>
          <img slot="child" class="icon-child" src="../../assets/slot_address.svg"
               @click="goContactPage(1)"/>
        </input-picker>
        <x-datetime-range class="datetime-padding" title="卸货时间"
                          v-model="contacts[1].expected_time" :sdate="contacts[0].expected_time">
        </x-datetime-range>
      </group>

      <group gutter="5px" label-width="4em" label-margin-right="2em" label-align="right">
        <cell is-link value-align="left" @click.native="showVehicleTypePopupPicker = true">
          <img slot="icon" class="icon" src="../../assets/car.svg"/>
          <span slot="default" :class="{'cell-tips': !this.order.vehicle_type_name}">{{showVehicleType}}</span>
        </cell>
        <popup-picker :show="showVehicleTypePopupPicker" @on-hide="showVehicleTypePopupPicker = false"
                      :show-cell="false" :data="vehicleTypes" v-model="vehicleTypeName"
                      @on-change="onChangeVehicleType">
        </popup-picker>
        <x-input class="input-padding" v-show="showVehicleTypeNote" v-model="order.vehicle_type_note"
                 placeholder="车型备注"></x-input>
      </group>

      <group gutter="5px" label-width="4em" label-margin-right="2em" label-align="right" class="last-group">
        <x-textarea placeholder="订单备注信息在这里填写" v-model="order.note"
                    :show-counter="false" :autosize="true" :rows="1">
        </x-textarea>
      </group>

      <group gutter="5px" label-width="4em" label-margin-right="2em" label-align="right" class="last-group">
        <x-input v-model="charges[0].receivable_amount" placeholder="本单收取发货人金额" type="number">
          <img slot="label" class="icon" src="../../assets/income.svg">
        </x-input>
      </group>
      <x-hr/>
    </div>
    <div class="bottom_btn_wrapper">
      <x-button @click.native="submitOrder" type="primary">保存</x-button>
    </div>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {Group, Cell, XInput, PopupPicker, XTextarea, XButton, DatetimeRange, XHr} from 'vux'
  import InputPicker from '../../components/input-picker'
  import XDatetimeRange from '../../components/x-datetime-range'
  import {dateFormat, showToast, replaceEmoji, PICK_VEHICLE_TYPES} from '../../util/utils'
  import API from '../../config/api'

  export default {
    components: {
      Group,
      Cell,
      XInput,
      PopupPicker,
      XTextarea,
      XButton,
      DatetimeRange,
      InputPicker,
      XDatetimeRange,
      XHr
    },
    data() {
      return {
        showVehicleTypePopupPicker: false,
        vehicleTypeName: [],
        vehicleTypes: [PICK_VEHICLE_TYPES],
        order: {
          customer_id: '',
          customer_name: '',
          customer_order_number: '',
          vehicle_type_name: '',
          vehicle_type_note: '',
          cargo_note: '',
          note: ''
        },
        contacts: [
          {
            contact_id: '',
            contact_type: 'sender',
            priority: 1,
            address: '',
            name: '',
            phone_number: '',
            expected_time: ''
          },
          {
            contact_id: '',
            contact_type: 'receiver',
            priority: 2,
            address: '',
            name: '',
            phone_number: '',
            expected_time: ''
          }
        ],
        charges: [
          {
            category: 'receivable',
            name: 'transportation_fee',
            receivable_amount: '',
            currency: 'CNY',
            note: ''
          }
        ]
      }
    },
    created() {
      this.loadDataFromStore();
    },
    beforeDestroy() {
      if (this.vehicleTypeName && this.vehicleTypeName.length) {
        this.order.vehicle_type_name = this.vehicleTypeName[0];
      }
      this.SAVE_ORDER_DATA({order: this.order, contacts: this.contacts, charges: this.charges});
    },
    computed: {
      showCustomerName() {
        return this.order.customer_name ? this.order.customer_name : '选择发货人名称(必填)';
      },
      showVehicleType() {
        return this.order.vehicle_type_name ? this.order.vehicle_type_name : '选择车型';
      },
      showVehicleTypeNote() {
        return this.vehicleTypeName && this.vehicleTypeName[0] === '其他车型';
      }
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER_DATA'
      ]),
      onChangeVehicleType(val) {
        this.order.vehicle_type_name = val[0];
      },
      goContactPage(index) {
        this.$router.push({
          path: '/contact',
          query: {id: this.contacts[index].contact_id, contact_type: index == 0 ? 'sender' : 'receiver'}
        });
      },
      validateForm() {
        if (!this.order.customer_name) {
          showToast.bind(this, '发货人不能为空')();
          return false;
        }
        if (!this.contacts[0].address) {
          showToast.bind(this, '装货地址不能为空')();
          return false;
        }
        if (!this.contacts[1].address) {
          showToast.bind(this, '卸货地址不能为空')();
          return false;
        }
        if (this.contacts[0].expected_time && this.contacts[1].expected_time
          && this.contacts[0].expected_time > this.contacts[1].expected_time) {
          showToast.bind(this, '卸货时间不能早于装货时间')();
          return false;
        }
        return true;
      },
      loadDataFromStore() {
        if (this.$store.state.order && this.$store.state.order.vehicle_type_name) {
          this.vehicleTypeName[0] = this.$store.state.order.vehicle_type_name;
        }

        Object.assign(this.order, this.$store.state.order);

        let contacts = this.$store.state.contacts;
        if (contacts && contacts.length) {
          let length = Math.min(this.contacts.length, contacts.length);
          for (let i = 0; i < length; i++) {
            if (Object.keys(contacts[i]).length) {
              Object.assign(this.contacts[i], contacts[i]);
            }
          }
        }

        let charges = this.$store.state.charges;
        if (charges && charges.length) {
          let length = Math.min(this.charges.length, charges.length);
          for (let i = 0; i < length; i++) {
            if (Object.keys(charges[i]).length) {
              Object.assign(this.charges[i], charges[i]);
            }
          }
        }
      },
      buildPostRequestParam() {
        if (this.order.vehicle_type_name !== '其他车型') {
          this.order.vehicle_type_note = '';
        }
        if (this.order.created_at || this.order.updated_at) {
          delete this.order.created_at;
          delete this.order.updated_at;
        }

        replaceEmoji(this.order, ['customer_order_number', 'cargo_note', 'vehicle_type_note', 'note']);
        replaceEmoji(this.contacts[0], 'address');
        replaceEmoji(this.contacts[1], 'address');

        return {order: this.order, contacts: this.contacts, charges: this.charges};
      },
      submitOrder() {
        if (!this.validateForm()) {
          return;
        }
        if (this.$route.query.id) {
          API.updateOrder(this.buildPostRequestParam()).then(res => {
            showToast.bind(this, '更新成功')();
            setTimeout(_ => {
              this.$router.go(-1);
            }, 1500)
          }, showToast.bind(this))
        } else {
          API.createOrder(this.buildPostRequestParam()).then(res => {
            this.$router.replace({path: '/order/result', query: {id: res.id, order_number: res.order_number}});
          }, error => {
            this.$router.push('/order/result');
          })
        }
      }
    }
  }
</script>

<style lang="less">
  @import '../../style/common';

  .router-view {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .order-form {
      overflow-y: auto;
      .px2rem(margin-bottom, 65);
      background-color: @bg;

      .weui-cell:before {
        ._px2rem(margin-left, 95);
      }

      .weui-cells:after {
        border-bottom: none !important;
      }

      .vux-cell-box:before {
        ._px2rem(margin-left, 70);
      }

      .weui-label {
        color: @placeholder;
        margin-right: 0 !important;
      }

      .icon {
        display: block;
        .px2rem(margin-right, 10);
        .px2rem(width, 60);
      }

      .field-require {
        display: flex;
        align-items: center;
        &:before {
          content: '*';
          color: @blue;
        }
      }

      .icon-child {
        .px2rem(margin-left, 10);
        .px2rem(width, 60);
      }

      .input-padding {
        .px2rem(padding-left, 100);
      }

      .datetime-padding {
        .px2rem(padding-left, 70);
      }

      .cell-tips {
        color: @placeholder;
      }
    }
    .bottom_btn_wrapper {
      .px2rem(padding, 20);
    }
  }
</style>
