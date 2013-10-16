// Clamps the provided value between a min and max value
Math.clamp = function(value, min, max) {
  var newMin = (value < min) ? min : value;
  return (newMin > max) ? newMin : max;
}
