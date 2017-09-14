import Axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import {endpoint} from './env'

Axios.defaults.baseURL = `${endpoint}/`;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const NO_LOADING_TOAST_APIS = ['attachments/upload'];

const fetch = (url, params = {}) => {
  return Axios.get(url, {params: params}).then(response => {
    if (response.data && response.data.return_code == 0) {
      return Promise.resolve(response.data);
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
  return Axios.post(url, qs.stringify({body: JSON.stringify(params)})).then(response => {
    if (response.data && response.data.return_code == 0) {
      store.commit('UPDATE_LOADING_STATUS', false);
      return Promise.resolve(response.data);
    }
    throw response;
  }).catch(error => {
    console.warn(error);
    store.commit('UPDATE_LOADING_STATUS', false);
    return Promise.reject(error.data || error);
  });
};


var configJssdk = url => fetch('wechats/jssdk_config', {url: url})
var uploadImageApi = params => post('attachments/upload', params)
var fetchConstantMap = () => fetch('constants/sources')

var fetchUser = () => fetch('users/show')
var fetchUserSession = () => fetch('users/get_session')
var updateUser = params => post('users/update', params)

var fetchOrder = id => fetch('orders/show', {id: id})
var fetchOrders = params => fetch('orders/search', params)
var fetchOrderMultipleInfo = orderId => fetch('orders/multiple_info', {order_id: orderId})
var createOrder = params => post('orders/create', params)
var updateOrder = params => post('orders/update', params)
var updateOrderToOnWay = id => post('orders/to_on_way', {id: id})
var updateOrderCompleted = id => post('orders/to_completed', {id: id})

var fetchOrderDispatchInfo = orderId => fetch('orders/dispatch_info', {order_id: orderId})
var saveOrderDispatchInfo = params => post('orders/save_dispatch_info', params)

var fetchCustomers = params => fetch('customers/search', params)
var createCustomer = params => post('customers/create', params)
var updateCustomer = params => post('customers/update', params)

var fetchContacts = params => fetch('contacts/search', params)
var createContact = params => post('contacts/create', params)
var updateContact = params => post('contacts/update', params)

var fetchFleets = text => fetch('fleets/search', {search_text: text})

var fetchDrivers = text => fetch('drivers/search', {search_text: text})

var fetchVehicles = text => fetch('vehicles/search', {search_text: text})

var saveOrderException = params => post('orders/save_exception', params)
var reportOrderException = params => post('orders/report_exception', params)

var saveOrderCharge = params => post('orders/save_charge', params)
var reportOrderCharge = params => post('orders/report_charge', params)

var fetchOrderTransportRequirement = orderId => fetch('orders/transport_requirement', {order_id: orderId})
var saveOrderTransportRequirement = params => post('orders/save_transport_requirement', params)

var fetchOrderTasks = orderId => fetch('order_tasks/list', {order_id: orderId})
var updateOrderTask = params => post('order_tasks/update', params)
var updateOrderTaskAttachment = params => post('order_tasks/update_attachment', params)
var executeOrderTask = params => post('order_tasks/execute', params)

var fetchCollaboratives = index => fetch('collaboratives/list', {index: index})
var fetchCollaborative = params => fetch('collaboratives/show', params)
var acceptCollaboratives = params => post('collaboratives/accept', params)
var receiveCollaboratives = params => post('collaboratives/receive', params)
var orderDispatchCollaboratives = params => post('collaboratives/order_dispatch', params)

export {
  configJssdk, uploadImageApi, fetchConstantMap,
  fetchUser, fetchUserSession, updateUser,
  fetchOrder, fetchOrders, fetchOrderMultipleInfo,
  createOrder, updateOrder, updateOrderToOnWay, updateOrderCompleted,
  fetchOrderDispatchInfo, saveOrderDispatchInfo,
  fetchCustomers, createCustomer, updateCustomer,
  fetchContacts, createContact, updateContact,
  fetchFleets,
  fetchDrivers,
  fetchVehicles,
  saveOrderException, reportOrderException,
  saveOrderCharge, reportOrderCharge,
  fetchOrderTransportRequirement, saveOrderTransportRequirement,
  fetchOrderTasks, updateOrderTask, updateOrderTaskAttachment, executeOrderTask,
  fetchCollaboratives, fetchCollaborative, acceptCollaboratives, receiveCollaboratives, orderDispatchCollaboratives
}
