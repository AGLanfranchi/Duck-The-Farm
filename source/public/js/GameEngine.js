import Entity from "./Entity.js";

// Game engine. Will hold all the entities, monitor the inputs such as keystrokes, 
// gamepad inputs, touchscreen and controls the flow within the game.

export default class GameEngine {

    //Private variables
    #currentEntity;
    #entityList;

    //Constructors
    constructor() {
        // Stores entity list at start of gameEngine
        this.#entityList = CreateEntities();
        this.getEntity();
    }

    displayEntity() {
        // 
        let container = document.querySelector('.farm-container');

        let entityContainer = document.createElement('div');
        entityContainer.classList.add('entity-container');

        let entityImage = document.createElement('img');
        entityImage.src = this.#currentEntity.imageURL;
        // TODO What if no image supplied? 

        let entityName = document.createElement('div');
        entityName.classList.add('entity-name');
        entityName.innerText = this.#currentEntity.name;

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
    }
}

function CreateEntities() {
    return [
        new Entity({
            name: 'Cow',
            imageURL: './images/cow.png'
        }),
        new Entity({
            name: 'Pig',
            imageURL: './images/pig.png'
        }),
        new Entity({
            name: 'Chicken',
            imageURL: './images/chick3.png'
        }),
        new Entity({
            name: 'Sheep',
            imageURL: './images/sheep.png'
        })
    ]
} 