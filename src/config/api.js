import Axios from 'axios'
import qs from 'qs'
import store from '../store/index'

Axios.defaults.baseURL = '/api';

const NO_LOADING_TOAST_APIS = ['attachments/upload'];

const fetch = (url, params = {}) => {
  return Axios.get(url, {params: params}).then(response => {
    if (response.data && response.data.return_code == 0) {
      return response.data;
    }
    throw response;
  }).catch(error => {
    console.warn(error);
    return Promise.reject(error.data || error);
  });
};

const post = (url, params = {}) => {
  if (!NO_LOADING_TOAST_APIS.includes(url)) {
    store.commit('UPDATE_LOADING_STATUS', true);
  }
  return Axios.post.bind(null, url, qs.stringify({body: JSON.stringify(params)})).then(response => {
    if (response.data && response.data.return_code == 0) {
      store.commit('UPDATE_LOADING_STATUS', false);
      return response.data;
    }
    throw response;
  }).catch(error => {
    console.warn(error);
    store.commit('UPDATE_LOADING_STATUS', false);
    return Promise.reject(error.data || error);
  });
};

export default {
  configJssdk: fetch.bind(null, '/wechats/jssdk_config'),
  uploadImageApi: post.bind(null, '/attachments/upload'),
  fetchConstantMap: fetch.bind(null, '/constants/sources'),
  fetchUser: fetch.bind(null, '/users/show'),
  fetchUserSession: fetch.bind(null, '/users/get_session'),
  updateUser: post.bind(null, '/users/update'),
  fetchOrder: fetch.bind(null, '/orders/show'),
  fetchOrders: fetch.bind(null, '/orders/search'),
  fetchOrderMultipleInfo: fetch.bind(null, '/orders/multiple_info'),
  createOrder: post.bind(null, '/orders/create'),
  updateOrder: post.bind(null, '/orders/update'),
  updateOrderToOnWay: post.bind(null, '/orders/to_on_way'),
  updateOrderCompleted: post.bind(null, '/orders/to_completed'),
  fetchOrderDispatchInfo: fetch.bind(null, '/orders/dispatch_info'),
  saveOrderDispatchInfo: post.bind(null, '/orders/save_dispatch_info'),
  fetchCustomers: fetch.bind(null, '/customers/search'),
  createCustomer: post.bind(null, '/customers/create'),
  updateCustomer: post.bind(null, '/customers/update'),
  fetchContacts: post.bind(null, '/contacts/search'),
  createContact: post.bind(null, '/contacts/create'),
  updateContact: post.bind(null, '/contacts/update'),
  fetchFleets: fetch.bind(null, '/fleets/search'),
  fetchDrivers: fetch.bind(null, '/drivers/search'),
  fetchVehicles: fetch.bind(null, '/vehicles/search'),
  saveOrderException: post.bind(null, '/orders/save_exception'),
  reportOrderException: post.bind(null, '/orders/report_exception'),
  saveOrderCharge: post.bind(null, '/orders/save_charge'),
  reportOrderCharge: post.bind(null, '/orders/report_charge'),
  fetchOrderTransportRequirement: fetch.bind(null, '/orders/transport_requirement'),
  saveOrderTransportRequirement: post.bind(null, '/orders/save_transport_requirement'),
  fetchOrderTasks: fetch.bind(null, '/order_tasks/list'),
  updateOrderTask: post.bind(null, '/order_tasks/update'),
  updateOrderTaskAttachment: post.bind(null, '/order_tasks/update_attachment'),
  executeOrderTask: post.bind(null, '/order_tasks/execute'),
  fetchCollaboratives: fetch.bind(null, '/collaboratives/list'),
  fetchCollaborative: fetch.bind(null, '/collaboratives/show'),
  acceptCollaboratives: post.bind(null, '/collaboratives/accept'),
  receiveCollaboratives: post.bind(null, '/collaboratives/receive'),
  orderDispatchCollaboratives: post.bind(null, '/collaboratives/order_dispatch')
}
