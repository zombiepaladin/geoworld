//A level scene, spawns the player and renders the scene
Level = function (tileMapObject) {
  Scene.call(this);

	this.tileEngine = new TileEngine(tileMapObject);

  //TODO: Make this use a Tiled object or something similar...
	var startX = parseInt(tileMapObject.properties.startX);
	var startY = parseInt(tileMapObject.properties.startY);
	var initialPosition = new Vector(startX, startY);
	var initialVelocity = new Vector(0, 0);
	
	this.player = new Player(this, initialPosition, this);
}

Level.prototype = new Scene();
Level.prototype.constructor = Level;

// Updates player and camera position on the level
Level.prototype.update = function(timeStep, input) {
	var canvasWidth = document.getElementById("geoworld").scrollWidth;
	var canvasHeight = document.getElementById("geoworld").scrollHeight;
	var midCanvasX = canvasWidth / 2;
	var midCanvasY = canvasHeight / 2;
	// Far right of the map
	var rightClamp = (this.tileEngine.tilemap.layers[0].width - 1) * this.tileEngine.tilemap.tilewidth - canvasWidth;
	// Bottom of the map
	var bottomClamp = (this.tileEngine.tilemap.layers[0].height - 1) * this.tileEngine.tilemap.tileheight - canvasHeight;
	
	// Handles the camera on the x-axis
	// Clamp the camera position to prevent going off screen on the left and right of the map
	this.tileEngine.scrollPosition.x = Math.clamp(this.player.position.x - midCanvasX, 0, rightClamp);	
		
	// Handles the camera on the y-axis
	// Clamp the camera position to prevent going off screen on the top and bottom of the map
	this.tileEngine.scrollPosition.y = Math.clamp(this.player.position.y - midCanvasY, 0, bottomClamp);
}

Level.prototype.render = function (timeStep, ctx) {
  ctx.save();
  this.tileEngine.render(timeStep, ctx);
  ctx.translate(-this.tileEngine.scrollPosition.x, -this.tileEngine.scrollPosition.y);
  this.player.render(timeStep, ctx);
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

Level.prototype.isFinished = function() {
	return this.tileEngine.isEndAt(this.player.position.x, this.player.position.y);
}