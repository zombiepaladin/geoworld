BlobEnemy = function (initialParent, initialPosition, scene, left, right) {
  Entity.call(this, initialParent, initialPosition, scene);

  this.left = left;
  this.right = right;

  this.initialY = this.position.y;

  //Load sprite sheet
  this.spritesheet = new Image();
  this.spritesheet.src = "EukaryBlob.png";

  this.spriteWidth = 130;
  this.spriteHeight = 128;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.scale = 0.5;

  this.left += this.spriteHalfWidth * this.scale;
  this.right -= this.spriteHalfWidth * this.scale;

  this.direction = 1;
  this.speed = 50;

  this.animScale = 1.0;
  this.animSpeed = 3.0;
}

BlobEnemy.prototype = new Entity();
BlobEnemy.prototype.constructor = BlobEnemy;

BlobEnemy.createFromLevel = function (info, scene) {
  return new BlobEnemy(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene, info.x, info.x + info.width);
}

BlobEnemy.prototype.update = function (timeStep) {
  //Move
  this.animScale = Math.clamp(this.animScale + this.animSpeed * this.direction * (timeStep / 1000), -1.0, 1.0);

  if (Math.abs(this.animScale) + Math.EPSILON >= 1.0) {
    this.position.x += this.direction * this.speed * (timeStep / 1000);

    if (this.direction < 0 && this.position.x < this.left) {
      this.position.x = this.left;
      this.direction = 1;
    }
    else if (this.direction > 0 && this.position.x > this.right) {
      this.position.x = this.right;
      this.direction = -1;
    }

    this.position.y = this.scene.getGroundLevelAt(this.position.x, this.initialY);
  }
}

BlobEnemy.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.scale(this.animScale, 1.0);

  // Draw the current frame
  ctx.drawImage(this.spritesheet,
    0, 0, this.spriteWidth, this.spriteHeight,
    -this.spriteHalfWidth * this.scale, -this.spriteHeight * this.scale, this.spriteWidth * this.scale, this.spriteHeight * this.scale
  );

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
