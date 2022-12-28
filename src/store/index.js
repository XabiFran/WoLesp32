import { collection, doc, QuerySnapshot } from "firebase/firestore";
import Vue from "vue";
import Vuex from "vuex";
import PCView from "../views/PCs.vue";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  ref,
  set,
  push,
  get,
  query,
  child,
  getDatabase,
  update,
} from "firebase/database";
import { database as RTDBdatabase } from "../main";
import { auth, db } from "../main";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    autorized: null,
    currentDevice: null,
    username: null,
    pcList: [],
    deviceList: [],
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
    addDevice(state, PC) {
      state.deviceList.push({
        id: PC.id,
        title: PC.title,
        ip: PC.ip,
        mac: PC.mac,
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
        ip: PC.ip,
        on: PC.on,
        timestamp: PC.timestamp,
        turnOn: PC.turnOn,
      });
    },
    updateDevice(state, PC) {
      const id = PC.id;
      const index = state.deviceList.indexOf(
        state.deviceList.filter((pc) => pc.id === id)[0]
      );

      state.deviceList.splice(index, 1, {
        title: PC.title,
        id: PC.id,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: PC.timestamp,
      });
    },
    turnOnPC(state, id) {
      let pc = state.pcList.filter((pc) => pc.id === id)[0];
      pc.turnOn = !pc.turnOn;
    },
    deletePC(state, id) {
      state.pcList = state.pcList.filter((pc) => pc.id !== id);
    },
    deleteDevice(state, id) {
      state.deviceList = state.deviceList.filter((pc) => pc.id !== id);
    },
    retrievePCs(state, PCs) {
      state.pcList = PCs;
    },
    retrieveDevices(state, PCs) {
      state.deviceList = PCs;
    },
    emptyPCs(state) {
      while (state.pcList.length > 0) {
        state.pcList.pop();
      }
    },
    emptyDevices(state) {
      while (state.deviceList.length > 0) {
        state.deviceList.pop();
      }
    },
    setDeviceID(state, id){
      state.currentDevice = id;
    },
  },
  actions: {
    emptyPCs(context) {
      context.commit("emptyPCs");
    },
    emptyDevices(context) {
      context.commit("emptyDevices");
    },
    retrievePCs(context) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          //Parte de FireStore
          /*db.collection("Users")
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
              //context.commit("retrievePCs", tempPCsSorted);
            });*/
          //Parte de RTDB
          const referenciatemp = RTDBdatabase.ref(
            "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice +"/PCs"
          );
          referenciatemp.on(
            "value",
            (snapshot) => {
              let tempPCs = [];
            
              snapshot.forEach((doc) => {
                console.log("DESCARGO ESTO: ", doc);
                const data = {
                  id: doc.key,
                  mac: doc.val().mac,
                  ip: doc.val().ip,
                  title: doc.val().title,
                  on: doc.val().on,
                  timestamp: doc.val().timestamp,
                  turnOn: doc.val().turnOn,
                };
                tempPCs.push(data);
              });
              
              context.commit("retrievePCs", tempPCs);
            },
            (errorObject) => {
              console.log("The read failed: " + errorObject.name);
            }
          );
        } else {
          console.log("No estás logueado compai");
          context.commit("emptyPCs");
        }
      });
    },
    retrieveDevices(context) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const referenciatemp = RTDBdatabase.ref(
            "UsersData/" + auth.currentUser.uid + "/Devices"
          );
          referenciatemp.on(
            "value",
            (snapshot) => {
              let tempPCs = [];
            
              snapshot.forEach((doc) => {
                console.log("DESCARGO ESTOS DEVICES: ", doc);
                const data = {
                  id: doc.key,
                  mac: doc.val().mac,
                  ip: doc.val().ip,
                  title: doc.val().title,
                  timestamp: doc.val().timestamp,
                };
                tempPCs.push(data);
              });
              context.commit("retrieveDevices", tempPCs);
            },
            (errorObject) => {
              console.log("The read failed: " + errorObject.name);
            }
          );
        } else {
          console.log("No estás logueado compai");
          context.commit("emptyDevices");
        }
      });
    },
    addPC(context, PC) {
      //Parte de FireStore
      /*db.collection("Users").doc(auth.currentUser.uid).collection("PCs").add({
        title: PC.title,
        on: PC.on,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: new Date(),
        turnOn: PC.turnOn,
      });
      /*.then((docRef) => {
          context.commit("addPC", {
            title: PC.title,
            on: PC.on,
            mac: PC.mac,
            ip: PC.ip,
            id: docRef.id,
            timestamp: PC.timestamp,
            turnOn: PC.turnOn,
          });
        });*/
      //parte de RTDB
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var key = push(ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/PCs"), {
        title: PC.title,
        on: PC.on,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
        turnOn: PC.turnOn,
      }).key;

      update(ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/PCs/"+key), {
        timestamp: new Date(),
      });
      /*.then((docRef) => {
        context.commit("addPC", {
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          ip: PC.ip,
          id: docRef.key,
          timestamp: PC.timestamp,
          turnOn: PC.turnOn,
        });
      })*/
    },

    addDevice(context, PC) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var key=push(ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Devices"), {
        title: PC.title,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
      }).key;
      update(ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Devices/"+key), {
        timestamp: new Date(),
      });
      /*.then((docRef) => {
        context.commit("addPC", {
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          ip: PC.ip,
          id: docRef.key,
          timestamp: PC.timestamp,
          turnOn: PC.turnOn,
        });
      })*/
    },
    pingearPC(context, PC){
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/Actions"
      );
      referenciatemp.set({
        action: "ping",
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
        PCID: PC.id,
        deviceID: this.state.currentDevice,
      });
    },
    turnOnPC(context, PC) {
      //RTDB
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/Actions"
      );
      referenciatemp.set({
        action: "encender",
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
        PCID: PC.id,
        deviceID: this.state.currentDevice,
      });
      //FIRESTORE
      /*db.collection("Users")
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
        });*/
    },

    deletePC(context, id) {
      /*db.collection("Users")
        .doc(auth.currentUser.uid)
        .collection("PCs")
        .doc(id)
        .delete()
        .then(() => {
          context.commit("deletePC", id);
        });
      const delPCref = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/PCs" + id
      );*/
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/PCs/"+ id
      );
      referenciatemp.remove();
    },

    deleteDevice(context, id) {
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ id
      );
      referenciatemp.remove();
    },

    updatePC(context, PC) {
      //RTDB
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ this.state.currentDevice + "/PCs/"+ PC.id
      );
      referenciatemp.update({
        title: PC.title,
        on: PC.on,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: new Date(),
        turnOn: PC.turnOn,
      });
      //FIRESTORE
      /*db.collection("Users")
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
        });*/
    },

    updateDevice(context, PC) {
      //RTDB
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/"+ PC.id
      );
      referenciatemp.update({
        title: PC.title,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: new Date(),
      });
    },

    updatePCListener(context, PC) {
      context.commit("updatePC", PC);
    },
    setDeviceID(context, id){
      context.commit("setDeviceID", id);
    },
  },

  modules: {},
});
