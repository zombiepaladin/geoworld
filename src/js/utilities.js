function assert(condition, message) {
  if (!condition) {
    if (message === undefined) {
      throw "Assertation Failed!";
    } else {
      throw "Assertation Failed! " + message;
    }
  }
}

//Additional array functions:
Array.prototype.removeAt = function (index) {
  this.splice(index, 1);
}

Array.prototype.remove = function (item) {
  var i;
  var ret = 0;
  while (true) {
    i = this.indexOf(item);
    if (i < 0) { break; }
    this.removeAt(i);
  }

  return ret;
}

Array.prototype.add = Array.prototype.push;

Array.prototype.peek = function () {
  if (this.length <= 0) {
    return undefined;
  }

  return this[this.length - 1];
}
