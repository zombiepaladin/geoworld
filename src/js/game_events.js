// Acts as the central controller for events/levels; basically, controls game state

EventController = function(game) {
	this.game = game;
	this.events = {"titlescreen":  new TitleScreen(),
				   "pausescreen":  new PauseScreen(),
				   "deathscreen":  new DeathScreen(),
				   "levelfinishedscreen": new FinishLevelScreen(),
			 	   "levelselectscreen": new LevelSelectScreen(this.levels),
				   "level": new LevelEvent()
	              };
			
	this.resetLevels();
	this.currEvent = this.events["titlescreen"];
}		

EventController.prototype.resetLevels = function() {
	this.levels = {
	  "level_8_1": new Level(this.game, level_8_1, entities_8_1),
	  "level_6_1": new Level(this.game, level_6_1, entities_6_1),
	  "level_5_1": new Level(this.game, level_5_1, entities_5_1),
	  "level_5_2": new Level(this.game, level_5_2, entities_5_2),
	  "level_5_3": new Level(this.game, level_5_3, entities_5_3),
	  "level_3_1": new Level(this.game, level_3_1, entities_3_1),
	  "level_3_2": new Level(this.game, level_3_2, entities_3_1),
	  "level_3_3": new Level(this.game, level_3_3, entities_3_1)
	};
}				  

EventController.prototype.update = function(timeStep, input) {
	// Handle events
	this.currEvent.update(timeStep, input);
	var selection = this.currEvent.selection;
	if (selection !== null) {
		this.currEvent.selection = null;  // Reset selection
		this.handleSelection(selection);
	}
}

// Takes a selection from an event (e.g. "resume" or "quitgame" in PauseScreen) and handles it
EventController.prototype.handleSelection = function(selection) {
	if (selection === "startgame") {
		this.currEvent = this.events["levelselectscreen"];
	}
	else if (selection === "pause") {
		this.currEvent = this.events["pausescreen"];
	}
	else if (selection === "resume") {
		this.currEvent = this.events["level"];
	}
	else if (selection === "quit") {
		this.resetLevels(); 
		this.currEvent = this.events["titlescreen"];
	}
	else if (selection === "finishlevel") {
		this.events["levelselectscreen"].completeLevel(this.currLevel);
		this.resetLevels(); 
		this.currEvent = this.events["levelfinishedscreen"];
	}
	else if (selection === "death")
	{
		// If player dies, restart
		this.resetLevels(); 
		this.currEvent = this.events["deathscreen"];
	}
	else if (selection.indexOf("level") != -1) {
		//this.resetLevels();
		this.currEvent = this.events["level"];
		this.currEvent.level = this.levels[selection];
		this.currLevel = selection;
	}
}

EventController.prototype.render = function(timeStep, ctx) {
	this.currEvent.render(timeStep, ctx);
}



//======================================
// Level event: Handles levels
//--------------------------------------

LevelEvent = function() {
	this.selection = null;
	this.level = null;
	this.input_handler = new InputHandler(60);
}

LevelEvent.prototype.update = function(timeStep, input) {
	this.input_handler.press(timeStep, input);
	var canPressEscape = this.input_handler.check("escape");

	this.level.update(timeStep, input);
	if (this.level.isFinished()) {
		this.selection = "finishlevel";
	}
	else if (canPressEscape) {
		this.selection = "pause";
	}
	else if (this.level.isDeathTileAt(this.level.player.position.x,this.level.player.position.y))
	{
		this.selection = "death";
	}
}

LevelEvent.prototype.render = function(timeStep, ctx) {
	this.level.render(timeStep, ctx);
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
	
	this.background = new Image();
	this.background.src = "TitleScreenBackground.png";
	
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
		this.clock = 0;
	}
}

TitleScreen.prototype.render = function(timeStep, ctx) {
	// Draw background
	ctx.drawImage(this.background, 0, 0, 800, 400, 0, 0, 800, 400);

	// Draw logo
	ctx.drawImage(this.logo, 0, 0, 514, 101, 120, 40, 514, 101);
	
	// Draw enterText after certain amount of time
	if (this.clock > 1500) {
        ctx.drawImage(this.enterText, 0, 0, 156, 18, 400, 160, 156, 18);
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
	this.left = 350;
	this.textYDistance = 80;
	this.cursor = new Image();
	this.cursor.src = "cursor.png";
	this.background = new Image();
	this.background.src = "PauseScreenBackground.png";
	
	this.input_handler = new InputHandler(60);
	
	// TODO: MAKE A MORE INTERESTING PAUSE SCREEN
}

PauseScreen.prototype.update = function(timeStep, input) {
	this.input_handler.press(timeStep, input);
	var canPressEnter = this.input_handler.check("enter");
	var canPressUp = this.input_handler.check("up");
	var canPressDown = this.input_handler.check("down");

	if (canPressUp) this.cursorSelect = Math.clamp(this.cursorSelect - 1, 0, this.numChoices - 1);
	if (canPressDown) this.cursorSelect = Math.clamp(this.cursorSelect + 1, 0, this.numChoices - 1);
	
	if (canPressEnter) {
		if (this.cursorSelect === 0) {
			this.selection = "resume";
		}
		else if (this.cursorSelect === 1) {
			this.selection = "quit";
		}
	}
}

PauseScreen.prototype.render = function(timeStep, ctx) {
	ctx.drawImage(this.background, 0, 0, 800, 400, 0, 0, 800, 400);
	
	ctx.save();
	ctx.fillStyle = "red";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Resume", this.left, this.top);
	ctx.fillText("Quit", this.left, this.top + this.textYDistance);
	
	ctx.drawImage(this.cursor, 0, 0, 47, 45, this.left - 70, this.top - 30 + (this.cursorSelect * this.textYDistance), 47, 45);
	ctx.restore();
}


//======================================
// Death Screen
//--------------------------------------

DeathScreen = function() {
	this.selection = null;
	this.cursorSelect = 0;
	this.numChoices = 2;
	
	this.top = 100;
	this.left = 350;
	this.textYDistance = 80;
	this.cursor = new Image();
	this.cursor.src = "cursor.png";
	this.background = new Image();
	this.background.src = "Phase6DeathScreen.png";
	
	this.input_handler = new InputHandler(60);
	
	// TODO: MAKE A MORE INTERESTING PAUSE SCREEN
}

DeathScreen.prototype.update = function(timeStep, input) {
	this.input_handler.press(timeStep, input);
	var canPressEnter = this.input_handler.check("enter");
	var canPressUp = this.input_handler.check("up");
	var canPressDown = this.input_handler.check("down");

	if (canPressUp) this.cursorSelect = Math.clamp(this.cursorSelect - 1, 0, this.numChoices - 1);
	if (canPressDown) this.cursorSelect = Math.clamp(this.cursorSelect + 1, 0, this.numChoices - 1);
	
	if (canPressEnter) {
		if (this.cursorSelect === 0) {
			this.selection = "startgame";
		}
		else if (this.cursorSelect === 1) {
			this.selection = "quit";
		}
	}
}

DeathScreen.prototype.render = function(timeStep, ctx) {
	ctx.drawImage(this.background, 0, 0, 800, 400, 0, 0, 800, 400);
	
	ctx.save();
	ctx.fillStyle = "red";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Restart", this.left, this.top);
	ctx.fillText("Quit", this.left, this.top + this.textYDistance);
	
	ctx.drawImage(this.cursor, 0, 0, 47, 45, this.left - 70, this.top - 30 + (this.cursorSelect * this.textYDistance), 47, 45);
	ctx.restore();
}


//======================================
// Finish Level Screen
//--------------------------------------
FinishLevelScreen = function() {
	this.selection = null;
	this.clock = 0;
	this.displayTime = 1500;  // Amount of time to display each fossil message
	this.collectedFossils = ["dinosaur", "example"];  // USED FOR EXAMPLE: DELETE THESE VALUES LATER 
	this.currFossil = 0;
	
	this.background = new Image();
	this.background.src = "FinishLevelBackground.png";
}

FinishLevelScreen.prototype.update = function(timeStep, input) {
	this.clock += timeStep;
	// If there are no more fossils to display (or none to begin with), then go back to level select
	if (this.clock > this.displayTime && this.collectedFossils[this.currFossil] == undefined) {
		this.selection = "startgame";
		this.clock = 0;
		this.currFossil = 0;
	}
	// Change each collected fossil to draw after certain amount of time
	else if (this.clock > this.displayTime * (this.currFossil+1)) {
		this.currFossil++;
	}
}

FinishLevelScreen.prototype.render = function(timeStep, ctx) {
	ctx.save();
	ctx.drawImage(this.background, 0, 0, 800, 400, 0, 0, 800, 400);
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.fillText("Level Completed!", 280, 100);	
	if (this.collectedFossils[this.currFossil] !== undefined) {
		ctx.fillText("You collected the " + this.collectedFossils[this.currFossil] + " fossil!", 150, 300);
	}
	ctx.restore();
}



//======================================
// Level Select Screen
//--------------------------------------
LevelSelectScreen = function(levels) {
	this.selection = null;
	this.levels = levels;
	this.levelsFinished = {"Phase1": 0, "Phase2": 0, "Phase3": 2, "Phase4": 0, "Phase5": 0, 
						   "Phase6": 0, "Phase7": 0, "Phase8": 0 };
	// Will needed to be updated for number of levels made for each phase
	this.numLevels = {"Phase1": 0, "Phase2": 0, "Phase3": 3, "Phase4": 0, "Phase5": 3, 
					  "Phase6": 1, "Phase7": 0, "Phase8": 1 };
					  
	this.cursorSelect = 0;
	this.menuSelect = 0;  // 0 is for selecting phase, 1 for selecting level number
	this.phaseSelect = -1;
	
	this.top = 50;
	this.left = 350;
	this.textYDistance = 45;
	this.background = new Image();
	this.background.src = "FutureBackground.png";
	
	// Need to play with this minTime value for best results
	this.input_handler = new InputHandler(40);
}

// Takes a level and increases the number of levels completed that were not completed before
// This is used to know what levels the player can access in a phase
LevelSelectScreen.prototype.completeLevel = function(level) {
	var phase = "Phase" + level.substring(level.indexOf('_')+1, level.lastIndexOf('_'));
	var levelNum = parseInt(level.substring(level.lastIndexOf('_')+1));
	
	if (this.levelsFinished[phase] < levelNum && this.numLevels[phase] > levelNum) {
		this.levelsFinished[phase]++;
	}
}

LevelSelectScreen.prototype.update = function(timeStep, input) {
	this.input_handler.press(timeStep, input);
	var canPressEnter = this.input_handler.check("enter");
	var canPressUp = this.input_handler.check("up");
	var canPressDown = this.input_handler.check("down");
	var canPressEscape = this.input_handler.check("escape");
	
	// Select phase
	if (this.menuSelect === 0) {
		if (canPressUp) this.cursorSelect = Math.clamp(this.cursorSelect - 1, 0, 7);
		if (canPressDown) this.cursorSelect = Math.clamp(this.cursorSelect + 1, 0, 7);
		if (canPressEnter && this.numLevels["Phase" + (this.cursorSelect+1)] > 0) {
			this.phaseSelect = this.cursorSelect+1;
			this.cursorSelect = 0;
			this.menuSelect = 1;
		}
	}
	// Select level number
	else if (this.menuSelect === 1) {
		if (canPressUp) this.cursorSelect = Math.clamp(this.cursorSelect - 1, 0, this.levelsFinished["Phase" + this.phaseSelect]);
		if (canPressDown) this.cursorSelect = Math.clamp(this.cursorSelect + 1, 0, this.levelsFinished["Phase" + this.phaseSelect]);
		if (canPressEnter) {
			this.selection = "level_" + (this.phaseSelect + "_" + (this.cursorSelect+1));
			this.phaseSelect = -1;
			this.cursorSelect = 0;
			this.menuSelect = 0;
		}
		else if (canPressEscape) {
			this.phaseSelect = -1;
			this.cursorSelect = 0;
			this.menuSelect = 0;
		}
	}
}

LevelSelectScreen.prototype.render = function(timeStep, ctx) {
	ctx.save();
	ctx.fillStyle = "blue";
    ctx.font = "bold 25px Arial";
	
	// Draw background
	ctx.drawImage(this.background, 0, 0, 800, 400, 0, 0, 800, 400);
	
	// Draw phase choices
	if (this.menuSelect === 0) {
		for (i = 1; i <= 8; i++) {
			// Draw selected phase differently
			if (this.cursorSelect === i - 1) {
				ctx.save();
				ctx.fillStyle = "red";
				ctx.font = "bold 27px Arial";
				ctx.fillText("Phase " + i, this.left, this.top + (this.textYDistance * (i-1)));
				ctx.restore();
			}
			// Grey out any phases with no level in them
			else if (this.numLevels["Phase" + i] === 0) {
				ctx.save();
				ctx.fillStyle = "grey";
				ctx.fillText("Phase " + i, this.left, this.top + (this.textYDistance * (i-1)));
				ctx.restore();
			}
			else ctx.fillText("Phase " + i, this.left, this.top + (this.textYDistance * (i-1)));
		}
	}
	// Draw level choices
	else if (this.menuSelect === 1) {
		// Loop through all the available levels in the chosen phase
		for (i = 1; i <= this.levelsFinished["Phase" + this.phaseSelect] + 1; i++) {
			// Draw selected level differently
			if (this.cursorSelect === i - 1) {
				ctx.save();
				ctx.fillStyle = "red";
				ctx.font = "bold 27px Arial";
				ctx.fillText("Level " + i, this.left, this.top + (this.textYDistance * (i-1)));
				ctx.restore();
			}
			else
			ctx.fillText("Level " + i, this.left, this.top + (this.textYDistance * (i-1)));
		}
	}
	ctx.restore();
}