import Vue from 'vue'
import VueRouter from 'vue-router'
import {sync} from 'vuex-router-sync'
import FastClick from 'fastclick'
import routes from './router/index'
import store from './store/'
import {configJssdk} from './config/api'
import {trustedDomainFullName} from './config/env'
import './config/rem'
import {WechatPlugin, ConfirmPlugin, ToastPlugin} from 'vux'
import {Autocomplete, Input} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
// import './util/vconsole.min'

Vue.use(VueRouter);
Vue.use(WechatPlugin);
Vue.use(ConfirmPlugin);
Vue.use(ToastPlugin);
Vue.use(Autocomplete);
Vue.use(Input);

FastClick.attach(document.body);

const router = new VueRouter({
  routes,
  strict: process.env.NODE_ENV !== 'production'
});

sync(store, router);

// config wechat jssdk
const url = encodeURIComponent(trustedDomainFullName);
configJssdk(url).then(res => {
  Vue.wechat.config(res.data)
});

const sharedUrls = ['/order_dispatch_info/new', '/order_dispatch_info/success', '/collaborative/order_detail'];

router.beforeEach((to, from, next) => {
  document.title = (to.query.title && to.meta.editTitle ? to.meta.editTitle : to.meta.title);

  if (to.matched.length) {
    // 隐藏/显示 微信右上角菜单
    if (sharedUrls.includes(to.path)) {
      Vue.wechat.ready(Vue.wechat.showOptionMenu);
    } else {
      Vue.wechat.ready(Vue.wechat.hideOptionMenu);
    }
    next();
  } else {
    next({path: '/home', redirect: '/home'})
  }
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box');
