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

    //Constructors
    constructor() {
        // Stores entity list at start of gameEngine
        this.#entityList = CreateEntities();
        // Creates new instance of audioEngine
        this.#audioEngine = new AudioEngine();
        // Creates new instance of maths object
        this.#maths = new Maths();
        this.getEntity();
    }

    // Plays sound 
    playSound() {
        this.#audioEngine.playSound();
    }

    playAnimation() {
        // Sets the currentEntity animations to the animations variable
        let animations = this.#currentEntity.animations;
        // Gets random index
        let index = this.#maths.getRandomInteger(animations.length);
        // Plays animation
        animateCSS('.entity-container', animations[index]);
    }

    start(){
        this.displayWelcomeScreen();
        this.displayAllEntities();
        
        setTimeout(()=>{
            let elem = document.getElementById('titleContainer');
            elem.remove();
        },5000);
    }

    displayAllEntities(){
        [...this.#entityList].forEach((entity)=>{
            let container = document.querySelector(`#entityContainer${entity.id}`);
            
            // Creates entity-container
            let entityContainer = document.createElement('div');
            // Assigns class name
            entityContainer.classList.add('entity-container', 'small');
            entityContainer.dataset.entityId = entity.id;
            entityContainer.addEventListener('click',(e)=>{
                let entityId = e.currentTarget.dataset.entityId;
                this.hideSmallEntity(entityId);
                this.#currentEntity = [...this.#entityList].find(x=> x.id === parseInt(entityId));
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

    hideSmallEntity(entityId){
        let container = document.querySelector(`#entityContainer${entityId} .entity-container`);
        container.classList.add('hide');
    }

    displayWelcomeScreen() {
        let container = document.querySelector('.farm-container');

        let titleContainer = document.createElement('div');
        titleContainer.id = "titleContainer";
        let titleElm = document.createElement('h1');
        titleElm.innerText = 'Duck the Farm';

        titleContainer.append(titleElm);
        container.append(titleContainer);
        // TODO find out how to work with timers. Within that timer need to call animateCSS
    }

    displayEntity() {
        // Selects the farm container
        let container = document.querySelector('.farm-container');

        // Creates entity-container
        let entityContainer = document.createElement('div');
        // Assigns class name
        entityContainer.classList.add('entity-container');

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
    }

    getEntity() {
        this.#currentEntity = GetRandomEntity(this.#entityList, this.#currentEntity)
        // Load sound
        this.#audioEngine.loadSound(this.#currentEntity.soundURL);
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
            soundURL: './sounds/Pig.wav',
            animations: ['flash', 'shakeY', 'tada']
        }),
        new Entity({
            id: 2,
            name: 'Cow',
            imageURL: './images/cow.png',
            soundURL: './sounds/Cow.wav',
            animations: ['shakeX', 'jello', 'heartBeat']
        }),
        new Entity({
            id: 3,
            name: 'Chicken',
            imageURL: './images/chick3.png',
            soundURL: './sounds/Chicken.wav',
            animations: ['shakeX', 'jello', 'bounce']
        }),
        new Entity({
            id: 5,
            name: 'Sheep',
            imageURL: './images/sheep.png',
            soundURL: './sounds/Sheep.wav'
        }),
        new Entity({
            id: 4,
            name: 'Tractor',
            imageURL: './images/tractor.png',
            soundURL: './sounds/Tractor.wav',
            animations: ['pulse', 'wobble', 'heartBeat']
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