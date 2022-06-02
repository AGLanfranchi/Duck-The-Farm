import Entity from './Entity.js';
import AudioEngine from './AudioEngine.js';
import Maths from './Maths.js';

// Game engine. Will hold all the entities, monitor the inputs such as keystrokes, 
// gamepad inputs, touchscreen and controls the flow within the game.

export default class GameEngine {

    //Private variables
    #currentEntity;
    #entityList;
    #audioEngine;
    #maths;
    #canGrabAttention = false
    #grabAttentionTime = 8000;
    #entityToInteractWith = null;
    #failedSounds = ['./sounds/incorrect01.mp3','./sounds/incorrect02.mp3','./sounds/incorrect03.mp3'];

    //Constructors
    constructor() {
        // Stores entity list at start of gameEngine
        this.#entityList = CreateEntities();
        // Creates new instance of audioEngine
        this.#audioEngine = new AudioEngine();
        // Creates new instance of maths object
        this.#maths = new Maths();
        // Gets the initial background music volume from storage 
        // If doesn't exist, defaults to 1 AKA 100%
        let backgroundVolume = localStorage.getItem('backgroundVolume') || 1;

        // Make sure background volume input uses the local storage value as default
        let backgroundVolumeElement = document.getElementById('backgroundVolume');
        backgroundVolumeElement.value = backgroundVolume * backgroundVolumeElement.max;

        // Calls function for setting music icon
        SetBackgroundMusicIcon(backgroundVolume);

        // Starts background music
        this.#audioEngine.loadAndPlayBackgroundMusic('./sounds/background.mp3', backgroundVolume);

        // Gets the initial sfx music volume from storage 
        // If doesn't exist, defaults to 1 AKA 100%
        let sfxVolume = localStorage.getItem('sfxVolume') || 1;

        // Make sure sfx volume input uses the local storage value as default
        let sfxVolumeElement = document.getElementById('sfxVolume');
        sfxVolumeElement.value = sfxVolume * sfxVolumeElement.max;

        // Sets initial sfx volume level in the audio engine 
        this.#audioEngine.setSFXLevel(sfxVolume);
        
        // Calls function for setting music icon
        SetSFXMusicIcon(sfxVolume);

        // Hook up controls
        this.addControlEvents();

        //then start the loop for calling the grab attention function
        this.grabAttentionTimer();
    }

    // Event for controlling the sound
    addControlEvents() {
        // Selects the HTML element and listens for the input event i.e. clicking on sound bar
        document.querySelector('.music-volume input').addEventListener('input', (event) => {
            // Get the target of the event i.e. the range input. 
            let elem = event.target;
            // Turns selected value into fraction between 0 and 1
            let val = elem.value / elem.max;
            // Sets the volume to that value
            this.#audioEngine.setBackgroundLevel(val);
            // Saves the background volume to local storage    
            localStorage.setItem('backgroundVolume', val);
            // Display correct image
            document.querySelectorAll('.music-volume svg');
            // Calls function for setting music icon
            SetBackgroundMusicIcon(val);
        })

        document.querySelector('.sfx-volume input').addEventListener('input', (event) => {
            // Get the target of the event i.e. the range input. 
            let elem = event.target;
            // Turns selected value into fraction between 0 and 1
            let val = elem.value / elem.max;
            // Sets the volume to that value
            this.#audioEngine.setSFXLevel(val);
            // Saves the background volume to local storage    
            localStorage.setItem('sfxVolume', val);
            // Display correct image
            document.querySelectorAll('.sfx-volume svg');
            // Calls function for setting music icon
            SetSFXMusicIcon(val);
        })

        
    }

    // Plays sound 
    playSound() {
        this.#audioEngine.playSound();
    }

    animateEntity() {
        let selector = '.main-entity-container img';
        // Animate entrance
        animateCSS(selector, this.#currentEntity.entranceAnimation);
        // Two seconds later
        setTimeout(() => {
            // Plays random animation
            this.playRandomAnimation(this.#currentEntity, '.main-entity-container img');
        }, 2000)
        setTimeout(() => {
            // Add event listener to detect when exit animation has ended
            document.querySelector(selector).addEventListener('animationend', () => {
                // Delete main entity container 
                document.querySelector('.main-entity-container').remove();
                // Redisplay these small entity 
                this.showSmallEntity(this.#currentEntity.id);
                // Remove reference to main entity
                this.#currentEntity = null;
                // Set the flag for main entity being displayed to false
                this.#canGrabAttention = true;
            })
            // Plays exit animation
            animateCSS(selector, this.#currentEntity.exitAnimation);
        }, 4000)
    }

    playRandomAnimation(entity, selector) {
        // Sets the currentEntity animations to the animations variable
        let animations = entity.animations;
        // Gets random index
        let index = this.#maths.getRandomInteger(animations.length);
        // Plays animation
        animateCSS(selector, animations[index]);
    }

    playEntranceAnimation() {
        // Plays animation
        animateCSS('.main-entity-container img', this.#currentEntity.entranceAnimation);
    }

    // Starts the game 
    start() {
        this.displayWelcomeScreen();
        this.displayAllEntities();

        document.getElementById('titleContainer').addEventListener('click', (event) => {
            document.querySelector('#titleContainer').remove();
            document.querySelector('.settings').classList.remove('hide');
            this.#canGrabAttention = true;
            //play initial grab attention
            this.grabAttention();
        });
    }

    displayAllEntities() {
        [...this.#entityList].forEach((entity) => {
            let container = document.querySelector(`#entityContainer${entity.id}`);

            // Creates entity-container
            let entityContainer = document.createElement('div');
            entityContainer.classList.add('entity-data');
            // Assigns class name
            entityContainer.dataset.entityId = entity.id;
            entityContainer.addEventListener('click', (e) => {

                let entityId = e.currentTarget.dataset.entityId;
                let targetEntity = [...this.#entityList].find(x => x.id === parseInt(entityId));
                
                //check if they have clicked on the correct entity if not play wrong one sound
                if(targetEntity != this.#entityToInteractWith){
                    let failSoundURL = GetRandomFailedSound(this.#failedSounds);
                    this.#audioEngine.loadSound(failSoundURL);
                    this.#audioEngine.playSound()
                    return;
                }

                
                this.hideSmallEntity(entityId);
                this.#currentEntity = targetEntity;
                this.displayEntity();

                // Reset the entity that they are trying to find as they have found it
                this.#entityToInteractWith = null;
                
            })

            //Creates image tag 
            let entityImage = document.createElement('img');
            // Assigns source 
            entityImage.src = entity.imageURL;

            //Creates div
            let entityName = document.createElement('div');
            // Assigns class name
            entityName.classList.add('entity-name');
            // Sets the inner text 
            entityName.innerText = entity.name;

            // Adds elements to the DOM
            entityContainer.append(entityImage);
            entityContainer.append(entityName);

            container.append(entityContainer);

        });
    }

    hideSmallEntity(entityId) {
        // Gets entity container for specific entity ID and hides
        let container = document.querySelector(`#entityContainer${entityId} div`);
        container.classList.add('hide');
    }

    showSmallEntity(entityId) {
        // Gets entity container for specific entity ID and removes hide class
        let container = document.querySelector(`#entityContainer${entityId} div`);
        container.classList.remove('hide');
    }

    displayWelcomeScreen() {
        // Block attention grab whilst welcome screen is open
        this.#canGrabAttention = false;
        // Generates HTML for welcome screen
        let container = document.querySelector('body');

        let titleContainer = document.createElement('div');
        titleContainer.id = "titleContainer";

        let titleElm = document.createElement('div');

        let titleImage = document.createElement('img');
        titleImage.src = './images/Title.png';
        titleImage.classList.add('title-image');

        let titlePlayImage = document.createElement('img');
        titlePlayImage.src = './images/Play button.png';
        titlePlayImage.classList.add('play-image');

        titleElm.append(titleImage);
        titleElm.append(titlePlayImage);
        titleContainer.append(titleElm);
        container.append(titleContainer);
    }

    displayEntity() {
        // Set the flag for main entity being displayed to true
        this.#canGrabAttention = false;
        //loads the sound
        this.#audioEngine.loadSound(this.#currentEntity.soundURL);

        // Selects the farm container
        let container = document.querySelector('.farm-container');

        // Creates entity-container
        let entityContainer = document.createElement('div');
        // Assigns class name
        entityContainer.classList.add('main-entity-container');

        //Creates image tag 
        let entityImage = document.createElement('img');
        // Assigns source 
        entityImage.src = this.#currentEntity.imageURL;

        //Creates div
        let entityName = document.createElement('div');
        // Assigns class name
        entityName.classList.add('entity-name');
        // Sets the inner text 
        entityName.innerText = this.#currentEntity.name;

        // Adds elements to the DOM
        entityContainer.append(entityImage);
        entityContainer.append(entityName);

        container.append(entityContainer);

        this.animateEntity();
        this.playSound();
    }

    grabAttentionTimer() {
        setTimeout(() => {
            // Plays random animation
            this.grabAttention();
            this.grabAttentionTimer();
        }, this.#grabAttentionTime);
    }

    grabAttention() {
        //only play if main entity is NOT being displayed
        if (this.#canGrabAttention === false) return;
        //Get random entity
        if(this.#entityToInteractWith === null){
            this.#entityToInteractWith = GetRandomEntity(this.#entityList);
        }
        //play random animation
        this.playRandomAnimation(this.#entityToInteractWith, `[data-entity-id="${this.#entityToInteractWith.id}"] img`);
        //load random grab attention sound and play it
        if (this.#entityToInteractWith.grabAttentionSounds) {
            let fileLocation = GetRandomGrabAttentionSound(this.#entityToInteractWith);
            this.#audioEngine.loadSound(fileLocation);
            this.#audioEngine.playSound()
        }
    }
}

// Gets random sound URL from array of grab attention sounds on an entity
function GetRandomGrabAttentionSound(entity) {
    let index = new Maths().getRandomInteger(entity.grabAttentionSounds.length);
    return entity.grabAttentionSounds[index];
}

// Gets random sound URL from array of failed sounds
function GetRandomFailedSound(soundURLArray) {
    let index = new Maths().getRandomInteger(soundURLArray.length);
    return soundURLArray[index];
}

// Displays the correct icon for the background music volume setting
function SetBackgroundMusicIcon(backgroundVolume) {
    if (backgroundVolume > 0) {
        document.querySelector('.music-volume .on').classList.remove('hide');
        document.querySelector('.music-volume .off').classList.add('hide');
    }
    else {
        document.querySelector('.music-volume .off').classList.remove('hide');
        document.querySelector('.music-volume .on').classList.add('hide');
    }
}

// Displays the correct icon for the SFX volume setting
function SetSFXMusicIcon(sfxVolume){
    if (sfxVolume >= 0.5) {
        document.querySelector('.sfx-volume .high').classList.remove('hide');
        document.querySelector('.sfx-volume .low').classList.add('hide');
        document.querySelector('.sfx-volume .muted').classList.add('hide');
    }else if (sfxVolume > 0) {
        document.querySelector('.sfx-volume .high').classList.add('hide');
        document.querySelector('.sfx-volume .low').classList.remove('hide');
        document.querySelector('.sfx-volume .muted').classList.add('hide');
    }
    else {
        document.querySelector('.sfx-volume .high').classList.add('hide');
        document.querySelector('.sfx-volume .low').classList.add('hide');
        document.querySelector('.sfx-volume .muted').classList.remove('hide');
    }
}

// Function to get a random entity
function GetRandomEntity(entityList, currentEntity) {
    // Copies the entity array to new array so we can remove objects to prevent 
    // the same entity being selected twice without altering original array
    let entityListCopy = [...entityList];
    // If we have a current entity 
    if (currentEntity) {
        // Loop through all elements in entityListCopy array
        for (let i = 0; i < entityListCopy.length; i++) {
            // If element in entityListCopy array = currentEntity
            if (entityListCopy[i] === currentEntity) {
                // Remove from array
                entityListCopy.splice(i, 1);
                // Array has got one smaller so decrease
                i--;
            }
        }
    }
    // Gets random index for the entity list 
    let index = new Maths().getRandomInteger(entityListCopy.length);
    // Retrieves entity from random index
    return entityListCopy[index];
}

// Function to load initial entities
function CreateEntities() {
    return [
        new Entity({
            id: 1,
            name: 'Pig',
            imageURL: './images/pig.png',
            soundURL: './sounds/Pig.mp3',
            animations: ['flash', 'shakeY', 'tada'],
            grabAttentionSounds: ['./sounds/FindPig01.mp3', './sounds/FindPig02.mp3', './sounds/FindPig03.mp3']
        }),
        new Entity({
            id: 2,
            name: 'Cow',
            imageURL: './images/cow.png',
            soundURL: './sounds/Cow.mp3',
            animations: ['shakeX', 'jello', 'heartBeat'],
            grabAttentionSounds: ['./sounds/FindCow01.mp3', './sounds/FindCow02.mp3', './sounds/FindCow03.mp3']
        }),
        new Entity({
            id: 3,
            name: 'Chicken',
            imageURL: './images/chick3.png',
            soundURL: './sounds/Chicken.mp3',
            animations: ['shakeX', 'jello', 'bounce'],
            grabAttentionSounds: ['./sounds/FindChicken01.mp3', './sounds/FindChicken02.mp3', './sounds/FindChicken03.mp3']
        }),
        new Entity({
            id: 5,
            name: 'Sheep',
            imageURL: './images/sheep.png',
            soundURL: './sounds/Sheep.mp3',
            grabAttentionSounds: ['./sounds/FindSheep01.mp3', './sounds/FindSheep02.mp3', './sounds/FindSheep03.mp3']
        }),
        new Entity({
            id: 4,
            name: 'Tractor',
            imageURL: './images/tractor.png',
            soundURL: './sounds/Tractor.mp3',
            animations: ['pulse', 'wobble', 'heartBeat'],
            grabAttentionSounds: ['./sounds/FindTractor01.mp3', './sounds/FindTractor02.mp3', './sounds/FindTractor03.mp3']
        })
    ]
}

// Taken from https://animate.style/
const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element);

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, { once: true });
    });