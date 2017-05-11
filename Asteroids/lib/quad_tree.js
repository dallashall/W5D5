class QuadTree {
  constructor(minX, maxX, minY, maxY, maxNum = 5) {
    this.maxNum = maxNum;
    this.store = [];
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.full = false;
  }

  tooMany() {
    return (this.store.length > this.maxNum);
  }

  inRange(asteroid) {
    return (
      asteroid.pos[0] >= this.minX &&
      asteroid.pos[0] <= this.maxX &&
      asteroid.pos[1] >= this.minY &&
      asteroid.pos[1] <= this.maxY
    );
  }

  setFull() {
    this.full = true;
  }

  place(asteroid) {
    if (!this.inRange(asteroid)) {
      return false
    }

    if (this.full) {
      this.placeInSub(asteroid);
    } else {
      this.store.push(asteroid);
      if (this.tooMany()) {
        this.divide();
      }
    }

    return true;
  }

  divide() {
    this.setFull();
    const oldStore = this.store;
    const midX = this.maxX / 2;
    const midY = this.maxY / 2;
    this.store = [
      new QuadTree(this.minX, midX, this.minY, midY, this.maxNum),
      new QuadTree(midX, this.maxX, this.minY, midY, this.maxNum),
      new QuadTree(this.minX, midX, midY, this.maxY, this.maxNum),
      new QuadTree(midX, this.maxX, midY, this.maxY, this.maxNum)
    ];
    console.log(this.store);
    console.log(oldStore);
    oldStore.forEach(asteroid => this.placeInSub(asteroid));
  }

  placeInSub(asteroid) {
    this.store.some(quadTree => {
      return quadTree.place(asteroid);
    });
  }
}

class Asteroid {
  constructor(pos) {
    this.pos = pos;
  }
}

let array1 = [];
let array2 = [];
let obj = {};

for (let i = 1; i < 200; i++) {
  array1.push(i);
  array2.push(i);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

shuffleArray(array1);
shuffleArray(array2);


array1 = array1.map((pos, idx) => new Asteroid([pos, array2[idx]]));

const q = new QuadTree(0, 100, 0, 100, 5);

array1.forEach(asteroid => q.place(asteroid));

exports.Asteroid = Asteroid;
exports.QuadTree = QuadTree;
exports.q = q;
exports.array = array1;