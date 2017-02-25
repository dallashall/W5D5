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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);

	document.addEventListener("DOMContentLoaded", function(event){
	  const canvasEl = document.getElementById('game-canvas');
	  const ctx = canvasEl.getContext("2d");
	  const gameView = new GameView(ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// Stores a Game instance.
	// Stores a canvas context to draw the game into.
	// Installs key listeners to move the ship and fire bullets.
	// Installs a timer to call Game.prototype.step.
	const MovingObject = __webpack_require__(2);
	const Game = __webpack_require__(3);
	const Asteroid = __webpack_require__(4);

	function GameView(ctx){
	  this.game = new Game(ctx);
	  this.ctx = ctx;
	  this.game.draw(this.ctx);
	}

	GameView.prototype.start = function() {
	  setInterval(this.game.step(this.game), 20);
	};

	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// Base class for anything that moves.
	// Most important methods are
	// MovingObject.prototype.move,
	// MovingObject.prototype.draw(ctx),
	// MovingObject.prototype.isCollidedWith(otherMovingObject).
	const Utils = __webpack_require__(5);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// Holds collections of the asteroids, bullets, and your ship.
	// Game.prototype.step method calls Game.prototype.move on all the objects,
	// and Game.prototype.checkCollisions checks for colliding objects.
	// Game.prototype.draw(ctx) draws the game.
	// Keeps track of dimensions of the space; wraps objects around when they
	// drift off the screen.
	const Asteroid = __webpack_require__(4);

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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// Spacerock. It inherits from MovingObject.
	const MovingObject = __webpack_require__(2);
	const Util = __webpack_require__(5);

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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
	    return Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2));
	  }
	};

	module.exports = Util;


/***/ }
/******/ ]);