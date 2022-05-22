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
    #mainEntityBeingDisplayed = false
    #grabAttentionTime = 5000;
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
        let backgroundVolumeElement = document.getElementById('backgroundVolume');

        backgroundVolumeElement.value = backgroundVolume * backgroundVolumeElement.max;

        // Calls function for setting music icon
        SetBackgroundMusicIcon(backgroundVolume);

        // Starts background music
        this.#audioEngine.loadAndPlayBackgroundMusic('./sounds/background.mp3', backgroundVolume);
        // Hook up controls
        this.addControlEvents();

        //start loop for calling the grab attention function
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
            var elems = document.querySelectorAll('.music-volume svg');
            // Calls function for setting music icon
            SetBackgroundMusicIcon(val);
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
            this.playRandomAnimation(this.#currentEntity,'.main-entity-container img');
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
                this.#mainEntityBeingDisplayed = false;
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

    start() {
        this.displayWelcomeScreen();
        this.displayAllEntities();

        document.getElementById('titleContainer').addEventListener('click', (event) => {
            document.querySelector('#titleContainer').remove();
            document.querySelector('.settings').classList.remove('hide');
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
                this.hideSmallEntity(entityId);
                this.#currentEntity = [...this.#entityList].find(x => x.id === parseInt(entityId));
                this.displayEntity();
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
        let container = document.querySelector(`#entityContainer${entityId} div`);
        container.classList.add('hide');
    }
    showSmallEntity(entityId) {
        let container = document.querySelector(`#entityContainer${entityId} div`);
        container.classList.remove('hide');
    }

    displayWelcomeScreen() {
        let container = document.querySelector('.farm-container');

        let titleContainer = document.createElement('div');
        titleContainer.id = "titleContainer";
        let titleElm = document.createElement('h1');
        titleElm.innerText = 'Duck the Farm';

        let subTitleElm = document.createElement('h2');
        subTitleElm.innerText = 'Start';

        titleContainer.append(titleElm);
        titleContainer.append(subTitleElm)
        container.append(titleContainer);
        // TODO find out how to work with timers. Within that timer need to call animateCSS
    }

    displayEntity() {
        // Set the flag for main entity being displayed to true
        this.#mainEntityBeingDisplayed = true;
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

    grabAttentionTimer(){
        setTimeout(() => {
            // Plays random animation
            this.grabAttention();
            this.grabAttentionTimer();
        }, this.#grabAttentionTime);
    }

    grabAttention() {
        //only play if main entity is NOT being displayed
        if(this.#mainEntityBeingDisplayed === true) return;
        //Get random entity
        let randomEntity = GetRandomEntity(this.#entityList);
        //play random animation
        this.playRandomAnimation(randomEntity, `[data-entity-id="${randomEntity.id}"] img`);
    }
}

function SetBackgroundMusicIcon (backgroundVolume) {
    if (backgroundVolume > 0) {
        document.querySelector('.music-volume .on').classList.remove('hide');
        document.querySelector('.music-volume .off').classList.add('hide');
    }
    else {
        document.querySelector('.music-volume .off').classList.remove('hide');
        document.querySelector('.music-volume .on').classList.add('hide');
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
            animations: ['flash', 'shakeY', 'tada']
        }),
        new Entity({
            id: 2,
            name: 'Cow',
            imageURL: './images/cow.png',
            soundURL: './sounds/Cow.mp3',
            animations: ['shakeX', 'jello', 'heartBeat']
        }),
        new Entity({
            id: 3,
            name: 'Chicken',
            imageURL: './images/chick3.png',
            soundURL: './sounds/Chicken.mp3',
            animations: ['shakeX', 'jello', 'bounce']
        }),
        new Entity({
            id: 5,
            name: 'Sheep',
            imageURL: './images/sheep.png',
            soundURL: './sounds/Sheep.mp3'
        }),
        new Entity({
            id: 4,
            name: 'Tractor',
            imageURL: './images/tractor.png',
            soundURL: './sounds/Tractor.mp3',
            animations: ['pulse', 'wobble', 'heartBeat']
        })
    ]
}

function PlayGrabAttentionAnimation() {
    setTimeout(() => {

    }, 1000);
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