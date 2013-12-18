Phase2StartScreenScene = function () {
  Scene.call(this);

  this.background = new Image();
  this.background.src = "phase2_start.png";
}

Phase2StartScreenScene.prototype = new Scene();
Phase2StartScreenScene.prototype.constructor = Phase2StartScreenScene;

Phase2StartScreenScene.prototype.keyUp = function (event) {
  Game.replaceScene(new Phase2Scene());
}

Phase2StartScreenScene.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.drawImage(this.background, 0, 0, Game.width, Game.height);
  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
