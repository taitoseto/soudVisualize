<template>
    <div>
        <canvas id="waveform" width="40" height="100" class="canvas"></canvas>
        <p><button  @click="onClick">MyButton</button></p>
        <div v-bind:style="{ color: color}">
             <transition name="color-fade">
                <i class="fas fa-microphone microphone"></i>
            </transition>
        </div>  
    </div>
    
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
    export default class MyCanvas extends Vue {
        
        audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser: AnalyserNode = this.audioCtx.createAnalyser();
        canvas: HTMLCanvasElement | null = null;
        canvasCtx: CanvasRenderingContext2D | null = null;
        constraints = {audio: true};
        frameCount = 0;    
        color = 'black';
        fontsize = 80;
    

        mounted(){
          // mounted 以降で canvas の DOM にアクセスできる
          this.getMicStream();
          this.visualize();
          this.fillIcon();
          //this.waveform();
        }
        async getMicStream(){
            //this.analyser= this.audioCtx.createAnalyser();
            this.analyser.minDecibels = -60;
            this.analyser.maxDecibels = -10;
            this.analyser.smoothingTimeConstant = 0.9;
            const audioCtx = this.audioCtx;
            const analyser = this.analyser;
            const gainNode = this.audioCtx.createGain();
            
            let stream = null;
            //TODO: Safari等への対応
            
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function(constraints: {audio: boolean}) {
                   
                    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }
                    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                    return new Promise((resolve, reject) => {
                        navigator.getUserMedia.call(navigator,  constraints, resolve, reject);    
                    });
                }
            }
            if (navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                try {
                  stream = await navigator.mediaDevices.getUserMedia (this.constraints)
                  const source = audioCtx.createMediaStreamSource(stream);
                  source.connect(gainNode);
                  gainNode.connect(analyser);
                  //analyser.connect(audioCtx.destination);
                } catch(e) {
                  console.log(e)
                }
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        }
        async onClick(){
            window.cancelAnimationFrame(this.frameCount);
            this.visualize();
            this.fillIcon();
            //this.waveform();           
        }
        //周波数ごとのデータから取得
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

            this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            if (!(this.canvasCtx instanceof CanvasRenderingContext2D)) {
                throw new Error("#canvasCtx is not an CanvasRenderingContext2D");
            }
            this.analyser.getByteFrequencyData(dataArrayAlt);
            const lowest = 0.01;
            let max = lowest;
            for (const f of dataArrayAlt) {
                max = Math.max(max, f / 256);
            }
            //const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
            const percent = Math.min(Math.max(max, 0), 1);
                          
            this.canvasCtx.fillStyle ='rgb(0,100,0)';
            this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * percent);
            const peak = 0.8; 
            if(percent > peak){
                this.canvasCtx.fillStyle ='rgb(100,0,0)';
                this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * (percent - peak)); 
            }
        }

        fillIcon() {
            
            this.frameCount = requestAnimationFrame(this.fillIcon);
            this.analyser.fftSize = 32;
            const bufferLengthAlt = this.analyser.frequencyBinCount;
            const dataArrayAlt = new Uint8Array(bufferLengthAlt);
            this.analyser.getByteFrequencyData(dataArrayAlt);
            const lowest = 0.01;
            let max = lowest;
            for (const f of dataArrayAlt) {
                max = Math.max(max, f / 256);
            }
            //const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
            const percent = Math.min(Math.max(max, 0), 1);              
            if(percent < 0.3){
                this.color = 'black';
            }else if(percent < 0.8){
                this.color = 'green';
            }else{
                this.color = 'red';
            }
            //console.log(percent);
        }
        
        //波形から取得
        waveform() {
            this.canvas = document.getElementById('waveform') as HTMLCanvasElement;
            this.canvasCtx = this.canvas.getContext('2d');
            const WIDTH = this.canvas.width;
            const HEIGHT = this.canvas.height;
           

            if (!(this.canvasCtx instanceof CanvasRenderingContext2D)) {
                throw new Error("#canvasCtx is not an CanvasRenderingContext2D");
            }
            this.frameCount = requestAnimationFrame(this.waveform);
            this.analyser.fftSize = 32;
            const bufferLength = this.analyser.fftSize;

            const dataArray = new Uint8Array(bufferLength);

            this.analyser.getByteTimeDomainData(dataArray);

            this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            
            const barWidth = WIDTH;
            
            const lowest = 0.01;
            let max = lowest;
            for (const f of dataArray) {
                max = Math.max(max, (f - 128) / 128);
            }
            const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
            const percent = Math.min(Math.max(normalized, 0), 1);

            this.canvasCtx.fillStyle = 'rgb(100, 0, 0)';
            this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent,barWidth, HEIGHT * percent);
            const peak = 0.8; 
            if(percent > peak){
                this.canvasCtx.fillStyle ='rgb(100,0,0)';
                this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * (percent - peak)); 
            }
        }
    }
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
.microphone {
    font-size: 80px;
    
}
.color-fade-enter-active {
  transition: all .3s ease;
}
.color-fade-leave-active {
  transition: all .8s ease;
}
.color-fade-enter, .color-fade-leave-to{
  opacity: 0;
}
</style>