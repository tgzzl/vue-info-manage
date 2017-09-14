<template>
  <div class="order_report_exception_page">
    <group gutter="0">
      <checker v-model="exception.exception_type" class="selector">
        <checker-item v-for="(value, key) in exceptionMap" :key="key" :value="key" class="flex-wrapper"
                      :disabled="readonly">
          <span>{{ value }}</span>
          <x-icon :class="selectedClass(key)" type="ios-checkmark-outline" size="30"></x-icon>
        </checker-item>
      </checker>

      <x-textarea v-model="exception.note" placeholder="异常备注" :disabled="readonly"
                  :show-counter="false" :autosize="true" :rows="1"></x-textarea>
      <x-hr/>

      <img-upload v-if="exception.attachment || !readonly" title="上传异常照片" v-model="exception.attachment"
                  :params="modelAttr" :is-upload="!readonly"></img-upload>

      <x-hr/>
      <div class="need_report">
        设置对客户可见
        <img v-if="exception.need_report" @click="changeNeedReport(false)" width="30px" height="30px"
             src="../../assets/eye_open.svg">
        <img v-else @click="changeNeedReport(true)" width="30px" height="30px" src="../../assets/eye_close.svg">
      </div>
    </group>

    <flexbox style="padding: 10px;">
      <flexbox-item>
        <x-button link="BACK" plain>返回</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button :disabled="!isSelectedType" @click.native="saveException" type="primary">提交异常</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XInput, XTextarea, XHr, Checker, CheckerItem, XButton, Flexbox, FlexboxItem} from 'vux'
  import {saveOrderException} from '../../config/api'
  import ImgUpload from '../../components/img-upload'
  import {getStore, showToast, dateFormat, replaceEmoji} from '../../util/utils'

  export default {
    components: {Group, XInput, XTextarea, XHr, Checker, CheckerItem, XButton, Flexbox, FlexboxItem, ImgUpload},
    data () {
      let constantMap = getStore('CONSTANT_MAP');
      return {
        readonly: false,
        object_name: 'order_exception',
        orderId: null,
        exceptionMap: constantMap.order_exception.exception_type,
        exception: {
          id: null,
          order_id: null,
          category: null,
          exception_type: null,
          note: null,
          attachment: null,
          need_report: false
        },
        location: {collect_time: dateFormat(new Date())}
      }
    },
    computed: {
      modelAttr(){
        let object_id = this.exception.id || 0;
        return {
          object_name: this.object_name,
          object_id: object_id
        }
      },
      isSelectedType(){
        return this.exception.exception_type && this.exception.exception_type.length > 0;
      }
    },
    created(){
      Object.assign(this.exception, this.$route.query);
      if (this.exception.id) {
        this.exception.need_report = (this.exception.status == 'submited');
      }
      if (this.readonly) {
        document.title = '查看异常';
      }
      this.$wechat.ready(this.getLocation);
    },
    methods: {
      saveException(){
        replaceEmoji(this.exception, 'note');
        let params = {exception: this.exception};
        if (this.location.longitude && this.location.latitude) {
          params.location = this.location;
        }
        saveOrderException(params).then(res => {
          this.$router.go(-1);
        }, showToast.bind(this));
      },
      selectedClass(exceptionType){
        return this.exception.exception_type == exceptionType ? 'selected_icon' : 'unselected_icon';
      },
      changeNeedReport(){
        if (this.readonly) {
          return;
        }
        this.exception.need_report = !this.exception.need_report;
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

  .order_report_exception_page {
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
        border-bottom: 1px solid #D9D9D9;
        align-items: center;
        justify-content: space-between;
      }
      .selected_icon {
        fill: @blue;
      }
      .unselected_icon {
        fill: #999999;
      }
    }
    .need_report {
      display: flex;
      padding: 10px 15px;
      justify-content: space-between;
    }
  }
</style>
