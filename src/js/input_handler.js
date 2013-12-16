// Used by menus to prevent input from activating more than once per press
// If anybody wants to make a better implementation that can be used for player
// then feel free to do so
InputHandler = function(minTime) {
	this.minTime = minTime;
	this.enterClock = 0;
	this.upClock = 0;
	this.downClock = 0;
	this.escapeClock = 0;

	this.isEnterPressed = false;
	this.wasEnterPressed = false;
	//this.enterTransitioning = false;
	
	this.isUpPressed = false;
	this.wasUpPressed = false;
	
	this.isDownPressed = false;
	this.wasDownPressed = false;
	
	this.isEscapePressed = false;
	this.wasEscapePressed = false;
}

// Set isPressed for all necessary input
InputHandler.prototype.press = function(timeStep, input) {
	this.isEnterPressed = input.enter;
	this.isUpPressed = input.up;
	this.isDownPressed = input.down;
	this.isEscapePressed = input.escape;
	
	this.enterClock += timeStep;
	this.upClock += timeStep;
	this.downClock += timeStep;
	this.escapeClock += timeStep;
}

// Checks if the input type given can be pressed again
InputHandler.prototype.check = function(inputType) {
	if (inputType === "enter") {
		if (!this.isEnterPressed && this.wasEnterPressed && this.minTime < this.enterClock) {
			this.enterClock = 0;
			this.isEnterPressed = false;
			return true;
		}
		this.wasEnterPressed = this.isEnterPressed;
	}
	else if (inputType === "up") {
		if (!this.isUpPressed && this.wasUpPressed && this.minTime < this.upClock) {
			this.upClock = 0;
			this.isUpPressed = false;
			return true;
		}
		this.wasUpPressed = this.isUpPressed;
	}
	else if (inputType === "down") {
		if (!this.isDownPressed && this.wasDownPressed && this.minTime < this.downClock) {
			this.downClock = 0;
			this.isDownPressed = false;
			return true;
		}
		this.wasDownPressed = this.isDownPressed;
	}
	else if (inputType === "escape") {
		if (!this.isEscapePressed && this.wasEscapePressed && this.minTime < this.escapeClock) {
				this.escapeClock = 0;
				this.isEscapePressed = false;
				return true;
			}
		this.wasEscapePressed = this.isEscapePressed;
	}
	return false;
}