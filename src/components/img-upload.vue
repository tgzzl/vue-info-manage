<template>
  <div class="weui-uploader">
    <div v-if="title" class="weui-uploader__hd">
      <p class="weui-uploader__title">{{title}}</p>
    </div>
    <div class="weui-uploader__bd">
      <ul class="weui-uploader__files">
        <li v-for="url in currentAttachments" :key="url" class="weui-uploader__file" :style="itemStyle">
          <img :src="downloadPath + url" @click.stop="previewImage" :style="itemStyle"/>
        </li>
      </ul>
      <div v-if="isUpload" @click.stop="chooseImage" class="weui-uploader__input-box" :style="itemStyle"></div>
    </div>
  </div>
</template>

<script>
  /*
   * 基于微信 jssdk 封装的 图片上传/下载 组件
   * Props:
   *   name | type | default | description
   *   ---|---|---|---
   *   value    String           附件值，使用v-model双向绑定
   *   title    String           组件标题栏，title值有效才会显示
   *   isUpload Boolean true     true: 可以上传图片; false: 不可以上传图片;
   *   width    Number  40       图片宽高，单位px
   *   params   Object  {}       表单额外参数, 附件长传固定参数{object_name, object_id}
   */

  import API from '../config/api'
  import {endpoint} from '../config/env'

  export default {
    props: {
      value: String,
      title: String,
      isUpload: {
        type: Boolean,
        default: true
      },
      width: {
        type: Number,
        default: 40
      },
      params: {
        type: Object,
        default(){
          return {}
        }
      }
    },
    data(){
      let width = this.width < 40 ? 40 : this.width;
      return {
        init: true,
        index: 0,
        localIds: [],
        currentAttachments: [],
        downloadPath: '/attachments/download?file_path=',
        itemStyle: {
          width: `${width}px`,
          height: `${width}px`,
          'border-radius': `${width / 2}px`
        }
      }
    },
    created(){
      this.watchValue(this.value);
    },
    watch: {
      value(val){
        this.watchValue(val);
      }
    },
    methods: {
      showToast(msg){
        this.$vux.toast.text(msg);
      },
      previewImage(){
        let downloadUrlArray = this.currentAttachments.map(url => {
          return `${endpoint}${this.downloadPath}${url}`;
        });
        this.$wechat.previewImage({
          urls: downloadUrlArray // 需要预览的图片http链接列表
        });
      },
      chooseImage(){
        this.$wechat.chooseImage({
          // count: 1, // 默认9
          // original compressed 可以指定是原图还是压缩图，默认二者都有
          sizeType: ['compressed'], //指定compressed,为original时拍照图片太大经常上传失败
          sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
          complete: res => {
            this.localIds = res.localIds;
            if (this.localIds && this.localIds.length) {
              this.index = 0;
              this.uploadImage();
            } else {
              console.error('wechat.chooseImage:', JSON.stringify(res));
            }
          }
        });
      },
      uploadImage() {
        this.$wechat.uploadImage({
          localId: this.localIds[this.index], // 需要上传的图片的本地ID，由chooseImage接口获得
          complete: res => {
            if (res.serverId) {
              this.index++;
              this.transferToAliyun(res.serverId);
              // ios bug: 上传多张图片时，不能同时传多张，只能等上一张传完才能开始下一张
              // 参考微信官方demo: http://203.195.235.76/jssdk/
              if (this.index < this.localIds.length) {
                this.uploadImage();
              }
            } else {
              console.error('wechat.uploadImage:', JSON.stringify(res));
              this.showToast('上传失败');
            }
          }
        });
      },
      transferToAliyun(mediaId){
        let uploadParams = Object.assign({
          media_id: mediaId,
          current_attachments: this.currentAttachments
        }, this.params);
        API.uploadImageApi(uploadParams).then(res => {
          if (res.return_info) {
            this.addToCurrentAttachments(res.return_info);
            this.showToast('上传成功');
          } else {
            this.showToast('上传失败，没有附件');
          }
        }, error => {
          this.showToast('上传失败');
        })
      },
      addToCurrentAttachments(attachment){
        this.currentAttachments.push(this.filterSeparator(attachment));
        this.$emit('input', this.currentAttachments.join('-||-'));
      },
      filterSeparator(attachment){
        return attachment.replace(/-\|\|-/g, '');
      },
      watchValue(val){
        if (val && this.init) {
          this.init = false;
          this.currentAttachments = val.split('-||-').filter(item => {
            return item && item.length;
          });
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/weui/widget/weui-uploader/index.less';

  .weui-uploader__hd {
    padding-bottom: 0;
    p {
      font-size: 14px;
    }
  }

  .weui-uploader__input-box {
    border: 1px solid gray;
    &:before {
      height: 20px;
      background-color: gray;
    }
    &:after {
      width: 20px;
      background-color: gray;
    }
  }
</style>
