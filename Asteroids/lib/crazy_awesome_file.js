/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

// Spacerock. It inherits from MovingObject.
const MovingObject = __webpack_require__(1);
const Util = __webpack_require__(2);

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Base class for anything that moves.
// Most important methods are
// MovingObject.prototype.move,
// MovingObject.prototype.draw(ctx),
// MovingObject.prototype.isCollidedWith(otherMovingObject).
const Utils = __webpack_require__(2);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Utility code, especially vector math stuff.

// to find distance btwn 2 points:
// Dist([x_1, y_1], [x_2, y_2]) = sqrt((x_1 - x_2) ** 2 + (y_1 - y_2) ** 2)

// norm (magnitude or length) of a velocity:
// Norm([x_1, y_1]) = Dist([0, 0], [x_1, y_1])

const Util = {
  inherits(childClass, parentClass) {
    function Surrogate () {}
    Surrogate.prototype = parentClass.prototype;
    childClass.prototype = new Surrogate();
    childClass.prototype.constructor = childClass;
  },
  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale(vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  dist(pos1, pos2) {
    return Math.floor(Math.sqrt((pos1[0] - pos2[0])**2 + (pos1[1] - pos2[1])**2));
  }
};

module.exports = Util;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// Stores a Game instance.
// Stores a canvas context to draw the game into.
// Installs key listeners to move the ship and fire bullets.
// Installs a timer to call Game.prototype.step.
const MovingObject = __webpack_require__(1);
const Game = __webpack_require__(4);
const Asteroid = __webpack_require__(0);

function GameView(ctx){
  this.game = new Game(ctx);
  this.ctx = ctx;
  this.game.draw(this.ctx);
}

GameView.prototype.start = function() {
  setInterval(this.game.step.bind(this.game), 20);
};

module.exports = GameView;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// Holds collections of the asteroids, bullets, and your ship.
// Game.prototype.step method calls Game.prototype.move on all the objects,
// and Game.prototype.checkCollisions checks for colliding objects.
// Game.prototype.draw(ctx) draws the game.
// Keeps track of dimensions of the space; wraps objects around when they
// drift off the screen.
const Asteroid = __webpack_require__(0);

function Game(ctx) {
  this.DIM_X = 500;
  this.DIM_Y = 500;
  this.NUM_ASTEROIDS = 30;
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
};

module.exports = Game;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const GameView = __webpack_require__(3);

document.addEventListener("DOMContentLoaded", function(event){
  const canvasEl = document.getElementById('game-canvas');
  const ctx = canvasEl.getContext("2d");
  const gameView = new GameView(ctx);
  gameView.start();
});


/***/ })
/******/ ]);