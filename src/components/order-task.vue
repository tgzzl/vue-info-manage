<template>
  <div :class="className">
    <div style="display: flex;">
      <div style="flex: 1;">
        <span>需</span>
        <template v-if="orderNotCompleted && notCompleted">
          <x-datetime-range v-model="orderTask.expected_time" :show="showDatetimeRange" :show-cell="false"
                            @on-change="updateTaskExpectedTime" @on-hide="showDatetimeRange = false" class="datetime">
          </x-datetime-range>
          <span class="link" @click.self="showDatetimeRange=true">{{ formatTaskDate }}</span>
        </template>
        <span v-else>{{ formatTaskDate }}</span>
        <span>{{ orderTask.name }}</span>
        <img-upload v-model="orderTask.attachment" :params="orderTaskModel" :is-upload="orderNotCompleted"></img-upload>
      </div>

      <div class="right">
        <div v-if="!orderNotCompleted && notCompleted">未完成</div>
        <div v-else-if="orderNotCompleted && notCompleted" class="operator">
          <x-icon class="execute_btn" type="ios-checkmark-outline" size="45" @click="executeTask"></x-icon>
        </div>
        <div v-else class="actual_time">
          <div>{{ dateFormat(orderTask.actual_time, 'HH:mm') }} {{ taskStatus }}</div>
          <x-icon class="executed_btn" type="ios-checkmark-outline" size="45"></x-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ImgUpload from './img-upload'
  import XDatetimeRange from './x-datetime-range'
  import {dateFormat} from '../util/utils'
  import {updateOrderTask, executeOrderTask, updateOrderTaskAttachment} from '../config/api'

  export default {
    components: {ImgUpload, XDatetimeRange},
    props: {
      orderTask: {
        type: Object,
        default(){
          return {}
        }
      },
      orderNotCompleted: Boolean,
      location: Object
    },
    data () {
      return {
        showDatetimeRange: false,
        taskCompletedStatus: 'completed'
      }
    },
    watch: {
      'orderTask.attachment'(val){
        updateOrderTaskAttachment({
          id: this.orderTask.id,
          attachment: val
        }).then(null, this.showToast)
      }
    },
    computed: {
      orderTaskModel(){
        return {
          object_name: 'order_task',
          object_id: this.orderTask.id
        }
      },
      notCompleted(){
        return this.orderTask.status != this.taskCompletedStatus;
      },
      isNeedAttachment(){
        return this.orderTask.need_attachment ? true : false;
      },
      taskStatus(){
        return '已完成';
      },
      className(){
        return this.notCompleted ? 'order_task_wrapper' : 'order_task_wrapper order_task_wrapper_completed'
      },
      formatTaskDate(){
        return this.dateFormat(this.orderTask.expected_time, 'MM-DD HH:mm', '(几点)');
      }
    },
    methods: {
      dateFormat,
      updateTaskExpectedTime(val){
        // 阻止初始化时去更新数据
        if (!val || val.length == 0) return;
        let time = `${val[0]} ${val[1]}:${val[2]}`;
        if (time == this.orderTask.expected_time) return;
        this.orderTask.expected_time = time;
        updateOrderTask({
          id: this.orderTask.id,
          expected_time: time
        }).then(null, this.showToast);
      },
      executeTask(){
        if (this.notCompleted) {
          if (this.isNeedAttachment && (this.orderTask.attachment == null || this.orderTask.attachment.length == 0)) {
            this.showToast('需要上传附件才能完成任务');
            return;
          }
          let param = {id: this.orderTask.id};
          if (this.location.longitude && this.location.latitude) {
            param.location = this.location;
          }
          executeOrderTask(param).then(res => {
            this.orderTask.actual_time = dateFormat(new Date());
            this.orderTask.status = this.taskCompletedStatus;
          }, this.showToast);
        }
      },
      showToast(msg){
        this.$vux.toast.text(msg);
      },
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .order_task_wrapper {
    padding: 10px 5px 0 15px;
    font-size: 14px;
    border-bottom: 1px solid lightgray;

    .right {
      text-align: right;

      .executed_btn {
        fill: @blue;
      }
      .execute_btn {
        fill: @grey;
      }
    }
    .link {
      color: @blue;
    }
    .datetime {
      display: inline-block !important;
    }
  }

  .order_task_wrapper_completed {
    color: #999999;
    span, div {
      color: #999999;
    }
  }
</style>
