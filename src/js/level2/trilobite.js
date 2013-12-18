Trilobite = function (initialParent, scene, spr, top) {
  var xx;
  var yy;
  do {
    xx = Math.randomInt(-50, Game.width + 50);
  } while (xx > 0 && xx < Game.width);
  yy = Math.randomInt(top + 50, Game.height + 70);

  var initialPosition = new Vector(xx, yy);

  Entity.call(this, initialParent, initialPosition, scene);

  this.spriteSheet = spr;

  this.diameter = 26;
  this.angle = Math.random(0, 2 * Math.PI); // in radians
  this.speed = Math.random(0.03, 0.1);

  // when collision with robot
  this.airProvided = -3;
  this.maxSpeedChange = -0.03;
  this.accelerationChange = 0.0001;
  this.waterLevelChange = 0;
  this.stopRobot = false;
}

Trilobite.prototype = new Entity();
Trilobite.prototype.constructor = Trilobite;

Trilobite.prototype.update = function (timeStep) {
  this.position.x += timeStep * this.speed * Math.sin(this.angle);
  this.position.y -= timeStep * this.speed * Math.cos(this.angle);
}

Trilobite.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(this.angle);
  ctx.translate(-this.spriteSheet.width / 2, -this.spriteSheet.height / 2);
  ctx.drawImage(this.spriteSheet, 0, 0, this.spriteSheet.width, this.spriteSheet.height, 0, 0, this.spriteSheet.width, this.spriteSheet.height);
  ctx.restore();
}