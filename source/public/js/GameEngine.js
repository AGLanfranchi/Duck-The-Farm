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
        let container = document.querySelector(".farm-container");
        container.innerText = this.#currentEntity.name;
    }

    getEntity() {
        // Gets random index for the entity list 
        let selector = Math.random() * this.#entityList.length;
        console.log(selector);
        // Retrieves entity from random index
        this.#currentEntity = this.#entityList[selector];
        console.log(this.#currentEntity);
        console.log(this.#entityList);
    }
}

function CreateEntities() {
    return [
        new Entity({
            name: 'cow'
        }),
        new Entity({
            name: 'duck'
        }),
        new Entity({
            name: 'pig'
        })
    ]
} 