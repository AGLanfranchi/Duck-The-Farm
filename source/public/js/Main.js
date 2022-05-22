import GameEngine from "./GameEngine.js";

// Create new instance of GameEngine
const gameEngine = new GameEngine();

// Start the game
gameEngine.start();

// Add event listener for keyboard
document.addEventListener('keydown', (event) => {
    // Chosen keys in array for moving entities
    var allowedKeys = ['ArrowRight', 'ArrowLeft']
    if (allowedKeys.includes(event.code)) {
        // Loads new entity
        gameEngine.getEntity();
        // Display entity
        gameEngine.displayEntity();
    }
});     

// Install Chrome and enable developer mode on phone to talk to phone/PC