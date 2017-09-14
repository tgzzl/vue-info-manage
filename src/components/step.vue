<template>
  <div class="step_wrapper">
    <div class="step-title">
      <span :class="isCompleted(index)" v-for="(title, index) in titles" :key="title">{{title}}</span>
    </div>
    <div class="step">
      <div :class="'task ' + isCompleted(index)" v-for="(title, index) in titles" :key="title">
        <span class="tag">{{index + 1}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      titles: {
        type: Array,
        default(){
          return ['登记运输要求', '登记车辆信息', '分享']
        }
      },
      step: {
        type: Number,
        default: 1
      }
    },
    methods: {
      isCompleted(index){
        return index + 1 <= this.step ? 'completed' : 'uncompleted';
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .step_wrapper {
    background-color: @bg;
    .step-title {
      display: flex;
      padding-top: 10px;
      span {
        flex: 1;
        font-size: 14px;
        text-align: center;
      }
      .completed {
        color: @blue;
      }
    }

    .step {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .task {
        position: relative;
        padding: 10px;
        flex: 1;

        &:before {
          top: 50%;
          left: 0;
          content: '';
          display: block;
          position: absolute;
          width: 50%;
          height: 3px;
          background-color: @gray;
        }

        &:after {
          top: 50%;
          right: 0;
          content: '';
          display: block;
          position: absolute;
          width: 50%;
          height: 3px;
          background-color: @gray;
        }

        &:first-child::before {
          display: none;
        }
        &:last-child::after {
          display: none;
        }

        &.completed::before {
          background-color: @blue;
        }
        &.completed::after {
          background-color: @blue;
        }
        &.completed .tag {
          color: @blue;
          border: 2px solid @blue;
        }
        .tag {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: block;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          z-index: 1;
          background: #fff;
          color: @gray;
          text-align: center;
          border: 2px solid @gray;
        }
      }
    }
  }
</style>
