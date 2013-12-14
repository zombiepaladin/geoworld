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
				this.currEvent.selection = null;  // Reset selection
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
	
	//TODO: MAKE A MORE INTERESTING TITLE SCREEN; SHOULD ALSO WAIT
	// A CERTAIN AMOUNT OF TIME BEFORE ACCEPTING INPUT TO AVOID RAPID 
	// OSCILLATION BETWEEN EVENTS
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
LevelSelectScreen = function(levels) {
	this.selection = null;
	this.levels = levels;
	this.levelsFinished = {"Phase1": 0, "Phase2": 0, "Phase3": 0, "Phase4": 0, "Phase5": 0, 
						   "Phase6": 0, "Phase7": 0, "Phase8": 0 };
	// Will needed to be updated for number of levels made for each phase
	this.numLevels = {"Phase1": 0, "Phase2": 0, "Phase3": 0, "Phase4": 0, "Phase5": 3, 
					  "Phase6": 0, "Phase7": 0, "Phase8": 0 };
}

// Takes a level and increases the number of levels completed not completed before
LevelSelectScreen.prototype.completeLevel = function(level) {
	var phase = "Phase" + level.substring(level.indexOf('_')+1, level.lastIndexOf('_'));
	var levelNum = parseInt(level.substring(level.lastIndexOf('_')+1));
	
	if (this.levelsFinished[phase] < levelNum) {
		this.levelsFinished[phase]++;
	}
}

LevelSelectScreen.prototype.update = function(timeStep, input) {

}

LevelSelectScreen.prototype.render = function(timeStep, ctx) {

}


// HACK: USED TO (POORLY) DEAL WITH JAVASCRIPT'S ASYNCHRONOUS BEHAVIOR
EmptyEvent = function() { this.selection = "noevent"; }
EmptyEvent.prototype.update = function(timeStep, input) {  }
EmptyEvent.prototype.render = function(timeStep, ctx) {  }
EmptyEvent.prototype.getSelection = function() { return this.selection; }