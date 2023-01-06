<template>
  <div class="Logs">
    <v-list flat class="pt-0">
      <div v-for="log in this.$store.state.logList" :key="log.id">
        <v-list-item>
          <template v-slot:default>
            <v-list-item-content>
              <v-list-item-title>
                <!--:class="{ 'text-decoration-line-through': pc.on }"-->
                Action: {{ log.action }} {{log.type}}</v-list-item-title
              >
              <v-list-item-subtitle>Name: {{ log.title }}</v-list-item-subtitle>
              <v-list-item-subtitle>Date: {{ new Date(log.timestamp) }}</v-list-item-subtitle>
              <!--<v-list-item-subtitle>{{ pc.timestamp.toDate() }}</v-list-item-subtitle>-->
            </v-list-item-content>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    
  </div>
</template>

<script>
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
export default {
  name: "Home",
  data() {
    return {
      
    };
  },
  watch: {
  },
  methods: {
    
  },
  /**
   * Función encargada de enviar la orden de mostrar los registros a Actions cuando se carga la vista.
   */
  created() {
    this.$store.dispatch("retrieveLogs");
  },
};
</script>