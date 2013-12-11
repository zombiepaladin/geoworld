// Primary class for handling levels and, indirectly, the player

Level = function(tileMapObject) {
	this.tileEngine = new TileEngine(tileMapObject);
	// TODO: GENERALIZE SO THAT INITIALPOSITION CAN BE SET DEPENDING ON LEVEL
	var initialPosition = new Vector(100, 100);
	this.player = new Player(this, initialPosition);
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
	if (this.player.position.x <= midCanvasX || (this.tileEngine.scrollPosition.x != 0 && this.tileEngine.scrollPosition.x != rightClamp))
		// Clamp the camera position to prevent going off screen on the left side of map
		this.tileEngine.scrollPosition.x = Math.clamp(this.player.position.x, 0, rightClamp);	
	else if (this.player.position.x >= midCanvasX || (this.tileEngine.scrollPosition.x != 0 && this.tileEngine.scrollPosition.x != rightClamp)) 
		// Clamp the camera position to prevent going off screen on the right side of map
		this.tileEngine.scrollPosition.x = Math.clamp(this.player.position.x, 0, rightClamp);	
		
	// TODO: HANDLE THE CAMERA ON THE Y-AXIS
}

Level.prototype.render = function(timeStep, ctx) {
  this.tileEngine.render(timeStep, ctx);
  this.player.render(timeStep, ctx);
}

Level.prototype.getGroundLevelAt = function(x) {
	return this.tileEngine.getGroundLevelAt(x);
}

Level.prototype.isWaterAt = function(x) {
	return this.tileEngine.isWaterAt(x);
}