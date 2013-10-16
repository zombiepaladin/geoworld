// Construct a new player object
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
  
  // Player state variables
  this.position = new Vector(300, 100);  // in pixels
  this.velocity = new Vector(0, 0);      // in pixels per second
  
  // Movement constants
  this.maxVelocity = 5;     // in pixels per second
  this.acceleration = 150;  // in pixels per second^2  
  
  // Vertical and Horizontal states
  this.verticalState = "OnGround"; // {OnGround, Falling, Jumping}
  this.horizontalState = "Stationary"; // {Stationary, MovingLeft, MovingRight}
  
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
  var seconds = timeStep / 1000; // Convert timestep to s
  if(input.up) console.log(this.animationState);
  
  // Update horizontal state
  if(input.left) { 
    this.horizontalState = "MovingLeft";
    this.velocity.x -= this.acceleration * seconds; 
  }
  if(input.right) {
    this.horizontalState = "MovingRight";
    this.velocity.x += this.acceleration * seconds; 
  }
  Math.clamp(this.velocity.x, -this.maxVelocity, this.maxVelocity);
  
  // Apply horizontal velocity
  this.position.x += this.velocity.x * seconds;
  
  // Update vertical state
 
  
  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0, 
    y: 0, 
    width: this.spriteWidth, 
    height: this.spriteHeight
  };
  
  if(this.verticalState === "OnGround") {
  
    // Determine the amount of "lean" based on the direction
    // and velocity of the sprite
    if(this.horizontalState === "MovingLeft") {
    
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if(this.velocity.x > 0.5) 
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.velocity.x > -0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.velocity.x > -8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    
    }else if(this.horizontalState === "MovingRight") {
      
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if(this.velocity.x < -0.5) 
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.velocity.x < 0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.velocity.x < 8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    }
    
  } else if (this.verticalState === "Jumping") {
  } else if (this.verticalState === "Falling") {
  }  
}

// Render the player's sprite using the provided context
Player.prototype.render = function(timeStep, ctx) {
  ctx.save();
  
  // Translate sprite to on-screen position
  ctx.translate(this.position.x, this.position.y);
  
  // Flip direction sprite faces when moving left 
  // (animations are all drawn facing right)
  if(this.horizontalState == "MovingLeft") ctx.scale(-1, 1);
  
  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet, 
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );
  
  ctx.restore();
}