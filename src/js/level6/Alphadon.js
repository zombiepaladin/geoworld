Alphadon = function (initialParent, initialPosition, scene, fishType) {
  Entity.call(this, initialParent, initialPosition, scene);

  //Sprite
  this.spritesheet = new Image();
  this.spritesheet.src = "alphadon.png";
  this.spriteWidth = 47;
  this.spriteHeight = 58;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.walktime = 0;

  // Physics:
  this.applyModifier(physics_modifier);
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 100;  // in pixels per second^2

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

Alphadon.prototype = new Entity();
Alphadon.prototype.constructor = Alphadon;

Alphadon.createFromLevel = function (info, scene) {
  return new Alphadon(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene);
}

// Update the player's sprite given the provided input
Alphadon.prototype.update = function (timeStep, input) {
  var seconds = timeStep / 1000; // Convert timestep to seconds

  var player = this.scene.player;
  var playerPos = player.position;
  var playDirection = player.facingLeft;
  var change = 0;
  if (player.facingLeft) {
    change = 48;
  } else {
    change = -48;
  }

  if (playerPos.x + change > this.position.x) {
    this.accelerate(new Vector(this.acceleration, 0), seconds);
  } else {
    this.accelerate(new Vector(-this.acceleration, 0), seconds);
  }

  if (playerPos.y + 10 < this.position.y && this.isOnGround()) {
    this.accelerate(new Vector(0, this.instantaneousJumpImpulse * this.gravityScale));
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

// Render the player's sprite using the provided context
Alphadon.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);

  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}