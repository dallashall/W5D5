// Spacerock. It inherits from MovingObject.
const MovingObject = require('./moving_object.js');
const Util = require('./utils.js');

function Asteroid(pos) {
  this.COLOR = "thistle";
  this.RADIUS = 15;
  this.pos = pos.pos;
  this.vel = Util.randomVec(Math.floor(Math.random() * 10) + 1);

  return new MovingObject({
    pos : this.pos,
    vel : this.vel,
    radius : this.RADIUS,
    color : "thistle"
  });
}

Util.inherits(Asteroid, MovingObject);

module.exports = Asteroid;
