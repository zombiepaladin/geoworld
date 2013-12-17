//Modifier for entities, adds physics to an entity
physics_modifier = function () {
  this.velocity = new Vector(0,0);
  this.maxVelocity = undefined;
  this.frictionConstant = 0;
  this.lastAcceleration = new Vector(0, 0);//Used to apply friction

  this.gravityScale = 1.0;

  this.hangTimeEnabled = false;
  this.hangTimeVelocityThreshold = 0;//The crossover of the Y velocity to start applying hang time
  this.hangTimeMinimum = 1.0;//As a percentage of world gravity

  this.accelerate = function (accelerationVector, scale) {
    if (scale === undefined) {
      scale = 1.0;
    }

    this.velocity.x += accelerationVector.x * scale;
    this.velocity.y += accelerationVector.y * scale;

    this.lastAcceleration.plusEquals(accelerationVector.scale(scale));
  }

  this.isOnGround = function () {
    return this.position.y >= this.scene.getGroundLevelAt(this.position.x, this.position.y);
  }

  this.isUnderWater = function () {
    return this.scene.isWaterAt(this.position.x, this.position.y - 3);//Check a little above current Y so we don't get ground at our feet
  }
  this.isOnAir = function () {
    return this.scene.isAirAt(this.position.x, this.position.y);
  }

  return function (timeStep) {
    var seconds = timeStep / 1000;

    //Ensure velocity is not NaN:
    assert(!isNaN(this.velocity.x));
    assert(!isNaN(this.velocity.y));

    //Limit velocity to maxVelocity
    if (this.maxVelocity) {
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
      var gravity = Game.physics.gravityConstant * this.gravityScale;

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

    // Apply current ground level in case of slopes
    if (this.isOnGround()) {
      this.position.y = this.scene.getGroundLevelAt(this.position.x, this.position.y);
    }

    //Reset values that are only valid in-between calls to update:
    this.lastAcceleration = new Vector(0, 0);
  };
}