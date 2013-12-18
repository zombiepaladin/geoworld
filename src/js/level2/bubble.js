Bubble = function (initialParent, scene, spr) {
  var initialPosition = new Vector(
    Math.randomInt(30, 770),
    Math.randomInt(500, 680)
  );

  Entity.call(this, initialParent, initialPosition, scene);

  this.spriteSheet = spr;
  this.diameter = 12;
  this.shaking = Math.randomInt(0, 5);
  this.upwardSpeed = 0.05;
  this.airProvided = 10;
}

Bubble.prototype = new Entity();
Bubble.prototype.constructor = Bubble;

Bubble.prototype.update = function (timeStep) {
  this.shaking += timeStep / 300;
  this.position.y -= timeStep * this.upwardSpeed;
  this.position.x += 0.5 * Math.sin(this.shaking);
}

Bubble.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.spriteSheet, 0, 0, this.spriteSheet.width, this.spriteSheet.height, -this.spriteSheet.width / 2, -this.spriteSheet.height / 2, this.spriteSheet.width, this.spriteSheet.height);
  ctx.restore();
}