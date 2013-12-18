There are certain things that have to be done for the levels to work with the tile engine. These should be included into your levels:

1) There needs to be a Ground layer that *only* has ground tiles, or tiles that the robot can walk/run into (e.g. water, lava, ceiling, ground, etc...).
   You can have multiple layers, but there must be at least a ground layer called  "Ground".

2) All of the ground tiles need to have three certain properties: type, left, right. Type is used to denote what type of ground tile it is (e.g. water, lava, see above).
   The left and right are the number of air pixels on the left and right side of that tile.

3) A map should have a box object named "Player", the player will spawn at the bottom middle of this box.

4) The win area is determined by a box object named "Goal" with the property "for:Player"
   Goal can also have an property named "destination". If it is given, it will warp the player to the specified
   level name (in the form "level_#_#") instead of kicking them back to the main menu when they win.

Additionally, you can change the background color and image in the map properties. The background image, if needed, is loaded from a property named "backgroundsrc".