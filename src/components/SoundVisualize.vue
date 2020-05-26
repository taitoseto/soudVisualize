<template>
    <v-container>
        <v-row justify="center" align-content="center">
            <v-col cols=1>
                <v-row>
                    <canvas id="waveform" width="20" height="100" class="canvas"/>  
                </v-row>
                <v-row>
                    <v-btn v-on:click="onClick">button</v-btn>
                </v-row>
            </v-col>
        </v-row>  
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";  
    declare global {  
        interface Window {  
            webkitAudioContext: typeof AudioContext;  
        }
        interface Navigator {
            webkitGetUserMedia: typeof Promise;
            mozGetUserMedia: typeof Promise;
            msGetUserMedia: typeof Promise;
        }  
    }  
 
    @Component
    export default class SoundVisualize extends Vue {
        
        audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser: AnalyserNode = this.audioCtx.createAnalyser();
        canvas: HTMLCanvasElement | null = null;
        canvasCtx: CanvasRenderingContext2D | null = null;
        frameCount = 0; 
        isEnable = false;   
        red = 0.9;
        amber = 0.7;
        minDecibels = -80;
        maxDecibels = -20;

        mounted(){
          this.getMicStream();
          this.visualize();
        }
        async getMicStream(){
            this.analyser.minDecibels = this.minDecibels;
            this.analyser.maxDecibels = this.maxDecibels;
            this.analyser.smoothingTimeConstant = 0.9;
            const audioCtx = this.audioCtx;
            const analyser = this.analyser;
            const gainNode = this.audioCtx.createGain();
            const constraints = {audio: true};
            let stream = null;
            //navigator.mediaDevices.getUserMedia非対応のブラウザへの対応
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function(constraints: {audio: boolean}) {
                   
                    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    return new Promise((resolve, reject) => {
                        navigator.getUserMedia.call(navigator,  constraints, resolve, reject);    
                    });
                }
            }
            if (navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                try {
                  stream = await navigator.mediaDevices.getUserMedia (constraints)
                  const source = audioCtx.createMediaStreamSource(stream);
                  source.connect(gainNode);
                  gainNode.connect(analyser);
                } catch(e) {
                  console.log(e)
                }
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        }

        async onClick(){
            this.isEnable = !this.isEnable;
            window.cancelAnimationFrame(this.frameCount);
            //テスト用＿一時的に描画を止める
            if(this.isEnable){
                this.visualize(); 
            }
        }

        //音量バーの描画
        visualize() {
            
            this.canvas = document.getElementById('waveform') as HTMLCanvasElement;
            this.canvasCtx = this.canvas.getContext('2d');
            const WIDTH = this.canvas.width;
            const HEIGHT = this.canvas.height;

            if (!(this.canvasCtx instanceof CanvasRenderingContext2D)) {
                throw new Error("#canvasCtx is not an CanvasRenderingContext2D");
            }
            this.frameCount = requestAnimationFrame(this.visualize);
            this.analyser.fftSize = 32;
            const bufferLengthAlt = this.analyser.frequencyBinCount;
            const dataArrayAlt = new Uint8Array(bufferLengthAlt);
 
            const bgGradient = this.canvasCtx.createLinearGradient(0,0,WIDTH,HEIGHT);
            bgGradient.addColorStop(0.0 , "#660000");
            bgGradient.addColorStop(0.3 , "#665f24");
            bgGradient.addColorStop(1.0 , "#00662a");
            this.canvasCtx.fillStyle = bgGradient;
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            this.analyser.getByteFrequencyData(dataArrayAlt);
            const lowest = 0.01;
            let max = lowest;
            for (const f of dataArrayAlt) {
                max = Math.max(max, f / 256);
            }
            //const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
            const percent = Math.min(Math.max(max, 0), 1);
            
            const barGradient = this.canvasCtx.createLinearGradient(0,0,WIDTH,HEIGHT);
            barGradient.addColorStop(0.0 , "#D50000");
            barGradient.addColorStop(0.3 , "#FFEE58");
            barGradient.addColorStop(1.0 , "#00C853");
            this.canvasCtx.fillStyle = barGradient;
            this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * percent);
        }
    }
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
</style>