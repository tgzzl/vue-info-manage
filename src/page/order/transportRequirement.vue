<template>
  <div class="transport_requirement_page">
    <step :step="1"></step>
    <group>
      <x-textarea v-model="transportRequirement.transport_note" placeholder="运输注意事项在这里填写"
                  autosize :show-counter="false" :rows="1"></x-textarea>
      <x-hr/>
      <img-upload v-model="transportRequirement.attachment" :params="attachmentParams" title="提货文件"></img-upload>
    </group>
    <group title="跟踪时间节点">
      <div class="order-task" v-for="task in tasks">需
        <span @click.self="setTaskExpectedTime(task)">
          {{dateFormat(task.expected_time, 'YYYY-MM-DD HH:mm', '(几点)')}}
        </span>{{task.name}}
      </div>
      <x-datetime-range v-model="datetimeValue" :show="showDatetimeRange" :show-cell="false"
                        @on-change="onChangeTaskTime" @on-hide="showDatetimeRange = false">
      </x-datetime-range>
    </group>
    <flexbox style="padding: 10px;background-color: white;">
      <flexbox-item>
        <x-button link="BACK" plain>返回</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button @click.native="onsubmit" type="primary">下一步</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Group, XButton, XTextarea, XHr, Flexbox, FlexboxItem} from 'vux'
  import Step from '../../components/step'
  import ImgUpload from '../../components/img-upload'
  import XDatetimeRange from '../../components/x-datetime-range'
  import {dateFormat, showToast, replaceEmoji, pick} from '../../util/utils'
  import API from '../../config/api'

  export default {
    components: {Group, XButton, XTextarea, XHr, Flexbox, FlexboxItem, Step, ImgUpload, XDatetimeRange},
    data(){
      return {
        orderId: this.$route.query.id,
        showDatetimeRange: false,
        datetimeValue: '',
        transportRequirement: {},
        currentTask: {},
        tasks: [],
        taskExpectedTimes: [],
        attachmentParams: {object_id: this.$route.query.id, object_name: 'order_attachment'}
      }
    },
    mounted(){
      API.fetchOrderTransportRequirement({order_id: this.orderId}).then(res => {
        this.transportRequirement = pick(res, ['attachment', 'transport_note']);
      }, showToast.bind(this));

      API.fetchOrderTasks({order_id: this.orderId}).then(res => {
        this.tasks = res.tasks || this.tasks;
        this.taskExpectedTimes = this.tasks.map(item => {
          return item.expected_time;
        });
        this.datetimeValue = this.taskExpectedTimes.slice().sort()[0];
      }, showToast.bind(this));
    },
    methods: {
      dateFormat,
      setTaskExpectedTime(task){
        this.currentTask = task;
        this.datetimeValue = this.currentTask.expected_time;
        this.showDatetimeRange = true;
      },
      onChangeTaskTime(value){
        this.currentTask.expected_time = value && value.length ? `${value[0]} ${value[1]}:${value[2]}` : '';
      },
      onsubmit(){
        this.tasks.forEach((item, index) => {
          if (this.taskExpectedTimes[index] != item.expected_time) {
            API.({id: item.id, expected_time: item.expected_time});
          }
        });

        replaceEmoji(this.transportRequirement, 'transport_note');
        this.transportRequirement.order_id = this.orderId;
        API.saveOrderTransportRequirement(this.transportRequirement).then(res => {
          this.$router.push({path: '/order_dispatch_info/new', query: {id: this.orderId}});
        }, showToast.bind(this));
      }
    }
  }
</script>

<style lang="less">
  @import "../../style/theme";

  .transport_requirement_page {
    .vux-x-hr:before {
      left: 15px !important;
      right: 15px !important;
    }
    background-color: @bg;
    .weui-uploader {
      padding: 10px 15px !important;
    }
    .order-task {
      padding: 15px;
      border-bottom: 1px solid @grey;
      &:last-child {
        border: none;
      }
      span {
        color: @blue;
      }
    }
  }
</style>
