Function.prototype.inheritsFrom = function(superClass) {
  const subClass = this;
  function Surrogate() {}
  Surrogate.prototype = superClass.prototype;
  subClass.prototype = new Surrogate();
  subClass.prototype.constructor = subClass;
};

function MovingObject (name) {
  this.name = name;
  this.funIndex = 1000;
}
MovingObject.prototype.run = function() {
  console.log(`WEEEEEEEE! so much fun on this ${this.name}`);
};

function Ship () {
  this.name = 'ship';
}
Ship.inheritsFrom(MovingObject);


function Asteroid () {
  this.name = 'asteroid';
}

Asteroid.inheritsFrom(MovingObject);

let voyager = new Ship();
voyager.run();
let astor = new Asteroid();
astor.run();
