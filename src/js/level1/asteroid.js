Asteroid = function (initialParent, initialPosition, scene) {
  Entity.call(this, initialParent, initialPosition, scene);

  this.size = Math.random(20, 60);
  this.position.y -= this.size / 2.0;//Move up so it is above the world, so the player doesn't see it spawn
}

Asteroid.prototype = new Entity();
Asteroid.prototype.constructor = Asteroid;

Asteroid.Velocity = new Vector(75, 280);
Asteroid.CollisionScale = 0.7;

Asteroid.prototype.update = function (timeStep) {
  this.position.plusEquals(Asteroid.Velocity.scale(timeStep / 1000));

  //Check if the asteroid has collided with the world.
  //Since the asteroid moves down and to the right, we only check those directions.
  //If this asteroid gets used outside of this level, you probably want to check all directions
  //Similarly, lava is only checked for below the asteroid. Additionally, it assumes the only hazzard tiles are lava.
  if (this.scene.isGroundAt(this.position.x + this.size / 2 * Asteroid.CollisionScale, this.position.y) ||
    this.scene.isHazzardAt(this.position.x, this.position.y + this.size / 2 * Asteroid.CollisionScale) ||
    this.scene.isHazzardAt(this.position.x, this.position.y + this.size / 2 * Asteroid.CollisionScale)) {
    this.destroy();
  }
}

Asteroid.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.fillStyle = "red";
  ctx.fillCircle(0, 0, this.size / 2);
  this.renderChildren(timeStep, ctx);
  ctx.restore();
}
