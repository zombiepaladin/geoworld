//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill
//Licensed under CC-BY-SA
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn, scope) {
    'use strict';
    var i, len;
    for (i = 0, len = this.length; i < len; ++i) {
      if (i in this) {
        fn.call(scope, this[i], i, this);
      }
    }
  };
}
