//A level scene, spawns the player and renders the scene
Level = function (tileMapObject) {
  Scene.call(this);

	this.tileEngine = new TileEngine(tileMapObject);

  //TODO: Make this use a Tiled object or something similar...
	var startX = parseInt(tileMapObject.properties.startX);
	var startY = parseInt(tileMapObject.properties.startY);
	var initialPosition = new Vector(startX, startY);
	
	this.player = new Player(this, initialPosition, this);

	this.cameraPosition = new Vector(0, 0);
}

Level.prototype = new Scene();
Level.prototype.constructor = Level;

// Updates player and camera position on the level
Level.prototype.update = function(timeStep, input) {
  //Move camera:
  this.cameraPosition.x = Math.clamp(this.player.position.x,
    Game.width / 2,
    (this.tileEngine.getLevelWidth() - Game.width / 2)
  );

  this.cameraPosition.y = Math.clamp(this.player.position.y,
    Game.height / 2,
    (this.tileEngine.getLevelHeight() - Game.height / 2)
  );

  this.tileEngine.setScrollPosition(new Vector(Game.width / 2 - this.cameraPosition.x, Game.height / 2 - this.cameraPosition.y));
}

Level.prototype.render = function (timeStep, ctx) {
  ctx.save();
  this.tileEngine.render(timeStep, ctx);

  //Translate and render children
  ctx.translate(-this.cameraPosition.x + Game.width / 2, -this.cameraPosition.y + Game.height / 2);
  this.renderChildren(timeStep, ctx);
  ctx.restore();
}

Level.prototype.getGroundLevelAt = function(x, y) {
	return this.tileEngine.getGroundLevelAt(x, y);
}

Level.prototype.isWaterAt = function(x, y) {
	return this.tileEngine.isWaterAt(x, y);
}
Level.prototype.isAirAt = function(x, y) {
	return this.tileEngine.isAirAt(x, y);
}
Level.prototype.isHazzardAt = function(x, y){
	return this.tileEngine.isHazzardAt(x, y);
}
Level.prototype.isFinished = function() {
	return this.tileEngine.isEndAt(this.player.position.x, this.player.position.y);
}