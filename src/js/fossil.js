//Constructs the Fossil object
Fossil = function(game, entity, location) {
	this.entity = entity;
	this.position = {
		x: entity.position.x,
		y: entity.position.y
	}
	//Still need to determine what to make the size
	this.size = entity.size;
	this.retrievedAt;
	this.retrieved = false;
	this.spriteSheet = new Image();
	//Need someone to create the spritesheet
	this.spriteSheet.src = "fossil.png";
}

Fossil.prototype.update = function(timeStep, input) {
	//Update the fossil object
}

Fossil.prototype.retrieve(time) {
	this.retrievedAt = time;
	this.retrieved = true;
}

Fossil.prototype.render = function(timeStep, ctx) {
  if(this.spriteSheet) {
    ctx.save();
	ctx.translate(this.position.x, this.position.y);
	ctx.rotate(this.angle);
    ctx.translate(-24, -24);
	//Need to change the first 2 "0"'s to whatever part of the tileset the fossil belongs to.
    ctx.drawImage(this.spriteSheet, 0, 0, this.size.width, this.size.height, 0, 0, this.size.width, this.size.height);
    ctx.restore();
	}
}