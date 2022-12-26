<template>
  <form class="form1 pa-6" @submit.prevent="loginUser">
    <H1>LOG IN</H1>
    <v-text-field
      v-model="email"
      label="E-mail"
      required
    ></v-text-field>

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
    <v-btn class="mr-4" @click="loginUser"> submit </v-btn>
  </form>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "../main";

export default {
  data() {
    return {
      show1: false,
      email: "",
      password: "",
      xhrRequest: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },

  methods: {
    loginUser() {
      let r = this;
      r.xhrRequest = true;
      auth.signInWithEmailAndPassword(this.email, this.password).then(
        () => {
          alert("login");
          this.$store.commit('setAuthorization', true);
          this.$router.replace("/");
        },
        (err) => {
          r.xhrRequest = false;
          console.log(`Error - ${err.message}`);
        }
      );
    },
  },
};
</script>