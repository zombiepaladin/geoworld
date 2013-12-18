LevelSelectScene = function () {
  Scene.call(this);

  assert(levels_list);//Make sure the levels list is loaded before this scene is constructed

  //Selections will be 1-indexed because the levels are 1-indexed.
  this.phaseSelect = 1;
  this.subphaseSelect = 1;
  this.subphaseSelectMode = false;

  //The levels list will inlude an extra null for entry 0, but we use the last option for the credits button
  this.phaseSelectNumOptions = levels_list.length - 1 + 1;
  this.subphaseSelectNumOptions = 0;

  this.top = 50;
  this.left = 350;
  this.textYDistance = 45;
  this.background = new Image();
  this.background.src = "FutureBackground.png";
}

LevelSelectScene.prototype = new Scene();
LevelSelectScene.prototype.constructor = LevelSelectScene;

LevelSelectScene.prototype.moveCursor = function (direction) {
  if (this.subphaseSelectMode) {
    this.subphaseSelect += direction;

    if (this.subphaseSelect < 1) {
      this.subphaseSelect = this.subphaseSelectNumOptions;
    }
    if (this.subphaseSelect > this.subphaseSelectNumOptions) {
      this.subphaseSelect = 1;
    }
  }
  else {
    this.phaseSelect += direction;

    if (this.phaseSelect < 1) {
      this.phaseSelect = this.phaseSelectNumOptions;
    }
    if (this.phaseSelect > this.phaseSelectNumOptions) {
      this.phaseSelect = 1;
    }
  }
}

LevelSelectScene.prototype.keyUp = function (event) {
  var selectionDelta = 0;

  //Move selection:
  if (event.key == Keys.Up) {
    this.moveCursor(-1);
    return true;
  }
  else if (event.key == Keys.Down) {
    this.moveCursor(1);
    return true;
  }
  else if (event.key == Keys.Enter) {
    //Handle the selected option:
    if (!this.subphaseSelectMode) {
      //If they pressed credits:
      if (this.phaseSelect == this.phaseSelectNumOptions) {
        Game.pushScene(new CreditsScreen());
      }
      else if (levels_list[this.phaseSelect] != null) {//Only move to the phase selection screen if the level is actually available
        this.subphaseSelectMode = true;
        this.subphaseSelectNumOptions = levels_list[this.phaseSelect].length - 1;//Subtract 1 for the 0th phase that is not actually used.
      }
    }
    else {//else !this.subphaseSelectMode
      if (levels_list[this.phaseSelect][this.subphaseSelect] != null) {//If the phase is available
        level_data = window[levels_list[this.phaseSelect][this.subphaseSelect]];
        assert(level_data != undefined);//Level is not loaded!
        Game.replaceScene(new Level(level_data));
      }
    }

    return true;
  }
  else if (event.key == Keys.Escape) {
    //If they press escape, go back to the main menu or to the level select screen
    if (this.subphaseSelectMode) {
      this.subphaseSelectMode = false;
    } else {
      Game.popScene();
    }

    return true;
  }

  return false;
}

LevelSelectScene.prototype.render = function (timeStep, ctx) {
  ctx.save();

  // Draw background
  ctx.drawImage(this.background, 0, 0, Game.width, Game.height);

  //Draw phase select screen:
  if (!this.subphaseSelectMode) {
    var i;
    for (i = 1; i <= (this.phaseSelectNumOptions - 1) ; i++) {
      var isNotALevel = (levels_list[i] == null);

      //Determine text styling:
      //Draw selected phase differently
      if (this.phaseSelect == i) {
        ctx.fillStyle = "red";
        ctx.font = "bold 27px Arial";

        if (isNotALevel) {
          ctx.fillStyle = "maroon";
        }
      }
      else {
        ctx.fillStyle = "blue";
        ctx.font = "bold 25px Arial";

        if (isNotALevel) {
          ctx.fillStyle = "grey";
        }
      }

      ctx.fillText("Phase " + i, this.left, this.top + (this.textYDistance * (i - 1)));
    }

    // Credits button
    if (this.phaseSelect == this.phaseSelectNumOptions) {
      ctx.fillStyle = "red";
      ctx.font = "bold 27px Arial";
    } else {
      ctx.fillStyle = "green";
      ctx.font = "bold 25px Arial";
    }

    ctx.fillText("Credits", this.left + 300, this.top + (this.textYDistance * 7) + 30);
  }
  // Draw subphase choices
  else {
    // Loop through all the available subphases in the chosen phase
    for (i = 1; i <= this.subphaseSelectNumOptions; i++) {
      // Draw selected level differently
      //Determine text styling:
      //Draw selected phase differently
      if (this.subphaseSelect == i) {
        ctx.fillStyle = "red";
        ctx.font = "bold 27px Arial";
      }
      else {
        ctx.fillStyle = "blue";
        ctx.font = "bold 25px Arial";
      }

      //Grey out any phases with no level in them
      if (levels_list[this.phaseSelect][i] == null) {
        ctx.fillStyle = "grey";
      }

      ctx.fillText("Level " + i, this.left, this.top + (this.textYDistance * (i - 1)));
    }
  }
  ctx.restore();

  this.renderChildren(timeStep, ctx);
}
