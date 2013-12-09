// Primary class for handling levels and, indirectly, the player

Level = function(levelFileName) {
	this.tileEngine = new TileEngine(levelFileName);
	this.player = new Player();
	
}

// Updates player and camera position on the level
Level.prototype.update = function(timeStep, input) {
	// TODO: NEED TO REWRITE PLAYER TO USE TILEENGINE
	this.player.update(timeStep, input, this.tileEngine);

	var canvasWidth = document.getElementById("game").scrollWidth;
	var midCanvas = canvasWidth/ 2;
	var rightClamp = (this.tileEngine.tilemap.layers[0].width - 1) * this.tileEngine.tilemap.tilewidth - canvasWidth;

	// TODO: MODIFY CAMERA BASED ON THE PLAYER'S NEW POSITION
	if (input.left) {
		if (this.player.position.x <= midCanvas || (this.tileEngine.scrollPosition.x != 0 && this.tileEngine.scrollPosition.x != rightClamp))
			// Clamp the camera position to prevent going off screen on the left side of map
			this.tileEngine.scrollPosition.x = clamp(this.tileEngine.scrollPosition.x - timeStep * currSpeed, 0, rightClamp);
		if (this.tileEngine.scrollPosition.x <= 0 || this.tileEngine.scrollPosition.x >= rightClamp) 
			this.position.x -= timeStep * currSpeed;
	}
	if (input.right) {
		if (this.player.position.x >= midCanvas || (this.tileEngine.scrollPosition.x != 0 && this.tileEngine.scrollPosition.x != rightClamp)) 
			// Clamp the camera position to prevent going off screen on the left side of map
			this.tileEngine.scrollPosition.x = clamp(this.tileEngine.scrollPosition.x + timeStep * currSpeed, 0, rightClamp);
			if (this.tileEngine.scrollPosition.x <= 0 || this.tileEngine.scrollPosition.x >= rightClamp) 
				this.position.x += timeStep * currSpeed;
	}
	
	
}