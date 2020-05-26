<template>
    <v-app>
        <v-content>
        <div class="WaveForm">
            <SoundVisualize>SoundVisualize</SoundVisualize>           
        </div>
        </v-content>
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