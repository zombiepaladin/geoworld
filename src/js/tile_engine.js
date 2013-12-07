TileEngine = function(tileMapObject) {
  var engine = this;
  this.tilemap = tileMapObject;
  this.tilesheets = [];
  this.layers = this.tilemap.layers;  // Number of layers
  this.scrollPosition = {x: 0, y: 0};

  // Load the tileset images
  tilemapObject.tilesets.forEach(
  
    // For every tileset in array, we will load the corresponding
    // image and place it in the tilesheets array.
    function loadTileset(tileset, index, array) {
    
      var image = new Image();
      // The onload function adds the current object (the image)
      // to the tilesheet array at position <index>
      image.onload = function() {
        engine.tilesheets[index] = this;
      }
      image.src = tileset.image;
    }
  );
  
}

// Set the current scrolling position for the tile engine
//   position - the position, an object with an x and y property
TileEngine.prototype.setScrollPosition = function(position) {
  this.scrollPosition.x = position.x;
  this.scrollPosition.y = position.y;
}

// Calculate height based on x position
TileEngine.prototype.getGroundLevelAt = function(x) {
  var mapWidth = this.tilemap.layers[0].width;
  var mapHeight = this.tilemap.layers[0].height;
  var tileHeight = this.tilemap.tileheight;
  var groundLevel = mapHeight * tileHeight;
  var tileX = Math.floor((x + this.scrollPosition.x) / this.tilemap.tilewidth);
  var yCutoff = 18 ; // Pixels that tiles cutoff at top of screen, constant in this game  
  
  // Loop down through the current x below the player until a ground tile is reached
  for (y = Math.floor(this.scrollPosition.y / tileHeight); y < mapHeight; y++) {
	var currTile = this.tilemap.layers[0].data[tileX + y * mapWidth];
	var flippedHorizontally = currTile & 0x80000000;
	currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
    
	// Not handled since they shouldn't be used for ground tiles
	//var flippedVertically = currTile & 0x40000000;
    //var flippedDiagonally = currTile & 0x20000000;
	
	// Ground tile
	if (currTile === 5 || currTile >= 9) {
		//console.log(this.tilemap.tilesets[0].tileproperties);
		var y0 = parseFloat(this.tilemap.tilesets[0].tileproperties[currTile - 1].left);
		var y1 = parseFloat(this.tilemap.tilesets[0].tileproperties[currTile - 1].right);
		var x0 = 0;
		var x1 = this.tilemap.tilewidth;
		var xWidth = (x + this.scrollPosition.x) - tileX * this.tilemap.tilewidth;
		var xHeight;
		
		// Linear interpolation
		if (flippedHorizontally) 
		  xHeight = y1 + (y0 - y1) * ((xWidth - x0)/(x1 - x0));
		else xHeight = y0 + (y1 - y0) * ((xWidth - x0)/(x1 - x0));

		groundLevel = y * tileHeight - xHeight - yCutoff;
		break;
	}
  }
  return groundLevel;
}

// Checks if the ground tile at the specified location contains water
TileEngine.prototype.isWaterAt = function(x, y) {
  var tileX = Math.floor((x + this.scrollPosition.x) / this.tilemap.tilewidth);
  var tileY = Math.floor((y + this.scrollPosition.y + 20) / this.tilemap.tileheight);
  var currTile = this.tilemap.layers[0].data[tileX + tileY * this.tilemap.layers[0].width];
  currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
  if (currTile === 15 || currTile === 16) return true;
  return false;
}

// Checks if the ground tile at the specified location contains mud
TileEngine.prototype.isMudAt = function(x, y) {
  var tileX = Math.floor((x + this.scrollPosition.x) / this.tilemap.tilewidth);
  var tileY = Math.floor((y + this.scrollPosition.y + 23) / this.tilemap.tileheight);
  var currTile = this.tilemap.layers[0].data[tileX + tileY * this.tilemap.layers[0].width];
  currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
  if (currTile === 13 || currTile === 14) return true;	
  return false;
}

// Render the tilemap
//  timestep - the time between frames
//  ctx - the rendering context
TileEngine.prototype.render = function(timestep, ctx) {  
  ctx.save();
  ctx.translate(-1 * this.scrollPosition.x, -1 * this.scrollPosition.y);
  
  var canvas = document.getElementById("game");  
  var tilewidth = this.tilemap.tilewidth;
  var tileheight = this.tilemap.tileheight;
  var width = Math.floor(canvas.scrollWidth / tilewidth) + 2;
  var height = Math.floor(canvas.scrollHeight / tileheight) + 1;
  var startX = Math.floor(this.scrollPosition.x / tilewidth);
  var startY = Math.floor(this.scrollPosition.y / tileheight);
  
  for (layer = 0; layer < this.layers; layer++) {  // Painter's algorithm
	  for(x = startX; x < width + startX; x++) {
		for(y = startY; y < height + startY; y++) {
		  
		  var tileId = this.tilemap.layers[layer].data[x + y * this.tilemap.layers[layer].width];
		  var tileset = this.tilemap.tilesets[0];
		  var tilesheet = this.tilesheets[0];
		  var rowWidth = Math.floor(tileset.imagewidth / tileset.tilewidth);
		  
		  if(tilesheet) {
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
				(tileX * tilewidth) + 1, (tileY * tileheight) + 1, tilewidth - 2, tileheight - 1,
				(x * tilewidth) - 1, y * tileheight, tilewidth + 1, tileheight + 2
			  );
			  ctx.restore();
			} else if(flippedVertically) {
			  ctx.save();
			  ctx.translate(0, y * tileheight + tileheight / 2);
			  ctx.scale(1, -1);
			  ctx.translate(0, -y * tileheight - tileheight / 2);
			  ctx.drawImage(tilesheet, 
				//tileX, tileY, tilewidth, tileheight,
				tileX * tilewidth, (tileY + 1) * tileheight, tilewidth, -tileheight,
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
				tileX * tilewidth, tileY * tileheight, tilewidth, tileheight,
				x * tilewidth, y * tileheight, tilewidth + 1, tileheight
			  );
			  ctx.restore();
			} else {
			  ctx.drawImage(tilesheet, 
				//tileX, tileY, tilewidth, tileheight,
				(tileX * tilewidth) + 1, (tileY * tileheight) + 1, tilewidth - 1, tileheight - 1,
				x  * tilewidth, y * tileheight, tilewidth + 1, tileheight + 1
			  );
			}
		  }      
	  }
    }  
    
  }
  
  ctx.restore();
}
  