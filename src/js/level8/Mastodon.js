Mastodon = function (initialParent, initialPosition, scene, fishType) {
  Entity.call(this, initialParent, initialPosition, scene);

  //Sprite
  this.spritesheet = new Image();
  this.spritesheet.src = "mammothSprite.png";
  this.spriteWidth = 48;
  this.spriteHeight = 48;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.initialPosition = new Vector(initialPosition.x, initialPosition.y);

  this.facingLeft = true;
  this.walktime = 0;

  // Physics:
  this.applyModifier(physics_modifier);
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 50;  // in pixels per second^2

  this.maxVelocity = new Vector(200, 400);
  this.frictionConstant = 200;

  this.hangTimeEnabled = false;

  // Multi-jump:
  this.jumpsMax = 2;
  this.jumpsLeft = this.jumpsMax;

  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };

}

Mastodon.prototype = new Entity();
Mastodon.prototype.constructor = Mastodon;

Mastodon.createFromLevel = function (info, scene) {
  return new Mastodon(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene);
}

Mastodon.prototype.update = function (timeStep, input) {
  var seconds = timeStep / 1000; // Convert timestep to seconds

  if (this.position.x > (this.initialPosition.x + 250)) {
    this.facingLeft = true;
  }
  if (this.position.x < (this.initialPosition.x - 10)) {
    this.facingLeft = false;
  }
  if (this.facingLeft) {
    this.velocity = new Vector(-this.acceleration, this.velocity.y);
  }
  if (!this.facingLeft) {
    this.velocity = new Vector(this.acceleration, this.velocity.y);
  }

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };
  this.walktime = (this.walktime + timeStep) % 300;
  if (this.walktime < 150) {
    this.frame.x = this.spriteWidth;
  } else {
    this.frame.x = this.spriteWidth * 2;
  }
}

Mastodon.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if (this.facingLeft) {
    ctx.scale(-1, 1);
  }

  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}