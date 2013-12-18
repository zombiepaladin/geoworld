Mososaur = function (initialParent, initialPosition, scene, fishType) {
  Entity.call(this, initialParent, initialPosition, scene);

  //Sprite
  this.spritesheet = new Image();
  this.spritesheet.src = "mosasaurSpritesheet.png";
  this.spriteWidth = Math.floor(1455 / 9) + 1;
  this.spriteHeight = 55;
  this.spriteHalfWidth = this.spriteWidth / 2;
  this.spriteHalfHeight = this.spriteHeight / 2;

  this.facingLeft = false;
  this.walktime = 0;

  this.left = this.position.x;
  this.right = this.position.x + 750;
  this.speed = 150;

  // Current animation frame to render
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };

}

Mososaur.prototype = new Entity();
Mososaur.prototype.constructor = Mososaur;

Mososaur.createFromLevel = function (info, scene) {
  return new Mososaur(scene, new Vector(info.x + info.width / 2, info.y + info.height / 2), scene);
}

// Update the player's sprite given the provided input
Mososaur.prototype.update = function (timeStep, input) {
  var seconds = timeStep / 1000; // Convert timestep to seconds

  if (this.position.x < this.left) {
    this.facingLeft = false;
  } else if (this.position.x > this.right) {
    this.facingLeft = true;
  }
  
  this.position.x += (this.facingLeft ? -1 : 1) * this.speed * seconds;

  // Determine the current frame of animation
  // Start with a "default" frame
  this.frame = {
    x: 0,
    y: 0,
    width: this.spriteWidth,
    height: this.spriteHeight
  };
  this.walktime = (this.walktime + timeStep) % 1000;
  var f = Math.floor(this.walktime / (1000 / 9));
  this.frame.y = 0
  this.frame.x = f * this.spriteWidth;
}

// Render the player's sprite using the provided context
Mososaur.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  if (this.facingLeft) {
    ctx.scale(-1, 1);
  }

  // Draw the sprite's current frame of animation
  ctx.drawImage(this.spritesheet,
    this.frame.x, this.frame.y, this.frame.width, this.frame.height,
    -this.spriteHalfWidth, -this.spriteHeight, this.spriteWidth, this.spriteHeight
  );

  ctx.restore();
}