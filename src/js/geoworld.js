
Geoworld = function() {

  // Global variables (limited to the scope of 
  // the Geoworld object (function) - essentailly
  // namespacing)
  var gameClock = 0;
  var frame = 0;
  
  // The game's containing div
  var game = document.getElementById("geoworld");
  
  // The game's levels
  var levels = [new Level(game, level_5_3)];
  var currLevel = 0;
  
  // The gameplay canvas & context
  var gameplayCanvas = document.getElementById("gameplay-canvas");
  this.gameWidth = gameplayCanvas.clientWidth;
  this.gameHeight = gameplayCanvas.clientHeight;
  var gameplayCtx = gameplayCanvas.getContext('2d');
  
  // The input object
  var input = {
    enter: false,
	spacebar: false,
    left: false,
    up: false,
    right: false,
    down: false
  };
  
  // Set up physics globals
  this.physics = new Object();
  this.physics.gravityConstant = 200;
  
  // Keypress handling
  document.addEventListener("keydown", function(event) {
    var key = event.keyCode || event.which;
    switch(key) {
	  case 13: // enter key
	    input.enter = true;
		break;
	  case 32: // spacebar key
	    input.spacebar = true;
		break;
      case 37: // left key
        input.left = true;
        break;
      case 38: // up key
        input.up = true;
        break;
      case 39: // right key
        input.right = true;
        break;
      case 40: // down key
        input.down = true;
        break;
    };
  });  
  
  document.addEventListener("keyup", function(event) {
    var key = event.keyCode || event.which;
    switch(key) {
	  case 13: // enter key
	    input.enter = false;
		break;
	  case 32: // spacebar key
	    input.spacebar = false;
		break;
      case 37: // left key
        input.left = false;
        break;
      case 38: // up key
        input.up = false;
        break;
      case 39: // right key
        input.right = false;
        break;
      case 40: // down key
        input.down = false;
        break;
    };
  }); 
  
  // Update the game simualation by the timestep
  function update(timeStep) {
    // Update the player sprite
    levels[currLevel].update(timeStep, input);
  }
  
  // Render the updated game
  function render(timeStep){
    gameplayCtx.clearRect(0, 0, Game.gameWidth, Game.gameHeight);
    
    // Draw the level (and player)
    levels[currLevel].render(timeStep, gameplayCtx);
    
	/*
    // Draw water for physics demo:
    if (Game.enableWaterOnLeft() || Game.enableWaterOnRight()) {
      gameplayCtx.save();
      gameplayCtx.fillStyle = "rgba(52, 179, 247, 0.5)";
      
      if (Game.enableWaterOnLeft()) {
        gameplayCtx.fillRect(0, 0, Game.gameWidth / 2, Game.gameHeight);
      }

      if (Game.enableWaterOnRight()) {
        gameplayCtx.fillRect(Game.gameWidth / 2, 0, Game.gameWidth / 2, Game.gameHeight);
      }

      gameplayCtx.restore();
    }
	*/
  }

  // The main game loop for the game
  function gameLoop(time) {
  
    // Calculate the timestep for this frame
    var timeStep = time - gameClock;
    gameClock = time;
    
    update(timeStep);
    render(timeStep);
    
    // Loop by requesting the next animation frame
    window.requestAnimationFrame(gameLoop);
  }

  this.startGame = function () {
    gameLoop(0);
  }

  this.setDebugString = function (str) {
    document.getElementById("debug").innerHTML = str;
  }

  /*
  this.enableHangTime = function () { return document.getElementById("hangTime").checked; }
  this.enableWaterOnLeft = function () { return document.getElementById("waterOnLeft").checked; }
  this.enableWaterOnRight = function () { return document.getElementById("waterOnRight").checked; }
  this.enableDoubleJump = function () { return document.getElementById("doubleJump").checked; }
  */
};

Game = new Geoworld();
// Start the game loop
Game.startGame();
