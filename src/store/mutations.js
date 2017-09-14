import {
  SELECT_CUSTOMER,
  SELECT_CONTACT,
  SAVE_ORDER_DATA,
  CLEAR_ORDER_DATA,
  SAVE_ALL_ORDERS_TAB_INDEX,
  SAVE_DISPATCH_ORDERS_TAB_INDEX,
  UPDATE_LOADING_STATUS,
} from './mutation-types.js'


export default {

  [SELECT_CUSTOMER](state, customer) {
    state.order.customer_id = customer.id;
    state.order.customer_name = customer.name || customer.contact_name;
  },

  [SELECT_CONTACT](state, contact) {
    if (contact && contact.contact_type) {
      if (contact.contact_type === 'sender') {
        Object.assign(state.contacts[0], contact);
      } else if (contact.contact_type === 'receiver') {
        Object.assign(state.contacts[1], contact);
      }
    }
  },

  [SAVE_ORDER_DATA](state, orderForm) {
    Object.assign(state.order, orderForm.order);
    state.contacts = orderForm.contacts;
    state.charges = orderForm.charges;
  },

  [CLEAR_ORDER_DATA](state) {
    state.order = {};
    state.customer = {};
    state.contacts = [];
    state.charges = [];
  },

  [SAVE_ALL_ORDERS_TAB_INDEX](state, index) {
    state.allOrdersTabIndex = index;
  },

  [SAVE_DISPATCH_ORDERS_TAB_INDEX](state, index) {
    state.dispatchOrdersTabIndex = index;
  },

  [UPDATE_LOADING_STATUS](state, isLoading){
    state.isLoading = isLoading;
  }
}
