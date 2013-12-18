Phase2Scene = function () {
  Scene.call(this);

  this.robot = new Phase2Robot(this, new Vector(Game.width / 2, Game.height / 2), this);
  this.cameraPosition = 0; // only y axis

  // water
  this.waterLevel = 0;
  this.waterDecreasing = 0.03;
  this.waterDecreased = 0;
  this.waterDecreaseMax = 100;

  // bubbles
  this.bubble = new Image();
  this.bubble.src = "bubble.png";
  this.bubblesNum = 0;
  this.bubblesNumMax = 11;
  this.bubbles = [];
  for (var i = 0; i < this.bubblesNumMax; i++) {
    this.addBubble();
  }

  // lining
  this.lining = new Image();
  this.lining.src = "hoarfrost.png";

  // animals
  this.trilobite = new Image();
  this.trilobite.src = "trilobite.png";
  this.trilobiteCnt = 0;
  this.anomalocaris = new Image();
  this.anomalocaris.src = "anomalocaris.png";
  this.anomalocarisCnt = 0;
  this.pikaia = new Image();
  this.pikaia.src = "pikaia.png";
  this.pikaiaCnt = 0;
  this.animalsNum = 0;
  this.animalsNumMax = 5;
  this.animals = [];
  for (var i = 0; i < this.animalsNumMax; i++) {
    this.addAnimal();
  }
}

Phase2Scene.prototype = new Scene();
Phase2Scene.prototype.constructor = Phase2Scene;

Phase2Scene.prototype.update = function (timeStep) {
  //Move water
  this.waterLevel += timeStep * this.waterDecreasing;
  this.waterDecreased += timeStep * 0.03 * this.waterDecreasing;

  if (this.waterDecreased >= this.waterDecreaseMax) {
    this.win();
  }

  // check if bubbles are in, otherwise make new ones
  for (var i = 0; i < this.bubblesNum; i++) {
    if (this.bubbles[i].position.y < 0 || this.bubbles[i].position.y < this.waterLevel) {
      this.deleteBubble(i);
      this.addBubble();
    }
  }

  // check if animals are in, otherwise make new ones
  for (var i = 0; i < this.animalsNum; i++) {
    if (this.animals[i].position.y < this.waterLevel) { // animal is on the top of water, change its direction
      if (this.animals[i].angle <= 1) // (...;1>
        this.animals[i].angle = Math.PI - this.animals[i].angle;
      else if (this.animals[i].angle >= 5) // <5;...)
        this.animals[i].angle = 3 * Math.PI - this.animals[i].angle;
      else if (this.animals[i].angle < (3 * Math.PI / 2) && this.animals[i].angle > Math.PI / 2) // (1.5;4.5)
        this.animals[i].speed += 0.02;
      else if (this.animals[i].angle <= Math.PI) // (1;1.5>
        this.animals[i].angle += Math.PI / 3;
      else // <4,5;5)
        this.animals[i].angle -= Math.PI / 3;

    }
    else if (this.animals[i].position.x < -50 ||
             this.animals[i].position.x > (Game.width + 50) ||
             this.animals[i].position.y < 0 ||
             this.animals[i].position.y > (Game.height + 70)
      ) { // animal is out
      this.deleteAnimal(i);
      this.addAnimal();
    }
  }

  // collision of robot with bubble
  var robotX = this.robot.position.x;
  var robotY = this.robot.position.y;
  collisionWithin = (this.robot.headDiameter + this.bubbles[0].diameter) / 2;
  for (var i = 0; i < this.bubblesNum; i++) {
    if (Math.sqrt((this.bubbles[i].position.x - robotX) * (this.bubbles[i].position.x - robotX) +
               (this.bubbles[i].position.y - robotY) * (this.bubbles[i].position.y - robotY)) < collisionWithin) {
      this.robot.airLevel += this.bubbles[i].airProvided;
      this.deleteBubble(i);
      this.addBubble();
    }
  }
  // collision of robot with animal
  for (var i = 0; i < this.animalsNum; i++) {
    collisionWithin = (this.robot.headDiameter + this.animals[i].diameter) / 2;
    if (Math.sqrt((this.animals[i].position.x - robotX) * (this.animals[i].position.x - robotX) +
               (this.animals[i].position.y - robotY) * (this.animals[i].position.y - robotY)) < collisionWithin) {
      this.robot.airLevel += this.animals[i].airProvided;
      this.robot.maxSpeed += this.animals[i].maxSpeedChange;
      this.robot.acceleration += this.animals[i].accelerationChange;
      if (this.robot.acceleration < this.robot.minAcceleration)
        this.robot.acceleration = this.robot.minAcceleration;
      this.waterLevel += this.animals[i].waterLevelChange;
      this.waterDecreased += this.animals[i].waterLevelChange / 5;
      if (this.animals[i].stopRobot)
        this.robot.speed = 0;
      if (this.animals[i] instanceof Trilobite)
        this.trilobiteCnt++;
      else if (this.animals[i] instanceof Anomalocaris)
        this.anomalocarisCnt++;
      else if (this.animals[i] instanceof Pikaia)
        this.pikaiaCnt++;
      this.deleteAnimal(i);
      this.addAnimal();
    }
  }

  if (this.robot.airLevel > this.robot.airLevelMax)
    this.robot.airLevel = this.robot.airLevelMax;
}

Phase2Scene.prototype.render = function (timeStep, ctx) {
  ctx.save();

  //Draw water:
  ctx.fillStyle = "blue";
  ctx.fillRect(0, this.waterLevel, Game.width, Game.height - this.waterLevel);

  //Draw children:
  this.renderChildren(timeStep, ctx);

  //Draw border:
  ctx.drawImage(this.lining, 0, 0, this.lining.width, this.lining.height, 0, 0, this.lining.width, this.lining.height);

  //Draw HUD:
  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";

  ctx.fillText("Water level  0", 30, 30);
  ctx.strokeRect(135, 16, 150, 18);
  ctx.fillText("300 ft", 290, 30);
  var water = 150 - this.waterDecreased / this.waterDecreaseMax * 150;
  ctx.fillRect(135, 16, water, 18);

  ctx.fillText("Air level", 360, 30);
  ctx.strokeRect(430, 16, 150, 18);
  var air = this.robot.airLevel / this.robot.airLevelMax * 150;
  if (air > 150)
    air = 150;
  ctx.fillRect(430, 16, air, 18);

  ctx.translate(620, 0);
  ctx.drawImage(this.trilobite, 0, 0, this.trilobite.width, this.trilobite.height, 0, 16, 15, 23);
  ctx.translate(20, 0);
  ctx.fillText("x " + this.trilobiteCnt, 0, 33);
  ctx.translate(40, 0);
  ctx.drawImage(this.anomalocaris, 0, 0, this.anomalocaris.width, this.anomalocaris.height, 0, 16, 15, 23);
  ctx.translate(20, 0);
  ctx.fillText("x " + this.anomalocarisCnt, 0, 33);
  ctx.translate(35, 0);
  ctx.drawImage(this.pikaia, 0, 0, this.pikaia.width, this.pikaia.height, 0, 16, 15, 23);
  ctx.translate(20, 0);
  ctx.fillText("x " + this.pikaiaCnt, 0, 33);

  ctx.restore();
}

Phase2Scene.prototype.keyUp = function (event) {
  if (event.key == Keys.Escape) {
    Game.pushScene(new PauseScene());
    return true;
  }

  return false;
}

Phase2Scene.prototype.win = function () {
  Game.popScene();//Remove this level from the stack
  Game.pushScene(new FinishScene());//Push the end of level screen
}

Phase2Scene.prototype.moveAll = function (timeStep, moveStep) {
  this.cameraPosition += moveStep;
  this.waterLevel += moveStep;

  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i] == this.robot) {
      continue;
    }

    this.children[i].position.y += moveStep;
  }
}

Phase2Scene.prototype.addBubble = function () {
  if (this.bubblesNum >= this.bubblesNumMax) {
    return;
  }

  this.bubbles[this.bubblesNum] = new Bubble(this, this.scene, this.bubble);
  this.bubblesNum++;
}

Phase2Scene.prototype.deleteBubble = function (num) {
  if (this.bubblesNum < 1) {
    return;
  }

  this.bubbles[num].destroy();
  this.bubblesNum--;
  for (var i = num; i < this.bubblesNum; i++) {
    this.bubbles[i] = this.bubbles[i + 1];
  }
}

Phase2Scene.prototype.addAnimal = function () {
  if (this.animalsNum >= this.animalsNumMax) {
    return;
  }

  var x = Math.randomInt(0, 3);
  if (x == 0)
    this.animals[this.animalsNum] = new Trilobite(this, this.scene, this.trilobite, this.waterLevel);
  else if (x == 1)
    this.animals[this.animalsNum] = new Anomalocaris(this, this.scene, this.anomalocaris, this.waterLevel);
  else
    this.animals[this.animalsNum] = new Pikaia(this, this.scene, this.pikaia, this.waterLevel);
  this.animalsNum++;
}

Phase2Scene.prototype.deleteAnimal = function (num) {
  if (this.animalsNum < 1) {
    return;
  }

  this.animals[num].destroy();
  this.animalsNum--;
  for (var i = num; i < this.animalsNum; i++) {
    this.animals[i] = this.animals[i + 1];
  }
}
