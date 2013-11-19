// Fireball Class
// Takes (x, y) coordinates and an angle to go in
var Fireball = function(x, y, angle) {
  // Create an entity at given (x, y) with width:8 and height:8
  this.entity = new Entity(x, y, 8, 8);
  
  // Set speed(px/s) of fireball
  this.speed = 750;

  // calculate dx and dy of fireball based on given angle
  // Note: Since axes are rotated and inverted, we need angle-pi/2 and angle+pi/2
  this.dx = Math.cos(angle-Math.PI/2);
  this.dy = Math.sin(angle+Math.PI/2);

  // Create an animator object with 4 sprites every 100ms
  this.animator = new Animator(4, 100);

  // Update method to calculate new (x, y) 
  this.update= function(delta) {
    // velocity = speed*time(s)
    var v = this.speed*delta/1000;

    // Update (x, y)
    this.entity.x += v*this.dx;
    this.entity.y += v*this.dy;
  }
}
