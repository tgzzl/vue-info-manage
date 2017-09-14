const home = r => require.ensure([], () => r(require('../page/home/home')), 'home')

// chunk user
const userIndex = r => require.ensure([], () => r(require('../page/user')), 'user')
const userLogin = r => require.ensure([], () => r(require('../page/user/login')), 'user')
const userAgreement = r => require.ensure([], () => r(require('../page/user/agreement')), 'user')

// chunk order
const orderList = r => require.ensure([], () => r(require('../page/order/list')), 'order')
const orderOnWay = r => require.ensure([], () => r(require('../page/order/onWay')), 'order')
const orderCreate = r => require.ensure([], () => r(require('../page/order/edit')), 'order')
const orderResult = r => require.ensure([], () => r(require('../page/order/result')), 'order')
const orderShow = r => require.ensure([], () => r(require('../page/order/show')), 'order')
const orderShowForOnWay = r => require.ensure([], () => r(require('../page/order/showForOnWay')), 'order')
const transportRequirement = r => require.ensure([], () => r(require('../page/order/transportRequirement')), 'order')

// chunk customer
const customerList = r => require.ensure([], () => r(require('../page/customer/list')), 'customer')
const customerCreate = r => require.ensure([], () => r(require('../page/customer/edit')), 'customer')

// chunk contact
const contactList = r => require.ensure([], () => r(require('../page/contact/list')), 'contact')
const contactCreate = r => require.ensure([], () => r(require('../page/contact/edit')), 'contact')

// chunk orderDispatchInfo
const orderDispatchInfoCreate = r => require.ensure([], () => r(require('../page/orderDispatchInfo/new')), 'orderDispatchInfo')
const orderDispatchInfoSave = r => require.ensure([], () => r(require('../page/orderDispatchInfo/edit')), 'orderDispatchInfo')
const orderDispatchInfoSuccess = r => require.ensure([], () => r(require('../page/orderDispatchInfo/success')), 'orderDispatchInfo')

// chunk orderException
const orderExceptionEdit = r => require.ensure([], () => r(require('../page/orderException/edit')), 'orderException')

// chunk orderCharge
const orderChargeEdit = r => require.ensure([], () => r(require('../page/orderCharge/edit')), 'orderCharge')

// chunk collaborative
const collaborativeMessages = r => require.ensure([], () => r(require('../page/collaborative/messages')), 'collaborative')
const collaborativeSuccess = r => require.ensure([], () => r(require('../page/collaborative/success')), 'collaborative')
const collaborativeOrderDetail = r => require.ensure([], () => r(require('../page/collaborative/orderDetail')), 'collaborative')


export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: home,
    meta: {title: '鲸运物流管家'}
  },
  {
    path: '/user',
    component: userIndex,
    meta: {title: '我的信息'}
  },
  {
    path: '/user/login',
    component: userLogin,
    meta: {title: '我的信息'}
  },
  {
    path: '/user/agreement',
    component: userAgreement,
    meta: {title: '我要接单'}
  },
  {
    path: '/order',
    component: orderList,
    meta: {
      title: '我的订单',
      editTitle: '我要派单'
    }
  },
  {
    path: '/order/on_way',
    component: orderOnWay,
    meta: {title: '我的在途'}
  },
  {
    path: '/order/edit',
    component: orderCreate,
    meta: {
      title: '我要开单',
      editTitle: '编辑订单'
    }
  },
  {
    path: '/order/show',
    component: orderShow,
    meta: {title: '订单详情'}
  },
  {
    path: '/order/result',
    component: orderResult,
    meta: {title: '我要开单'}
  },
  {
    path: '/order/show_for_on_way',
    component: orderShowForOnWay,
    meta: {title: '订单详情'}
  },
  {
    path: '/order/transport_requirement',
    component: transportRequirement,
    meta: {title: '我要派单'}
  },
  {
    path: '/order_exception/edit',
    component: orderExceptionEdit,
    meta: {
      title: '上报异常',
      editTitle: '编辑异常'
    }
  },
  {
    path: '/order_charge/edit',
    component: orderChargeEdit,
    meta: {
      title: '上报附加费',
      editTitle: '编辑附加费'
    }
  },
  {
    path: '/customer',
    component: customerList,
    meta: {title: '发货人'}
  },
  {
    path: '/customer/edit',
    component: customerCreate,
    meta: {
      title: '添加发货人',
      editTitle: '编辑发货人'
    }
  },
  {
    path: '/contact',
    component: contactList,
    meta: {title: '常用地址'}
  },
  {
    path: '/contact/edit',
    component: contactCreate,
    meta: {
      title: '添加常用地址',
      editTitle: '编辑常用地址'
    }
  },
  {
    path: '/order_dispatch_info/edit',
    component: orderDispatchInfoSave,
    meta: {title: '登记车辆'}
  },
  {
    path: '/order_dispatch_info/new',
    component: orderDispatchInfoCreate,
    meta: {title: '我要派单'}
  },
  {
    path: '/order_dispatch_info/success',
    component: orderDispatchInfoSuccess,
    meta: {title: '我要派单'}
  },
  {
    path: '/collaborative/messages',
    component: collaborativeMessages,
    meta: {title: '我的消息'}
  },
  {
    path: '/collaborative/order_detail',
    component: collaborativeOrderDetail,
    meta: {title: '订单详情'}
  },
  {
    path: '/collaborative/success',
    component: collaborativeSuccess,
    meta: {title: '接单成功'}
  }
]
