fish2 = function (game, initialPosition, initialVelocity, level) {

  // To use spritesheet data in the canvas, we need to load it
  // into javascript
  var spritesheet = new Image();
  spritesheet.src = "fish2.png";

  //Call base class constructor:
  Entity.call(this, game, initialPosition, initialVelocity, spritesheet, level);
  
  // Sprite size constants
  this.spriteWidth = 164;
  this.spriteHeight = 50;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = true;
  this.walktime = 0;
  
  // Physics constants:
  this.instantaneousJumpImpulse = -200;
  this.acceleration = 100;  // in pixels per second^2

  this.maxVelocity = new Vector(100, 400);
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
    width: 164,
    height: 50
  };
  
}

fish2.prototype = new Entity();
fish2.prototype.constructor = fish2;

// Update the player's sprite given the provided input
fish2.prototype.update = function (timeStep, input) {
  Entity.prototype.update.call(this, timeStep, input);
  var seconds = timeStep / 1000; // Convert timestep to seconds
  if (this.isUnderWater()) {
    this.gravityScale = 0.5;//Half gravity under water
  } else {
    this.gravityScale = 1.0;//Full gravity above water
  }
   if (this.isOnAir()) {
	this.accelerate(new Vector(0, -7));
  }
  var player = this.level.player;
  var playerPos = player.position;
  var playDirection = player.facingLeft;
  var change = 0;
  if(player.facingLeft){
    change = 48;
  } else {
    change = -48;
  }
  if(Math.abs(this.position.x - playerPos.x) < 500){
	if( playerPos.x + change > this.position.x){
		this.facingLeft = true;
		this.accelerate(new Vector(this.acceleration, 0), seconds);
	} else {
		this.facingLeft = false;
		this.accelerate(new Vector(-this.acceleration, 0), seconds);
	}
	 if(playerPos.y + 10 < this.position.y && this.isOnGround()){
    this.accelerate(new Vector(0, this.instantaneousJumpImpulse * this.gravityScale));
  }
  }
  
 
  // Handle user input
  /*if(input.left || input.a) {
    this.accelerate(new Vector(-this.acceleration, 0), seconds);
    this.facingLeft = true;
  }
  if(input.right || input.d) {
    this.accelerate(new Vector(this.acceleration, 0), seconds);
    this.facingLeft = false;
  }
  if ((input.up || input.spacebar || input.w) &&
    (
     this.isOnGround() ||
     this.jumpsLeft > 0 || //For double (triple, etc) jumping
     this.isUnderWater() //Infinite mario-style jumping under water.
    )) {
    if (this.isOnGround()) {
      this.jumpsLeft = this.jumpsMax - 1;
    } else {
      this.jumpsLeft--;
    }
    input.up = false;//HACK: Should probably modify the input system so we can check if it was just pressed instead.
    input.spacebar = false;
	input.w = false;
	this.velocity.y = 0;  // Reset y-velocity to 0 for multiple jumps
	this.lastAcceleration.y = 0;
	
    //HACK: Using gravity scale to reduce jump impulse under water. Should add something more specific later.
    this.accelerate(new Vector(0, this.instantaneousJumpImpulse * this.gravityScale));
  }*/
  
  /*
  // Wrap around edges of screen:
  if (this.position.x > Game.gameWidth + this.spriteWidth / 2) { this.position.x = -this.spriteWidth / 2; }
  if (this.position.x < -this.spriteWidth / 2) { this.position.x = Game.gameWidth + this.spriteWidth / 2; }
  */
  
  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 164, 
    y: 0, 
    width: this.spriteWidth, 
    height: this.spriteHeight
  };
  if(this.velocity < -Math.EPSILON){
	this.frame.x = 0;
  } else{
	this.walktime = (this.walktime + timeStep) % 300;
	if(this.walktime < 150){
      this.frame.x = 0;
	} else{
	  this.frame.x = this.spriteWidth;
	}
  }
}

// Render the player's sprite using the provided context
fish2.prototype.render = function(timeStep, ctx) {
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