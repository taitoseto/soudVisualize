<template>
    <div class="WaveForm">
        <MyCanvas>MyCanvas</MyCanvas>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import MyCanvas from "@/components/MyCanvas.vue";

    @Component({
        components: {
            MyCanvas,
    },
    })
    export default class WaveForm extends Vue {}
</script>