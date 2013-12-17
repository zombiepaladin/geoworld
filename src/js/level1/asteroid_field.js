AsteroidField = function (initialParent, spawnRegion, scene) {
  Entity.call(this, initialParent, new Vector(0, 0), scene);

  this.minX = spawnRegion.x;
  this.maxX = spawnRegion.x + spawnRegion.width;

  this.timeToNextAsteroid = 0;
}

AsteroidField.prototype = new Entity();
AsteroidField.prototype.constructor = AsteroidField;

AsteroidField.createFromLevel = function (info, scene) {
  return new AsteroidField(scene, new Rect(info.x, info.y, info.width, info.height), scene);
}

AsteroidField.prototype.spawnAsteroid = function () {
  new Asteroid(this, new Vector(Math.random(this.minX, this.maxX), 0), this.scene);
}

AsteroidField.prototype.update = function (timeStep) {
  this.timeToNextAsteroid -= timeStep;

  if (this.timeToNextAsteroid <= 0) {
    this.timeToNextAsteroid = Math.random(10, 100);
    this.spawnAsteroid();
  }
}
