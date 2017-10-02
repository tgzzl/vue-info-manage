<template>
  <div class="home_page">
    <div class="item">
      <img @click="goNewOrderPage" src="../../assets/home/1.png">
      <img @click="linkTo('/order')" src="../../assets/home/2.png">
    </div>
    <div class="item">
      <img @click="linkTo('/order', {title: true})" src="../../assets/home/3.png">
      <img @click="linkTo('/collaborative/messages')" src="../../assets/home/4.png">
    </div>
    <img class="single" @click="linkTo('/order/on_way')" src="../../assets/home/5.png">
  </div>
</template>

<script>
  import {mapMutations} from 'vuex'
  import API from '../../config/api'
  import {setStore, omit} from '../../util/utils'
  import {trustedDomainFullName} from '../../config/env'

  export default {
    data() {
      return {}
    },
    mounted() {
      API.fetchUserSession().then(res => {
        this.$store.commit('UPDATE_LOADING_STATUS', false);

        setStore('USER_INFO', res.user);

        // config wechat jssdk
        const url = encodeURIComponent(trustedDomainFullName);
        API.configJssdk({url: url}).then(res => this.$wechat.config(res.data));

        // 如果存在未授权的url，服务器端获取微信授权后，设置前端路由跳转到该url
        let route = res.user_query;
        if (route && route.access_url) {
          console.warn('<<< authenticate', route);
          this.$router.push({path: route.access_url, query: omit(route, ['access_url'])});
        }
      }, error => {
        if (typeof error === 'object' && error.return_code) {
          // 通知服务端发起微信授权请求
          console.warn('>>> authenticate', this.$route.query);
          window.location.href = '/users/entrance?user_query=' + encodeURIComponent(JSON.stringify(this.$route.query));
        }
      });
      API.fetchConstantMap().then(res => setStore('CONSTANT_MAP', res));
    },
    methods: {
      ...mapMutations([
        'CLEAR_ORDER_DATA'
      ]),
      goNewOrderPage() {
        this.CLEAR_ORDER_DATA();
        this.linkTo('/order/edit');
      },
      linkTo(url, params = {}) {
        this.$router.push({path: url, query: params});
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../style/common";

  .home_page {
    .px2rem(padding, 15);
    text-align: center;

    img.single {
      .px2rem(width, 669);
      .px2rem(height, 302);
    }

    .item {
      display: flex;
      justify-content: space-around;
      .px2rem(margin-bottom, 15);
      img {
        .px2rem(width, 320);
        .px2rem(height, 320);
      }
    }
  }
</style>
