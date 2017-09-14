<template>
  <div class="order_report_charge_page">
    <group gutter="0">
      <checker v-model="charge.name" class="selector">
        <checker-item v-for="(value, key) in nameMap" :key="key" :value="key" class="flex-wrapper" :disabled="readonly">
          <span>{{ value }}</span>
          <x-icon :class="selectedClass(key)" type="ios-checkmark-outline" size="30"></x-icon>
        </checker-item>
      </checker>

      <!-- 应收费用 -->
      <div class="charge">
        <img width="30px" height="30px" src="../../assets/income.svg">
        <x-input class="flex" v-model="charge.receivable_amount" required :type="'number'"
                 placeholder="收取费用金额" :disabled="readonly"></x-input>
        <label>对客户可见</label>
        <img v-if="charge.need_report" @click="changeNeedReport(false)" width="30px" height="30px"
             src="../../assets/eye_open.svg">
        <img v-else @click="changeNeedReport(true)" width="30px" height="30px" src="../../assets/eye_close.svg">
      </div>
      <x-hr/>

      <!-- 应付费用 -->
      <div v-if="charge.id" class="charge">
        <img width="30px" height="30px" src="../../assets/expenditure.svg">
        <x-input class="flex" v-model="charge.payable_amount" required :type="'number'"
                 placeholder="支付费用金额" :disabled="readonly"></x-input>
      </div>
      <x-hr/>
      <x-textarea v-model="charge.note" placeholder="其他说明" :disabled="readonly"
                  :show-counter="false" :autosize="true" :rows="1"></x-textarea>
      <x-hr/>
      <img-upload v-if="charge.attachment || !readonly" title="上传费用图片" v-model="charge.attachment"
                  :params="modelAttr" :is-upload="!readonly"></img-upload>
    </group>

    <flexbox style="padding: 10px;">
      <flexbox-item>
        <x-button link="BACK" plain>返回</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button :disabled="!isSelectedName" @click.native="saveCharge" type="primary">提交附加费</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XInput, XTextarea, XHr, Checker, CheckerItem, XButton, Flexbox, FlexboxItem} from 'vux'
  import {saveOrderCharge} from '../../config/api'
  import ImgUpload from '../../components/img-upload'
  import {getStore, showToast, replaceEmoji} from '../../util/utils'

  export default {
    components: {Group, XInput, XTextarea, XHr, Checker, CheckerItem, XButton, Flexbox, FlexboxItem, ImgUpload},
    data () {
      let constantMap = getStore('CONSTANT_MAP');
      return {
        readonly: false,
        object_name: 'order_charge',
        orderId: null,
        nameMap: constantMap.order_charge.name,
        charge: {
          id: null,
          order_id: null,
          category: null,
          name: null,
          receivable_amount: null,
          payable_amount: null,
          need_report: true,
          currency: 'CNY',
          note: null,
          attachment: null
        }
      }
    },
    computed: {
      modelAttr(){
        let object_id = this.charge.id || 0;
        return {
          object_name: this.object_name,
          object_id: object_id
        }
      },
      isSelectedName(){
        return this.charge.name && this.charge.name.length > 0;
      }
    },
    created(){
      Object.assign(this.charge, this.$route.query);
      if (this.charge.status && this.charge.status == 'effective') {
        this.charge.need_report = false;
      }
      if (this.readonly) {
        document.title = '查看附加费';
      }
    },
    methods: {
      checkParams(){
        if (!this.charge.receivable_amount) {
          showToast.bind(this, '请填写附加费金额')();
          return false;
        }
        return true;
      },
      saveCharge(){
        if (this.checkParams()) {
          replaceEmoji(this.charge, 'note');
          saveOrderCharge(this.charge).then(res => {
            this.$router.go(-1);
          }, showToast.bind(this));
        }
      },
      selectedClass(chargeName){
        return this.charge.name == chargeName ? 'selected_icon' : 'unselected_icon';
      },
      changeNeedReport(bool){
        if (this.readonly) {
          return;
        }
        this.charge.need_report = bool;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../../style/theme';

  .order_report_charge_page {
    .weui-cell:before {
      border-top: none !important;
    }
    .weui-uploader {
      padding: 0 15px;
    }
    .selector {
      .flex-wrapper {
        display: flex;
        padding: 7px 15px;
        border-bottom: 1px solid @grey;
        align-items: center;
        justify-content: space-between;

        .selected_icon {
          fill: @blue;
        }
        .unselected_icon {
          fill: #999999;
        }
      }
    }
    .charge {
      display: flex;
      margin-left: 15px;
      padding-right: 10px;

      img {
        margin: 5px 0;
      }
      label {
        font-size: 14px;
        line-height: 40px;
      }
      .flex {
        flex: 1;
      }
    }
  }
</style>
