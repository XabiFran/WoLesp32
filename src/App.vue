<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> WOLESP </v-list-item-title>
          <v-list-item-subtitle> PC Checker </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark src="vaporwave.jpg" prominent>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>WOLESP</v-app-bar-title>

      <v-spacer></v-spacer>

      <!--<v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->

      <!--<v-btn icon to="/feed">
        <v-icon>mdi-heart</v-icon>
      </v-btn>-->

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, i) in options" :key="i" :to="item.to" link>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon @click="handleSignOut" v-if="this.$store.state.autorized">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
//import { onMounted, ref } from "vue";
//import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import router from "./router";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

import { auth, db } from "./main";

export default {
  data: () => ({
    drawer: null,
    isLogged: false,
    items: [
      { title: "PCs", icon: "mdi-format-list-checks", to: "/" },
      { title: "About", icon: "mdi-help-box", to: "/about" },
    ],
    options: [
      { title: "Sign in", to: "/sign-up2" },
      { title: "Login", to: "/login2" },
      { title: "Sign Out", to: "/" },
    ],
  }),

  methods: {
    handleSignOut() {
      console.log("Entré en la función de salir");
      auth
        .signOut()
        .then(() => {
          this.$store.commit("setAuthorization", false);
          this.$router.replace("login2");
        })
        .catch((err) => {
          console.log(`Error - ${err.message}`);
        });
    },
    userAuthChange() {
      auth.onAuthStateChanged((user) => {
        console.log(user);
      });
    },
  },

  created() {
    auth.onAuthStateChanged((user) => {
      if (user) this.isLogged = true;
      else this.isLogged = false;
    });
  },
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
</style>