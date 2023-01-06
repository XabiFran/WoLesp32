<template>
  <form class="form1 pa-6" @submit.prevent="loginUser">
    <H1>LOG IN</H1>
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
    <v-btn class="mr-4" @click="loginUser"> submit </v-btn>
    <v-dialog v-model="dialogSuccess" width="500" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Information
        </v-card-title>

        <v-card-text> <br />Successful log in.</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="
              dialogSuccess = false;
              handleSuccess();
            "
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogError" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          Information
        </v-card-title>
        <v-card-text>
          {{ this.error }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialogError = false"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialogSuccess: false,
      dialogError: false,
      error: "",
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
    /**
     * Función encargada de redirigir al usuario a la vista de dispositivos.
     * 
     */
    handleSuccess() {
      this.$store.commit("setAuthorization", true);
      this.$router.replace("/");
    },
    /**
     * Función encargada de acceder con las credenciales del usuario.
     * 
     */
    loginUser() {
      let r = this;
      r.xhrRequest = true;
      auth.signInWithEmailAndPassword(this.email, this.password).then(
        () => {
          this.dialogSuccess = true;
        },
        (err) => {
          r.xhrRequest = false;
          this.error = err.message;
          this.dialogError = true;
        }
      );
    },
  },
};
</script>