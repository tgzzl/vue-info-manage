<template>
  <div class="order_show_for_on_way_page">
    <group title="订单信息">
      <div class="flex-wrapper">
        <img style="margin-right: 10px;" width="25" height="25" src="../../assets/sender_address.svg">
        <div class="flex">
          <span>{{ sender.address }}</span><br/>
          <label v-if="sender.name || sender.phone_number">{{ sender.name }}&nbsp;{{ sender.phone_number }}<br/></label>
          <label v-if="sender.expected_time">装货时间：{{ dateFormat(sender.expected_time) }}<br/></label>
          <label v-if="order.cargo_note">{{ order.cargo_note }}</label>
        </div>
        <a v-if="sender.phone_number" :href="`tel:${sender.phone_number}`">
          <img style="margin-top: 22px;" width="25" height="25" src="../../assets/phone_blue.svg">
        </a>
      </div>
      <x-hr/>
      <div class="flex-wrapper">
        <img style="margin-right: 10px;" width="25" height="25" src="../../assets/receiver_address.svg">
        <div class="flex">
          <span>{{ receiver.address }}</span><br/>
          <label v-if="receiver.name || receiver.phone_number">{{ receiver.name }}&nbsp;{{ receiver.phone_number }}<br/></label>
        </div>
        <a v-if="receiver.phone_number" :href="`tel:${receiver.phone_number}`">
          <img style="margin-top: 22px;" width="25" height="25" src="../../assets/phone_orange.svg">
        </a>
      </div>
    </group>

    <group title="提货注意事项" v-if="order.transport_note || order.attachment">
      <div class="row" v-if="order.transport_note">{{ order.transport_note }}</div>
      <x-hr/>
      <img-upload v-if="order.attachment" v-model="order.attachment" :is-upload="false"
                  title="提货文件" style="padding: 3px 15px;">
      </img-upload>
    </group>

    <group title="我的运输任务">
      <order-task v-for="task in tasks" :key="task.id" :location="location"
                  :orderTask="task" :orderNotCompleted="notCompleted"></order-task>
    </group>

    <group title="异常">
      <cell-box v-if="notCompleted" is-link :link="reportExceptionRoute">上报异常</cell-box>
      <div v-for="exception in exceptions" :key="exception.id" class="exception_item">
        <div class="exception flex-wrapper small_vertical_padding">
          <div class="flex">
            <label @click="editOrderException(exception)">
              异常-{{ exceptionType(exception.exception_type) }} {{ exception.note }}
            </label>
            <img-upload v-if="exception.attachment" v-model="exception.attachment" :is-upload="false"></img-upload>
          </div>
          <div v-if="isReported(exception)" class="eye_wrapper">
            <img width="20" height="20" src="../../assets/eye_open.svg">
            <span>可见</span>
          </div>
          <div v-else @click.stop="reportException(exception)" class="eye_wrapper">
            <img width="20" height="20" src="../../assets/eye_close.svg">
            <span>不可见</span>
          </div>
        </div>
      </div>
    </group>

    <group title="费用">
      <cell-box v-if="notCompleted" is-link :link="reportChargeRoute">上报附加费</cell-box>
      <div v-for="charge in additionalCharges" :key="charge.id" class="charge_item">
        <div class="flex-wrapper small_vertical_padding">
          <div @click="editOrderCharge(charge)" class="flex">
            <div class="flex_between">
              <div class="flex-wrapper small_vertical_padding">
                <img width="25" height="25" src="../../assets/income.svg">
                <div class="flex">{{ receivableMoneyDesc(charge) }}</div>
              </div>
              <div class="flex-wrapper small_vertical_padding">
                <img width="25" height="25" src="../../assets/expenditure.svg">
                <div class="flex">{{ payableMoneyDesc(charge) }}</div>
              </div>
            </div>
            <div v-if="isExistNote(charge)">其他费用说明：{{ charge.note}}</div>
          </div>
          <div v-if="isReported(charge)" class="eye_wrapper">
            <img width="20" height="20" src="../../assets/eye_open.svg">
            <span>可见</span>
          </div>
          <div v-else @click.stop="reportCharge(charge)" class="eye_wrapper">
            <img width="20" height="20" src="../../assets/eye_close.svg">
            <span>不可见</span>
          </div>
        </div>
        <img-upload v-if="charge.attachment" v-model="charge.attachment" :is-upload="false"></img-upload>
      </div>
    </group>

    <div v-if="notCompleted">
      <div class="hint">请确认所有的任务已做完，异常和费用已登记再结束订单！</div>
      <div class="flex-wrapper">
        <x-button link="BACK" plain class="flex" style="margin:15px 10px 0 0">返回列表</x-button>
        <x-button class="flex" type="primary" @click.native="showConfirm">结束订单</x-button>
      </div>
    </div>

  </div>
</template>

<script>
  import {Group, CellBox, XButton, XHr} from 'vux'
  import {
    fetchOrderMultipleInfo,
    fetchConstantMap,
    updateOrderCompleted,
    reportOrderCharge,
    reportOrderException
  } from '../../config/api'
  import ImgUpload from '../../components/img-upload'
  import OrderTask from '../../components/order-task'
  import {setStore, getStore, dateFormat, showToast, omit} from '../../util/utils'

  export default {
    components: {Group, CellBox, XButton, XHr, ImgUpload, OrderTask},
    data () {
      return {
        order: {},
        sender: {},
        receiver: {},
        tasks: [],
        exceptions: [],
        charges: [],
        additionalCharges: [],
        chargeNameMap: {},
        exceptionTypeMap: {},
        location: {collect_time: dateFormat(new Date())}
      }
    },
    created(){
      let orderId = this.$route.query.id;
      this.$store.commit('UPDATE_LOADING_STATUS', true);

      fetchOrderMultipleInfo(orderId).then(res => {
        this.$store.commit('UPDATE_LOADING_STATUS', false);

        this.$wechat.ready(this.getLocation);

        this.order = res.order || this.order;
        this.order.attachment = res.attachment;
        this.order.transport_note = res.transport_note;
        this.sender = res.contacts[0] || this.sender;
        this.receiver = res.contacts[1] || this.receiver;
        this.dispatchInfo = res.dispatch_info || this.dispatchInfo;
        this.exceptions = res.exceptions || this.exceptions;
        this.charges = res.charges || this.charges;

        this.tasks = (res.tasks || this.tasks).map(item => {
          item.expected_time = dateFormat(item.expected_time);
          return item;
        });
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
      notCompleted(){
        return this.order.status != 'completed';
      },
      reportExceptionRoute(){
        return '/order_exception/edit?order_id=' + this.order.id;
      },
      reportChargeRoute(){
        return '/order_charge/edit?order_id=' + this.order.id;
      }
    },
    methods: {
      dateFormat,
      editOrderException(exception){
        if (!this.notCompleted) return;
        this.linkTo('/order_exception/edit', this.prepareParams(exception));
      },
      editOrderCharge(charge){
        if (!this.notCompleted) return;
        this.linkTo('/order_charge/edit', this.prepareParams(charge));
      },
      prepareParams(object){
        object.title = true; // 触发标题切换
        object.order_id = this.order.id;
        return omit(object, ['created_at', 'updated_at', 'geographical_location_id']);
      },
      linkTo(url, params = {}){
        this.$router.push({path: url, query: params});
      },
      showConfirm(){
        let that = this;
        this.$vux.confirm.show({
          title: '消息',
          content: '请确认所有的任务已做完，异常和费用已登记再结束订单！已结束订单后将不能再操作咯，您确定要结束？',
          onConfirm(){
            that.toCompleted();
          }
        });
      },
      toCompleted(){
        updateOrderCompleted(this.order.id).then(res => {
          this.$router.go(-1);
        }, showToast.bind(this));
      },
      chargeName(name){
        return this.chargeNameMap[name];
      },
      formatCharge(charge){
        return charge && charge != undefined ? charge : 0.0;
      },
      receivableMoneyDesc(charge){
        return `收取${this.chargeName(charge.name)}¥${this.formatCharge(charge.receivable_amount)}`;
      },
      payableMoneyDesc(charge){
        return `支付${this.chargeName(charge.name)}¥${this.formatCharge(charge.payable_amount)}`;
      },
      isReported(object){
        return object.status && object.status == 'submitted';
      },
      reportCharge(charge){
        if (!this.notCompleted) return;
        reportOrderCharge({id: charge.id}).then(res => {
          charge.status = 'submitted';
        }, showToast.bind(this));
      },
      reportException(exception){
        if (!this.notCompleted) return;
        reportOrderException({id: exception.id}).then(res => {
          exception.status = 'submitted';
        }, showToast.bind(this));
      },
      exceptionType(type){
        return (this.exceptionTypeMap[type] || '');
      },
      isExistNote(object){
        return object && object.note && object.note.length > 0;
      },
      getLocation(){
        this.$wechat.getLocation({
          type: 'gcj02',
          success: res => Object.assign(this.location, res)
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_show_for_on_way_page {
    font-size: 16px;
    background-color: @bg;

    .row {
      padding: 10px 15px;
    }

    .flex-wrapper {
      display: flex;
      padding: 15px;

      .flex {
        flex: 1;
      }
    }
    .exception_item, .charge_item {
      padding: 5px 15px;
      font-size: 14px;
      border-top: 1px solid lightgray;
    }
    .hint {
      color: @gray;
      font-size: 12px;
      text-align: center;
      margin-top: 15px;
      margin-bottom: -15px;
    }
    .small_vertical_padding {
      padding: 5px 0;
    }
    .flex-around {
      justify-content: space-between;
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
