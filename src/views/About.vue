<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import MyButton from "@/components/MyButton.vue";

    @Component({
        components: {
            MyButton,
    },
    })
    export default class Home extends Vue {}
</script>