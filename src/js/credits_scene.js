CreditsScreen = function () {
  Scene.call(this);

  this.top = 60;
  this.left = 100;
  this.textYDistance = 22;

  this.numDesigners = {
    "Phase1": 3, "Phase2": 2, "Phase3": 3, "Phase4": 3,
    "Phase5": 2, "Phase6": 3, "Phase7": 0, "Phase8": 4
  };

  this.developers = ["David Maas", "Robert Stewart", "Tyler Robinson",
            "Jan Kabelka", "Matej Dolezal",
            "Casey Mason", "Brendan Carney", "Adam Liebl",
            "Youg Jae Song", "Phillip Dugas", "Austin Goering",
            "Jonathan Kress", "Montana Grier",
            "Dalton Vonfeldt", "Chase Sinclair", "Grant Borthwick",
            "Eric Marlen", "Joung Kim", "Alex Roberts", "Kyle Hacek"];
}

CreditsScreen.prototype = new Scene();
CreditsScreen.prototype.constructor = CreditsScreen;

CreditsScreen.prototype.keyUp = function (event) {
  if (event.key == Keys.Enter || event.key == Keys.Escape) {
    Game.popScene();
    return true;
  }

  return false;
}

CreditsScreen.prototype.render = function (timeStep, ctx) {
  ctx.fillRect(0, 0, 800, 400);
  var currDevIndex = 0;
  var currSpace = 1;

  ctx.save();
  ctx.fillStyle = "red";
  ctx.font = "bold 18px Arial";
  // Phase One
  ctx.fillText("Phase One Design", this.left, this.top);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase1"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 10, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  // Phase Two
  ctx.fillText("Phase Two Design", this.left, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase2"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 10, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  // Phase Three
  ctx.fillText("Phase Three Design", this.left, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase3"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 10, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  // Phase Four
  ctx.fillText("Phase Four Design", this.left, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase4"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 10, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  // Phase Five
  currSpace = 1;
  ctx.fillText("Phase Five Design", this.left + 200, this.top);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase5"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 210, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  // Phase Six
  ctx.fillText("Phase Six Design", this.left + 200, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase6"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 210, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();

  /* Commented out since nobody has worked on this phase yet
  // Phase Seven
  ctx.fillText("Phase Seven Design", this.left + 200, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "blue";
    ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase7"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 210, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();
  */

  // Phase Eight
  ctx.fillText("Phase Eight Design", this.left + 200, this.top + this.textYDistance * currSpace++);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  for (i = 0; i < this.numDesigners["Phase8"]; i++) {
    ctx.fillText(this.developers[currDevIndex++], this.left + 210, this.top + this.textYDistance * currSpace++);
  }
  ctx.restore();


  // Developers
  ctx.fillText("Developers", this.left + 400, this.top);
  ctx.save();
  ctx.fillStyle = "white";
  ctx.font = "bold 12px Arial";
  // First Half
  for (i = 0; i < this.developers.length / 2; i++) {
    ctx.fillText(this.developers[i], this.left + 410, this.top + this.textYDistance * (i + 1));
  }
  // Second half
  for (i = 0; i < this.developers.length / 2 - 1; i++) {
    ctx.fillText(this.developers[i + 1 + this.developers.length / 2], this.left + 510, this.top + this.textYDistance * (i + 1));
  }
  ctx.restore();
  ctx.restore();

  this.renderChildren(timeStep, ctx);
}
