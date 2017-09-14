<template>
  <div class="weui-cell"
       :class="{'vux-tap-active': isLink || !!link, 'weui-cell_access': isLink || !!link, 'vux-cell-no-border-intent': !borderIntent}">
    <div class="weui-cell__hd">
      <slot name="icon"></slot>
    </div>
    <div class="vux-cell-bd" :class="{'vux-cell-primary': primary === 'title' && valueAlign !== 'left'}">
      <p>
        <label class="vux-label" :style="getLabelStyles()" v-if="title">{{title}}</label>
        <slot name="after-title"></slot>
      </p>
    </div>
    <div class="weui-cell__ft" :class="valueClass">
      <!-- <x-input :placeholder="placeholder" v-model="currentValue.address" class="x-input"
               v-show="showInput" @on-change="onInputChange"></x-input> -->
      <x-textarea class="x-input" :placeholder="placeholder" v-model="currentValue.address" v-show="showInput"
                  :show-counter="false" :autosize="true" :rows="1" @on-change="onInputChange">
      </x-textarea>
      <div v-show="!showInput" class="flex-display">
        <slot name="pickerValue"></slot>
        <slot><span class="vux-cell-primary">{{currentValue.address}}</span></slot>
        <icon type="clear" v-show="true" @click.native="clearPicker"></icon>
      </div>
      <i class="weui-loading" v-if="isLoading"></i>
    </div>
    <slot name="child"></slot>
  </div>
</template>

<script>
  import {Icon, XInput, XTextarea} from 'vux'
  export default {
    components: {Icon, XInput, XTextarea},
    props: {
      title: [String, Number],
      placeholder: String,
      value: Object,
      isLink: Boolean,
      isLoading: Boolean,
      inlineDesc: [String, Number],
      primary: {
        type: String,
        default: 'title'
      },
      link: [String, Object],
      valueAlign: [String, Boolean, Number],
      borderIntent: {
        type: Boolean,
        default: true
      },
      arrowDirection: String // down or up
    },
    data () {
      return {
        showInput: true,
        currentValue: {}
      }
    },
    created () {
      this.currentValue = this.value;
      this.showInput = this.currentValue.contact_id ? false : true;
    },
    watch: {
      currentValue (val) {
        this.currentValue = val;
        this.showInput = this.currentValue.contact_id ? false : true;
      }
    },
    computed: {
      valueClass () {
        return {
          'vux-cell-primary': this.primary === 'content' || this.valueAlign === 'left',
          'vux-cell-align-left': this.valueAlign === 'left',
          'vux-cell-arrow-transition': !!this.arrowDirection,
          'vux-cell-arrow-up': this.arrowDirection === 'up',
          'vux-cell-arrow-down': this.arrowDirection === 'down'
        }
      },
    },
    methods: {
      getLabelStyles () {
        return {
          width: this.$parent.labelWidth || this.$parent.$parent.labelWidth,
          textAlign: this.$parent.labelAlign || this.$parent.$parent.labelAlign,
          marginRight: this.$parent.labelMarginRight || this.$parent.$parent.labelMarginRight
        }
      },
      clearPicker () {
        this.currentValue.contact_id = null;
        this.currentValue.address = '';
        this.showInput = true;
      },
      onInputChange (val) {
        if (this.currentValue.contact_id) {
          this.showInput = false;
          return;
        }
        this.currentValue.contact_id = null;
        this.currentValue.address = val;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/variable.less';
  @import '~vux/src/styles/tap.less';
  @import '~vux/src/styles/weui/base/mixin/setArrow.less';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
  @import '~vux/src/styles/weui/widget/weui-loading/weui-loading.less';

  .vux-cell-primary {
    flex: 1;
  }

  .vux-label {
    display: block;
    word-wrap: break-word;
    word-break: break-all;
  }

  .weui-cell__ft .weui-loading {
    display: block;
  }

  .weui-cell__ft.vux-cell-align-left {
    text-align: left;
  }

  .weui-cell.vux-cell-no-border-intent:before {
    left: 0;
  }

  .weui-cell_access .weui-cell__ft.vux-cell-arrow-down:after {
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(90deg);
  }

  .weui-cell_access .weui-cell__ft.vux-cell-arrow-up:after {
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-90deg);
  }

  .vux-cell-arrow-transition:after {
    transition: transform 300ms;
  }

  .x-input {
    padding: 0;
  }

  .flex-display {
    display: flex;
    align-items: center;
  }
</style>
