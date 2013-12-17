// Construct a new vector object
Rect = function (x, y, width, height) {
  this.x = (x === undefined) ? 0 : x;
  this.y = (y === undefined) ? 0 : y;
  this.width = (width === undefined) ? 0 : width;
  this.height = (height === undefined) ? 0 : height;
}

Rect.prototype.isPointInside = function (x, y) {
  //isPointInside(vec) overload:
  if (y == undefined && x.x != undefined && x.y != undefined) {
    y = x.y;
    x = x.x;
  }

  return x > this.x && y > this.y && x < (this.x + this.width) && y < (this.y + this.height);
}
