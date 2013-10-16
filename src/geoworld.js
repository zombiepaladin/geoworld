

Geoworld = function() {

  // Global variables (limited to the scope of 
  // the Geoworld object (function) - essentailly
  // namespacing)
  var gameClock = 0;
  var frame = 0;
  
  // The game's containing div
  var game = document.getElementById("geoworld");
  
  // The gameplay canvas & context
  var gameWidth = 800;
  var gameHeight = 480;
  var gameplayCanvas = document.getElementById("gameplay-canvas");
  var gameplayCtx = gameplayCanvas.getContext('2d');
  
  // The input object
  var input = {
    left: false,
    up: false,
    right: false,
    down: false
  };
  
  // The player object
  var player = new Player(game);
  
  
  // Keypress handling
  document.addEventListener("keydown", function(event) {
    var key = event.keyCode || event.which;
    switch(key) {
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
    player.update(timeStep, input);
  }
  
  // Render the updated game
  function render(timeStep){
    gameplayCtx.clearRect(0, 0, gameWidth, gameHeight);
    
    // Draw the player sprite
    player.render(timeStep, gameplayCtx);
    
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
  
  // Start the game loop
  gameLoop(0);
}();