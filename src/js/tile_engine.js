// Handles the rendering of the level

TileEngine = function(tileMapObject) {
  var engine = this;
  this.tilemap = tileMapObject;
  // TODO: HANDLE MULTIPLE TILESHEETS ON A SINGLE LEVEL (NECESSARY?)
  this.tilesheets = [];
  this.layers = this.tilemap.layers.length;  // Number of layers
  this.scrollPosition = {x: 0, y: 0};
  this.background;
  
  //Paralaxed backgorund add backgroundsrc prop in json file
  var backgroundimg = new Image();
  backgroundimg.onload = function() {
   engine.background = this;
  }
  backgroundimg.src = this.tilemap.backgroundsrc;
  
  this.tileanimation = 15;
  this.switchtile = false;
  this.validanimationmap=this.tilemap.valid;

  
  // Find the ground layer
  // Checks for undefined later to tell if ground or air layer exists
  for (var i = 0; i < this.layers; i++) {
	if (this.tilemap.layers[i].name === "Ground") {
	  this.groundLayer = i;
	}
	if (this.tilemap.layers[i].name === "Air") {
	  this.airLayer = i;
	}
  }
  
  // Load the tileset images
  tileMapObject.tilesets.forEach(
  
    // For every tileset in array, we will load the corresponding
    // image and place it in the tilesheets array.
    function loadTileset(tileset, index, array) {
    
      var image = new Image();
      // The onload function adds the current object (the image)
      // to the tilesheet array at position <index>
      image.onload = function() {
        engine.tilesheets[index] = this;
      }
	  
	    //Don't change this to use a specific path, use node make!!!
      image.src = tileset.image.substring(tileset.image.lastIndexOf('/')+1);
    }
  );
}

TileEngine.prototype.getAlternateTile = function(id) {
	if (this.validanimationmap===1)
	{
	switch(id)
		{
			case 1:
				id=4;
				break;
			case 2:
				id=5;
				break;
			case 3:
				id=6;
				break;
			case 8:
				id=11;
				break;
			case 9:
				id=12;
				break;
			case 10:
				id=13;
				break;
			case 15:
				id=18;
				break;
			case 16:
				id=19;
				break;
			case 17:
				id=20;
				break;
		}
	}
	return id;
}

TileEngine.prototype.Alternate = function() {
		if(this.tileanimation<0)
			{
				this.tileanimation=15;
				if(this.switchtile===true)
				{
					this.switchtile=false;
				}
				else
				{
					this.switchtile=true;
				}
			}
		else
			{
				this.tileanimation--;
			}
}

// Set the current scrolling position for the tile engine
//   position - the position, an object with an x and y property
TileEngine.prototype.setScrollPosition = function(position) {
  this.scrollPosition.x = position.x;
  this.scrollPosition.y = position.y;
}

// Calculate height based on absolute x position, below y position
TileEngine.prototype.getGroundLevelAt = function(absX, absY) {
  var mapWidth = this.tilemap.layers[this.groundLayer].width;
  var mapHeight = this.tilemap.layers[this.groundLayer].height;
  var tileHeight = this.tilemap.tileheight;
  var groundLevel = mapHeight * tileHeight;
  var tileX = Math.floor(absX / this.tilemap.tilewidth); 
  
  // Loop down through the current x that player is on until a ground tile is reached
  for (y = Math.floor(absY / tileHeight) - 1; y < mapHeight; y++) {
	var currTile = this.tilemap.layers[this.groundLayer].data[tileX + y * mapWidth];
	
	var flippedHorizontally = currTile & 0x80000000;
	currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
    
	// Not handled since they shouldn't be used for ground tiles
	//var flippedVertically = currTile & 0x40000000;
    //var flippedDiagonally = currTile & 0x20000000;
	
	// Ground tile
	if (currTile !== 0 && this.tilemap.tilesets[0].tileproperties[currTile - 1].type === "ground") {
		//console.log(this.tilemap.tilesets[0].tileproperties);
		var y0 = parseFloat(this.tilemap.tilesets[0].tileproperties[currTile - 1].left);
		var y1 = parseFloat(this.tilemap.tilesets[0].tileproperties[currTile - 1].right);
		var x0 = 0;
		var x1 = this.tilemap.tilewidth;
		var xWidth = absX - tileX * this.tilemap.tilewidth;
		var xHeight;
		
		// Linear interpolation
		if (flippedHorizontally) 
		  xHeight = y1 + (y0 - y1) * ((xWidth - x0)/(x1 - x0));
		else xHeight = y0 + (y1 - y0) * ((xWidth - x0)/(x1 - x0));

		groundLevel = y * tileHeight + xHeight;
		break;
	}
  }
  return groundLevel;
}

// Checks if the tile at the specified location is the end (portal)
TileEngine.prototype.isEndAt = function(x, y) {
  var tileX = Math.floor(x / this.tilemap.tilewidth);
  var tileY = Math.floor(y / this.tilemap.tileheight);
  var currTile = this.tilemap.layers[this.groundLayer].data[tileX + tileY * this.tilemap.layers[this.groundLayer].width];
  currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
  if (currTile !== 0 && this.tilemap.tilesets[0].tileproperties[currTile - 1].type === "portal") return true;
  return false;
}
// Checks if the tile at the specified location is on air
TileEngine.prototype.isAirAt = function(x, y) {
  if (this.airLayer === undefined) return false;  // No air layer exists on this level
  var tileX = Math.floor(x / this.tilemap.tilewidth);
  var tileY = Math.floor(y / this.tilemap.tileheight);
  var currTile = this.tilemap.layers[this.airLayer].data[tileX + tileY * this.tilemap.layers[this.airLayer].width];
  currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
  if (currTile !== 0 && this.tilemap.tilesets[0].tileproperties[currTile - 1].type === "air") return true;
  return false;
}

// Checks if the ground tile at the specified location contains water
TileEngine.prototype.isWaterAt = function(x, y) {
  if (this.groundLayer === undefined) return false;  // No ground layer exists on this level
  var tileX = Math.floor(x / this.tilemap.tilewidth);
  var tileY = Math.floor(y / this.tilemap.tileheight);
  var currTile = this.tilemap.layers[this.groundLayer].data[tileX + tileY * this.tilemap.layers[this.groundLayer].width];
  currTile = currTile & ~(0x80000000 | 0x40000000 | 0x20000000);
  if (currTile !== 0 && this.tilemap.tilesets[0].tileproperties[currTile - 1].type === "water") return true;
  return false;
}

// Render the tilemap
//  timestep - the time between frames
//  ctx - the rendering context
TileEngine.prototype.render = function (timestep, ctx) {
  var canvas = document.getElementById("geoworld");  
  var tilewidth = this.tilemap.tilewidth;
  var tileheight = this.tilemap.tileheight;
  var width = Math.floor(canvas.scrollWidth / tilewidth) + 2;
  var height = Math.floor(canvas.scrollHeight / tileheight) + 2;
  var startX = Math.floor(this.scrollPosition.x / tilewidth);
  var startY = Math.floor(this.scrollPosition.y / tileheight);

  

  
  for (layer = 0; layer < this.layers; layer++) {  // Painter's algorithm
		this.Alternate();
		ctx.save();
		console.log(ctx.width);
		if(this.background) ctx.drawImage(this.background,-((this.background.width-800)*((this.scrollPosition.x)/((this.tilemap.layers[layer].width*tilewidth)-800))), 0);
   
		ctx.restore();
		ctx.save();
		ctx.translate(-1 * this.scrollPosition.x, -1 * this.scrollPosition.y);
		
		
		
	  for(x = startX; x < width + startX; x++) {
		for(y = startY; y < height + startY; y++) {
		  
		  var tileId = this.tilemap.layers[layer].data[x + y * this.tilemap.layers[layer].width];

		  if (this.switchtile)
			{
				tileId = this.getAlternateTile(tileId);
			}
		  var tileset = this.tilemap.tilesets[0];
		  var tilesheet = this.tilesheets[0];
		  var rowWidth = Math.floor(tileset.imagewidth / tileset.tilewidth);
		  
		  // A tileID of 0 means there is nothing to draw
		  if(tilesheet && tileId > 0) {
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
			} else if(flippedVertically) {
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
				tileX * tilewidth  + (spacing * tileX), tileY * tileheight + (spacing * tileY), tilewidth, tileheight,
				x * tilewidth, y * tileheight, tilewidth + 1, tileheight
			  );
			  ctx.restore();
			} else {
			  ctx.drawImage(tilesheet, 
				//tileX, tileY, tilewidth, tileheight,
				(tileX * tilewidth) + (spacing * tileX), (tileY * tileheight) + (spacing * tileY), tilewidth, tileheight,
				x  * tilewidth, y * tileheight, tilewidth + 1, tileheight + 1
			  );
			}
		  }      
	  }
    }  
      ctx.restore();
  }
  

}
  