<template>
  <div class="toolbar_container">
    <div v-for="item in value" class="flex" @click="onItemClick(item)">
      <img :src="getImageSrc(item)" width="32" height="32" style="margin-bottom: -6px"/>
      <span :class="selectedClass(item)">{{ item.text }}</span>
    </div>
  </div>
</template>

<script>
  import img0 from '../assets/home.svg';
  import img1 from '../assets/onway.png';
  import img1_hlight from '../assets/onway_hlight.png';
  import img2 from '../assets/messge.svg';
  import img2_hlight from '../assets/messge_hlight.png';
  import img3 from '../assets/user.svg';

  export default {
    props: {
      value: {
        type: Array,
        default(){
          return [
            {
              image: img0,
              text: '主页',
              path: '/home'
            },
            {
              image: img1,
              image_hlight: img1_hlight,
              text: '我的在途',
              path: '/order/on_way'
            },
            {
              image: img2,
              image_hlight: img2_hlight,
              text: '我的消息',
              path: '/collaborative/messages'
            },
            {
              image: img3,
              text: '我',
              path: '/user'
            }
          ]
        }
      }
    },
    data(){
      return {
        currentItem: {}
      }
    },
    created() {
      let path = this.$route.path;
      this.value.forEach(item => {
        if (path.includes(item.path)) {
          this.currentItem = item;
        }
      });
    },
    methods: {
      getImageSrc(obj){
        return obj == this.currentItem && obj.image_hlight ? obj.image_hlight : obj.image;
      },
      selectedClass(obj){
        return obj == this.currentItem && obj.image_hlight ? 'selected' : 'unselected';
      },
      onItemClick(obj){
        this.currentItem = obj;
        if (this.$route.path.includes(obj.path)) {
          return;
        }
        this.$router.push(obj.path);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/theme';

  .toolbar_container {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    background-color: white;
    border-top: 1px solid @grey;
    border-bottom: 1px solid @grey;

    .flex {
      flex: 1;
      font-size: 12px;
      text-align: center;
      span {
        display: block;
      }
      .unselected {
        color: #666666;
      }
      .selected {
        color: @blue;
      }
    }
  }
</style>
