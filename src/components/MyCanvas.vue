<template>
    <canvas id="waveform" width="400" height="400" class="canvas"></canvas>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";  
    declare global {  
        interface Window {  
            webkitAudioContext: typeof AudioContext;  
        }  
    }  

    @Component
    export default class MyCanvas extends Vue {
        audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = this.audioCtx.createAnalyser();
        
        method(){
        //    let source: MediaStreamAudioSourceNode = this.audioCtx.createMediaStreamSource();
        //    source.connect(this.analyser);
        //    this.analyser.connect(this.audioCtx.destination);
        //    this.analyser.fftSize = 256;
        //    let bufferLength: number = this.analyser.frequencyBinCount;
        //    console.log(bufferLength);
        //    let dataArray: Uint8Array = new Uint8Array(bufferLength);

        //     canvasCtx.clearRect(0, 0, width, height);
        }
           
        
        
        mounted() {
            // mounted 以降で canvas の DOM にアクセスできる
            // CreateJS などを使うときにも、ここで canvas と紐付ける
            console.log(this.$el);
            //const canvas = document.getElementById('waveform') as HTMLCanvasElement;
            //const canvasCtx = canvas.getContext('2d');
            //canvasCtx = this.$el.getContext('2d');
            const canvas = document.getElementById('waveform') as HTMLCanvasElement;
            const canvasCtx = canvas.getContext('2d');
            if (!(canvasCtx instanceof CanvasRenderingContext2D)) {
            throw new Error("#my-audio is not an HTMLMediaElement");
            }
            canvasCtx.beginPath();
            canvasCtx.clearRect(0, 0, 200, 200);
            canvasCtx.arc(200, 200, 100, 0, Math.PI * 2);
            canvasCtx.fill();
        }

        
    }
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
</style>