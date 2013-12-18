TileAnimator = function () {
  this.tileFrame = 0;
  this.tileFrameMax = 1;
  this.tileAnimationSpeed = 0.25;
  this.tileAnimationTimer = this.tileAnimationSpeed;
}

//Default update function is good for 
TileAnimator.prototype.update = function (timeStep) {
  this.tileAnimationTimer -= timeStep / 1000;

  if (this.tileAnimationTimer < 0) {
    this.tileAnimationTimer = this.tileAnimationSpeed;
    this.tileFrame++;
    if (this.tileFrame > this.tileFrameMax) {
      this.tileFrame = 0;
    }
  }
}

//Override this
TileAnimator.prototype.translateTileId = function (tileId) {
  return tileId;
}
