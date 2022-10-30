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
    autorized: null,
    pcList: [
      {
        id: 1,
        title: "PC de Luis",
        mac: "00:00:00:00:00:00",
        on: true,
        timestamp: new Date(),
      },
      {
        id: 2,
        title: "PC de Xabi",
        mac: "00:00:00:00:00:00",
        on: false,
        timestamp: new Date(),
      },
      {
        id: 3,
        title: "PC de Frades",
        mac: "00:00:00:00:00:00",
        on: false,
        timestamp: new Date(),
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
        timestamp: PC.timestamp,
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
        timestamp: PC.timestamp,
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
      db.collection("PCs")
        .get()
        .then((snapshot) => {
          let tempPCs = [];
          snapshot.forEach((doc) => {
            const data = {
              id: doc.id,
              mac: doc.data().mac,
              title: doc.data().title,
              on: doc.data().on,
              timestamp: doc.data().timestamp,
            };
            tempPCs.push(data);
          });
          const tempPCsSorted = tempPCs.sort((a, b) => {
            return a.timestamp.seconds - b.timestamp.seconds;
          });
          context.commit("retrievePCs", tempPCsSorted);
        });
    },

    addPC(context, PC) {
      db.collection("PCs")
        .add({
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          timestamp: new Date(),
        })
        .then((docRef) => {
          context.commit("addPC", {
            title: PC.title,
            on: PC.on,
            mac: PC.mac,
            id: docRef.id,
            timestamp: PC.timestamp,
          });
        });
    },

    turnOnPC(context, id) {
      db.collection("PCs")
        .doc(id)
        .get()
        .then((doc) => {
          console.log("Hasta aqui llegué");
          return doc.ref.update({ on: !doc.data().on });
        })
        .then(() => {
          context.commit("turnOnPC", id);
        });
    },

    deletePC(context, id) {
      db.collection("PCs")
        .doc(id)
        .delete()
        .then(() => {
          context.commit("deletePC", id);
        });
    },

    updatePC(context, PC) {
      db.collection("PCs")
        .doc(PC.id)
        .set({
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          id: PC.id,
          timestamp: new Date(),
        })
        .then(() => {
          context.commit("updatePC", PC);
        });
    },
  },

  modules: {},
});
