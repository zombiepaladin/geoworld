Asteroid_Phase6 = function (game, initialPosition, initialVelocity, level) {

  // To use spritesheet data in the canvas, we need to load it
  // into javascript
  var spritesheet = new Image();
  spritesheet.src = "asteroid.png";

  //Call base class constructor:
  Entity.call(this, game, initialPosition, initialVelocity, spritesheet, level);
  console.log(this.position);
  // Sprite size constants
  this.spriteWidth = 150;
  this.spriteHeight = 135;
  this.spriteHalfWidth = this.spriteWidth / 2 - 45;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  this.walktime = 0;

  // Physics constants:
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 10;  // in pixels per second^2

  this.maxVelocity = new Vector(200, 400);
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

Asteroid_Phase6.prototype = new Entity();
Asteroid_Phase6.prototype.constructor = Asteroid_Phase6;

// Update the player's sprite given the provided input
Asteroid_Phase6.prototype.update = function (timeStep, input) {
  Entity.prototype.update.call(this, timeStep, input);
  this.velocity = new Vector(0, 0);
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
  this.facingLeft = (playerPos.x > this.position.x);



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

// Render the player's sprite using the provided context
Asteroid_Phase6.prototype.render = function (timeStep, ctx) {
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