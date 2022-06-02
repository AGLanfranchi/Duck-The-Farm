const AudioContext = window.AudioContext || window.webkitAudioContext;



export default class AudioEngine {
    // Private variables
    #audioCtx;
    #backgroundAudioCtx;
    #audioBuffer;
    #backgroundAudioSource;
    #backgroundAudioCtxGainNode;
    #currentAudioSource;
    #loadingSound = false;
    #bmSuspended = false;
    #sfxAudioCtxGainNode;

    // Constructors
    constructor() {
        this.#audioCtx = new AudioContext();
        this.#backgroundAudioCtx = new AudioContext();

        // MASSIVE HACK
        // Autoplay in Chrome is disabled by default. 
        // Couldn't work out better/proper way of detecting user interaction with the page 
        document.addEventListener("click", (event) => {
            if (this.#bmSuspended === true) {
                this.#backgroundAudioSource.start();
                document.removeEventListener(this);
            }
        })


        // Initialise the sfx audio pipeline
        // Create gain node to allow control of volume
        this.#sfxAudioCtxGainNode = this.#audioCtx.createGain();
        this.setSFXLevel(1);
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        this.#sfxAudioCtxGainNode.connect(this.#audioCtx.destination);
    }

    loadAndPlayBackgroundMusic(audioSourceURL, initialVolume) {
        window.fetch(audioSourceURL)
            // Turn HTML response into arrayBuffer
            .then(response => response.arrayBuffer())
            // Use the audio context to read the arrayBuffer and create and audioBuffer
            //https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
            .then(arrayBuffer => this.#backgroundAudioCtx.decodeAudioData(arrayBuffer))
            // Store created audio buffer in private variable for later use
            .then(audioBuffer => {
                // Create gain node to allow control of volume
                this.#backgroundAudioCtxGainNode = this.#backgroundAudioCtx.createGain();
                //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource
                this.#backgroundAudioSource = this.#backgroundAudioCtx.createBufferSource();
                // set the buffer in the AudioBufferSourceNode from the previously loaded buffer data
                this.#backgroundAudioSource.buffer = audioBuffer;
                // Loops the music. It wil NEVER END! Unless told to...
                this.#backgroundAudioSource.loop = true;
                // Sets initial background music volume
                this.setBackgroundLevel(initialVolume);
                // connect the AudioBufferSourceNode to the
                // destination so we can hear the sound
                this.#backgroundAudioSource.connect(this.#backgroundAudioCtxGainNode);
                this.#backgroundAudioCtxGainNode.connect(this.#backgroundAudioCtx.destination);
                // start the source playing
                this.#backgroundAudioSource.start();
                // Attempts to detect autoplay being disabled.
                // Used by the MASSIVE HACK!
                if (this.#backgroundAudioCtx.state === "suspended") {
                    this.#bmSuspended = true;
                }
            })
    }
    // Sets the volume of the background music 
    setBackgroundLevel(level) {
        this.#backgroundAudioCtxGainNode.gain.value = level;
    }

    // Sets the SFX volume  music 
    setSFXLevel(level) {
        this.#sfxAudioCtxGainNode.gain.value = level;
    }

    loadSound(audioSourceURL) {
        this.#loadingSound = true;
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
                this.#loadingSound = false;
            })
    }

    playSound() {
        if (this.#loadingSound === true) {
            setTimeout(() => {
                this.playSound()
            }, 500);
            return;
        }
        //stop sound playing over itself
        //if currentAudioSource has data then stop it before trying to play it again
        if (this.#currentAudioSource) {
            this.#currentAudioSource.stop();
            this.#currentAudioSource.disconnect();
        }

        //https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createBufferSource
        this.#currentAudioSource = this.#audioCtx.createBufferSource();
        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        this.#currentAudioSource.connect(this.#sfxAudioCtxGainNode);

        // set the buffer in the AudioBufferSourceNode from the previously loaded buffer data
        this.#currentAudioSource.buffer = this.#audioBuffer;
        // start the source playing
        this.#currentAudioSource.start();
    }
}