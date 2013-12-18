TitleScreen = function () {
  Scene.call(this);

  this.selection = null;

  this.logo = new Image();
  this.logo.src = "geoworld_logo.png";

  this.enterText = new Image();
  this.enterText.src = "press_enter_to_play.png";

  // Used to know when to draw logos, only enterText for now
  this.clock = 0;
}

TitleScreen.prototype = new Scene();
TitleScreen.prototype.constructor = TitleScreen;

TitleScreen.prototype.update = function (timeStep) {
  this.clock += timeStep;
}

TitleScreen.prototype.keyUp = function (event) {
  if (event.key == Keys.Enter) {
    Game.pushScene(new Level(level_1_1));

    return true;
  }

  return false;
}

TitleScreen.prototype.render = function (timeStep, ctx) {
  // Draw logo
  ctx.drawImage(this.logo,
                0, 0, this.logo.width, this.logo.height,
               Game.width / 2 - this.logo.width / 2, 40, this.logo.width, this.logo.height
  );

  // Draw enterText after certain amount of time
  if (this.clock > 1500) {
    ctx.drawImage(this.enterText,
                0, 0, this.enterText.width, this.enterText.height,
                400, 160, this.enterText.width, this.enterText.height
    );
  }

  this.renderChildren(timeStep, ctx);
}
