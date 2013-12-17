// Handles the rendering of the level

TileEngine = function(tileMapObject) {
  var thisEngine = this;
  this.tilemap = tileMapObject;
  this.scrollPosition = new Vector(0, 0);
  
  assert(this.tilemap.layers.length > 0);//Assert there is at least one layer in the tile map

  //Pull out some commonly used varaibles:
  this.mapWidth = this.tilemap.width;
  this.mapHeight = this.tilemap.height;
  this.tileWidth = this.tilemap.tilewidth;
  this.tileHeight = this.tilemap.tileheight;

  // Identifify special layers:
  this.groundLayer = -1;
  this.airLayer = -1;
  this.objectLayer = -1;
  this.tilemap.layers.forEach(function (layer, i) {
    //Ensure consistency of tile map:
    assert(layer.width == thisEngine.mapWidth);
    assert(layer.height == thisEngine.mapHeight);

    //Find ground layer:
    if (layer.name === "Ground") {
      assert(thisEngine.groundLayer == -1);
      thisEngine.groundLayer = i;
    }

    //Find air layer:
    if (layer.name === "Air" || layer.name == "Sky") {
      assert(thisEngine.airLayer == -1);
      thisEngine.airLayer = i;
    }

    //Find object layer
    if (layer.objects !== undefined) {
      assert(thisEngine.objectLayer == -1);
      thisEngine.objectLayer = i;
    }
  });

  assert(this.groundLayer >= 0);//A ground layer is required.
  
  // Load the tileset images
  this.tilesheetTextures = [];
  tileMapObject.tilesets.forEach(function(tileset, index) {
    var image = new Image();
    image.src = tileset.image.substring(tileset.image.lastIndexOf('/') + 1);
    thisEngine.tilesheetTextures[index] = image;
  });
}

// Set the current scrolling position for the tile engine
//   position - the position, an object with an x and y property
TileEngine.prototype.setScrollPosition = function (position) {
  assert(!isNaN(position.x));
  assert(!isNaN(position.y));
  this.scrollPosition.x = Math.floor(position.x);
  this.scrollPosition.y = Math.floor(position.y);
}

TileEngine.prototype.getObjects = function () {
  if (this.objectLayer < 0) {
    return [];
  }

  return this.tilemap.layers[this.objectLayer].objects;
}

TileEngine.prototype.getLevelWidth = function () {
  return this.mapWidth * this.tileWidth;
}

TileEngine.prototype.getLevelHeight = function () {
  return this.mapHeight * this.tileHeight;
}

TileEngine.prototype.getRawTileId = function (layer, x, y) {
  return this.tilemap.layers[layer].data[x + y * this.mapWidth];
}

TileEngine.prototype.isTileFlippedHorizontally = function (layer, x, y) {
  return (this.getRawTileId(layer, x, y) & 0x80000000) != 0;
}

TileEngine.prototype.isTileFlippedVertically = function (layer, x, y) {
  return (this.getRawTileId(layer, x, y) & 0x40000000) != 0;
}

TileEngine.prototype.isTileFlippedDiagonally = function (layer, x, y) {
  return (this.getRawTileId(layer, x, y) & 0x20000000) != 0;
}

TileEngine.prototype.getTileId = function (layer, x, y) {
  //We subtract 1 because Tiled exports with 1-indexed tile ids.
  //This means -1 will be 'no tile' and 0..n will be a tile index.
  return (this.getRawTileId(layer, x, y) & ~(0x80000000 | 0x40000000 | 0x20000000)) - 1;
}

TileEngine.prototype.getTileX = function (x) {
  return Math.floor(x / this.tilemap.tilewidth);
}

TileEngine.prototype.getTileY = function (y) {
  return Math.floor(y / this.tilemap.tileheight);
}

TileEngine.prototype.getTileIdNear = function (layer, worldX, worldY) {
  return this.getTileId(layer, this.getTileX(worldX), this.getTileY(worldY));
}

TileEngine.prototype.getTypeAt = function (layer, x, y) {
  var tileId = this.getTileId(layer, x, y);
  if (tileId < 0 || !this.tilemap.tilesets[0].tileproperties[tileId]) { return ""; }
  return this.tilemap.tilesets[0].tileproperties[tileId].type;
}

TileEngine.prototype.getTypeNear = function (layer, worldX, worldY) {
  var tileId = this.getTileIdNear(layer, worldX, worldY);
  if (tileId < 0 || !this.tilemap.tilesets[0].tileproperties[tileId]) { return ""; }
  return this.tilemap.tilesets[0].tileproperties[tileId].type;
}

TileEngine.prototype.getPropertiesAt = function (layer, x, y) {
  var tileId = this.getTileId(layer, x, y);
  if (tileId < 0 || !this.tilemap.tilesets[0].tileproperties[tileId]) { return undefined; }
  return this.tilemap.tilesets[0].tileproperties[tileId];
}

TileEngine.prototype.getPropertiesNear = function (layer, worldX, worldY) {
  var tileId = this.getTileIdNear(layer, worldX, worldY);
  if (tileId < 0 || !this.tilemap.tilesets[0].tileproperties[tileId]) { return undefined; }
  return this.tilemap.tilesets[0].tileproperties[tileId];
}

// Calculate height based on absolute x position, below y position
TileEngine.prototype.getGroundLevelAt = function(worldX, worldY) {
  var tileX = this.getTileX(worldX);
  // Loop down through the current x that player is on until a ground tile is reached
  for (var tileY = this.getTileY(worldY) - 1; tileY < this.mapHeight; tileY++) {
    if (this.getTypeAt(this.groundLayer, tileX, tileY) == "ground") {
      //console.log(this.tilemap.tilesets[0].tileproperties);
      var tileProperties = this.getPropertiesAt(this.groundLayer, tileX, tileY);

		  var left = parseFloat(tileProperties.left);
		  var right = parseFloat(tileProperties.right);
		  
		  if (this.isTileFlippedHorizontally(this.groundLayer, tileX, tileY)) {
		    var temp = left;
		    left = right;
		    right = temp;
		  }

		  var percent = (worldX - tileX * this.tileWidth) / this.tileWidth;

		  var ret = tileY * this.tileHeight + Math.lerp(left, right, percent);

		  return ret;
	  }
  }

  // If no ground tiles found, return the bottom of the map
  return this.mapHeight * this.tileHeight;
}

// Checks if the ground tile at the specified location is ground
TileEngine.prototype.isGroundAt = function (x, y) {
  if (y > this.getLevelHeight()) {//Points below the level are always considered ground
    return true;
  }

  return this.getTypeNear(this.groundLayer, x, y) == "ground";
}

// Checks if the tile at the specified location is the end (portal)
TileEngine.prototype.isEndAt = function (x, y) {
  return this.getTypeNear(this.groundLayer, x, y) == "portal";
}

// Checks if the tile at the specified location is on air
TileEngine.prototype.isAirAt = function(x, y) {
  if (this.airLayer < 0) {
    return false;
  }

  return this.getTypeNear(this.airLayer, x, y) == "air";
}

// Checks if the ground tile at the specified location contains water
TileEngine.prototype.isWaterAt = function(x, y) {
  var prop = this.getPropertiesNear(this.groundLayer, x, y);
  if (prop === undefined) { return false; }
  return prop.water == "true" || prop.type == "water";
}

TileEngine.prototype.isHazzardAt = function(x, y){
	var prop = this.getPropertiesNear(this.groundLayer, x, y);
	if(prop === undefined) {return false;}
	return prop.isHazzard == "true";
}

// Render the tilemap
//  timestep - the time between frames
//  ctx - the rendering context
TileEngine.prototype.render = function (timestep, ctx, frame) {
  ctx.save();
  ctx.translate(this.scrollPosition.x, this.scrollPosition.y);

  //Handle optional frame argument:
  if (frame === undefined) {
    frame = new Rect(0, 0, this.getLevelWidth(), this.getLevelHeight());
  }

  var startX = this.getTileX(frame.x);
  var startY = this.getTileY(frame.y);
  var endX = this.getTileX(frame.x + frame.width) + 1;
  var endY = this.getTileY(frame.y + frame.height) + 1;

  if (startX < 0) { startX = 0; }
  if (startY < 0) { startY = 0; }
  if (endX >= this.mapWidth) { endX = this.mapWidth - 1; }
  if (endY >= this.mapHeight) { endY = this.mapHeight - 1; }

  var tilewidth = this.tileWidth;
  var tileheight = this.tileHeight;

  var tilesDrawn = 0;

  console.log(startX, endX, ",", startY, endY);

  for (var layer = 0; layer < this.tilemap.layers.length; layer++) {
    if (layer == this.objectLayer) { continue; }

    for (var x = startX; x <= endX; x++) {
      for (var y = startY; y <= endY; y++) {
        
        var tileId = this.getTileId(layer, x, y);
        var tileset = this.tilemap.tilesets[0];
        var tilesheet = this.tilesheetTextures[0];
        var rowWidth = Math.floor(tileset.imagewidth / tileset.tilewidth);
        
        if (!tilesheet || tileId < 0) {
          continue;
        }

        tilesDrawn++;

        var spacing = tileset.spacing;
        var tileX = tileId % rowWidth;
        var tileY = Math.floor(tileId / rowWidth);

        tileX = tileX * tilewidth + spacing * tileX;
        tileY = tileY * tileheight + spacing * tileY;
        
        if (this.isTileFlippedHorizontally(layer, x, y)) {
          ctx.save();
          ctx.translate(x * tilewidth + tilewidth / 2, 0);
          ctx.scale(-1, 1);
          ctx.translate(-x * tilewidth - tilewidth / 2, 0);
          ctx.drawImage(tilesheet, 
            tileX, tileY, tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth, tileheight
          );
          ctx.restore();
        } else if(this.isTileFlippedVertically(layer, x, y)) {
          ctx.save();
          ctx.translate(0, y * tileheight + tileheight / 2);
          ctx.scale(1, -1);
          ctx.translate(0, -y * tileheight - tileheight / 2);
          ctx.drawImage(tilesheet, 
            tileX, tileY, tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth, tileheight
          );         
          ctx.restore();
        } else if (this.isTileFlippedDiagonally(layer, x, y)) {
          ctx.save();
          ctx.translate(x * tilewidth + tilewidth, y * tileheight + tileheight / 2);
          ctx.scale(-1, -1);
          ctx.translate(-x * tilewidth - tilewidth, -y * tileheight - tileheight / 2);
          ctx.drawImage(tilesheet, 
            tileX, tileY, tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth, tileheight
          );
          ctx.restore();
        } else {
          ctx.drawImage(tilesheet, 
            tileX, tileY, tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth, tileheight
          );
        }

        // Debugging overlay:
        if (layer == this.groundLayer && false) {
          ctx.save();
          ctx.font = "8px sans-serif";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeRect(x * tilewidth, y * tileheight, tilewidth, tileheight);
          ctx.fillText(tileId + (this.isTileFlippedHorizontally(layer, x, y) ? "F": ""),
            (x + 0.5) * tilewidth, (y + 0.5) * tileheight);
          ctx.restore();
        }
      } //Y loop
    } // X loop
  } // Layer loop
  Game.setDebugString(tilesDrawn.toString() + " Tiles Drawn");

  ctx.restore();
}
