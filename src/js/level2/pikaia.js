// Generate a random Integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
} 

// Generate a random Float
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

Pikaia = function( spr, top ) {
	var xx;
	var yy;
	this.spriteSheet = spr;
	do {
		xx = getRandomInt( -50, 850 );
	} while ( xx > 0 && xx < 800 );
	yy = getRandomInt( top + 50, 550 );
	this.position = {
		x: xx,
		y: yy
	}
	this.diameter = 18;
	this.angle = getRandomFloat( 0, 2 * Math.PI ); // in radians
	this.speed = getRandomFloat( 0.03, 0.1 );

	// when collision with robot
	this.airProvided = 13;
	this.maxSpeedChange = 0;
	this.accelerationChange = 0;
	this.waterLevelChange = -20;
	this.stopRobot = true;
}

Pikaia.prototype.update = function( timeStep, moveY ) {
	if ( moveY > 0 )
		this.position.y -= moveY;
	else if ( moveY < 0 )
		this.position.y += moveY;
	this.position.x += timeStep * this.speed * Math.sin( this.angle );
	this.position.y -= timeStep * this.speed * Math.cos( this.angle );
}

Pikaia.prototype.render = function( timeStep, ctx ) {
	ctx.save();
	ctx.translate( this.position.x, this.position.y );
	ctx.rotate(this.angle);
	ctx.translate(-this.spriteSheet.width/2, -this.spriteSheet.height/2);
	ctx.drawImage(this.spriteSheet, 0, 0, this.spriteSheet.width, this.spriteSheet.height, 0, 0, this.spriteSheet.width, this.spriteSheet.height );
	ctx.restore();
}