import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    userAvatar: "https://cn.vuejs.org/images/logo.png",
    userName: "昇",
    authPermissions: []
  },
  getters: {},
  mutations: {
    getUserAvatar(state, userAvatar) {
      state.userAvatar = userAvatar;
    },
    getUserName(state, userName) {
      state.userName = userName;
    },
    getAuthPermissions(state, authPermissions) {
      state.authPermissions = authPermissions;
    }
  },
  actions: {
    logout() {
      return;
    }
  }
});

export default store;
