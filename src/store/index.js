import Vue from 'vue'
import Vuex from 'vuex'
import state from "./state";
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    clearToken(state) {
      state.token = "";
      localStorage.setItem("token", "")
    },
  },
  getters:{
    token: state => state.token,
  },

  actions: {
  },
  modules: {
  }
})
