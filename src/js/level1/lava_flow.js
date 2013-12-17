LavaFlow = function (initialParent, scene) {
  Entity.call(this, initialParent, new Vector(0, 0), scene);

  //Load sprites:
  this.sprites = [];
  this.sprites[0] = new Image();
  this.sprites[1] = new Image();
  this.sprites[2] = new Image();

  this.sprites[0].src = "Fire1.png";
  this.sprites[1].src = "Fire2.png";
  this.sprites[2].src = "Fire3.png";

  this.animationSpeed = 0.2;
  this.animationTimer = this.animationSpeed;
  this.frame = 0;
  this.lastFrame = 0;
  this.frameDir = 1;

  this.spriteWidth = 800;
  this.spriteHeight = 600;

  this.timeTillGoing = 2;//seconds
  this.speed = 150;
}

LavaFlow.prototype = new Entity();
LavaFlow.prototype.constructor = LavaFlow;

LavaFlow.createFromLevel = function (info, scene) {
  return new LavaFlow(scene, scene);
}

LavaFlow.prototype.isGoing = function () {
  return this.timeTillGoing <= 0.0;
}

LavaFlow.prototype.update = function (timeStep) {
  var seconds = timeStep / 1000;

  if (this.isGoing()) {
    this.position.x += this.speed * seconds;

    if (this.scene.player.position.x < this.position.x - 50) {
      this.scene.player.kill();
    }

    this.animationTimer -= seconds;
    if (this.animationTimer <= 0.0) {
      this.animationTimer = this.animationSpeed;
      this.lastFrame = this.frame;
      this.frame += this.frameDir;

      if (this.frame >= this.sprites.length) {
        this.frame -= 2;
        this.frameDir = -1;
      }

      if (this.frame < 0) {
        this.frame = 1;
        this.frameDir = 1;
      }
    }
  }
  else {
    this.timeTillGoing -= seconds;
  }
}

LavaFlow.prototype.drawFlow = function (ctx, frame) {
  spriteScale = this.scene.cameraFrame.height / this.spriteHeight;

  //Draw a streched first pixel column for when the flow is past the left side of the screen:
  ctx.drawImage(this.sprites[frame],
    0, 0, 1, this.spriteHeight,
    0, this.scene.cameraFrame.y, this.position.x - this.spriteWidth * spriteScale, this.spriteHeight * spriteScale
  );

  //Draw the actual lava flow:
  ctx.drawImage(this.sprites[frame],
    0, 0, this.spriteWidth, this.spriteHeight,
    this.position.x - this.spriteWidth * spriteScale, this.scene.cameraFrame.y, this.spriteWidth * spriteScale, this.spriteHeight * spriteScale
  );
}

LavaFlow.prototype.render = function (timeStep, ctx) {
  ctx.save();
  if (this.isGoing()) {
    this.drawFlow(ctx, this.frame);

    //Draw old frame super-imposed on the old one and fade it out with the animation timer time:
    ctx.globalAlpha = this.animationTimer / this.animationSpeed;
    this.drawFlow(ctx, this.lastFrame);
    this.globalAlpha = 1.0;
  }

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
