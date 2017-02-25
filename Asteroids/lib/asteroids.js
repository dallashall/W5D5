const GameView = require('./game_view.js');

document.addEventListener("DOMContentLoaded", function(event){
  const canvasEl = document.getElementById('game-canvas');
  const ctx = canvasEl.getContext("2d");
  const gameView = new GameView(ctx);
  gameView.start();
});
