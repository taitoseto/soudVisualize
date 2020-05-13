<template>
    <div>
        <canvas id="waveform" width="800" height="400" class="canvas"></canvas>
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
        //voiceSelect = document.getElementById("voice");
        //source;
        //stream;
        analyser: AnalyserNode = this.audioCtx.createAnalyser();
        canvas: HTMLCanvasElement | null = null;
        canvasCtx: CanvasRenderingContext2D | null = null;

        frameCount = 0;        

        mounted(){
          // mounted 以降で canvas の DOM にアクセスできる
          this.getMicStream();
          this.visualize();
          
        }
        getMicStream(){
            //this.analyser= this.audioCtx.createAnalyser();
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = -10;
            this.analyser.smoothingTimeConstant = 0.85;
            const audioCtx = this.audioCtx;
            const analyser = this.analyser;
            const distortion = this.audioCtx.createWaveShaper();
            const gainNode = this.audioCtx.createGain();
            const biquadFilter = this.audioCtx.createBiquadFilter();
            //const convolver = this.audioCtx.createConvolver();
            const constraints = {audio: true};
            
            // if (navigator.mediaDevices === undefined) {
            //     // プロパティの初期化。readonlyなのでエラーが出る。
            //     //navigator.mediaDevices = {};
            // }
            // if (navigator.mediaDevices.getUserMedia === undefined) {
            //     navigator.mediaDevices.getUserMedia = function(constraints) {
                   
            //         const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

            //         if (!getUserMedia) {
            //             return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            //         }
            //         // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            //         return new Promise(function(resolve, reject) {
            //             //エラーが出るので一時的にコメントアウト
            //             getUserMedia.call(navigator, constraints, resolve, reject);
            //         });
            //     }
            // }
            if (navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                navigator.mediaDevices.getUserMedia (constraints)
                .then(
                    function(stream) {
                        const source = audioCtx.createMediaStreamSource(stream);
                        source.connect(gainNode);
                        //distortion.connect(biquadFilter);                       
                        //biquadFilter.connect(gainNode);
                        //convolver.connect(gainNode);
                        gainNode.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        //this.visualize();
                })
                .catch( function(err) { console.log('The following gUM error occured: ' + err);})
                //こっちで書けるのでは？
                // try {
                //   const stream = await navigator.....
                // } catch(e) {
                //   console.log(e)
                // }
            } else {
                console.log('getUserMedia not supported on your browser!');
            }
        }
        async onClick(){
            window.cancelAnimationFrame(this.frameCount);
            //this.getMicStream();
            this.visualize();
        }

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
            console.log(bufferLengthAlt);
            const dataArrayAlt = new Uint8Array(bufferLengthAlt);

            this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            this.analyser.getByteFrequencyData(dataArrayAlt);

            this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            
            const barWidth = 60;
            let barHeight;
            let x = 0;
            this.canvasCtx.fillStyle = 'rgb(100, 0, 0)';
            for(let i = 0; i < bufferLengthAlt; i++) {
                barHeight = dataArrayAlt[i];

                this.canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                this.canvasCtx.fillRect(x,HEIGHT - barHeight/2,barWidth, barHeight/2);

                x += barWidth + 1;
            }      
        }
    }
</script>

<style scoped>
.canvas {
  border: 1px solid #000;
}
</style>