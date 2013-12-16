//Key constants to be used in entity keyboard input events
Keys = new Object();
Keys.Enter = 0x0D;

//Converts a standard JavaScript KeyboardEvent into a more generic key even for our game since the JavaScript KeyboardEvent is pretty knarly
//Returns a structure like the following:
//  event.key   : The keyCode of the key press (Always one of the above constants if available.)
//  event.ctrl  : True if control is down
//  event.alt   : True is alt is down
//  event.shift : True if shift is down
function jsKeyboardEventToGameKeyEvent(event) {
  var ret = new Object();
  ret.key = event.keyCode || event.which;
  ret.ctrl = event.ctrlKey;
  ret.alt = event.altKey;
  ret.shift = event.shiftKey;

  return ret;
}

