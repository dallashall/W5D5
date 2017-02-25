// Base class for anything that moves.
// Most important methods are
// MovingObject.prototype.move,
// MovingObject.prototype.draw(ctx),
// MovingObject.prototype.isCollidedWith(otherMovingObject).
const Utils = require('./utils.js');

function MovingObject(options) {
  this.pos = options['pos'];
  this.vel = options['vel'];
  this.radius = options['radius'];
  this.color = options['color'];
}

MovingObject.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(
    this.pos[0],
    this.pos[1],
    this.radius,
    0,
    2 * Math.PI,
    false
  );

  ctx.fillStyle = this.color;
  ctx.fill();
};

MovingObject.prototype.move = function(ctx) {
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
};

MovingObject.prototype.isCollidedWith = function(otherObject){
  if (Utils.dist(this.pos, otherObject.pos) < (this.radius + otherObject.radius)) {
    return true;
  } else {
    return false;
  }
};

module.exports = MovingObject;
