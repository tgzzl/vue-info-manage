<template>
  <div class="order_show_page">
    <section>
      <nav>订单详情
        <span v-if="!isOrderCompleted" class="edit" @click.self.once="goOrderEditPage">编辑订单</span>
      </nav>
      <!-- 发货人 -->
      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/customer.svg">
        <div class="flex">
          <span>{{ order.customer_name}}</span><br/>
          <label v-if="order.customer_contact_name || order.customer_phone_number">
            {{ order.customer_contact_name}} {{ order.customer_phone_number}}<br/>
          </label>
          <label v-if="order.customer_order_number">发货人单号：{{ order.customer_order_number }}</label>
        </div>
      </div>
      <x-hr/>
      <!-- 装货地址 -->
      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/sender_address.svg">
        <div class="flex">
          <span>{{ sender.address}}<br/></span>
          <label v-if="sender.name || sender.phone_number">{{ sender.name }}&nbsp;{{ sender.phone_number }}<br/></label>
          <label v-if="sender.expected_time">装货时间：{{ dateFormat(sender.expected_time) }}<br/></label>
          <label>{{ cargoInfo }}</label>
        </div>
      </div>
      <x-hr/>
      <!-- 卸货地址 -->
      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/receiver_address.svg">
        <div class="flex">
          <span>{{ receiver.address}}<br/></span>
          <label v-if="receiver.name || receiver.phone_number">{{ receiver.name }}&nbsp;{{ receiver.phone_number
            }}<br/></label>
          <label v-if="receiver.expected_time">卸货时间：{{ dateFormat(receiver.expected_time) }}<br/></label>
        </div>
      </div>
      <x-hr/>
      <!-- 车型 -->
      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth*2/3" src="../../assets/car.svg">
        <div class="flex">{{order.vehicle_type_name || '无'}}<span><br/>{{order.vehicle_type_note}}</span></div>
      </div>
      <x-hr/>
      <!-- 备注 -->
      <div v-if="order.note" class="note">{{ order.note }}</div>
      <x-hr/>
      <!-- 金额 -->
      <div v-if="orderMoney" class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/income.svg">
        <div class="flex">{{ orderMoney }}</div>
      </div>
    </section>

    <!-- 承运信息 -->
    <section v-if="hasDispatchInfo">
      <nav>承运信息
        <span v-if="!isOrderCompleted" class="edit" @click.self.once="goDispatchInfoEditPage">编辑承运信息</span>
      </nav>
      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/fleet.svg">
        <div class="flex">车队：{{ dispatchInfo.fleet_name }}</div>
      </div>

      <x-hr/>

      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/driver.svg">
        <div class="flex">
          <div class="driver-vehicle">
            <span>司机：{{ dispatchInfo.driver_name }}</span>
            <span>电话：{{ dispatchInfo.driver_phone_number }}</span>
          </div>
          <div>车牌号：{{ dispatchInfo.plate_no }}</div>
          <div>车型：{{ dispatchInfo.vehicle_type_name }}</div>
          <div v-if="dispatchInfo.vehicle_type_note">备注：{{ dispatchInfo.vehicle_type_note }}</div>
        </div>
      </div>

      <x-hr/>

      <div class="flex-wrapper">
        <img class="icon" :width="iconWidth" :height="iconWidth" src="../../assets/expenditure.svg">
        <div class="flex">{{ payableTransportationFee }}</div>
      </div>
    </section>

    <!-- 运输要求信息 -->
    <section v-if="order.transport_note || order.attachment">
      <nav>提货注意事项</nav>
      <div class="section-body">
        <div v-if="order.transport_note">{{order.transport_note}}</div>
        <img-upload v-if="order.attachment" :is-upload="false" v-model="order.attachment"></img-upload>
      </div>
    </section>

    <!-- 任务信息 -->
    <section v-if="tasks && tasks.length">
      <nav>跟踪时间节点</nav>
      <div class="section-body" v-for="task in tasks">
        <div class="order-task">
          <div class="left">
            需{{dateFormat(task.expected_time, 'MM-DD HH:mm')}}{{task.name}}
            <img-upload v-if="task.attachment" :is-upload="false" v-model="task.attachment"></img-upload>
          </div>
          <div v-if="task.status == 'completed'" class="right">
            <span class="actual_time">{{dateFormat(task.actual_time, 'HH:mm')}} 已完成</span>
            <x-icon type="ios-checkmark-outline" size="45"></x-icon>
          </div>
        </div>
      </div>
    </section>

    <!-- 异常信息 -->
    <section v-if="exceptions && exceptions.length">
      <nav>异常信息</nav>
      <div class="section-body exception flex-wrapper" v-for="exception in exceptions">
        <div class="flex">
          <span @click="editOrderException(exception)">
            异常-{{exceptionType(exception.exception_type)}}：{{exception.note}}
          </span>
          <img-upload v-if="exception.attachment" :is-upload="false" v-model="exception.attachment"></img-upload>
        </div>
        <div v-if="isReported(exception)" class="eye_wrapper">
          <img :width="iconWidth" :height="iconWidth" src="../../assets/eye_open.svg">
          <span>可见</span>
        </div>
        <div v-else class="eye_wrapper">
          <img width="20" height="20" src="../../assets/eye_close.svg">
          <span>不可见</span>
        </div>
      </div>
    </section>

    <!-- 费用信息 -->
    <section v-if="additionalCharges && additionalCharges.length">
      <nav>费用信息</nav>
      <div class="section-body charge" v-for="charge in additionalCharges">
        <div class="flex-wrapper small_vertical_padding">
          <div @click="editOrderCharge(charge)" class="flex">
            <div class="flex_between">
              <div class="flex-wrapper small_vertical_padding">
                <img :width="iconWidth" :height="iconWidth" src="../../assets/income.svg">
                <div class="flex">{{ receivableMoneyDesc(charge) }}</div>
              </div>
              <div class="flex-wrapper small_vertical_padding">
                <img :width="iconWidth" :height="iconWidth" src="../../assets/expenditure.svg">
                <div class="flex">{{ payableMoneyDesc(charge) }}</div>
              </div>
            </div>
            <div v-if="isExistNote(charge)">其他费用说明：{{ charge.note }}</div>
          </div>
          <div v-if="isReported(charge)" class="eye_wrapper">
            <img :width="iconWidth" :height="iconWidth" src="../../assets/eye_open.svg">
            <span>可见</span>
          </div>
          <div v-else class="eye_wrapper">
            <img width="20" height="20" src="../../assets/eye_close.svg">
            <span>不可见</span>
          </div>
        </div>
        <img-upload v-if="charge.attachment" :is-upload="false" v-model="charge.attachment"></img-upload>
      </div>
    </section>

    <!-- 在途 -->
    <section v-if="needShowOnWayInfo" class="operator">
      <div class="description">您还没有加入我的在途，加入后去跟踪订单</div>
      <x-button @click.native="changeOnWay" type="primary">+加入我的在途</x-button>
    </section>

    <toolbar/>
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import {XButton, XHr} from 'vux'
  import ImgUpload from '../../components/img-upload'
  import Toolbar from '../../components/toolbar'
  import {getStore, setStore, dateFormat, showToast, omit} from '../../util/utils'
  import {fetchConstantMap, fetchOrderMultipleInfo, updateOrderToOnWay,} from '../../config/api'

  export default {
    components: {XButton, XHr, ImgUpload, Toolbar},
    data () {
      return {
        iconWidth: 25,
        order: {},
        sender: {},
        receiver: {},
        charges: [],
        additionalCharges: [],
        dispatchInfo: {},
        tasks: [],
        exceptions: [],
        chargeNameMap: [],
        exceptionTypeMap: []
      }
    },
    created(){
      let orderId = this.$route.query.id;
      this.$store.commit('UPDATE_LOADING_STATUS', true);

      fetchOrderMultipleInfo(orderId).then(res => {
        this.$store.commit('UPDATE_LOADING_STATUS', false);

        this.order = res.order || this.order;
        this.order.attachment = res.attachment;
        this.order.transport_note = res.transport_note;
        this.sender = res.contacts[0] || this.sender;
        this.receiver = res.contacts[1] || this.receiver;
        this.dispatchInfo = res.dispatch_info || this.dispatchInfo;
        this.tasks = res.tasks || this.tasks;
        this.exceptions = res.exceptions || this.exceptions;
        this.charges = res.charges || this.charges;

        this.additionalCharges = this.charges.filter(item => {
          return item.category == 'additional';
        });
      }, error => {
        this.$store.commit('UPDATE_LOADING_STATUS', false);
      });

      let constantMap = getStore('CONSTANT_MAP');
      if (constantMap && constantMap.order_charge) {
        this.chargeNameMap = constantMap.order_charge.name;
        this.exceptionTypeMap = constantMap.order_exception.exception_type;
      } else {
        fetchConstantMap().then(res => {
          setStore('CONSTANT_MAP', res);
          this.chargeNameMap = res.order_charge.name;
          this.exceptionTypeMap = res.order_exception.exception_type;
        });
      }
    },
    computed: {
      cargoInfo(){
        return this.emptyCheck(this.order.cargo_note, '无货物信息');
      },
      orderMoney(){
        let transportFee = this.charges.filter(item => {
          return item.category == 'receivable' && item.name == 'transportation_fee';
        })[0];
        return transportFee && transportFee.receivable_amount ? transportFee.receivable_amount : '';
      },
      payableTransportationFee(){
        return this.dispatchInfo.payable_transportation_fee ? this.dispatchInfo.payable_transportation_fee : '无';
      },
      isOrderCompleted(){
        return this.order.status == 'completed';
      },
      hasDispatchInfo(){
        return this.dispatchInfo.id > 0;
      },
      needShowOnWayInfo(){
        return this.order.status == 'created';
      },
    },
    methods: {
      ...mapMutations([
        'SAVE_ORDER_DATA'
      ]),
      dateFormat,
      emptyCheck(value, def){
        return value == undefined || value.length == 0 ? def : value;
      },
      goOrderEditPage(){
        let contacts = [this.sender, this.receiver];
        this.SAVE_ORDER_DATA({order: this.order, contacts: contacts, charges: this.charges});
        this.$router.push({path: '/order/edit', query: {id: this.order.id, title: true}});
      },
      chargeName(name){
        return (this.chargeNameMap[name] || '');
      },
      exceptionType(type){
        return (this.exceptionTypeMap[type] || '');
      },
      formatCharge(charge){
        return charge && charge != undefined ? charge : 0.0;
      },
      receivableMoneyDesc(charge){
        return `收取${this.chargeName(charge.name)} ¥${this.formatCharge(charge.receivable_amount)}`;
      },
      payableMoneyDesc(charge){
        return `支付${this.chargeName(charge.name)} ¥${this.formatCharge(charge.payable_amount)}`;
      },
      goDispatchInfoEditPage(){
        this.$router.push({path: '/order_dispatch_info/edit', query: {id: this.order.id}});
      },
      changeOnWay(){
        updateOrderToOnWay(this.order.id).then(res => {
          this.order.status = 'delivering';
          showToast.bind(this, '加入成功！')();
        }, showToast.bind(this))
      },
      isReported(object){
        return object.status && object.status == 'submitted';
      },
      isExistNote(object){
        return object && object.note && object.note.length > 0;
      },
      editOrderCharge(charge){
        if (this.isOrderCompleted) {
          this.linkTo('/order_charge/edit', this.prepareParams(charge));
        }
      },
      editOrderException(exception){
        if (this.isOrderCompleted) {
          this.linkTo('/order_exception/edit', this.prepareParams(exception));
        }
      },
      prepareParams(object){
        object.title = true; // 触发标题切换
        object.order_id = this.order.id;
        return omit(object, ['created_at', 'updated_at', 'status', 'geographical_location_id']);
      },
      linkTo(url, params = {}){
        this.$router.push({path: url, query: params});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_show_page {
    background-color: @bg;
    padding-bottom: 55px;
    label {
      color: gray;
      font-size: 14px;
    }
    nav {
      display: flex;
      font-size: 14px;
      padding: 0 15px;
      justify-content: space-between;
      color: gray;
      .edit {
        color: @blue;
      }
    }
    .icon {
      margin-right: 10px;
    }
    .flex-wrapper {
      display: flex;
      padding: 15px;
      background-color: white;
      .flex {
        flex: 1;
      }
      .right {
        text-align: right;
      }
    }
    .driver-vehicle {
      display: flex;
      justify-content: space-between;
    }
    .note {
      padding: 15px;
      background-color: white;
    }

    .operator {
      padding: 10px;

      span {
        color: white;
        padding: 0 5px;
      }
    }
    .description {
      color: gray;
      font-size: 14px;
      text-align: center;
    }

    .weui-uploader {
      padding: 0 !important;
    }

    .section-body {
      padding: 10px 15px;
      border-top: 1px solid @grey;
      background-color: white;

      span.actual_time {
        display: block;
      }
    }
    .charge {
      font-size: 14px;
    }
    .exception {
      font-size: 14px;
    }
    .small_vertical_padding {
      padding: 5px 0;
    }
    .order-task {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .right {
        text-align: right;
        svg {
          margin-bottom: -10px;
        }
      }
    }
    .eye_wrapper {
      text-align: center;
      padding-left: 10px;
      span {
        display: block;
        margin-top: -10px;
        font-size: 12px;
      }
    }
  }
</style>
