<template>
  <group class="user_page" gutter="0" label-align="left">
    <nav @click.self="goUserLoginPage">编辑</nav>
    <cell title="车队或公司名称" :value="user.company_name" value-align="right"></cell>
    <cell title="姓名" :value="user.name" value-align="right"></cell>
    <cell title="手机" :value="user.phone_number" value-align="right"></cell>
    <cell v-if="user.plate_no" title="车牌" :value="user.plate_no" value-align="right"></cell>
    <cell v-if="user.vehicle_type_name" title="车型" :value="user.vehicle_type_name" value-align="right"></cell>
  </group>
</template>

<script>
  import {Group, Cell} from 'vux'
  import {fetchUser} from '../../config/api'

  export default {
    components: {Group, Cell},
    data () {
      return {
        user: {}
      }
    },
    created(){
      fetchUser().then(res => this.user = res.user || this.user);
    },
    methods: {
      goUserLoginPage(){
        this.$router.push({path: '/user/login', query: {user: this.user}});
      }
    }
  }
</script>

<style lang="less">
  @import '../../style/theme';

  .user_page {
    nav {
      color: @blue;
      background-color: @bg;
      text-align: right;
      padding: 3px 15px;
      font-size: 14px;
    }
  }
</style>
