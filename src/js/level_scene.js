//A level scene, spawns the player and renders the scene
Level = function (tileMapObject) {
  Scene.call(this);

	this.tileEngine = new TileEngine(tileMapObject);

  // Spawn objects:
	var regions = []
	var playerWasSpawned = 0;
	for (var i = 0; i < this.tileEngine.getObjects().length; i++) {
	  var object = this.tileEngine.getObjects()[i];

    // Process regions after player is spawned:
	  if (object.properties.for != undefined && object.properties.for != "") {
	    if (window[object.properties.for] == undefined) {
	      console.warn("Level wants to associate a region with a entity type that does not exist! '%s'", object.properties.for);
	    }

	    regions.push(object);
	    continue;
	  }

	  // Attempt to spawn object:
	  if (window[object.name] == undefined) {
	    console.warn("Level wanted to spawn unknown object '%s'", object.name);
	    continue;
	  }

	  if (window[object.name].createFromLevel == undefined) {
	    console.warn("Level wanted to spawn object '%s' but that object does not support createFromLevel!", object.name);
	    continue;
	  }

	  var newObject = window[object.name].createFromLevel(object, this);

    // Identify special objects:
	  if (newObject instanceof Player) {
	    this.player = newObject;
	  }
	}

  // Loop through regions
	for (var i = 0; i < regions.length; i++) {
	  var region = regions[i];

	  for (var j = 0; j < this.children.length; j++) {
	    var child = this.children[j];

	    if (child instanceof window[region.properties.for]) {
	      if (child.giveRegion == undefined) {
	        console.warn("Region '%s' tried to asccoiate with a '%s' which does not support giveRegion!", region.name, region.properties.for);
	        continue;
	      }

	      child.giveRegion(region);
	    }
	  }
	}

  // Player spawning assurance / compatibility:
	if (this.player == undefined) {
	  console.warn("Warning: Player was not spawned when spawning level objects. Using old spawn method?");

	  var startX = parseInt(tileMapObject.properties.startX);
	  var startY = parseInt(tileMapObject.properties.startY);

	  if (isNaN(startX) || isNaN(startY)) {
	    startX = 30;
	    startY = 0;
	  }

	  var initialPosition = new Vector(startX, startY);
	
	  this.player = new Player(this, initialPosition, this);
	}

	this.cameraPosition = new Vector(0, 0);
	this.cameraScale = 1.0;
	this.cameraScaleInv = (1.0 / this.cameraScale);
}

Level.prototype = new Scene();
Level.prototype.constructor = Level;

// Updates player and camera position on the level
Level.prototype.update = function(timeStep, input) {
  //Move camera:
  this.cameraPosition.x = Math.clamp(this.player.position.x,
    Game.width / 2 * this.cameraScaleInv,
    (this.tileEngine.getLevelWidth() - Game.width / 2 * this.cameraScaleInv)
  );

  this.cameraPosition.y = Math.clamp(this.player.position.y,
    Game.height / 2 * this.cameraScaleInv,
    (this.tileEngine.getLevelHeight() - Game.height / 2 * this.cameraScaleInv)
  );

  this.tileEngine.setScrollPosition(new Vector(Game.width / 2 * this.cameraScaleInv - this.cameraPosition.x, Game.height / 2 * this.cameraScaleInv - this.cameraPosition.y));
}

Level.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.scale(this.cameraScale, this.cameraScale);
  this.tileEngine.render(timeStep, ctx,
    new Rect(
      this.cameraPosition.x - Game.width / 2 * this.cameraScaleInv,
      this.cameraPosition.y - Game.height / 2 * this.cameraScaleInv,
      Game.width * this.cameraScaleInv,
      Game.height * this.cameraScaleInv
    )
  );

  //Translate and render children
  ctx.translate(-this.cameraPosition.x + Game.width / 2 * this.cameraScaleInv, -this.cameraPosition.y + Game.height / 2 * this.cameraScaleInv);
  this.renderChildren(timeStep, ctx);
  ctx.restore();
}

Level.prototype.getLevelHeight = function () {
  return this.tileEngine.getLevelHeight();
}

Level.prototype.getGroundLevelAt = function(x, y) {
	return this.tileEngine.getGroundLevelAt(x, y);
}

Level.prototype.isGroundAt = function (x, y) {
  return this.tileEngine.isGroundAt(x, y);
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

Level.prototype.keyUp = function (event) {
  if (event.key == Keys.Escape) {
    Game.pushScene(new PauseScene());
    return true;
  }

  return false;
}
