// Holds collections of the asteroids, bullets, and your ship.
// Game.prototype.step method calls Game.prototype.move on all the objects,
// and Game.prototype.checkCollisions checks for colliding objects.
// Game.prototype.draw(ctx) draws the game.
// Keeps track of dimensions of the space; wraps objects around when they
// drift off the screen.
const Asteroid = require('./asteroid.js');

function Game(ctx) {
  this.DIM_X = 500;
  this.DIM_Y = 500;
  this.NUM_ASTEROIDS = 3;
  this.ctx = ctx;
  this.asteroids = [];
  this.addAsteroids();
}

Game.prototype.addAsteroids = function(){
  // randomly place asteroids within game grid dimensions
  for (let i =0; i < this.NUM_ASTEROIDS; i++) {
    this.asteroids.push(new Asteroid({
      pos : [this.randomPosition(), this.randomPosition()]
    }));
  }
};

Game.prototype.randomPosition = function() {
  return Math.floor(Math.random() * this.DIM_X);
};

Game.prototype.draw = function() {
  this.ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
  this.asteroids.forEach( (asty) => asty.draw(this.ctx) );
};

Game.prototype.moveObjects = function() {
  this.asteroids.forEach( (asty) => {
    asty.pos = this.wrap(asty.pos);
    asty.move(this.ctx);
  });
  this.draw();
};

Game.prototype.wrap = function(pos) {
  let wrappedPos = [this.checkPos(pos, 0, this.DIM_X),
                    this.checkPos(pos, 1, this.DIM_Y)];
  return wrappedPos;
};

Game.prototype.checkPos = function(pos, index, limit) {
  let result = 0;
  if (pos[index] < 0) {
    result = limit;
  } else if (pos[index] > limit) {
    result = 0;
  } else {
    result = pos[index];
  }
  return result;
};

Game.prototype.checkCollisions = function() {
  this.asteroids.forEach( (asty, i) => {
    this.asteroids.slice(i).forEach( (otherAsty) => {
      if (asty.isCollidedWith(otherAsty)) {
        alert("CRASH! EVERYBODY PANIC!");
      }
    });
  });
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
};

module.exports = Game;
