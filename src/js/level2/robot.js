// Constructs a Robot object
Robot = function (initialPosition, Game) {
  this.position = {
    x: initialPosition.x,
    y: initialPosition.y
  }
  this.gameEngine = Game;
  this.angle = Math.PI; // in radians
  this.spriteSheet = new Image();
  this.spriteSheet.src = "robot.png";
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
}

// Updates a robot 
// timeStep - the seconds having passed from the previous frame
// input - an object representing the player's input 
Robot.prototype.update = function (timeStep, input) {

  // Modify the robot's speed and angle based on player input
  if (input.left) {
    if (input.down)
      this.angle += timeStep * this.rotateSpeed;
    else
      this.angle -= timeStep * this.rotateSpeed;
  }
  if (input.right) {
    if (input.down)
      this.angle -= timeStep * this.rotateSpeed;
    else
      this.angle += timeStep * this.rotateSpeed;
  }
  if (input.up) {
    this.speed += timeStep * this.acceleration;
    if (this.speed > this.maxSpeed)
      this.speed = this.maxSpeed;
  }
  if (input.down) {
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
    this.gameEngine.moveAll(timeStep, -moveY);
  else if ((this.position.y < 120 && moveY < 0) || (this.position.y > 360 && moveY > 0)) {
    this.gameEngine.moveAll(timeStep, -moveY / 2);
    this.position.y += moveY / 2;
  }
  else
    this.position.y += moveY;

  // do not make robot float away
  if (this.position.x < 25)
    this.position.x = 25;
  if (this.position.x > 800 - 23)
    this.position.x = 800 - 23;
  if (this.position.y < 17)
    this.position.y = 17;
  if (this.position.y < this.gameEngine.waterLevel + 17)
    this.position.y = this.gameEngine.waterLevel + 17;
  if (this.position.y > 480 - 23)
    this.position.y = 480 - 23;
  if (this.position.y < this.gameEngine.waterLevel + 17) { // game over
    this.gameEngine.message = true;
    this.gameEngine.messageNr = 2;
  }

  // loose an air
  this.airLevel -= timeStep * this.airLosing;
  if (this.airLevel < 0) { // game over
    this.gameEngine.message = true;
    this.gameEngine.messageNr = 2;
  }
}

// Render the robot
//  timeStep - the seconds between the previous and current frame
//  ctx - the drawing context
Robot.prototype.render = function (timeStep, ctx) {
  if (this.spriteSheet) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    ctx.translate(-15, -15);
    ctx.drawImage(this.spriteSheet, 0, 0, 28, 64, 0, 0, 28, 64);
    ctx.restore();
  }
}