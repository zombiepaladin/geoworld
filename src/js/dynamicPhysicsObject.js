// Construct a dynamic physics object
//TODO: Create base class for static physics objects?
DynamicPhysicsObject = function (initialPosition, initialVelocity, level) {
  this.position = initialPosition;  // Absolute position on level
  this.velocity = initialVelocity;
  this.level = level;
  this.maxVelocity = undefined;
  this.frictionConstant = 0;
  this.lastAcceleration = new Vector(0, 0);//Used to apply friction

  this.gravityScale = 1.0;

  this.hangTimeEnabled = false;
  this.hangTimeVelocityThreshold = 0;//The crossover of the Y velocity to start applying hang time
  this.hangTimeMinimum = 1.0;//As a percentage of world gravity

  if (this.position === undefined) {
    this.position = new Vector(0, 0);
  }

  if (this.velocity === undefined) {
    this.velocity = new Vector(0, 0);
  }
}

DynamicPhysicsObject.prototype.update = function (timeStep) {
  var seconds = timeStep / 1000;

  //Ensure velocity is not NaN:
  assert(!isNaN(this.velocity.x));
  assert(!isNaN(this.velocity.y));

  //Limit velocity to maxVelocity
  if (this.maxVelocity !== undefined) {
    this.velocity.x = Math.clamp(this.velocity.x, -this.maxVelocity.x, this.maxVelocity.x);
    this.velocity.y = Math.clamp(this.velocity.y, -this.maxVelocity.y, this.maxVelocity.y);
  }

  // Apply friction
  if (this.isOnGround() &&
      !(this.lastAcceleration.x < 0.0 && this.velocity.x < 0.0) &&//If not (moving left and velocity is to the left)
      !(this.lastAcceleration.x > 0.0 && this.velocity.x > 0.0)) {//If not (moving right and velocity is to the right)

    //If we are moving left, apply friction to the right
    if (this.velocity.x < Math.EPSILON) {
      this.velocity.x += this.frictionConstant * seconds;

      //Don't let friction make the object move.
      if (this.velocity.x >= 0.0) {
        this.velocity.x = 0.0;
      }
    }
    //If we are moving right, apply friction to the left
    else if (this.velocity.x > -Math.EPSILON) {
      this.velocity.x -= this.frictionConstant * seconds;

      //Don't let friction make the object move.
      if (this.velocity.x <= 0.0) {
        this.velocity.x = 0.0;
      }
    }
    else {
      this.velocity.x = 0.0;
    }
  }

  // Apply gravity:
  if (!this.isOnGround()) {
    gravity = Game.physics.gravityConstant * this.gravityScale;

    if (this.hangTimeEnabled &&
      Math.abs(this.velocity.y) < this.hangTimeVelocityThreshold &&// If we've passed the threshold
      this.velocity.y < 0) {// If we are rising (not falling)
      gravity = Math.lerp(gravity, gravity * this.hangTimeMinimum,
        1.0 - this.velocity.y / -this.hangTimeVelocityThreshold);
    }

    this.velocity.y += gravity * seconds;
  }

  // Apply velocity:
  this.position.plusEquals(this.velocity.scale(seconds));

  // Adjust velocity in response to collisions:
  if (this.isOnGround()) {
    this.velocity.y = 0.0;
  }

  //Reset values that are only valid in-between calls to update:
  this.lastAcceleration = new Vector(0, 0);
}

DynamicPhysicsObject.prototype.accelerate = function (accelerationVector, scale) {
  if (scale === undefined) {
    scale = 1.0;
  }

  this.velocity.x += accelerationVector.x * scale;
  this.velocity.y += accelerationVector.y * scale;

  this.lastAcceleration.plusEquals(accelerationVector.scale(scale));
}

DynamicPhysicsObject.prototype.isOnGround = function () {
  return this.position.y >= this.level.getGroundLevelAt(this.position.x);
}

DynamicPhysicsObject.prototype.isUnderWater = function () {
  return this.level.isWaterAt(this.position.x);
}
