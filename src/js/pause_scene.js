PauseScene = function () {
  this.cursorSelect = 0;
  this.numChoices = 2;

  this.top = 100;
  this.left = 300;
  this.textYDistance = 80;
  this.cursor = new Image();
  this.cursor.src = "cursor.png";
}

PauseScene.prototype = new Scene();
PauseScene.prototype.constructor = PauseScene;

PauseScene.prototype.keyUp = function (event) {
  //Move selection:
  if (event.key == Keys.Up) {
    this.cursorSelect--;
  } else if (event.key == Keys.Down) {
    this.cursorSelect++;
  } else if (event.key == Keys.Enter) {
    //Resume:
    if (this.cursorSelect == 0) {
      Game.popScene();
    }
    //Quit:
    else if (this.cursorSelect == 1) {
      Game.popScene();//Pop the pause scene
      Game.popScene();//Pop the level scene
    }
    else {
      assert(false);//Invalid selection
    }
  }
}

PauseScene.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.fillStyle = "blue";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Resume", this.left, this.top);
  ctx.fillText("Quit", this.left, this.top + this.textYDistance);

  ctx.drawImage(this.cursor, 0, 0, 47, 45, this.left - 70, this.top - 25 + (this.cursorSelect * this.textYDistance), 47, 45);

  this.renderChildren();
  ctx.restore();
}