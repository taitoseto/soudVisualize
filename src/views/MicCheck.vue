<template>
    <v-container fluid>
        <v-row>
            <v-col md="1">
                <v-row justify="center">
                    <v-card 
                        width="40"
                        height="120"
                        elevation="3"
                        color="grey"
                    >
                        <sound-visualize>SoundVisualize</sound-visualize>               
                    </v-card>
                </v-row>
            </v-col>
            <v-col md="11">
                <v-card
                    width="1280"
                    height="720"
                    outlined
                    elevation="3"
                    color="indigo"
                >
                </v-card>               
            </v-col>
        </v-row> 
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import DummyVideo from '@/components/DummyVideo.vue';
    import SoundVisualize from "@/components/SoundVisualize.vue";

    @Component({
        components: {
            SoundVisualize,
            DummyVideo,
        },
    })
    export default class MicCheck extends Vue {}
</script>
