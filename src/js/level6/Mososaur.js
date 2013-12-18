Mososaur = function (game, initialPosition, initialVelocity, level) {

  // To use spritesheet data in the canvas, we need to load it
  // into javascript
  var spritesheet = new Image();
  spritesheet.src = "mosasaurSpritesheet.png";

  //Call base class constructor:
  Entity.call(this, game, initialPosition, initialVelocity, spritesheet, level);
  // Sprite size constants
  this.initialPosition = new Vector(initialPosition.x, initialPosition.y);
  this.spriteWidth = Math.floor(1455 / 9) + 1;
  this.spriteHeight = 55;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  this.walktime = 0;

  // Physics constants:
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 100;  // in pixels per second^2

  this.maxVelocity = new Vector(150, 400);
  this.frictionConstant = 200;

  this.hangTimeEnabled = false;
  this.hangTimeVelocityThreshold = 30;
  this.hangTimeMinimum = 0.1;

  // Multi-jump:
  this.jumpsMax = 2;
  this.jumpsLeft = 2;

  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: 80,
    height: 100
  };

}

Mososaur.prototype = new Entity();
Mososaur.prototype.constructor = Mososaur;

// Update the player's sprite given the provided input
Mososaur.prototype.update = function (timeStep, input) {
  Entity.prototype.update.call(this, timeStep, input);
  var seconds = timeStep / 1000; // Convert timestep to seconds
  if (this.isUnderWater()) {
    this.gravityScale = 0;//Half gravity under water
  } else {
    this.gravityScale = 0;//Full gravity above water
  }
  if (this.isOnAir()) {
    this.accelerate(new Vector(0, -7));
  }
  var player = this.level.player;
  var playerPos = player.position;
  var playDirection = player.facingLeft;
  var change = 0;
  if (player.facingLeft) {
    change = 48;
  } else {
    change = -48;
  }
  if (this.position.x < this.initialPosition.x) {
    this.facingLeft = false;
  } else if (this.position.x > this.initialPosition.x + 750) {
    this.facingLeft = true;
  }
  this.velocity = new Vector((this.facingLeft ? -this.maxVelocity.x : this.maxVelocity.x), 0);

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };
  if (this.velocity < -Math.EPSILON) {
    this.frame.x = 0;
  } else {
    this.walktime = (this.walktime + timeStep) % 1000;
    var f = Math.floor(this.walktime / (1000 / 9));
    this.frame.y = 0
    this.frame.x = f * this.spriteWidth;
  }
}

// Render the player's sprite using the provided context
Mososaur.prototype.render = function (timeStep, ctx) {
  ctx.save();
  // Translate sprite to on-screen position
  ctx.translate(this.position.x - this.level.tileEngine.scrollPosition.x, this.position.y - this.level.tileEngine.scrollPosition.y);

  // Flip direction sprite faces when moving left 
  // (animations are all drawn facing right)
  if (this.facingLeft) ctx.scale(-1, 1);
  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}