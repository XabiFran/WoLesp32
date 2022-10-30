import { collection, doc, QuerySnapshot } from "firebase/firestore";
import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { auth, db } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    autorized: true,
    pcList: [
      {
        id: 1,
        title: "PC de Luis",
        mac: "00:00:00:00:00:00",
        on: true,
      },
      {
        id: 2,
        title: "PC de Xabi",
        mac: "00:00:00:00:00:00",
        on: false,
      },
      {
        id: 3,
        title: "PC de Frades",
        mac: "00:00:00:00:00:00",
        on: false,
      },
    ],
  },
  getters: {},
  mutations: {
    setAuthorization(state, value) {
      state.autorized = value;
    },
    addPC(state, PC) {
      state.pcList.push({
        id: PC.id,
        title: PC.title,
        mac: PC.mac,
        on: PC.on,
      });
    },
    updatePC(state, PC) {
      const id = PC.id;
      const index = state.pcList.indexOf(
        state.pcList.filter((pc) => pc.id === id)[0]
      );

      state.pcList.splice(index, 1, {
        title: PC.title,
        id: PC.id,
        mac: PC.mac,
        on: PC.on,
      });
    },
    turnOnPC(state, id) {
      let pc = state.pcList.filter((pc) => pc.id === id)[0];
      pc.on = !pc.on;
    },
    deletePC(state, id) {
      state.pcList = state.pcList.filter((pc) => pc.id !== id);
    },
    retrievePCs(state, PCs) {
      state.pcList = PCs;
    },
  },
  actions: {
    retrievePCs(context) {
      auth.onAuthStateChanged((user) => {
        console.log("Si esto es null, no estás logueado: ", user);
      });
      const PCdb = collection(db, "PCs");
    },
  },

  modules: {},
});
