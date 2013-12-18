// Construct a new vector object
Vector = function (x, y) {
  this.x = (x === undefined) ? 0 : x;
  this.y = (y === undefined) ? 0 : y;
}

Vector.prototype.scale = function (scale) {
  return new Vector(this.x * scale, this.y * scale);
}

Vector.prototype.plusEquals = function (other) {
  this.x += other.x;
  this.y += other.y;
  return this;
}

Vector.prototype.plus = function (other) {
  return new Vector(this.x, this.y).plusEquals(other);
}
