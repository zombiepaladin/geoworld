// Construct a new player object
Player = function (initialParent, initialPosition, scene) {

  // To use spritesheet data in the canvas, we need to load it
  // into javascript
  this.spritesheet = new Image();
  this.spritesheet.src = "robot.png";

  //Call base class constructor:
  Entity.call(this, initialParent, initialPosition, scene);
  this.applyModifier(physics_modifier);
  
  // Sprite size constants
  this.spriteWidth = 80;
  this.spriteHeight = 100;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  
  // Physics constants:
  this.instantaneousJumpImpulse = -200 * 1.5;
  this.acceleration = 200;  // in pixels per second^2

  this.maxVelocity = new Vector(200, 400);
  this.frictionConstant = 200;

  this.hangTimeEnabled = false;
  this.hangTimeVelocityThreshold = 30;
  this.hangTimeMinimum = 0.1;

  //Input-variables:
  this.input = new Object();
  this.input.left = false;
  this.input.right = false;

  // Multi-jump:
  this.jumpsMax = 2;
  this.jumpsLeft = this.jumpsMax;
  
  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: 80,
    height: 100
  };
  
  // Game state things:
  this.goal = undefined;
  this.goalDestination = undefined;
}

Player.prototype = new Entity();
Player.prototype.constructor = Player;

// Called from level_scene to create a player defined as an object in the level
Player.createFromLevel = function (info, scene) {
  return new Player(scene, new Vector(info.x + info.width / 2, info.y + info.height), scene);
}

Player.prototype.giveRegion = function (region) {
  if (region.name == "Goal") {
    assert(this.goal === undefined);
    this.goal = new Rect(region.x, region.y, region.width, region.height);

    if (region.properties.destination != undefined) {
      this.goalDestination = region.properties.destination;
    }
  }
}

// Called when the player dies
Player.prototype.kill = function () {
  Game.pushScene(new DeathScene());
}

// Update the player's sprite given the provided input
Player.prototype.update = function (timeStep) {
  var seconds = timeStep / 1000; // Convert timestep to seconds

  //Game.setDebugString("Under water: " + this.isUnderWater());

  if (this.isUnderWater()) {
    this.gravityScale = 0.5;//Half gravity under water
  } else {
    this.gravityScale = 1.0;//Full gravity above water
  }

  // Handle user input
  if (this.input.left) {
    this.accelerate(new Vector(-this.acceleration, 0), seconds);
    this.facingLeft = true;
  }

  if (this.input.right) {
    this.accelerate(new Vector(this.acceleration, 0), seconds);
    this.facingLeft = false;
  }

  if (this.scene.isHazzardAt(this.position.x, this.position.y) && false) {
    this.kill();
  }

  if (this.goal != undefined && this.goal.isPointInside(this.position)) {
    Game.popScene();//Remove this level from the stack
    if (this.goalDestination != undefined) {
      if (window[this.goalDestination] === undefined) {
        console.error("Tried to move to the next level '%s', but that level does not exist!", this.goalDestination);
      } else {
        Game.pushScene(new Level(window[this.goalDestination]));//Push the next level so the end of level screen returns to it when it is done
      }
    }
    Game.pushScene(new FinishScene());//Push the end of level screen
  }

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0, 
    y: 0, 
    width: this.spriteWidth, 
    height: this.spriteHeight
  };
  
  if(this.isOnGround()) {
  
    // Determine the amount of "lean" based on the direction
    // and velocity of the sprite
    if (this.velocity.y < -Math.EPSILON) {
    
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if(this.velocity.x > -0.5) 
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.velocity.x > -0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.velocity.x > -8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    
    } else if (this.velocity.y > Math.EPSILON) {
      
      // All ground-based moving animations 
      // fall in the second row
      this.frame.y = this.spriteHeight;
      
      // Determine the frame based on velocity
      if (this.velocity.x < 0.5)
        this.frame.x = this.spriteWidth;      // Second Column
      else if (this.velocity.x < 0.5)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
      else if (this.velocity.x < 8)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
      else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    }
    
  } else {//Not on ground

    // Determine the frame based on velocity
    if (Math.abs(this.velocity.y) < 0.5)
        this.frame.x = this.spriteWidth;      // Second Column
    else if (Math.abs(this.velocity.y) < 8)
        this.frame.x = 2 * this.spriteWidth;  // Third Column
    else if (Math.abs(this.velocity.y) < 50)
        this.frame.x = 3 * this.spriteWidth;   // Foruth Column
    else
        this.frame.x = 4 * this.spriteWidth;  // Fifth Column
    
    if (this.velocity.y < 0.0)//If jumping, rather than falling
    { this.frame.y = 2 * this.spriteHeight; }
    else
    { this.frame.y = 3 * this.spriteHeight; }
  }
}

// Render the player's sprite using the provided context
Player.prototype.render = function(timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);

  if (this.facingLeft) {
    ctx.scale(-1, 1);
  }

  ctx.drawImage(this.spritesheet, 
	  this.frame.x, this.frame.y, this.frame.width, this.frame.height,
	  -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );
  
  this.renderChildren(timeStep, ctx);
  ctx.restore();
}

Player.prototype.keyDown = function (event) {
  //Jumping:
  if ((event.key == Keys.Up || event.key == Keys.Space) &&
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

    this.velocity.y = 0;// Reset y-velocity to 0 for multiple jumps

    if (this.isUnderWater()) {
      this.accelerate(new Vector(0, this.instantaneousJumpImpulse * 0.7));
    } else {
      this.accelerate(new Vector(0, this.instantaneousJumpImpulse));
    }

    return true;
  }
  else if (event.key == Keys.Left) {
    this.input.left = true;
    return true;
  }
  else if (event.key == Keys.Right) {
    this.input.right = true;
    return true;
  }

  return false;
}

Player.prototype.keyUp = function (event) {
  if (event.key == Keys.Left) {
    this.input.left = false;
    return true;
  }
  else if (event.key == Keys.Right) {
    this.input.right = false;
    return true;
  }

  return false;
}
