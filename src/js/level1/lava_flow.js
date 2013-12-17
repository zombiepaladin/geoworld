LavaFlow = function (initialParent, scene) {
  Entity.call(this, initialParent, new Vector(0, 0), scene);

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
  
  Game.setDebugString(this.timeTillGoing.toString());

  if (this.isGoing()) {
    this.position.x += this.speed * seconds;

    if (this.scene.player.position.x < this.position.x - 50) {
      this.scene.player.kill();
    }
  }
  else {
    this.timeTillGoing -= seconds;
  }
}

LavaFlow.prototype.render = function (timeStep, ctx) {
  ctx.save();
  if (this.isGoing()) {
    ctx.fillStyle = "orange";
    ctx.fillRect(0, 0, this.position.x, this.scene.getLevelHeight());
  }

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
