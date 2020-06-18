<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="black"
    >
      <router-link to='/MicCheck'>MicCheck</router-link> | 
      <router-link to='/Waveform'>WaveForm</router-link>
    </v-app-bar>

    <v-content>
     
      <v-container
        class="fill-height"
        fluid
      >
        <router-view/>
      </v-container>
    </v-content>
    <v-footer
      color="black"
      app
    >
      <Footer/>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Footer from '@/components/Footer.vue'

export default Vue.extend({
  name: 'App',

  components: {
    Footer,
  },
});
</script>

