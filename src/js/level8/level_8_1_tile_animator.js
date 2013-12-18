Level81TileAnimator = function () {
  TileAnimator.call(this);
}

Level81TileAnimator.prototype = new TileAnimator();
Level81TileAnimator.prototype.constructor = Level81TileAnimator;

Level81TileAnimator.prototype.translateTileId = function (tileId) {
  if (this.tileFrame == 0) {
    return tileId;
  }

  switch (tileId) {
    case 1:
      return 4;
    case 2:
      return 5;
    case 3:
      return 6;
    case 8:
      return 11;
    case 9:
      return 12;
    case 10:
      return 13;
    case 15:
      return 18;
    case 16:
      return 19;
    case 17:
      return 20;
  }

  return tileId;
}
