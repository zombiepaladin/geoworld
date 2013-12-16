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
TileEngine.prototype.setScrollPosition = function(position) {
  this.scrollPosition.x = position.x;
  this.scrollPosition.y = position.y;
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
  return this.getRawTileId(layer, x, y) & ~(0x80000000 | 0x40000000 | 0x20000000) - 1;
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

		  var ret = tileY * this.tileHeight - Math.lerp(left, right, percent);

		  Game.setDebugString("tile: @ " + tileX + ", " + tileY + " -- " + left + ".." + right + " : " + (tileY * this.tileHeight) + " - " + Math.lerp(left, right, percent) + " = " + ret + " @ " + percent);

		  return ret;
	  }
  }

  // If no ground tiles found, return the bottom of the map
  return this.mapHeight * this.tileHeight;
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
  return this.getTypeNear(this.groundLayer, x, y) == "water";
}

// Render the tilemap
//  timestep - the time between frames
//  ctx - the rendering context
TileEngine.prototype.render = function (timestep, ctx) {
  ctx.save();
  ctx.translate(-1 * this.scrollPosition.x, -1 * this.scrollPosition.y);

  var canvas = document.getElementById("geoworld");
  var tilewidth = this.tilemap.tilewidth;
  var tileheight = this.tilemap.tileheight;
  var width = Math.floor(canvas.scrollWidth / tilewidth) + 2;
  var height = Math.floor(canvas.scrollHeight / tileheight) + 2;
  var startX = Math.floor(this.scrollPosition.x / tilewidth);
  var startY = Math.floor(this.scrollPosition.y / tileheight);

  for (layer = 0; layer < this.tilemap.layers.length; layer++) {  // Painter's algorithm
    for (x = startX; x < width + startX; x++) {
      for (y = startY; y < height + startY; y++) {

        var tileId = this.tilemap.layers[layer].data[x + y * this.tilemap.layers[layer].width];
        var tileset = this.tilemap.tilesets[0];
        var tilesheet = this.tilesheetTextures[0];
        var rowWidth = Math.floor(tileset.imagewidth / tileset.tilewidth);

        // A tileID of 0 means there is nothing to draw
        if (tilesheet && tileId > 0) {
          var spacing = tileset.spacing;
          var flippedHorizontally = tileId & 0x80000000;
          var flippedVertically = tileId & 0x40000000;
          var flippedDiagonally = tileId & 0x20000000;
          tileId = tileId & ~(0x80000000 | 0x40000000 | 0x20000000);
          var tileIndex = tileId - tileset.firstgid;
          var tileX = tileIndex % rowWidth;
          var tileY = Math.floor(tileIndex / rowWidth);

          if (flippedHorizontally) {
            ctx.save();
            ctx.translate(x * tilewidth + tilewidth / 2, 0);
            ctx.scale(-1, 1);
            ctx.translate(-x * tilewidth - tilewidth / 2, 0);
            ctx.drawImage(tilesheet,
            //tileX, tileY, tilewidth, tileheight,
            (tileX * tilewidth) + (spacing * tileX), (tileY * tileheight) + (spacing * tileY), tilewidth, tileheight,
            (x * tilewidth), y * tileheight, tilewidth, tileheight
            );
            ctx.restore();
          } else if (flippedVertically) {
            ctx.save();
            ctx.translate(0, y * tileheight + tileheight / 2);
            ctx.scale(1, -1);
            ctx.translate(0, -y * tileheight - tileheight / 2);
            ctx.drawImage(tilesheet,
            //tileX, tileY, tilewidth, tileheight,
            tileX * tilewidth + (spacing * tileX), (tileY + 1) * tileheight + (spacing * tileY), tilewidth, -tileheight,
            x * tilewidth, y * tileheight, tilewidth, tileheight
            );
            ctx.restore();
          } else if (flippedDiagonally) {
            ctx.save();
            ctx.translate(x * tilewidth + tilewidth, y * tileheight + tileheight / 2);
            ctx.scale(-1, -1);
            ctx.translate(-x * tilewidth - tilewidth, -y * tileheight - tileheight / 2);
            ctx.drawImage(tilesheet,
            //tileX, tileY, tilewidth, tileheight,
            tileX * tilewidth + (spacing * tileX), tileY * tileheight + (spacing * tileY), tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth + 1, tileheight
            );
            ctx.restore();
          } else {
            ctx.drawImage(tilesheet,
            //tileX, tileY, tilewidth, tileheight,
            (tileX * tilewidth) + (spacing * tileX), (tileY * tileheight) + (spacing * tileY), tilewidth, tileheight,
            x * tilewidth, y * tileheight, tilewidth + 1, tileheight + 1
            );
          }
        }
      }
    }

  }

  ctx.restore();
}
