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
  this.NUM_ASTEROIDS = 10;
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
  this.asteroids.slice(0, this.asteroids.length - 1).forEach( (asty, i) => {
    this.asteroids.slice(i + 1).forEach( (otherAsty) => {
      if (asty.isCollidedWith(otherAsty)) {
        console.log("Collision detected.")

        // Basic vector math
        let normalVector = [
          asty.pos[0] - otherAsty.pos[0],
          asty.pos[1] - otherAsty.pos[1]
        ];
        let normalMagnitude = Math.sqrt(normalVector[0]**2 + normalVector[1]**2);
        let unitNormalVector = [normalVector[0] / normalMagnitude, normalVector[1] / normalMagnitude];
        let unitTanVector = [-unitNormalVector[1], unitNormalVector[0]];

        // Check if moving toward each other
        let xVel = asty.vel[0] - otherAsty.vel[0];
        let yVel = asty.vel[1] - otherAsty.vel[1];
        let xDist = otherAsty.pos[0] - asty.pos[0];
        let yDist = otherAsty.pos[1] - asty.pos[1];
        let velDistDot = xVel * xDist + yVel * yDist;
        if (velDistDot <= 0) {
          return;
        }
        // TODO: DRY this up
        let astyNormScalar = unitNormalVector[0] * asty.vel[0] + unitNormalVector[1] * asty.vel[1];
        let astyTanScalar = unitTanVector[0] * asty.vel[0] + unitTanVector[1] * asty.vel[1];
        let otherNormScalar = unitNormalVector[0] * otherAsty.vel[0] + unitNormalVector[1] * otherAsty.vel[1];
        let otherTanScalar = unitTanVector[0] * otherAsty.vel[0] + unitTanVector[1] * otherAsty.vel[1];

        let astyNormColScalar = otherNormScalar;
        let otherNormColScalar = astyNormScalar;

        // TODO DRY this up
        let astyNormColVector = unitNormalVector.map( coord => coord * astyNormColScalar );
        let astyTanColVector = unitTanVector.map( coord => coord * astyTanScalar );
        let otherNormColVector = unitNormalVector.map( coord => coord * otherNormColScalar );
        let otherTanColVector = unitTanVector.map ( coord => coord * otherTanScalar );
        console.log(astyNormColVector);
        console.log(astyTanColVector);
        asty.vel[0] = astyNormColVector[0] + astyTanColVector[0];
        asty.vel[1] = astyNormColVector[1] + astyTanColVector[1];
        console.log(asty.vel);
        otherAsty.vel[0] = otherNormColVector[0] + otherTanColVector[0];
        otherAsty.vel[1] = otherNormColVector[1] + otherTanColVector[1];
      }
    });
  });
};

Game.prototype.step = function() {
  this.moveObjects();
  this.checkCollisions();
  window.requestAnimationFrame(this.step.bind(this));
};

module.exports = Game;
