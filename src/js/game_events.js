EventController = function(game) {
	this.specialEvents = {"titlescreen":  new TitleScreen(),
						 "pausescreen":  new PauseScreen(),
						 "levelfinished": new FinishLevel()
						 };
						
	this.levels = {"level_5_1": new Level(game, level_5_1),
	               "level_5_3": new Level(game, level_5_3),
				   "level_5_4": new Level(game, level_5_4)
				  };
				 
	this.currEvent = specialEvents["titlescreen"];
	this.currLevel = null;
}				 

EventController.prototype.update = function(timeStep, input) {

	// Handle special events
	if (this.currEvent !== null) {
		this.currEvent.update(timeStep, input);
		var selection = this.currEvent.getSelection();
		if (selection !== null) {
			handleSelection(selection);
		}
		if (this.currEvent.isFinished()) {
			this.currEvent = null;
		}
	}
	// Set current level to default if not set; will probably be lab later on
	else if (this.currLevel  === null) {
		this.currLevel = this.levels["level_5_1"];
	}
	// Handle level
	else {
		// Pause the game
		if (input.enter) {
			this.currEvent = specialEvents["pausescreen"];
		}
		else {
			this.currLevel.update(timeStep, input);
			// Handle the end of a level
			if (this.currLevel.isFinished()) {
				this.currEvent = specialEvents["levelfinished"];
			}
		}
	}
}

// Takes a selection from an event (e.g. "resume" or "quitgame" in PauseScreen) and handles it
EventController.prototype.handleSelection = function(selection) {

}

EventController.prototype.render = function(timeStep, ctx) {
	this.currEvent.render(timeStep, ctx);
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

TitleScreen.prototype.getSelection() {
	return this.selection;
}

TitleScreen.prototype.render = function(timeStep, ctx) {
	// Draw logo
	ctx.drawImage(this.logo, 
	              0, 0, 514, 101,
	             100, 0, 514, 101
    );
	
	// Draw enterText after certain amount of time
	if (this.clock > 3000) {
        ctx.drawImage(this.enterText, 
	                  0, 0, 156, 18,
	                  400, 130, 156, 18
        );
	}
}