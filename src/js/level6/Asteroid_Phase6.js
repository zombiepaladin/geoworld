Asteroid_Phase6 = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);

  this.spritesheet = new Image();
  this.spritesheet.src = "asteroid.png";
  this.spriteWidth = 150;
  this.spriteHeight = 135;
  this.spriteHalfWidth = this.spriteWidth / 2 - 45;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  this.walktime = 0;

  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };
}

Asteroid_Phase6.prototype = new Entity();
Asteroid_Phase6.prototype.constructor = Asteroid_Phase6;

Asteroid_Phase6.createFromLevel = function (info, scene) {
  return new Asteroid_Phase6(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene);
}

Asteroid_Phase6.prototype.update = function (timeStep, input) {
  var seconds = timeStep / 1000; // Convert timestep to seconds

  this.facingLeft = (this.scene.player.position.x < this.position.x);

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };
  this.walktime = (this.walktime + timeStep) % 1000;
  var f = Math.floor(this.walktime / 250);
  this.frame.y = Math.floor(f / 2) * this.spriteHeight;
  this.frame.x = (f % 2) * this.spriteWidth;
}

Asteroid_Phase6.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if (!this.facingLeft) {
    ctx.scale(-1, 1);
  }

  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}