<template>
    <v-app>
        <v-container>
        <div class="WaveForm">
            <SoundVisualize>SoundVisualize</SoundVisualize>           
        </div>
        </v-container>
    </v-app>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import SoundVisualize from "@/components/SoundVisualize.vue";

    @Component({
        components: {
            SoundVisualize,
    },
    })
    export default class WaveForm extends Vue {}
</script>