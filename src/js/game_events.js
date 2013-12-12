EventController = function(game) {
	this.specialEvents = {"titlescreen":  new TitleScreen(),
						 "pausescreen":  new PauseScreen(),
						 "levelfinished": new FinishLevel()
						 };
						
	this.levels = {"level_5_1": new Level(game, level_5_1),
	              "level_5_3": new Level(game, level_5_3)
				 };
				 
	this.currEvent = specialEvents["titlescreen"];
	this.currLevel = null;
}				 

EventController.prototype.update = function(timeStep, input) {

	// Handle special events
	if (this.currEvent !== null) {
		this.currEvent.update(timeStep, input);
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

EventController.prototype.render = function(timeStep, ctx) {
	this.currEvent.render(timeStep, ctx);
}

TitleScreen = function() {
	
}