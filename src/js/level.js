// Primary class for handling levels and, indirectly, the player

Level = function(game, tileMapObject) {
	this.tileEngine = new TileEngine(tileMapObject);

	var startX = parseInt(tileMapObject.properties.startX);
	var startY = parseInt(tileMapObject.properties.startY);
	var initialPosition = new Vector(startX, startY);
	var initialVelocity = new Vector(0, 0);
	
	this.player = new Player(game, initialPosition, initialVelocity, this);
}

// Updates player and camera position on the level
Level.prototype.update = function(timeStep, input) {
	this.player.update(timeStep, input);

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

Level.prototype.render = function(timeStep, ctx) {
  this.tileEngine.render(timeStep, ctx);
  this.player.render(timeStep, ctx);
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

Level.prototype.isDeathTileAt = function(x, y) {
	return this.tileEngine.isDeathTileAt(x, y);
}

Level.prototype.isFinished = function() {
	// Hackish: Check bottom of robot and the three tiles above it
	if (this.tileEngine.isEndAt(this.player.position.x, this.player.position.y) ||
		this.tileEngine.isEndAt(this.player.position.x, this.player.position.y - 23) ||
		this.tileEngine.isEndAt(this.player.position.x, this.player.position.y - 47) ||
		this.tileEngine.isEndAt(this.player.position.x, this.player.position.y - 71))
		return true;
	return false;
}

