<template>
    <v-container> 
        <sound-visualize>SoundVisualize</sound-visualize>  
    </v-container>
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