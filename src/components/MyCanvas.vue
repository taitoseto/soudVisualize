<template>
    <div>
        <canvas id="waveform" width="40" height="100" class="canvas"></canvas>
        <p><button  @click="onClick">MyButton</button></p>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";  
    declare global {  
        interface Window {  
            webkitAudioContext: typeof AudioContext;  
        }
        interface Navigator {
            webkitGetUserMedia: typeof MediaDevices;
            mozGetUserMedia: typeof MediaDevices;
            msGetUserMedia: typeof MediaDevices;
        }  
    }  
 
    @Component
    export default class MyCanvas extends Vue {
        
        audioCtx: AudioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser: AnalyserNode = this.audioCtx.createAnalyser();
        canvas: HTMLCanvasElement | null = null;
        canvasCtx: CanvasRenderingContext2D | null = null;

        frameCount = 0;        

        mounted(){
          // mounted 以降で canvas の DOM にアクセスできる
          this.getMicStream();
          this.visualize();
        }
        async getMicStream(){
            //this.analyser= this.audioCtx.createAnalyser();
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = 0;
            this.analyser.smoothingTimeConstant = 0.9;
            const audioCtx = this.audioCtx;
            const analyser = this.analyser;
            const gainNode = this.audioCtx.createGain();
            const constraints = {audio: true};
            let stream = null;
            if (navigator.mediaDevices === undefined) {
                // プロパティの初期化。readonlyなのでエラーが出る。
                //navigator.mediaDevices = {};
            }
            // if (navigator.mediaDevices.getUserMedia === undefined) {
            //     navigator.mediaDevices.getUserMedia = function(constraints) {
                   
            //         const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            //         if (!getUserMedia) {
            //             return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            //         }
            //         // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            //         return new Promise(function(resolve, reject) {
            //             //エラーが出るので一時的にコメントアウト
            //             //getUserMedia.call(navigator, constraints, resolve, reject);
            //         });
            //     }
            // }
            if (navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                try {
                  stream = await navigator.mediaDevices.getUserMedia (constraints)
                  const source = audioCtx.createMediaStreamSource(stream);
                  source.connect(gainNode);
                  gainNode.connect(analyser);
                  analyser.connect(audioCtx.destination);
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
                max = Math.max(max, (f - 128) / 128);
            }
            const normalized = (Math.log(lowest) - Math.log(max)) / Math.log(lowest);
            const percent = Math.min(Math.max(normalized, 0), 1);
                          
    
            this.canvasCtx.fillStyle ='rgb(0,100,0)';
                this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * percent);
            const peak = 0.5; 
            if(percent > peak){
                this.canvasCtx.fillStyle ='rgb(100,0,0)';
                this.canvasCtx.fillRect(0,HEIGHT - HEIGHT * percent, WIDTH, HEIGHT * (percent - peak)); 
            }
            console.log(normalized);  
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

            //this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            this.analyser.getByteTimeDomainData(dataArray);

            this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            
            const barWidth = WIDTH;
            this.canvasCtx.fillStyle = 'rgb(100, 0, 0)';
            //dataArray.map(x => Math.abs(x - 128));
            //const barHeight = dataArray.reduce((acc, item) => acc + item, 0) / bufferLength;
            let barHeight = dataArray[0];
            barHeight = Math.abs(barHeight - 128);
            this.canvasCtx.fillRect(0,HEIGHT - barHeight,barWidth, barHeight);
            //console.log(barHeight);
        }
    }
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
</style>