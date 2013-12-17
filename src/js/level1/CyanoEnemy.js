CyanoEnemy = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);
  
  //Load sprite sheet
  this.spritesheet = new Image();
  this.spritesheet.src = "cyanobacteria.png";
  
  this.spriteWidth = 124;
  this.spriteHeight = 93;
  this.spriteHalfWidth = this.spriteWidth / 2;
  
  this.frame = {
    x: 0,
    y: 0,
    width: 124,
    height: 93,
    number: 0
  };
  this.frameTimer = 0.02;
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
    this.frameTimer = 300;
    this.frame.number++;
    if (this.frame.number > 39) this.frame.number = 0;
  }
  
}

CyanoEnemy.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);

  // Draw the current frame
  this.frame.y = this.frame.number * this.spriteHeight;
  ctx.drawImage(this.spritesheet, this.frame.x, this.frame.y, 
                this.frame.width, this.frame.height, 
                -this.spriteHalfWidth, -this.spriteHeight, 
                this.spriteWidth, this.spriteHeight);

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
