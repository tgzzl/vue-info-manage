import {
  SELECT_CUSTOMER,
  ADD_CUSTOMER
} from './mutation-types.js'


export default {

  addCustomer(customer) {
    commit(SELECT_CUSTOMER, customer)
  }
}
