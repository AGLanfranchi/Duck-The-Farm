import GameEngine from "./GameEngine.js";
// Create new instance of GameEngine
// Constructor loads first entity
const gameEngine = new GameEngine();
// Display welcome screen
gameEngine.displayWelcomeScreen();

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

    // Press 'S' key to play sound of current entity
    if (event.code === 'KeyS') {
        gameEngine.playSound();
    }

    //Press 'A' key to play animation for current entity
    if (event.code === 'KeyA') {
        gameEngine.playAnimation();
    }
});     