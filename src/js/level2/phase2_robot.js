// Constructs a Robot object
Phase2Robot = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);

  this.angle = Math.PI; // in radians

  this.spriteSheet = new Image();
  this.spriteSheet.src = "robotPhase2.png";

  this.speed = 0;
  this.maxSpeed = 0.15;
  this.acceleration = 0.0004;
  this.minAcceleration = 0.0001;
  this.rotateSpeed = 0.0025;
  this.slowingDown = 0.0001;
  this.airLevelMax = 100;
  this.airLevel = 100;
  this.airLosing = 0.003;
  this.headDiameter = 15;

  this.inputLeft = false;
  this.inputRight = false;
  this.inputUp = false;
  this.inputDown = false;
}

Phase2Robot.prototype = new Entity();
Phase2Robot.prototype.constructor = Phase2Robot;

// Called when the player dies
Phase2Robot.prototype.kill = function () {
  Game.pushScene(new DeathScene(Phase2Scene));
}

// Updates a robot 
// timeStep - the seconds having passed from the previous frame
// input - an object representing the player's input 
Phase2Robot.prototype.update = function (timeStep) {

  // Modify the robot's speed and angle based on player input
  if (this.inputLeft) {
    if (this.inputDown)
      this.angle += timeStep * this.rotateSpeed;
    else
      this.angle -= timeStep * this.rotateSpeed;
  }
  if (this.inputRight) {
    if (this.inputDown)
      this.angle -= timeStep * this.rotateSpeed;
    else
      this.angle += timeStep * this.rotateSpeed;
  }
  if (this.inputUp) {
    this.speed += timeStep * this.acceleration;
    if (this.speed > this.maxSpeed)
      this.speed = this.maxSpeed;
  }
  if (this.inputDown) {
    this.speed -= timeStep * this.acceleration;
    if (this.speed < -this.maxSpeed)
      this.speed = -this.maxSpeed;
  }

  // slowing down
  if (this.speed > 0.001)
    this.speed -= timeStep * this.slowingDown;
  else if (this.speed < 0.001)
    this.speed += timeStep * this.slowingDown;

  // change the position either of robot or camera
  var moveX = timeStep * this.speed * Math.sin(this.angle);
  var moveY = -timeStep * this.speed * Math.cos(this.angle);
  this.position.x += moveX;
  if ((this.position.y < 50 && moveY < 0) || (this.position.y > 430 && moveY > 0))
    this.scene.moveAll(timeStep, -moveY);
  else if ((this.position.y < 120 && moveY < 0) || (this.position.y > 360 && moveY > 0)) {
    this.scene.moveAll(timeStep, -moveY / 2);
    this.position.y += moveY / 2;
  }
  else
    this.position.y += moveY;

  // do not make robot float away
  if (this.position.x < 25)
    this.position.x = 25;
  if (this.position.x > Game.width - 23)
    this.position.x = Game.width - 23;
  if (this.position.y < 17)
    this.position.y = 17;
  if (this.position.y < this.scene.waterLevel + 17)
    this.position.y = this.scene.waterLevel + 17;
  if (this.position.y > Game.height - 23)
    this.position.y = Game.height - 23;
  if (this.position.y < this.scene.waterLevel + 17) { // game over
    this.kill();
  }

  // loose an air
  this.airLevel -= timeStep * this.airLosing;
  if (this.airLevel < 0) { // game over
    this.kill();
  }
}

// Render the robot
//  timeStep - the seconds between the previous and current frame
//  ctx - the drawing context
Phase2Robot.prototype.render = function (timeStep, ctx) {
  if (this.spriteSheet) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.translate(-15, -15);
    ctx.drawImage(this.spriteSheet, 0, 0, 28, 64, 0, 0, 28, 64);
    ctx.restore();
  }
}

Phase2Robot.prototype.keyDown = function (event) {
  if (event.key == Keys.Left) {
    this.inputLeft = true;
    return true;
  }
  else if (event.key == Keys.Right) {
    this.inputRight = true;
    return true;
  }
  else if (event.key == Keys.Up) {
    this.inputUp = true;
    return true;
  }
  else if (event.key == Keys.Down) {
    this.inputDown = true;
    return true;
  }

  return false;
}

Phase2Robot.prototype.keyUp = function (event) {
  if (event.key == Keys.Left) {
    this.inputLeft = false;
    return true;
  }
  else if (event.key == Keys.Right) {
    this.inputRight = false;
    return true;
  }
  else if (event.key == Keys.Up) {
    this.inputUp = false;
    return true;
  }
  else if (event.key == Keys.Down) {
    this.inputDown = false;
    return true;
  }

  return false;
}

