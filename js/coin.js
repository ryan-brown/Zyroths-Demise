// Coin class
// Takes (x,y) spawn coordinates
var Coin = function(x, y) {
  // Create entity at given x and y
  this.entity = spawn(x, y);
  // Create an animator object with 8 sprites every 100ms
  this.animator = new Animator(8, 100);

  // returns a new Entity at given (x,y)
  function spawn(x, y) {
    // width:16, height:16
    return new Entity(x, y, 16, 16);
  }
}