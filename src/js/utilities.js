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
    ret++;
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

//Assert inputs to the context translate function:
CanvasRenderingContext2D.prototype.translate_orig = CanvasRenderingContext2D.prototype.translate;
CanvasRenderingContext2D.prototype.translate = function (x, y) {
  assert(!isNaN(x));
  assert(!isNaN(y));
  this.translate_orig(x, y);
}

CanvasRenderingContext2D.prototype.fillCircle = function (x, y, radius) {
  this.beginPath();
  this.arc(x, y, radius, 0, Math.PI * 2, true);
  this.closePath();
  this.fill();
}
