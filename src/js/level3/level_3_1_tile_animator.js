Level31TileAnimator = function () {
  TileAnimator.call(this);
}

Level31TileAnimator.prototype = new TileAnimator();
Level31TileAnimator.prototype.constructor = Level31TileAnimator;

Level31TileAnimator.prototype.translateTileId = function (tileId) {
  if (this.tileFrame == 0) {
    return tileId;
  }

  if (tileId == 13) {
    return 22;
  }

  if (tileId == 20) {
    return 21;
  }

  return tileId;
}
