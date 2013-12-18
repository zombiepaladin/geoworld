Game = function () {

  // Constants
  var SCROLL_SPEED = 0.5;

  // The game clock & canvas
  var clock = 0;
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var backCanvas = document.createElement("canvas");
  backCanvas.width = canvas.width;
  backCanvas.height = canvas.height;
  backCtx = canvas.getContext("2d");

  // splash screen
  var spl = document.getElementById("splash");

  // The game engine object
  var game = new GameStuff();

  // The robot object
  var robot = new Robot({ x: 400, y: 240 }, game);
  game.robot = robot;

  // The input object
  var input = {
    left: false,
    up: false,
    right: false,
    down: false
  };

  // Keypress handling
  document.addEventListener("keydown", function (event) {
    var key = event.keyCode || event.which;
    switch (key) {
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
  document.addEventListener("keyup", function (event) {
    var key = event.keyCode || event.which;
    switch (key) {
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

  // Game Loop
  function gameLoop(time) {
    var timeStep = time - clock;
    clock = time;


    if (game.message) {
      if (game.messageNr == 2) {
        var go = document.getElementById("gameover");
        go.style.visibility = "visible";
        go.style.zIndex = "5";
        game.messageNr = 0;
      }
      else if (game.messageNr == 3) {
        var win = document.getElementById("won");
        win.style.visibility = "visible";
        win.style.zIndex = "5";
        game.messageNr = 0;
      }
      return;
    }
    else if (spl.style.visibility == "visible") { }
    else {
      // Update the game state
      robot.update(timeStep, input);
      game.update(timeStep);

      // Render the game
      backCtx.clearRect(0, 0, 800, 480);
      game.render(timeStep, backCtx);
      robot.render(timeStep, backCtx);
      ctx.drawImage(backCanvas, 0, 0);
    }
    // Loop by requesting the next animation frame
    window.requestAnimationFrame(gameLoop);
  }

  // Initialize the game


  // Start the game loop
  gameLoop(0);

}();