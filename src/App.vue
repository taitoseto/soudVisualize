<template>
  <v-app>
    <v-content>
      <v-bottom-navigation>
        <router-link to="/">app</router-link> |
        <router-link to="/Waveform">Waveform</router-link>
      </v-bottom-navigation>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  components: {

  },
});
</script>
