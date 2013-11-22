function assert(condition, message) {
  if (!condition) {
    if (message === undefined) {
      throw "Assertation Failed!";
    } else {
      throw "Assertation Failed! " + message;
    }
  }
}