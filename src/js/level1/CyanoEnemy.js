CyanoEnemy = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);
  
  //Load sprite sheet
  this.spritesheet = new Image();
  this.spritesheet.src = "cyanobacteria.png";
  
  this.spriteWidth = 128;
  this.spriteHeight = 85;
  this.spriteHalfWidth = this.spriteWidth / 2;

  this.frame = 0;
  this.frameSpeed = 100;
  this.frameTimer = this.frameSpeed;
  this.frameCount = 40;
}

CyanoEnemy.prototype = new Entity();
CyanoEnemy.prototype.constructor = CyanoEnemy;

CyanoEnemy.createFromLevel = function (info, scene) {
  return new CyanoEnemy(scene, new Vector(info.x + info.width / 2, info.y + info.height), scene);
}

CyanoEnemy.prototype.update = function (timeStep) {
  //Update animation frame
  this.frameTimer -= timeStep;
  if (this.frameTimer <= 0) {
    this.frameTimer = this.frameSpeed;
    this.frame++;

    if (this.frame >= this.frameCount) {
      this.frame = 0;
    }
  }
  
}

CyanoEnemy.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);

  // Draw the current frame
  ctx.drawImage(this.spritesheet,
    0, this.frame * this.spriteHeight, this.spriteWidth, this.spriteHeight,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
