import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pcList: [
      {
        id: 1,
        title: "PC de Luis",
        mac: "none",
        on: true,
      },
      {
        id: 2,
        title: "PC de Xabi",
        mac: "none",
        on: false,
      },
      {
        id: 3,
        title: "PC de Frades",
        mac: "none",
        on: false,
      },
    ],
  },
  getters: {
  },
  mutations: {
    addPC(state, PC){
      state.pcList.push({
        id: PC.id,
        title: PC.title,
        mac: PC.mac,
        on: PC.on,
      });
    }
  },
  actions: {
  },
  modules: {
  }
})
