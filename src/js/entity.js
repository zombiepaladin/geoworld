// Construct a new player object
Entity = function (initialParent, initialPosition, scene) {
  console.log(this);

  this.scene = scene;
	this.position = initialPosition;

	this.children = []
	this.modifiers = []

	if (this.position === undefined) {
	  this.position = new Vector(0, 0);
	}

	if (initialParent) {
	  assert(initialParent instanceof Entity);
	  initialParent.giveChild(this);
	}

	return;
}

//Adds a child to this entity's children list
//Also updates the child's parent property.
Entity.prototype.giveChild = function (newChild) {
  if (newChild.parent !== undefined) {
    newChild.parent.takeChild(newChild);
  }

  this.children.add(newChild);
  newChild.parent = this;
}

//Removes a child from this entity's children list
//Also updates the child's parent property.
Entity.prototype.takeChild = function (oldChild) {
  assert(oldChild.parent === this);
  assert(this.children.remove(oldChild) === 1);
  oldChild.parent = undefined;
}

//Destroys this entity and all of its children
Entity.prototype.destroy = function () {
  if (this.parent !== undefined) {
    this.parent.takeChild(this);
  }

  this.children.forEach(function (child) {
    child.destroy();
  });
}

//Applies a modifier to this entity
Entity.prototype.applyModifier = function (modifier) {
  this.modifiers.add(modifier.call(this));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Entity update function, don't override or call this unless you know what you're doing.
Entity.prototype.entityUpdate = function (timeStep) {
  this.update(timeStep);

  this.modifiers.forEach(function (modifier) {
    modifier.call(this, timeStep);
  }, this);

  this.children.forEach(function (child) {
    child.entityUpdate(timeStep);
  }, this);
}

//Entity-specific update routine, you should override this if you need it
Entity.prototype.update = function (timeStep) {
  //Override me in child entities!
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Renders all children of this entity, usually you want to call this from render before your final ctx.restore.
Entity.prototype.renderChildren = function (timeStep, ctx) {
  this.children.forEach(function (child) {
    child.render(timeStep, ctx);
  });
}

//Entity-specific render routine, you should override this if you need it
//Make sure to call this.renderChildren if you have children that should be rendered.
Entity.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  this.renderChildren();
  ctx.restore();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Entity key down event function, don't override or call this unless you know what you're doing.
Entity.prototype.entityKeyDown = function (event) {
  if (this.keyDown(event)) {
    return true;//If handled, don't pass event to children
  }

  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].entityKeyDown(event)) {
      return true;//If child handled event, stop processing the event
    }
  }

  return false;
}

//Entity key down event function, override this to handle key press events with your entity.
//event is a structure with the following:
//  event.key   : The keyCode of the key press
//  event.ctrl  : True if control is down
//  event.alt   : True is alt is down
//  event.shift : True if shift is down
Entity.prototype.keyDown = function(event) {
  //Override me!
  return false;
}

//Entity key up event function, don't override or call this unless you know what you're doing.
Entity.prototype.entityKeyUp = function (event) {
  if (this.keyUp(event)) {
    return true;//If handled, don't pass event to children
  }

  for (var i = 0; i < this.children.length; i++) {
    if (this.children[i].entityKeyUp(event)) {
      return true;//If child handled event, stop processing the event
    }
  }

  return false;
}

//Entity key up event function, override this to handle key release events with your entity.
//event is a structure with the following:
//  event.key   : The keyCode of the key press
//  event.ctrl  : True if control is down
//  event.alt   : True is alt is down
//  event.shift : True if shift is down
Entity.prototype.keyUp = function (event) {
  //Override me!
  return false;
}
