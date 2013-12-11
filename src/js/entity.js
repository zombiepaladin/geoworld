// Construct a new player object
Entity = function(game){console.log(this);
	if(game){
        this.id = Entity.nextId;
        Entity[this.id] = this; // Store for getting any made entity by id.
        Entity.nextId ++;
        return this.id;
    }
    return 0;
}
Entity.nextId = 0;// Static variable to get next id when creating a Entity.

// make new Entities like this:
/*Player = function(game){
	Entity.call(this, game);
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Dino = function(game){
	Entity.call(this, game);
}
Dino.prototype = new Entity();
Dino.prototype.constructor = Dino;

Mammal = function(game){
	Entity.call(this, game);
}
Mammal.prototype = new Entity();
Mammal.prototype.constructor = Mammal;

Human = function(game){
	Mammal.call(this, game);
}
Human.prototype = new Mammal();
Human.prototype.constructor = Mammal;*/