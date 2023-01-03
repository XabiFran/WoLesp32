import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDk52kOpbvh9GUPoHi6eH51LKikC_nTt5g",
  authDomain: "wolespdb.firebaseapp.com",
  databaseURL:
    "https://wolespdb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wolespdb",
  storageBucket: "wolespdb.appspot.com",
  messagingSenderId: "741556827661",
  appId: "1:741556827661:web:b3f081bad4d01b35d08744",
  measurementId: "G-3JQH79HD3R",
};

firebase.initializeApp(firebaseConfig);

export const database = firebase.database();

export const auth = firebase.auth();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

auth.onAuthStateChanged((user) => {
  if (user) store.commit("setAuthorization", true);
  else store.commit("setAuthorization", false);
});
