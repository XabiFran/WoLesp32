<template>
  <form class="form1 pa-6" @submit.prevent="signupRequest">
    <H1>SIGN UP</H1>
    <v-text-field v-model="username" label="User Name" required></v-text-field>

    <v-text-field v-model="email" label="E-mail" required></v-text-field>

    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.min]"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      hint="At least 8 characters"
      counter
      @click:append="show1 = !show1"
    ></v-text-field>
    <v-btn class="mr-4" @click="signupRequest"> submit </v-btn>
  </form>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { auth, db } from "../main";

export default {
  data() {
    return {
      show1: false,
      email: "",
      password: "",
      username: "",
      xhrRequest: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },

  methods: {
    signupRequest() {
      let v = this;
      v.xhrRequest = true;
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((cred) => {
          return db.collection("Users").doc(cred.user.uid).set({
            username: this.username,
          });
        })
        .then(() => {
          this.$router.replace("login2");
        })
        .catch((err) => {
          v.xhrRequest = false;
          alert(`Error - ${err.message}`);
        });
    },
  },
};
</script>