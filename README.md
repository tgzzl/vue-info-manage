
> vue + vue-router + vuex + axios + vux 构建的大型单页WEB应用

工程目录说明
```bash

├── build                                       // webpack配置文件
├── config                                      // 项目打包路径
├── src                                         // 源码目录
│   ├── assets                                  // 图片资源
│   ├── components                              // 组件
│   ├── config                                  // 基本配置
│   │   ├── env.js                              // 环境切换配置
│   │   ├── api.js                              // 获取数据
│   │   └── rem.js                              // px转换rem
│   ├── page
│   │   ├── order
│   │   │   ├── edit.vue                        // 新建 / 编辑订单页
│   │   │   └── list.vue                        // 订单列表页
│   ├── router
│   │   └── index.js                            // 路由配置
│   ├── store                                   // vuex的状态管理
│   │   ├── action.js                           // 配置actions
│   │   ├── index.js                            // 引用vuex，创建store
│   │   ├── mutation-types.js                   // 定义常量muations名
│   │   └── mutations.js                        // 配置mutations
│   |── style
│   |   ├── common.scss                         // 公共样式文件
│   |   ├── mixin.scss                          // 样式配置文件
|   |── util                                    
|   |   |── regexp.js                           // 正则匹配工具
│   ├── App.vue                                 // 页面入口文件
│   ├── main.js                                 // 程序入口文件，加载各种公共组件
├── favicon.ico                                 // 图标
├── index.html                                  // 入口html文件

```
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
![image](http://tgzzl.oss-cn-shenzhen.aliyuncs.com/261505104587_.pic_hd.jpg)
![image](http://tgzzl.oss-cn-shenzhen.aliyuncs.com/271505104589_.pic_hd.jpg)
![image](http://tgzzl.oss-cn-shenzhen.aliyuncs.com/281505105718_.pic_hd.jpg)

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
