// Stores a Game instance.
// Stores a canvas context to draw the game into.
// Installs key listeners to move the ship and fire bullets.
// Installs a timer to call Game.prototype.step.
const MovingObject = require('./moving_object.js');
const Game = require('./game.js');
const Asteroid = require('./asteroid.js');

function GameView(ctx){
  this.game = new Game(ctx);
  this.ctx = ctx;
  this.game.draw(this.ctx);
}

GameView.prototype.start = function() {
  setInterval(this.game.step.bind(this.game), 20);
};

module.exports = GameView;
