// Acts as the central controller for events/levels

// TODO: FIX THE FUNKY BEHAVIOR INVOLVING JAVASCRIPT'S ASYNCHRONOUS BEHAVIOR
//       ANYBODY WITH EXPERIENCE WITH THIS SHOULD TRY TO FIX THIS CLASS UP

EventController = function(game) {
	this.specialEvents = {"none": new EmptyEvent(),
						 "titlescreen":  new TitleScreen(),
						 "pausescreen":  new PauseScreen(),
						 "levelfinishedscreen": new FinishLevelScreen(),
						 "levelselectscreen": new LevelSelectScreen()
						 };
						
	this.levels = {"level_5_1": new Level(game, level_5_1),
	               "level_5_3": new Level(game, level_5_3),
				   "level_5_4": new Level(game, level_5_4)
				  };
				 
	this.currEvent = this.specialEvents["titlescreen"];
	this.currLevel = null;
}				 

EventController.prototype.update = function(timeStep, input) {
	try {
		// Handle special events
		if (this.currEvent.selection !== "noevent") {
			this.currEvent.update(timeStep, input);
			var selection = this.currEvent.selection;
			if (selection !== null) {
				this.handleSelection(selection);
			}
		}
		// Handle level
		else {
			// Pause the game
			if (input.escape) {
				this.currEvent = this.specialEvents["pausescreen"];
			}
			else {
				this.currLevel.update(timeStep, input);
				// Handle the end of a level
				if (this.currLevel.isFinished()) {
					this.currEvent = this.specialEvents["levelfinishedscreen"];
				}
			}
		}
	}
	catch(e) { 
		console.log(e); 
		// HACK: Handles some asynchronous behavior I don't know how to deal with properly
		this.currEvent = this.specialEvents["none"]; 
	}
}

// Takes a selection from an event (e.g. "resume" or "quitgame" in PauseScreen) and handles it
EventController.prototype.handleSelection = function(selection) {
	if (selection === "startgame") {
		this.currEvent = this.specialEvents["none"];
		this.currLevel = this.levels["level_5_1"];
	}
	else if (selection === "resume") {
		this.currEvent = this.specialEvents["none"];
	}
	else if (selection === "quit") {
		this.currEvent = this.specialEvents["titlescreen"];
		this.currLevel = null;
	}
	
}

EventController.prototype.render = function(timeStep, ctx) {
	try {
		if (this.currEvent.selection !== "noevent") {
			this.currEvent.render(timeStep, ctx);
		}
		else if (this.currLevel !== null) {
			this.currLevel.render(timeStep, ctx);
		}
	}
	catch(e) {
		console.log(this.currEvent + ": " + e);
		// HACK: Handles some asynchronous behavior I don't know how to deal with properly
		this.currEvent = this.specialEvents["none"];
	}
}

//======================================
// Title Screen
//--------------------------------------

TitleScreen = function() {
	this.selection = null;
	
	this.logo = new Image();
	this.logo.src = "geoworld_logo.png";
	
	this.enterText = new Image();
	this.enterText.src = "press_enter_to_play.png";
	
	// Used to know when to draw logos, only enterText for now
	this.clock = 0;
	
	//TODO: MAKE A MORE INTERESTING TITLE SCREEN
}

TitleScreen.prototype.update = function(timeStep, input) {
	this.clock += timeStep;
	
	// Start game
	if (input.enter) {
		this.selection = "startgame";
	}
}

TitleScreen.prototype.render = function(timeStep, ctx) {
	// Draw logo
	ctx.drawImage(this.logo, 
	              0, 0, 514, 101,
	             120, 40, 514, 101
    );
	
	// Draw enterText after certain amount of time
	if (this.clock > 1500) {
        ctx.drawImage(this.enterText, 
	                  0, 0, 156, 18,
	                  400, 160, 156, 18
        );
	}
}

//======================================
// Pause Screen
//--------------------------------------

PauseScreen = function() {
	this.selection = null;
	this.cursorSelect = 0;
	this.numChoices = 2;
	
	this.top = 100;
	this.left = 300;
	this.textYDistance = 80;
	this.cursor = new Image();
	this.cursor.src = "cursor.png";
	
	// TODO: MAKE A MORE INTERESTING PAUSE SCREEN
}

PauseScreen.prototype.update = function(timeStep, input) {
	if (input.up) this.cursorSelect = Math.clamp(this.cursorSelect - 1, 0, this.numChoices - 1);
	if (input.down) this.cursorSelect = Math.clamp(this.cursorSelect + 1, 0, this.numChoices - 1);
	
	if (input.enter) {
		if (this.cursorSelect === 0) {
			this.selection = "resume";
		}
		else if (this.cursorSelect === 1) {
			this.selection = "quit";
		}
	}
}

PauseScreen.prototype.render = function(timeStep, ctx) {
	ctx.save();
	ctx.fillStyle = "blue";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Resume", this.left, this.top);
	ctx.fillText("Quit", this.left, this.top + this.textYDistance);
	
	ctx.drawImage(this.cursor, 0, 0, 47, 45, this.left - 70, this.top - 25 + (this.cursorSelect * this.textYDistance), 47, 45);
	ctx.restore();
}


//======================================
// Finish Level Screen
//--------------------------------------
FinishLevelScreen = function() {

}

FinishLevelScreen.prototype.update = function() {

}

FinishLevelScreen.prototype.render = function() {

}

//======================================
// Level Select Screen
//--------------------------------------
LevelSelectScreen = function() {

}


// HACK: USED TO (POORLY) DEAL WITH JAVASCRIPT'S ASYNCHRONOUS BEHAVIOR
EmptyEvent = function() { this.selection = "noevent"; }
EmptyEvent.prototype.update = function(timeStep, input) {  }
EmptyEvent.prototype.render = function(timeStep, ctx) {  }
EmptyEvent.prototype.getSelection = function() { return this.selection; }