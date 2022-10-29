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
    },
    updatePC(state, PC){
      const id = PC.id;
      const index = state.pcList.indexOf(state.pcList.filter((pc) => pc.id === id)[0]);

      console.log("El índice de este elemento en el array es el: ", index);

      state.pcList.splice(index, 1, {
        title: PC.title,
        id: PC.id,
        mac: PC.mac,
        on: PC.on,});
    }
  },
  actions: {
  },
  modules: {
  }
})
