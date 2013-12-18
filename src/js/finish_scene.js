FinishScene = function () {
  this.selection = null;
  this.clock = 0;
  this.displayTime = 5 * 1000;//5 seconds

  this.background = new Image();
  this.background.src = "FinishLevelBackground.png";
}

FinishScene.prototype = new Scene();
FinishScene.prototype.constructor = FinishScene;

FinishScene.prototype.endScene = function () {
  Game.popScene();
}

FinishScene.prototype.update = function (timeStep) {
  this.clock += timeStep;

  if (this.clock > this.displayTime) {
    this.endScene();
  }
}

FinishScene.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.drawImage(this.background, 0, 0, Game.width, Game.height);
  ctx.fillStyle = "red";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Level Completed!", 280, 100);
  ctx.restore();
}

FinishScene.prototype.keyUp = function (event) {
  if (event.key != Keys.Enter && event.key != Keys.Escape) {
    return false;
  }

  this.endScene();
  return true;
}
