import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: []
  },
  getters: {
  },
  mutations: {
    upUserData(state,data){
      state.user = data
    },
    deleteAllData(state){
      for(let i in state){
        delete state[i]
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
