There are certain things that have to be done for the levels to work with the tile engine. These should be included into your levels:

1) There needs to be a Ground layer that *only* has ground tiles, or tiles that the robot can walk/run into (e.g. water, lava, ceiling, ground, etc...). You can have multiple layers, but there must be at least a ground layer called "Ground".

2) All of the ground tiles need to have three certain properties: type, left, right. Type is used to denote what type of ground tile it is (e.g. water, lava, see above). The left and right are self-explanatory.

3) The map properties need to have two properties: startX, startY (in pixels). These should be self-explanatory.

4) (!!IMPORTANT CHANGE!!) Since the end of levels are denoted by a time portal, I suggest creating a ground tile with a type of "portal". This is used by the tile engine's isEndAt() function.

Note: Work is being done on adding functionality for a background image to be used along with parallax scrolling.