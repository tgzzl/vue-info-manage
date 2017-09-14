<template>
  <div id="app">
    <div v-transfer-dom>
      <loading v-model="isLoading" :text="text"></loading>
    </div>
    <toast type="text" v-model="showToast" :text="toastText" width="70%"></toast>
    <transition name="router-fade" mode="out-in">
      <router-view @toastEvent="toastEvent" class="router-view"></router-view>
    </transition>
  </div>
</template>

<script>
  import {Toast, Loading, TransferDom} from 'vux'
  import {mapState} from 'vuex'

  export default {
    directives: {TransferDom},
    components: {Toast, Loading},
    data(){
      return {
        showToast: false,
        toastText: '',
        text: '加载中...'
      }
    },
    computed: mapState(['isLoading']),
    methods: {
      toastEvent(e){
        this.showToast = e.show;
        this.toastText = e.text;
      }
    }
  }

</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';
  @import 'style/common.less';

  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }

  .router-fade-enter, .router-fade-leave-active {
    opacity: 0;
  }

  .router-view {
    width: 100%;
    height: 100%;
  }

  .weui-loading_toast {
    .weui-toast {
      width: 7.6em;
      min-height: 5.6em;
    }
  }

  .weui-toast__content {
    color: white;
  }

</style>

