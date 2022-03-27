import GameEngine from "./GameEngine.js";

const gameEngine = new GameEngine();

gameEngine.displayEntity();

document.addEventListener('keydown', (event) => {
    var allowedKeys = ['ArrowRight', 'ArrowLeft']
    if (allowedKeys.includes(event.code)) { //} === 'ArrowRight' || event.code === 'ArrowLeft') {
        gameEngine.getEntity();
        gameEngine.displayEntity();
    }
});