// Construct a new player object
Entity = function (initialParent, initialPosition, level) {
  console.log(this);

  this.level = level;
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

//Entity update function, don't override or call this unless you know what you're doing.
Entity.prototype.entityUpdate = function (timeStep) {
  this.update(timeStep);

  this.modifiers.forEach(function (modifier) {
    modifier.call(this, timeStep);
  }, this);

  this.children.forEach(function (modifier) {
    child.update(timeStep);
  }, this);
}

//Renders all children of this entity, usually you want to call this from render before your final ctx.restore.
Entity.prototype.renderChildren = function (timeStep, ctx) {
  this.children.forEach(function (child) {
    child.render(timeStep, ctx);
  });
}

//Entity-specific update routine, you should override this if you need it
Entity.prototype.update = function (timeStep) {
  //Override me in child entities!
}

//Entity-specific render routine, you should override this if you need it
//Make sure to call this.renderChildren if you have children that should be rendered.
Entity.prototype.render = function (timeStep, ctx) {
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  this.renderChildren();
  ctx.restore();
}
