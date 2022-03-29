import Entity from './Entity.js';
import AudioEngine from './AudioEngine.js';

// Game engine. Will hold all the entities, monitor the inputs such as keystrokes, 
// gamepad inputs, touchscreen and controls the flow within the game.

export default class GameEngine {

    //Private variables
    #currentEntity;
    #entityList;
    #audioEngine;

    //Constructors
    constructor() {
        // Stores entity list at start of gameEngine
        this.#entityList = CreateEntities();
        // Creates new instance of audioEngine
        this.#audioEngine = new AudioEngine();
        this.getEntity();
    }

    // Plays sound 
    playSound() {
        this.#audioEngine.playSound();
    }

    displayEntity() {
        // Selects the farm container
        let container = document.querySelector('.farm-container');
        container.innerHTML = '';

        // Creates entity-container
        let entityContainer = document.createElement('div');
        // Assigns class name
        entityContainer.classList.add('entity-container');

        //Creates image tag 
        let entityImage = document.createElement('img');
        // Assigns source 
        entityImage.src = this.#currentEntity.imageURL;
        // TODO What if no image supplied? 

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
        // Gets random index for the entity list 
        let selector = Math.floor(Math.random() * this.#entityList.length);
        // Retrieves entity from random index
        // TODO fix bug so random index dose not repeat i.e. 1 then 1 again
        this.#currentEntity = this.#entityList[selector];
        // Load sound
        this.#audioEngine.loadSound(this.#currentEntity.soundURL);
    }
}

// Function to load initial entities
function CreateEntities() {
    return [
        new Entity({
            name: 'Cow',
            imageURL: './images/cow.png',
            soundURL: './sounds/Cow.wav'
        }),
        new Entity({
            name: 'Pig',
            imageURL: './images/pig.png',
            soundURL: './sounds/Cow.wav'
        }),
        new Entity({
            name: 'Chicken',
            imageURL: './images/chick3.png',
            soundURL: './sounds/Chicken.wav'
        }),
        new Entity({
            name: 'Sheep',
            imageURL: './images/sheep.png',
            soundURL: './sounds/Sheep.wav'
        })
    ]
} 