
Geoworld = function() {

  // Global variables (limited to the scope of 
  // the Geoworld object (function) - essentailly
  // namespacing)
  var gameClock = 0;
  var frame = 0;
  
  // The game's containing div
  var game = document.getElementById("geoworld");
  
  // Dictates the events or flow of the game
  var eventController = new EventController(game);
  
  // The gameplay canvas & context
  var gameplayCanvas = document.getElementById("gameplay-canvas");
  this.gameWidth = gameplayCanvas.clientWidth;
  this.gameHeight = gameplayCanvas.clientHeight;
  var gameplayCtx = gameplayCanvas.getContext('2d');
  
  // The input object
  var input = {
    escape: false,
    enter: false,
	spacebar: false,
    left: false,
    up: false,
    right: false,
    down: false
  };
  
  // Set up physics globals
  this.physics = new Object();
  this.physics.gravityConstant = 300;
  
  // Keypress handling
  document.addEventListener("keydown", function(event) {
    var key = event.keyCode || event.which;
    switch(key) {
	  case 13: // enter key
	    input.enter = true;
		break;
	  case 27: // escape key
	    input.escape = true;
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
      case 27: // escape key
	    input.escape = true;
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
    eventController.update(timeStep, input);
  }
  
  // Render the updated game
  function render(timeStep){
    gameplayCtx.clearRect(0, 0, Game.gameWidth, Game.gameHeight);
    
    // Draw the level (and player)
    eventController.render(timeStep, gameplayCtx);
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
};

Game = new Geoworld();
// Start the game loop
Game.startGame();
