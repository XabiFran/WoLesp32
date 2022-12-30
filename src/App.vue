<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> WOLESP </v-list-item-title>
          <v-list-item-subtitle> {{ subtitulo }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <div v-if="this.$store.state.autorized">
        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            :to="item.to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-list dense nav>
          <v-list-item
            v-for="item in items.slice(1, 2)"
            :key="item.title"
            :to="item.to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
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

      <v-menu bottom left v-if="!this.$store.state.autorized">
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
      <v-menu bottom left v-if="this.$store.state.autorized">
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="(item, i) in exitOptions"
            :key="i"
            @click="handleExitOption(i)"
            link
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-dialog v-model="deleteDialog" width="500" persistent>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Information
          </v-card-title>

          <v-card-text>
            <br />
            Are you sure you want to delete your account?</v-card-text
          >

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red"
              text
              @click="
                deleteDialog = false;
                handleDelete();
              "
            >
              Yes, delete my accout
            </v-btn>
            <v-btn color="primary" text @click="deleteDialog = false">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
//import "firebase/compat/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { deleteUser } from "firebase/auth";
import { auth, db } from "./main";
import { database as RTDBdatabase } from "./main";

export default {
  data: () => ({
    drawer: null,
    isLogged: false,
    deleteDialog: false,
    subtitulo: "PC checker",
    items: [
      {
        title: "Devices",
        icon: "mdi-format-list-checks",
        to: "/",
        mostrar: false,
      },
      { title: "About", icon: "mdi-help-box", to: "/about", mostrar: true },
    ],
    options: [
      { title: "Sign in", to: "/sign-up2" },
      { title: "Login", to: "/login2" },
    ],
    exitOptions: [{ title: "Log out" }, { title: "Delete account" }],
  }),
  computed: {},
  methods: {
    handleDelete() {
      const usuarioBorrado = auth.currentUser;
      const referenciatemp = RTDBdatabase.ref(
        "UsersData/" + auth.currentUser.uid
      );
      referenciatemp.remove();
      deleteUser(usuarioBorrado)
        .then(() => {
          this.$router.replace("login2");
        })
        .catch((err) => {
          console.log(`Error - ${err.message}`);
        });
    },
    handleExitOption(index) {
      if (index == 0) {
        auth
          .signOut()
          .then(() => {
            this.$store.dispatch("emptyPCs");
            this.$store.commit("setAuthorization", false);
            this.$router.replace("login2");
          })
          .catch((err) => {
            console.log(`Error - ${err.message}`);
          });
      }
      if (index == 1) {
        this.deleteDialog = true;
      }
    },
    userAuthChange() {
      auth.onAuthStateChanged((user) => {
        console.log(user);
      });
    },
  },

  created() {
    /*console.log("print del ñeet desde el main ");
    auth.onAuthStateChanged((user) => {
      if (this.$store.state.autorized) {
        console.log("USUARIO:"+user);
        var docRef = db.collection("Users").doc(auth.currentUser.uid);
        docRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              console.log("Document data:", doc.data());
              this.subtitulo = doc.data().username;
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        this.subtitulo = "PC Checker";
      }
    });*/
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