<template>
    <v-container
        class="video-window"
        fluid
    >
        <v-card
            max-width="1280"
            max-height="720"
            outlined
            elevation="3"
            color="indigo"
        >       
            <v-list-item two-line>
                <v-list-item-content>
                    <v-list-item-title class="headline mb-1">Dummy Video</v-list-item-title>
                </v-list-item-content>    
                <v-list-item-avatar
                    tile
                    size="700"
                    color="grey"
                ></v-list-item-avatar>
            </v-list-item> 
        </v-card>                                     
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';


    @Component 
    export default class DummyVideo extends Vue {}
</script>