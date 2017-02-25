function sum(...nums) {
  let result = 0;
  nums.forEach( (num) => {
    result += num;
  });
  return result;
}

function argSum() {
  let args = Array.from(arguments);
  let result = 0;
  args.forEach( (num) => {
    result += num;
  });
  return result;
}

Function.prototype.myBind = function(obj) {
  let args = Array.from(arguments);
  args.shift();
  let context = this;

  return function() {
    let newArgs = Array.from(arguments);
    args = args.concat(newArgs); // if new args is empty, it stays the same
    context.apply(obj, args);
  };
};

Function.prototype.myBind = function(obj, ...args) {
  return (...args2) => this.apply(obj, args.concat(args2));
};

function curriedSum(n){
  let numbers = [];
  return function _curriedSum(num){
    numbers.push(num);
    if (numbers.length === n){
      return sum(...numbers);
    } else {
      return _curriedSum;
    }
  };
}

Function.prototype.curry = function(n) {
  let numbers = [];
  let context = this;
  return function _curry(...args) {
    numbers = numbers.concat(args);
    if (numbers.length >= n) {
      return context(...numbers);
    } else {
      return _curry;
    }
  };
};

console.log(sum.curry(3)(30)(20)(1, 4)); // => 51
