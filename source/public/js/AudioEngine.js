const AudioContext = window.AudioContext || window.webkitAudioContext;


// 
export default class AudioEngine {
    //Private variables
    #audioCtx;
    #audioBuffer;
    #currentAudioSource;

    // Constructors
    constructor() {
        this.#audioCtx = new AudioContext();
    }

    loadSound(audioSourceURL) {
        // Use fetch API to http request to load the audio file
        window.fetch(audioSourceURL)
            // Turn HTML response into arrayBuffer
            .then(response => response.arrayBuffer())
            // Use the audio context to read the arrayBuffer and create and audioBuffer
            //https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
            .then(arrayBuffer => this.#audioCtx.decodeAudioData(arrayBuffer))
            // Store created audio buffer in private variable for later use
            .then(audioBuffer => {
                this.#audioBuffer = audioBuffer;
            })
    }

    playSound() {
        //stop sound playing over itself
        //if currentAudioSource has data then stop it before trying to play it again
        if (this.#currentAudioSource) {
            this.#currentAudioSource.stop();
            this.#currentAudioSource.disconnect();
        }

        //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource
        this.#currentAudioSource = this.#audioCtx.createBufferSource();
        // set the buffer in the AudioBufferSourceNode from the previously loaded buffer data
        this.#currentAudioSource.buffer = this.#audioBuffer;
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        this.#currentAudioSource.connect(this.#audioCtx.destination);
        // start the source playing
        this.#currentAudioSource.start();
    }
}