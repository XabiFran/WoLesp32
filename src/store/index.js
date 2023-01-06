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
    timer: null,
    autorized: null,
    currentDevice: null,
    username: null,
    pcList: [],
    deviceList: [],
    logList: [],
  },
  getters: {},
  mutations: {
    /**
     * Función encargada de actualizar la autenticación.
     *
     * @param {JSON} state - El state de store.
     * @param {boolean} value - Valor de la autenticación.
     */
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
    /**
     * Función encargada de rellenar la lista de equipos.
     *
     * @param {JSON} state - El state de store.
     * @param {Object[]} PCs - Lista de equipos actualizada.
     */
    retrievePCs(state, PCs) {
      state.pcList = PCs;
    },
    /**
     * Función encargada de rellenar la lista de dispositivos.
     *
     * @param {JSON} state - El state de store.
     * @param {Object[]} Devices - Lista de dispositivos actualizada.
     */
    retrieveDevices(state, Devices) {
      state.deviceList = Devices;
    },
    /**
     * Función encargada de rellenar la lista de registros.
     *
     * @param {JSON} state - El state de store.
     * @param {Object[]} Logs - Lista de registros actualizada.
     */
    retrieveLogs(state, Logs) {
      state.logList = Logs;
    },
    /**
     * Función encargada de vaciar la lista de equipos.
     *
     * @param {JSON} state - El state de store.
     */
    emptyPCs(state) {
      while (state.pcList.length > 0) {
        state.pcList.pop();
      }
    },
    /**
     * Función encargada de vaciar la lista de dispositivos.
     *
     * @param {JSON} state - El state de store.
     */
    emptyDevices(state) {
      while (state.deviceList.length > 0) {
        state.deviceList.pop();
      }
    },
    /**
     * Función encargada de vaciar la lista de registros.
     *
     * @param {JSON} state - El state de store.
     */
    emptyLogs(state) {
      while (state.logList.length > 0) {
        state.logList.pop();
      }
    },
    /**
     * Función encargada de actualizar el id del dispositivo seleccionado.
     *
     * @param {JSON} state - El state de store.
     * @param {string} id - El id del dispositivo actual.
     */
    setDeviceID(state, id) {
      state.currentDevice = id;
    },
  },
  actions: {
    /**
     * Función encargada de enviar la orden de vaciar pcs a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
    emptyPCs(context) {
      context.commit("emptyPCs");
    },
    /**
     * Función encargada de enviar la orden de vaciar dispositivos a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
    emptyDevices(context) {
      context.commit("emptyDevices");
    },
    /**
     * Función encargada de enviar la orden de vaciar registros a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
    emptyLogs(context) {
      context.commit("emptyLogs");
    },
    /**
     * Función encargada de recuperar los equipos y enviarlos a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
    retrievePCs(context) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const referenciatemp = RTDBdatabase.ref(
            "UsersData/" +
              auth.currentUser.uid +
              "/Devices/" +
              this.state.currentDevice +
              "/PCs"
          );
          referenciatemp.on(
            "value",
            (snapshot) => {
              let tempPCs = [];

              snapshot.forEach((doc) => {
                const data = {
                  id: doc.key,
                  mac: doc.val().mac,
                  ip: doc.val().ip,
                  title: doc.val().title,
                  on: doc.val().on,
                  timestamp: doc.val().timestamp,
                  turnOn: doc.val().turnOn,
                  result: doc.val().result,
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
          context.commit("emptyPCs");
        }
      });
    },
    /**
     * Función encargada de recuperar los dispositivos y enviarlos a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
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
          context.commit("emptyDevices");
        }
      });
    },
    /**
     * Función encargada de recuperar los registros y enviarlos a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     */
    retrieveLogs(context) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const referenciatemp = RTDBdatabase.ref(
            "UsersData/" + auth.currentUser.uid + "/Logs"
          );
          referenciatemp.on(
            "value",
            (snapshot) => {
              let tempPCs = [];

              snapshot.forEach((doc) => {
                const data = {
                  id: doc.key,
                  mac: doc.val().mac,
                  ip: doc.val().ip,
                  title: doc.val().title,
                  timestamp: doc.val().timestamp,
                  action: doc.val().action,
                  type: doc.val().type,
                };
                tempPCs.push(data);
              });
              const tempPCsSorted = tempPCs.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
              });
              context.commit("retrieveLogs", tempPCsSorted);
            },
            (errorObject) => {
              console.log("The read failed: " + errorObject.name);
            }
          );
        } else {
          context.commit("emptyLogs");
        }
      });
    },
    /**
     * Función encargada de añadir un equipo a la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} PC - El pc que se quiere añadir a la base de datos.
     */
    addPC(context, PC) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var key = push(
        ref(
          RTDBdatabase,
          "UsersData/" +
            auth.currentUser.uid +
            "/Devices/" +
            this.state.currentDevice +
            "/PCs"
        ),
        {
          title: PC.title,
          on: PC.on,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          turnOn: PC.turnOn,
          result: "disconnected",
        }
      ).key;

      update(
        ref(
          RTDBdatabase,
          "UsersData/" +
            auth.currentUser.uid +
            "/Devices/" +
            this.state.currentDevice +
            "/PCs/" +
            key
        ),
        {
          timestamp: new Date(),
        }
      );

      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: PC.title,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          action: "Add",
          type: "PC",
        }
      ).key;

      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
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
    /**
     * Función encargada de añadir un dispositivo a la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} addedDevice - El dispositivo que se quiere añadir a la base de datos.
     */
    addDevice(context, addedDevice) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var key = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Devices"),
        {
          title: addedDevice.title,
          mac: addedDevice.mac,
          ip: addedDevice.ip,
          timestamp: myTimestamp,
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Devices/" + key
        ),
        {
          timestamp: new Date(),
        }
      );
      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: addedDevice.title,
          mac: addedDevice.mac,
          ip: addedDevice.ip,
          timestamp: myTimestamp,
          action: "Add",
          type: "Device",
        }
      ).key;

      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
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
    /**
     * Función encargada de escribir en la base de datos la acción de pingear un pc y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} PC - El pc que se quiere pingear.
     */
    pingearPC(context, PC) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" +
          auth.currentUser.uid +
          "/Devices/" +
          this.state.currentDevice +
          "/Actions"
      );
      referenciatemp.set({
        action: "ping",
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
        PCID: PC.id,
        deviceID: this.state.currentDevice,
      });

      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: PC.title,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          action: "Ping",
          type: "PC",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
    },
    /**
     * Función encargada de escribir en la base de datos la acción de encender un pc y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} PC - El pc que se quiere encender.
     */
    turnOnPC(context, PC) {
      //RTDB
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" +
          auth.currentUser.uid +
          "/Devices/" +
          this.state.currentDevice +
          "/Actions"
      );
      referenciatemp.set({
        action: "encender",
        mac: PC.mac,
        ip: PC.ip,
        timestamp: myTimestamp,
        PCID: PC.id,
        deviceID: this.state.currentDevice,
      });

      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: PC.title,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          action: "Turn On",
          type: "PC",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
    },
    /**
     * Función encargada de eliminar un pc de la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} PC - El pc que se quiere eliminar.
     */
    deletePC(context, PC) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: PC.title,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          action: "Remove",
          type: "PC",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" +
          auth.currentUser.uid +
          "/Devices/" +
          this.state.currentDevice +
          "/PCs/" +
          PC.id
      );
      referenciatemp.remove();
    },
    /**
     * Función encargada de eliminar un dispositivo de la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} deletedDevice - El dispositivo que se quiere eliminar.
     */
    deleteDevice(context, deletedDevice) {
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: deletedDevice.title,
          mac: deletedDevice.mac,
          ip: deletedDevice.ip,
          timestamp: myTimestamp,
          action: "Remove",
          type: "Device",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/" + deletedDevice.id
      );
      referenciatemp.remove();
    },
    /**
     * Función encargada de actualizar un pc de la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} PC - El pc que se quiere actualizar.
     */
    updatePC(context, PC) {
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" +
          auth.currentUser.uid +
          "/Devices/" +
          this.state.currentDevice +
          "/PCs/" +
          PC.id
      );
      referenciatemp.update({
        title: PC.title,
        on: PC.on,
        mac: PC.mac,
        ip: PC.ip,
        timestamp: new Date(),
        turnOn: PC.turnOn,
        result: PC.result,
      });
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: PC.title,
          mac: PC.mac,
          ip: PC.ip,
          timestamp: myTimestamp,
          action: "Modify",
          type: "PC",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
    },
    /**
     * Función encargada de actualizar un dispositivo de la base de datos y actualizar los registros.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {JSON} updatedDevice - El dispositivo que se quiere actualizar.
     */
    updateDevice(context, updatedDevice) {
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid + "/Devices/" + updatedDevice.id
      );
      referenciatemp.update({
        title: updatedDevice.title,
        mac: updatedDevice.mac,
        ip: updatedDevice.ip,
        timestamp: new Date(),
      });
      var myTimestamp = firebase.firestore.Timestamp.fromDate(new Date());
      var logKey = push(
        ref(RTDBdatabase, "UsersData/" + auth.currentUser.uid + "/Logs"),
        {
          title: updatedDevice.title,
          mac: updatedDevice.mac,
          ip: updatedDevice.ip,
          timestamp: myTimestamp,
          action: "Modify",
          type: "Device",
        }
      ).key;
      update(
        ref(
          RTDBdatabase,
          "UsersData/" + auth.currentUser.uid + "/Logs/" + logKey
        ),
        {
          timestamp: new Date(),
        }
      );
    },
    updatePCListener(context, PC) {
      context.commit("updatePC", PC);
    },
    /**
     * Función encargada enviar el id del dispositivo seleccionado a Mutations.
     *
     * @param {ActionContext<{JSON}>} context - El state de store y el contexto de la página que viene.
     * @param {string} id - El id del dispositivo seleccionado.
     */
    setDeviceID(context, id) {
      context.commit("setDeviceID", id);
    },
  },

  modules: {},
});
