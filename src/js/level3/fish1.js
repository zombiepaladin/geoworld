Fish1 = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);

  this.spritesheet = new Image();
  this.spritesheet.src = "fish1.png";

  // Sprite size constants
  this.spriteWidth = 120;
  this.spriteHeight = 46;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;
  this.spriteFacingLeft = true;

  this.facingLeft = true;
  this.walktime = 0;

  // Physics:
  this.applyModifier(physics_modifier);
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 100 / 2;  // in pixels per second^2

  this.maxVelocity = new Vector(100, 400);
  this.frictionConstant = 200;

  this.hangTimeEnabled = false;
  this.hangTimeVelocityThreshold = 30;
  this.hangTimeMinimum = 0.1;

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

Fish1.prototype = new Entity();
Fish1.prototype.constructor = Fish1;

Fish1.createFromLevel = function (info, scene) {
  return new Fish1(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene);
}

Fish1.prototype.update = function (timeStep, input) {
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

  if (Math.abs(this.position.x - playerPos.x) < 500) {
    if (playerPos.x + change > this.position.x) {
      this.facingLeft = false;
      this.accelerate(new Vector(this.acceleration, 0), seconds);
    } else {
      this.facingLeft = true;
      this.accelerate(new Vector(-this.acceleration, 0), seconds);
    }
    if (playerPos.y + 10 < this.position.y && this.isOnGround()) {
      this.accelerate(new Vector(0, this.instantaneousJumpImpulse * this.gravityScale));
    }
  }

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 120,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };

  this.walktime = (this.walktime + timeStep) % 300;
  if (this.walktime < 150) {
    this.frame.x = 0;
  } else {
    this.frame.x = this.spriteWidth;
  }
}

// Render the player's sprite using the provided context
Fish1.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if ((this.facingLeft && !this.spriteFacingLeft) ||
    (!this.facingLeft && this.spriteFacingLeft)) {
    ctx.scale(-1, 1);
  }

  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}