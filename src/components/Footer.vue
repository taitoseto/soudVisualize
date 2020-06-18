<template>
    <v-container fluid>
        <v-row>
            <v-col md="1"> 
                <v-row  justify="center">
                            <v-icon color="white">fa-microphone</v-icon>
                </v-row>
            </v-col>
            <v-col md="1" justify="center">
                    <v-row  justify="center">
                        <v-icon color="white">fa-video</v-icon>    
                    </v-row>                   
            </v-col>
            <v-col md="1" offset-md="9">
                <v-row  justify="center">
                    <v-icon color="white">fa-door-open</v-icon>
                </v-row>
            </v-col>
        </v-row>        
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';


    @Component 
    export default class Footer extends Vue {}
</script>

<style scoped>
.group {
    display: flex;
    flex: 1;
    justify-content: space-around;
}
</style>