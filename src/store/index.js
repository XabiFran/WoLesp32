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
    username: null,
    pcList: [],
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
        ip: PC.ip,
        mac: PC.mac,
        on: PC.on,
        timestamp: PC.timestamp,
        turnOn: PC.turnOn,
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
        ip: PC.ip,
        on: PC.on,
        timestamp: PC.timestamp,
        turnOn: PC.turnOn,
      });
    },
    turnOnPC(state, id) {
      let pc = state.pcList.filter((pc) => pc.id === id)[0];
      pc.turnOn = !pc.turnOn;
    },
    deletePC(state, id) {
      state.pcList = state.pcList.filter((pc) => pc.id !== id);
    },
    retrievePCs(state, PCs) {
      state.pcList = PCs;
    },
    emptyPCs(state) {
      while (state.pcList.length > 0) {
        state.pcList.pop();
      }
    },
  },
  actions: {
    emptyPCs(context) {
      context.commit("emptyPCs");
    },
    retrievePCs(context) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          db.collection("Users")
            .doc(auth.currentUser.uid)
            .collection("PCs")
            .get()
            .then((snapshot) => {
              let tempPCs = [];
              snapshot.forEach((doc) => {
                const data = {
                  id: doc.id,
                  mac: doc.data().mac,
                  ip: doc.data().ip,
                  title: doc.data().title,
                  on: doc.data().on,
                  timestamp: doc.data().timestamp,
                  turnOn: doc.data().turnOn,
                };
                tempPCs.push(data);
              });
              const tempPCsSorted = tempPCs.sort((a, b) => {
                return a.timestamp.seconds - b.timestamp.seconds;
              });
              context.commit("retrievePCs", tempPCsSorted);
            });
        } else {
          console.log("No estás logueado compai");
          context.commit("emptyPCs");
        }
      });
    },

    addPC(context, PC) {
      db.collection("Users")
        .doc(auth.currentUser.uid)
        .collection("PCs")
        .add({
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: new Date(),
          turnOn: PC.turnOn,
        })
        .then((docRef) => {
          context.commit("addPC", {
            title: PC.title,
            on: PC.on,
            mac: PC.mac,
            ip: PC.ip,
            id: docRef.id,
            timestamp: PC.timestamp,
            turnOn: PC.turnOn,
          });
        });
      //////////////////////////////SEPARADOR
      /*db.collection("PCs")
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
        });*/
    },

    turnOnPC(context, id) {
      db.collection("Users")
        .doc(auth.currentUser.uid)
        .collection("PCs")
        .doc(id)
        .get()
        .then((doc) => {
          console.log("Hasta aqui llegué");
          return doc.ref.update({
            turnOn: !doc.data().turnOn,
          });
        })
        .then(() => {
          context.commit("turnOnPC", id);
        });
    },

    deletePC(context, id) {
      db.collection("Users")
        .doc(auth.currentUser.uid)
        .collection("PCs")
        .doc(id)
        .delete()
        .then(() => {
          context.commit("deletePC", id);
        });
    },

    updatePC(context, PC) {
      db.collection("Users")
        .doc(auth.currentUser.uid)
        .collection("PCs")
        .doc(PC.id)
        .set({
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          PC: PC.ip,
          timestamp: new Date(),
          turnOn: PC.turnOn,
        })
        .then(() => {
          context.commit("updatePC", PC);
        });
    },
    updatePCListener(context, PC) {
      context.commit("updatePC", PC);
    },
  },

  modules: {},
});
