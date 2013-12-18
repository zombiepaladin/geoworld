
Geoworld = function () {

  // Global variables (limited to the scope of 
  // the Geoworld object (function) - essentailly
  // namespacing)
  this.lastTime = 0;

  // The game's containing div
  var game = document.getElementById("geoworld");

  // The gameplay canvas & context
  var gameplayCanvas = document.getElementById("gameplay-canvas");
  this.width = gameplayCanvas.clientWidth;
  this.height = gameplayCanvas.clientHeight;
  this.gameplayCtx = gameplayCanvas.getContext('2d');

  // Set up physics globals
  this.physics = new Object();
  this.physics.gravityConstant = 300 * 1.5;

  //Scene stetup:
  //Scenes are stored on a stack, the top-most scene is the one that the player is currently interacting with.
  this.scenes = [];
  this.pushScene(new TitleScreen());
  this.keyHasTriggeredKeyDown = [];

  //FPS counter:
  this.fpsTimer = 0;

  // Subscribe to key input events
  var thisGame = this;
  document.addEventListener("keydown", function (event) {
    var translatedEvent = jsKeyboardEventToGameKeyEvent(event);

    //Suppress repeated keydown events:
    if (thisGame.keyHasTriggeredKeyDown[translatedEvent.key]) {
      return;
    }
    thisGame.keyHasTriggeredKeyDown[translatedEvent.key] = true;

    var scene = thisGame.getCurrentScene();
    if (scene) {
      scene.entityKeyDown(translatedEvent);
    }
  });

  document.addEventListener("keyup", function (event) {
    var translatedEvent = jsKeyboardEventToGameKeyEvent(event);
    thisGame.keyHasTriggeredKeyDown[translatedEvent.key] = false;

    var scene = thisGame.getCurrentScene();
    if (scene) {
      scene.entityKeyUp(translatedEvent);
    }
  });
}

// Update the game simualation by the timestep
Geoworld.prototype.update = function (timeStep) {
  var scene = this.getCurrentScene();
  if (scene) {
    scene.entityUpdate(timeStep);
  }
}

// Render the game
Geoworld.prototype.render = function (timeStep, ctx) {
  ctx.clearRect(0, 0, this.width, this.height);

  var scene = this.getCurrentScene();
  assert(scene);
  scene.render(timeStep, ctx);
}

// The main game loop for the game
Geoworld.prototype.gameLoop = function (time) {

  // Calculate the timestep for this frame
  var timeStep = time - this.lastTime;

  if (this.lastTime == 0) { //Prevent the timeStep from being huge during the second frame.
    timeStep = 0;
  }

  this.lastTime = time;

  this.update(timeStep);
  this.render(timeStep, this.gameplayCtx);

  this.fpsTimer -= time;
  if (this.fpsTimer <= 0) {
    this.fpsTimer = 100;
    document.getElementById("fps").innerHTML = (Math.floor(1 / (timeStep / 1000)).toString() + " FPS").toString();
  }

  // Loop by requesting the next animation frame
  var thisGame = this;
  window.requestAnimationFrame(function (timeStep) {
    thisGame.gameLoop(timeStep);
  });
}

Geoworld.prototype.startGame = function () {
  this.gameLoop(0);
}

Geoworld.prototype.setDebugString = function (str) {
  document.getElementById("debug").innerHTML = str;
}

//Pushes a new scene onto the scene stack, making it the current scene
Geoworld.prototype.pushScene = function (newScene) {
  this.scenes.push(newScene);
}

//Pops the current scene from the scene stack, making the one below it the current scene
//Returns the old scene
Geoworld.prototype.popScene = function () {
  return this.scenes.pop();
}

//Replaces the current scene with a new one, returns the old scene
Geoworld.prototype.replaceScene = function (newScene) {
  var oldScene = this.scenes.pop();
  this.scenes.push(newScene);
  return oldScene;
}

//Returns the current scene or undefined when there is no current scene.
Geoworld.prototype.getCurrentScene = function () {
  return this.scenes.peek();
}

Game = new Geoworld();
// Start the game loop
Game.startGame();
