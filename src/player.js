// Construct a new player object
//TODO: Make a child of dynamicPhysicsObject? (We need to agree on an OOP strategy / library if we do that.)
Player = function(game) {
  // To use spritesheet data in the canvas, we need to load it
  // into javascript
  this.spritesheet = new Image();
  this.spritesheet.src = "robot.png";
  
  // Sprite size constants
  this.spriteWidth = 80;
  this.spriteHeight = 100;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  
  // Physics constants:
  this.instantaneousJumpImpulse = -100;
  this.acceleration = 200;  // in pixels per second^2  

  // Create physics object:
  this.physics = new DynamicPhysicsObject(
    new Vector(300, 100) //Initial position (In pixels)
  );

  this.physics.maxVelocity = new Vector(200, 400);
  this.physics.frictionConstant = 200;
  
  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: 80,
    height: 100
  };
  
}

// Update the player's sprite given the provided input
Player.prototype.update = function(timeStep, input) {
  var seconds = timeStep / 1000; // Convert timestep to seconds
  
  // Handle user input
  if(input.left) {
    this.physics.accelerate(new Vector(-this.acceleration, 0), seconds);
    this.facingLeft = true;
  }

  if(input.right) {
    this.physics.accelerate(new Vector(this.acceleration, 0), seconds);
    this.facingLeft = false;
  }

  if (input.up && this.physics.isOnGround()) {
    this.physics.accelerate(new Vector(0, this.instantaneousJumpImpulse));
    console.log("JUMP!");
  }

  // Update physics:
  this.physics.update(timeStep);
  
  // Wrap around edges of screen:
  if (this.physics.position.x > Game.gameWidth + this.spriteWidth / 2) { this.physics.position.x = -this.spriteWidth / 2; }
  if (this.physics.position.x < -this.spriteWidth / 2) { this.physics.position.x = Game.gameWidth + this.spriteWidth / 2; }
  
  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0, 
    y: 0, 
    width: this.spriteWidth, 
    height: this.spriteHeight
  };
  
  if(this.physics.isOnGround()) {
  
    // Determine the amount of "lean" based on the direction
    // and velocity of the sprite
    if (this.physics.velocity < -Math.EPSILON) {
    
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if(this.physics.velocity.x > -0.5) 
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.physics.velocity.x > -0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.physics.velocity.x > -8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    
    } else if (this.physics.velocity > Math.EPSILON) {
      
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if (this.physics.velocity.x < 0.5)
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.physics.velocity.x < 0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.physics.velocity.x < 8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    }
    
  } else {//Not on ground

    // Determine the frame based on velocity
    if (Math.abs(this.physics.velocity.y) < 0.5)
        this.frame.x = this.spriteWidth;      // Second Column
    else if (Math.abs(this.physics.velocity.y) < 8)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
    else if (Math.abs(this.physics.velocity.y) < 50)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
    else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    
    if (this.physics.velocity.y < 0.0)//If jumping, rather than falling
    { this.frame.y = 2 * this.spriteHeight; }
    else
    { this.frame.y = 3 * this.spriteHeight; }
  }
}

// Render the player's sprite using the provided context
Player.prototype.render = function(timeStep, ctx) {
  ctx.save();

  // Translate sprite to on-screen position
  ctx.translate(this.physics.position.x, this.physics.position.y);
  
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