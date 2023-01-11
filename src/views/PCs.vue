<template>
  <div class="PCs">
    <v-list flat class="pt-0">
      <div v-for="pc in this.$store.state.pcList" :key="pc.id">
        <v-list-item>
          <template v-slot:default>
            <v-list-item-action>
              <v-btn color="success" fab dark @click="modificarEstado(pc)">
                <v-icon large>mdi-power</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                color="#1e54b4"
                fab
                dark
                class="mr-5 ml-n5"
                @click="pingearPC(pc)"
              >
                <v-icon large>mdi-refresh</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action v-if="pc.result == 'turnedOn'">
              <v-icon class="mr-5" color="green lighten-2"
                >mdi-check-outline</v-icon
              >
            </v-list-item-action>
            <v-list-item-action v-else-if="pc.result == 'processing'">
              <v-icon class="mr-5" color="amber darken-2">mdi-progress-clock</v-icon>
            </v-list-item-action>
            <v-list-item-action v-else-if="pc.result == 'disconnected'">
              <v-icon class="mr-5">mdi-wifi-off</v-icon>
            </v-list-item-action>
            <v-list-item-action v-else-if="pc.result == 'notTurnedOn'">
              <v-icon class="mr-5" color="red darken-1">mdi-close</v-icon>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                <!--:class="{ 'text-decoration-line-through': pc.on }"-->
                {{ pc.title }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ pc.mac }}</v-list-item-subtitle>
              <!--<v-list-item-subtitle>{{ pc.timestamp.toDate() }}</v-list-item-subtitle>-->
            </v-list-item-content>
            <v-list-item-action>
              <v-btn v-if="showEdit" icon @click.stop="setEditModal(pc)">
                <v-icon color="blue-grey lighten-1">mdi-pencil</v-icon>
              </v-btn>
              <v-btn v-else-if="showDelete" icon @click.stop="deletePC(pc)">
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
            <v-icon v-else> mdi-desktop-classic </v-icon>
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
    <!--EL Modal de ver detalles-->
    <v-dialog v-model="detailDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">PC Details</span>
        </v-card-title>
        <v-card-text>
          <b>Name:</b> {{ thisPCTitle }} <br />
          <b>Status:</b> {{ thisStatus }}<br />
          <b>Mac:</b> {{ thisPCMAC }}<br />
          <b>IP:</b> {{ thisPCIP }}<br />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text color="primary" @click="detailDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--EL Modal de añadir-->
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add PC</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="PC name" v-model="newPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="newPCMAC"></v-text-field>
          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>

          <v-text-field label="IP Address" v-model="newPCIP"></v-text-field>
          <small class="grey--text">* IP Format: xxx.xxx.xxx.xxx</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="primary"
            @click="
              dialog1 = false;
              addPC();
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
          <v-text-field label="PC name" v-model="thisPCTitle"></v-text-field>
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
      dialog1: false,
      dialog2: false,
      detailDialog: false,

      timer: null,
      timerPing: null,

      loading5: false,

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

      thisPCIP: "",
      thisPCMAC: "",
      thisPCTitle: "",
      thisPCID: "",
      thisPCOn: false,
      thisPCTimestamp: "",
      thisPCTurnOn: false,
      thisPCresult: "",
      thisStatus: "",
    };
  },
  watch: {
  },
  methods: { 
    /**
     * Función encargada de llevar la orden de encendido y una actualización del equipo a Actions. También se encarga de empezar el timeout de conexión con el ESP32, de 30 segundos.
     * 
     * @param {JSON} pc - El equipo que se quiere encender.
     */
    modificarEstado(pc) {
      this.$store.dispatch("turnOnPC", pc);
      this.$store.dispatch("updatePC", {
        title: pc.title,
        id: pc.id,
        mac: pc.mac,
        ip: pc.ip,
        on: pc.on,
        turnOn: pc.turnOn,
        result: "processing",
      });
      this.timer = setTimeout(() => {
        console.log("No se ha obtenido respuesta");
        this.$store.dispatch("updatePC", {
          title: pc.title,
          id: pc.id,
          mac: pc.mac,
          ip: pc.ip,
          on: pc.on,
          turnOn: pc.turnOn,
          result: "disconnected",
        });
      }, 30000);
    },
    /**
     * Función encargada de llevar la orden de encendido y una actualización del equipo a Actions. También se encarga de empezar el timeout de conexión con el ESP32, de 30 segundos.
     * 
     * @param {JSON} pc - El equipo que se quiere pingear.
     */
    pingearPC(pc) {
      this.$store.dispatch("updatePC", {
        title: pc.title,
        id: pc.id,
        mac: pc.mac,
        ip: pc.ip,
        on: pc.on,
        turnOn: pc.turnOn,
        result: "processing",
      });
      this.$store.dispatch("pingearPC", pc);
      this.timerPing = setTimeout(() => {
        console.log("No se ha obtenido respuesta");
        this.$store.dispatch("updatePC", {
          title: pc.title,
          id: pc.id,
          mac: pc.mac,
          ip: pc.ip,
          on: pc.on,
          turnOn: pc.turnOn,
          result: "disconnected",
        });
      }, 30000);
    },
    /**
     * Función encargada de enviar la orden de borrado a Actions.
     * 
     * @param {JSON} pc - El equipo que se quiere eliminar.
     */
    deletePC(pc) {
      this.$store.dispatch("deletePC", pc);
    },
    /**
     * Función encargada de enviar la orden de añadir un nuevo pc con sus datos a Actions.
     * 
     */
    addPC() {
      this.$store.dispatch("addPC", {
        id: Date.now(),
        title: this.newPCTitle,
        mac: this.newPCMAC,
        ip: this.newPCIP,
        on: false,
        timestamp: new Date(),
        turnOn: false,
      });
      this.newPCIP = "";
      this.newPCTitle = "";
      this.newPCMAC = "";
    },
    /**
     * Función encargada de invocar el modal de ver detalles de un pc y cargarlo con sus datos.
     * 
     * @param {JSON} pc - El equipo que se quiere mostrar.
     */
    setDetailModal(pc) {
      this.thisPCTitle = pc.title;
      this.thisPCIP = pc.ip;
      this.thisPCMAC = pc.mac;
      this.thisPCID = pc.id;
      this.thisPCOn = pc.on;
      this.thisPCTurnOn = pc.turnOn;
      this.thisPCTimestamp = pc.timestamp;
      this.thisPCresult = pc.result;
      this.detailDialog = !this.detailDialog;
      if (pc.result == "disconnected") this.thisStatus = "Disconnected";
      else if (pc.result == "notTurnedOn") this.thisStatus = "Off";
      else if (pc.result == "turnedOn") this.thisStatus = "On";
      else this.thisStatus = "Processing";
    },
    /**
     * Función encargada de invocar el modal de editar un pc y cargarlo con sus datos.
     * 
     * @param {JSON} pc - El equipo que se quiere editar.
     */
    setEditModal(pc) {
      this.thisPCTitle = pc.title;
      this.thisPCIP = pc.ip;
      this.thisPCMAC = pc.mac;
      this.thisPCID = pc.id;
      this.thisPCOn = pc.on;
      this.thisPCTurnOn = pc.turnOn;
      this.thisPCTimestamp = pc.timestamp;
      this.thisPCresult = pc.result;
      this.dialog2 = !this.dialog2;
    },
    /**
     * Función encargada de enviar los datos de un pc actualizado a Actions.
     * 
     */
    updatePC() {
      this.$store.dispatch("updatePC", {
        title: this.thisPCTitle,
        id: this.thisPCID,
        mac: this.thisPCMAC,
        ip: this.thisPCIP,
        on: this.thisPCOn,
        turnOn: this.thisPCTurnOn,
        result: this.thisPCresult,
      });
    },
  },
  /**
   * Función encargada de enviar la orden de mostrar los pcs a Actions cuando se carga la vista. También se encarga de cancelar el timeout de ping o encendido.
   * 
   */
  created() {
    if (this.$store.state.currentDevice != null)
      this.$store.dispatch("retrievePCs");

    if (this.$store.state.currentDevice != null) {
      const ref = RTDBdatabase.ref(
        "UsersData/" +
          auth.currentUser.uid +
          "/Devices/" +
          this.$store.state.currentDevice +
          "/result"
      );
      console.log("REFERENCE TO RESULT: ", ref);
      ref.on(
        "value",
        (snapshot) => {
          clearTimeout(this.timer);
          clearTimeout(this.timerPing);
          console.log("Acabo de cancelar el timeout.");
          console.log("VALOR DE RESULT ESCUCHADA: ", snapshot.val());
        },
        (errorObject) => {
          console.log("The read failed: " + errorObject.name);
        }
      );
    }
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
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}

</style>