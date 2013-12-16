//Scenes are a root node entity that contains several entities
//They handle input going to the entities and are deactivated/activated depending on the game state
Scene = function () {
  //Call base class constructor:
  Entity.call(this, undefined, new Vector(0, 0), this);
}

Scene.prototype = new Entity();
Scene.prototype.constructor = Scene;
