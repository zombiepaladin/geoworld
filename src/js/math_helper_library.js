// Clamps the provided value between a min and max value
Math.clamp = function(value, min, max) {
  var newMin = (value < min) ? min : value;
  return (newMin > max) ? max : newMin;
}

//Define epsilon constant
Math.EPSILON = 4.94065645841247e-324;

Math.almostEqual = function (x, y) {
  return Math.abs(x - y) < Math.EPSILON;
}

Math.lerp = function (start, end, percent) {
  return start + (end - start) * percent;
}

Math.random_basic = Math.random;
Math.random = function (min, max) {
  if (min == undefined) {
    min = 0.0;
  }

  if (max == undefined) {
    max = 1.0;
  }

  return Math.random_basic() * (max - min) + min;
}
