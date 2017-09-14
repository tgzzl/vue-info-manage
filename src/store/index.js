import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  order: {},
  contacts: [],
  charges: [],
  allOrdersTabIndex: 0,
  dispatchOrdersTabIndex: 3,
  isLoading: false,
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
