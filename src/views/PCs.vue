<template>
  <div class="PCs">
    <v-text-field
      v-model="newPCTitle"
      @click:append="addPC()"
      @keyup.enter="addPC()"
      class="pa-3"
      outlined
      label="Add PC"
      append-icon="mdi-plus"
      hide-details
      clearable
    ></v-text-field>
    <v-list flat class="pt-0">
      <div v-for="pc in pcList" :key="pc.id">
        <v-list-item
          @click="modificarEstado(pc.id)"
          :class="{ 'blue lighten-5': pc.on }"
        >
          <template v-slot:default>
            <v-list-item-action>
              <v-checkbox :input-value="pc.on" color="primary"></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                :class="{ 'text-decoration-line-through': pc.on }"
              >
                {{ pc.title }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="deletePC(pc.id)">
                <v-icon color="primary lighten-1">mdi-close-thick</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </v-list>

  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      newPCTitle: "hola",
      pcList: [
        {
          id: 1,
          title: "PC de Jaime",
          mac: "none",
          on: true,
        },
        {
          id: 2,
          title: "PC de Xabi",
          mac: "none",
          on: false,
        },
        {
          id: 3,
          title: "PC de Frades",
          mac: "none",
          on: false,
        },
      ],
    };
  },
  methods: {
    modificarEstado(id) {
      let pc = this.pcList.filter((pc) => pc.id === id)[0];
      pc.on = !pc.on;
    },
    deletePC(id) {
      this.pcList = this.pcList.filter((pc) => pc.id !== id);
    },
    addPC() {
      let newPC = {
        id: Date.now(),
        title: this.newPCTitle,
        mac: "none",
        on: false,
      };
      this.pcList.push(newPC);
      this.newPCTitle = "";
    },
  },
};
</script>
