<template>
  <div class="Devices">
    <v-list flat class="pt-0">
      <div v-for="pc in this.$store.state.deviceList" :key="pc.id">
        <v-list-item @click.stop="setDeviceID(pc.id)">
          <template v-slot:default>
            <v-list-item-action>
              <v-icon color="#1e54b4">mdi-chip</v-icon>
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
              <v-btn v-else-if="showDelete" icon @click.stop="deleteDevice(pc)">
                <v-icon color="red lighten-2">mdi-close-thick</v-icon>
              </v-btn>
              <v-btn v-else icon @click.stop="setDetailModal(pc)">
                <v-icon>mdi-information</v-icon>
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
          <v-btn v-model="fab" color="#1e54b4" dark fab>
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-chip </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="indigo" @click="dialog1 = !dialog1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          v-if="showEdit"
          fab
          dark
          small
          color="light-green "
          @click="
            showDelete = false;
            showEdit = false;
          "
        >
          <v-icon>mdi-pencil-off</v-icon>
        </v-btn>
        <v-btn
          v-else
          fab
          dark
          small
          color="light-green "
          @click="
            showDelete = false;
            showEdit = true;
          "
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="showDelete"
          fab
          dark
          small
          color="red"
          @click="
            showDelete = false;
            showEdit = false;
          "
        >
          <v-icon>mdi-delete-off</v-icon>
        </v-btn>
        <v-btn
          v-else
          fab
          dark
          small
          color="red"
          @click="
            showDelete = true;
            showEdit = false;
          "
        >
          <v-icon>mdi-delete</v-icon>
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
    <!--EL Modal de ver detalles-->
    <v-dialog v-model="detailDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Device Details</span>
        </v-card-title>
        <v-card-text>
          <b>Name:</b> {{ thisPCTitle }} <br />
          <b>Mac:</b> {{ thisPCMAC }}<br />
          <b>Description:</b> {{ thisPCIP }}<br />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text color="primary" @click="detailDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--EL Modal de editar-->
    <v-dialog v-model="dialog2" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Device</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Device name" v-model="thisPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="thisPCMAC"></v-text-field>
          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>

          <v-text-field label="Description" v-model="thisPCIP"></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="primary"
            @click="
              dialog2 = false;
              updateDevice(thisPCID);
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
      detailDialog: false,

      showDelete: false,
      showEdit: false,

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

      newPCMAC: "",
      newPCTitle: "",
      newPCIP: "",
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
    deleteDevice(pc) {
      this.$store.dispatch("deleteDevice", pc);
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
    setDeviceID(id) {
      this.$store.dispatch("setDeviceID", id);
      this.$router.replace("PCs");
    },
    updateDevice(id) {
      this.$store.dispatch("updateDevice", {
        title: this.thisPCTitle,
        id: this.thisPCID,
        mac: this.thisPCMAC,
        ip: this.thisPCIP,
      });
    },
    setDetailModal(pc) {
      this.thisPCTitle = pc.title;
      this.thisPCIP = pc.ip;
      this.thisPCMAC = pc.mac;
      this.thisPCTimestamp = pc.timestamp;
      this.detailDialog = !this.detailDialog;
    },
  },
  created() {
    this.$store.dispatch("retrieveDevices");
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