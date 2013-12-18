DeathScene = function () {
  Scene.call(this);

  this.cursorSelect = 0;
  this.numChoices = 2;

  this.top = 100;
  this.left = 300;
  this.textYDistance = 80;
  this.cursor = new Image();
  this.cursor.src = "cursor.png";
}

DeathScene.prototype = new Scene();
DeathScene.prototype.constructor = DeathScene;

DeathScene.prototype.keyUp = function (event) {
  //Move selection:
  if (event.key == Keys.Up) {
    this.cursorSelect--;
  } else if (event.key == Keys.Down) {
    this.cursorSelect++;
  } else if (event.key == Keys.Enter) {
    //Restart:
    if (this.cursorSelect == 0) {
      Game.popScene();//Pop the death scene
      var oldLevel = Game.popScene();//pop + save level scene
      Game.pushScene(new Level(oldLevel.tileEngine.tilemap)); //Push new level scene with same tile map
    }
      //Quit:
    else if (this.cursorSelect == 1) {
      Game.popScene();//Pop the death scene
      Game.popScene();//Pop the level scene
    }
    else {
      assert(false);//Invalid selection
    }
  }
}

DeathScene.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.fillStyle = "red";
  ctx.font = "bold 60px Arial";
  ctx.fillText("FAILURE!!!!", 200, 50);
  ctx.fillStyle = "blue";
  ctx.font = "bold 30px Arial";
  ctx.fillText("Restart", this.left, this.top);
  ctx.fillText("Quit", this.left, this.top + this.textYDistance);

  ctx.drawImage(this.cursor, 0, 0, 47, 45, this.left - 70, this.top - 25 + (this.cursorSelect * this.textYDistance), 47, 45);

  this.renderChildren(timeStep, ctx);
  ctx.restore();
}