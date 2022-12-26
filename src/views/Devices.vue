<template>
  <div class="Devices">
    <v-list flat class="pt-0">
      <div v-for="pc in this.$store.state.deviceList" :key="pc.id">
        <v-list-item  @click.stop="setDeviceID(pc.id)">
          <template v-slot:default>
            <v-list-item-action>
              <v-icon color="cyan lighten-2">mdi-chip</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                <!--:class="{ 'text-decoration-line-through': pc.on }"-->
                {{ pc.title }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ pc.ip }}</v-list-item-subtitle>
              <!--<v-list-item-subtitle>{{ pc.timestamp.toDate() }}</v-list-item-subtitle>-->
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-if="showEdit" icon @click.stop="setEditModal(pc)">
                <v-icon color="blue-grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
              <v-btn v-if="showDelete" icon @click.stop="deletePC(pc.id)">
                <v-icon color="red lighten-2">mdi-close-thick</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>
    <!--El menú FAB -->
    <div>
      <v-speed-dial
        fixed
        v-model="fab"
        :top="top"
        :bottom="bottom"
        :right="right"
        :left="left"
        :direction="direction"
        :open-on-hover="hover"
        :transition="transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-chip </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="indigo" @click="dialog1 = !dialog1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab
          dark
          small
          color="red"
          @click="
            showDelete = !showDelete;
            showEdit = !showEdit;
          "
        >
          <v-icon v-if="showDelete">mdi-delete-off</v-icon>
          <v-icon v-else>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </div>
    <!--EL Modal de añadir-->
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Device</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Device name" v-model="newPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="newPCMAC"></v-text-field>
          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>

          <v-text-field
            label="Brief description"
            v-model="newPCIP"
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="primary"
            @click="
              dialog1 = false;
              addDevice();
            "
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--EL Modal de editar-->
    <v-dialog v-model="dialog2" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit PC</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="File name" v-model="thisPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="thisPCMAC"></v-text-field>
          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>

          <v-text-field label="IP Address" v-model="thisPCIP"></v-text-field>
          <small class="grey--text">* IP Format: xxx.xxx.xxx.xxx</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="primary"
            @click="
              dialog2 = false;
              updatePC(thisPCID);
            "
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { auth, db } from "../main";
import { getDatabase, ref, set, push } from "firebase/database";
import { database } from "../main";
export default {
  name: "Home",
  data() {
    return {
      dialog1: false,
      dialog2: false,

      showDelete: false,
      showEdit: true,

      direction: "top",
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: "slide-y-reverse-transition",

      newPCMAC: "00:00:00:00:00:00",
      newPCTitle: "Dispositivo nuevo",
      newPCIP: "Descripción del dispositivo",
      toRoute: "/PCs",
      thisDeviceID: "",
      thisPCIP: "",
      thisPCMAC: "",
      thisPCTitle: "",
      thisPCID: "",
      thisPCOn: false,
      thisPCTimestamp: "",
      thisPCTurnOn: false,
    };
  },
  methods: {
    modificarEstado(id) {
      this.$store.dispatch("turnOnPC", id);
    },
    deletePC(id) {
      this.$store.dispatch("deletePC", id);
    },
    addDevice() {
      this.$store.dispatch("addDevice", {
        id: Date.now(),
        title: this.newPCTitle,
        mac: this.newPCMAC,
        ip: this.newPCIP,
        timestamp: new Date(),
      });
      this.newPCIP = "";
      this.newPCTitle = "";
      this.newPCMAC = "";
    },
    setEditModal(pc) {
      this.thisPCTitle = pc.title;
      this.thisPCIP = pc.ip;
      this.thisPCMAC = pc.mac;
      this.thisPCID = pc.id;
      this.thisPCTimestamp = pc.timestamp;
      this.dialog2 = !this.dialog2;
    },
    setDeviceID(id){
      this.$store.dispatch("setDeviceID", id);
      this.$router.replace("PCs");
    },
    updatePC(id) {
      this.$store.dispatch("updateDevice", {
        title: this.thisPCTitle,
        id: this.thisPCID,
        mac: this.thisPCMAC,
        ip: this.thisPCIP,
      });
    },
  },
  created() {
    this.$store.dispatch("retrieveDevices");
    /*db.collection("Users")
      .doc(auth.currentUser.uid)
      .collection("PCs")
      .onSnapshot((res) => {
        const changes = res.docChanges();

        changes.forEach((change) => {
          if (change.type === "modified") {
            console.log(
              "Modified PC: ",
              change.doc.data(),
              "ID: ",
              change.doc.id
            );
            this.$store.dispatch("updatePCListener", {
              title: change.doc.data().title,
              id: change.doc.id,
              mac: change.doc.data().mac,
              on: change.doc.data().on,
              turnOn: change.doc.data().turnOn,
            });
          }
        });
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