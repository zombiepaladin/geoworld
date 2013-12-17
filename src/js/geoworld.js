
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
  var keys = {
	13: "enter",
	27: "escape",
	32: "spacebar",
	37: "left",
	38: "up",
	39: "right",
	40: "down",
	87: "w",
	65: "a",
	83: "s",
	68: "d"
  };
  function keyHandler(event){
	var key = event.keyCode || event.which;
	if(keys[key]) input[keys[key]] = event.type === "keydown";
  }
  document.addEventListener("keydown", keyHandler);
  document.addEventListener("keyup", keyHandler);
  
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
