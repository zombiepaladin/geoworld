// Generate a random Integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

Bubble = function (spr) {
  this.spriteSheet = spr;
  this.position = {
    x: getRandomInt(30, 770),
    y: getRandomInt(500, 680)
  }
  this.diameter = 12;
  this.shaking = getRandomInt(0, 5);
  this.upwardSpeed = 0.05;
  this.airProvided = 10;
}

Bubble.prototype.update = function (timeStep, moveY) {
  this.shaking += timeStep / 300;
  if (moveY)
    this.position.y += moveY;
  this.position.y -= timeStep * this.upwardSpeed;
  this.position.x += 0.5 * Math.sin(this.shaking);
}

Bubble.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.spriteSheet, 0, 0, this.spriteSheet.width, this.spriteSheet.height, -this.spriteSheet.width / 2, -this.spriteSheet.height / 2, this.spriteSheet.width, this.spriteSheet.height);
  ctx.restore();
}