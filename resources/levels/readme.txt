There are certain things that have to be done for the levels to work with the tile engine. These should be included into your levels:

1) There needs to be a Ground layer that *only* has ground tiles, or tiles that the robot can walk/run into (e.g. water, lava, ceiling, ground, etc...). You can have multiple layers, but there must be at least a ground layer called "Ground".

2) All of the ground tiles need to have three certain properties: type, left, right. Type is used to denote what type of ground tile it is (e.g. water, lava, see above). The left and right are self-explanatory.

3) The map properties need to have four properties: startX, startY, endTileX, endTileY. These should be self-explanatory, though they do currently have different units; start X and startY use pixels, and endTileX and endTileY use tiles.