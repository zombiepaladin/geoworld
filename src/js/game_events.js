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

	// Handle special events
	if (this.currEvent.getSelection() !== "noevent") {
		this.currEvent.update(timeStep, input);
		var selection = this.currEvent.getSelection();
		if (selection !== null) {
			this.handleSelection(selection);
		}
	}
	// Handle level
	else {
		// Pause the game
		if (input.enter) {
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

// Takes a selection from an event (e.g. "resume" or "quitgame" in PauseScreen) and handles it
EventController.prototype.handleSelection = function(selection) {
	if (selection === "startgame") {
		this.currEvent = this.specialEvents["none"];
		this.currLevel = this.levels["level_5_1"];
	}
}

EventController.prototype.render = function(timeStep, ctx) {
	if (this.currEvent.getSelection() !== "noevent") {
		this.currEvent.render(timeStep, ctx);
	}
	else if (this.currLevel !== null) {
		this.currLevel.render(timeStep, ctx);
	}
}

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

TitleScreen.prototype.getSelection = function() {
	return this.selection;
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

PauseScreen = function() {

}

FinishLevelScreen = function() {

}

LevelSelectScreen = function() {

}

EmptyEvent = function() {}
EmptyEvent.prototype.update = function(timeStep, input) {}
EmptyEvent.prototype.render= function(timeStep, ctx) {}
EmptyEvent.prototype.getSelection = function() { return "noevent"; }