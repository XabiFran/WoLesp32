<template>
  <div class="PCs">
    <v-list flat class="pt-0">
      <div v-for="pc in this.$store.state.pcList" :key="pc.id">
        <v-list-item
          @click="modificarEstado(pc.id)"
          :class="{ 'green lighten-5': pc.on }"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-switch
                inset
                :input-value="pc.on"
                color="light-green accent-4"
              ></v-switch>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title>
                <!--:class="{ 'text-decoration-line-through': pc.on }"-->
                {{ pc.title }}</v-list-item-title
              >
              <v-list-item-subtitle>{{ pc.mac }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ pc.timestamp.toDate() }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="setEditModal(pc)">
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
            <v-icon v-else> mdi-desktop-classic </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="green">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab dark small color="indigo" @click="dialog1 = !dialog1">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab dark small color="red" @click="showDelete = !showDelete">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </div>
    <!--EL Modal de añadir-->
    <v-dialog v-model="dialog1" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add PC</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="File name" v-model="newPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="newPCMAC"></v-text-field>

          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>
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
          <v-text-field label="File name" v-model="thisPCTitle"></v-text-field>
          <v-text-field label="MAC Address" v-model="thisPCMAC"></v-text-field>

          <small class="grey--text">* MAC Format: AA:BB:CC:DD:EE:FF</small>
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

export default {
  
  name: "Home",
  data() {
    return {
      dialog1: false,
      dialog2: false,

      showDelete: false,

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
      newPCTitle: "hola",

      thisPCMAC: "",
      thisPCTitle: "",
      thisPCID: "",
      thisPCOn: false,
      thisPCTimestamp: "",
    };
  },
  methods: {
    modificarEstado(id) {
      this.$store.dispatch("turnOnPC", id);
    },
    deletePC(id) {
      this.$store.dispatch("deletePC", id);
    },
    addPC() {
      this.$store.dispatch("addPC", {
        id: Date.now(),
        title: this.newPCTitle,
        mac: this.newPCMAC,
        on: false,
        timestamp: Date.now(),
      });

      this.newPCTitle = "";
      this.newPCMAC = "";
    },
    setEditModal(pc) {
      this.thisPCTitle = pc.title;
      this.thisPCMAC = pc.mac;
      this.thisPCID = pc.id;
      this.thisPCOn = pc.on;
      this.thisPCTimestamp = pc.timestamp;
      this.dialog2 = !this.dialog2;
    },
    updatePC(id) {
      this.$store.dispatch("updatePC", {
        title: this.thisPCTitle,
        id: this.thisPCID,
        mac: this.thisPCMAC,
        on: this.thisPCOn,
      });
    },
  },
  created(){
    this.$store.dispatch('retrievePCs');
  }
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